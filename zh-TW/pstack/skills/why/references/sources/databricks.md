# Databricks Analytics & System Tables（Databricks 分析與系統表）

## 這個來源包含什麼

Databricks 是產品分析、資料管線和資料倉儲遙測的那一層。它和 Datadog 互補：Datadog 是*基礎設施/執行期*的視角，Databricks 是*產品/資料*的視角（使用者做了什麼、跑了哪些實驗、功能使用量如何演變、某個門檻常數是從哪裡來的）。

- **產品分析事件。** `your_warehouse.events.analytics_track_event`（原始），以及 `<your_analytics_db>.<schema>.<table>` 中有型別、已去重、每種事件一個的 dbt 模型。使用者行為：功能呼叫、點擊、接受/拒絕、送出、客戶端回報的錯誤。
- **使用量與計費事件。** `your_warehouse.events.usage_event` / `<your_analytics_db>.<schema>.stg_usage_events`、`your_warehouse.events.raw_model_event` / `<your_analytics_db>.<schema>.stg_raw_model_events`。用於由成本或量驅動的決策。
- **實驗 / feature flag 資料。** 曝光和結果的表格。**schema 因公司而異。** 在假設名稱之前，先用 `SHOW TABLES` 探查。
- **系統表。** `system.query.history`、`system.compute.warehouses`、`system.billing.*`、`system.access.audit`。回答「這個查詢很貴嗎？」、「有多少人跑過這個？」、「資料倉儲的負載什麼時候飆高？」
- **dbt 沿革。** `<your_analytics_db>.<schema>` 中的模型會揭露哪些管線依賴某個表格/欄位。上游的改動常常促成使用端程式碼的改動。
- **Databricks notebook。** 工程師在改程式碼之前寫的探索性分析。**無法透過 SQL MCP 查詢。** 如果你懷疑理由在某個 notebook 裡，把它標為缺口。

## 如何搜尋

使用 Databricks SQL MCP。主要工具：`execute_sql_read_only`。如果它回傳一個 `statement_id`，用 `poll_sql_result` 輪詢，而不是重新執行。

**查詢前先定位。** schema 因公司而異。在相信一個表格名稱之前先探查：

```sql
SHOW TABLES IN <your_analytics_db>.<schema> LIKE '*<keyword>*';
DESCRIBE TABLE <your_analytics_db>.<schema>.stg_<event>;
```

**每個查詢都要限定時間範圍。** 這些表格非常大，不加限制的掃描會逾時。用一個涵蓋出貨日期的時間窗過濾 `_timestamp`（事件）或 `start_time`（`system.query.history`），通常是前後約 30 天，只有在有強烈理由時才擴大。

**偏好有型別的 dbt 模型，而不是原始表格。** `<your_analytics_db>.<schema>.<table>` 已去重、有型別，並使用 liquid clustering。`your_warehouse.events.analytics_track_event` 有重複資料和沒有型別的 `properties_json`。模型名稱模式：`stg_<source>_<event_name_with_underscores>`，其中 `<source>` 是 `app`、`backend`、`website` 或 `cli`。光靠模式無法確定時，用 `SHOW TABLES` 確認確切的模型名稱。只有在還沒有 dbt 模型，或你需要 dbt 刷新延遲之內的事件時，才降到原始表格。

**有型別的 dbt 模型上的欄位慣例**（知道這些可以省掉一次 `DESCRIBE`）：

- `_timestamp`、`_id`、`_auth_id`、`_request_id`、`event_name`。每個模型都有
- `properties_<name>`。有型別、底線命名的事件屬性（`properties_entrypoint`、`properties_size_bytes`……）
- `context_team_id`、`context_client_version`、`context_country`、`context_client_os`。預先擷取的客戶端脈絡

### 通常會有收穫的調查模式

選擇符合目標的表格 + 欄位組合：

1. **事件使用量軌跡。** 在 PR 合併日前後 ±30 天的時間窗中，對相關的 `stg_*` 模型做每日計數。在合併後一兩天內從零跳到穩定量的階梯函數，是「這個 PR 推出了這個功能」的強力情況證據。衰減到零則暗示棄用或刪除。
2. **護欄 / 防禦性檢查的起源。** PR 之前 14 天內相關 `properties_<name>` 欄位的分布（中位數 / p99 / 最大值）。如果 p99 和目標的門檻常數一致，暗示這個數字是根據資料選的。
3. **實驗 / feature flag 查詢。** 用 `SHOW TABLES ... LIKE '*experiment*'` 找到曝光表格，然後拉出 PR 日期附近相關 flag 鍵各變體的曝光數。
4. **遷移、回填或效能重寫的查詢歷史證據。** 用 `statement_text ILIKE '%<table_or_symbol>%'` 加上緊縮的 `start_time` 時間窗過濾 `system.query.history`，就能浮現很可能促成這次改動的昂貴查詢（依 `total_duration_ms` 排序，或彙總 `SUM(read_bytes)`、`COUNT(*)`）。
5. **dbt 沿革。** 如果目標讀取或寫入一個 `<your_analytics_db>.<schema>` 模型，模型本身的 git 歷史（在這個 repo 中）常常帶有理由。把那條線索交回給 git 調查者，而不是自己去追。

## 這裡的好證據長什麼樣子

除了上面的模式形狀之外：

- 一個用來分類錯誤的事件，在一個防禦性程式碼的 PR 之後幾天內數量降到接近零。暗示這個 PR 解決了那一類錯誤
- 一列曝光表格的資料寫明了目標的 feature flag 鍵，並在 PR 出貨日附近有「shipped」/「concluded」的決定

## 常見陷阱

- **有埋點 ≠ 是原因。** 一個事件存在，代表有人在意到要記錄它，不代表目標程式碼*因為*它而存在。在宣稱因果關係之前，搭配 git 調查者提供的 PR/commit 出處。
- **默默改變的埋點。** 事件量的階梯函數可能代表開始記錄一個新事件，而不是使用者行為改變了。在把增長解讀為功能上線訊號之前，先檢查同一時間窗中有沒有埋點相關的 PR。
- **Schema 偏移。** 事件屬性會演變。今天有型別的 dbt 模型上的某個欄位，在目標被寫出來時可能還不存在。較舊的資料可能只在原始的 `properties_json` 中帶有這個屬性。
- **dbt 刷新延遲。** `<your_analytics_db>.<schema>.*` 依排程重建（通常每小時/每天）。最近幾小時的事件，改用 `your_warehouse.events.*` 並依 `_id` 去重。
- **因公司而異的表格。** 實驗、feature flag、計費和使用量表格各不相同。回報一個你從沒確認過存在的表格的結果，是典型的失敗模式。先用 `SHOW TABLES` / `DESCRIBE TABLE` 探查。
- **保留期限斷崖。** 如果相關的時間窗早於表格的保留期限或 dbt 模型的建立日期，那是*缺口*，不是查無結果。明確說出來，讓綜合者不會把「沒有結果」解讀成「沒有活動」。
- **notebook 無法查詢。** SQL MCP 看不到 Databricks notebook。如果你懷疑理由在其中一個裡面，回傳一個缺口。

## 要回傳什麼

每個相關的發現：
- 類型（產品事件 / 實驗曝光 / 使用量或計費事件 / 系統表資料列 / dbt 模型）
- 完整的表格名稱以及你執行的確切查詢
- 查詢的時間窗
- 精簡的數值摘要（數量、百分位數、首次/最後出現的時間戳記）。**不要傾倒原始資料列。**
- 與目標出貨日的時間相關性（例如「第一列 2024-08-15，PR #49074 於 2024-08-14 合併」）
- 相關性 + 強度：直接 / 情況 / 薄弱
