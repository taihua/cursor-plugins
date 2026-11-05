# Datadog Telemetry（Datadog 遙測）

## 這個來源包含什麼

Datadog 保存的是執行期紀錄，也就是正式環境中實際發生了什麼，而不是計畫或討論了什麼。

- **指標（Metrics）。** 團隊埋點的計數器、量表、直方圖。一個指標的*存在*本身就是證據，代表有人認為這個數字值得觀察。
- **監視器與警報（Monitors & alerts）。** 團隊認為值得把人叫醒的條件。一個在 `rate_limit_hit > 10/min` 時觸發的監視器，就是團隊擔心那個門檻的直接證據。
- **儀表板（Dashboards）。** 團隊認為某個子系統重要的東西的精選視圖。
- **APM trace 與 span。** 請求層級的執行期資料，用於「為什麼這很慢」/「為什麼這裡有逾時」的問題。
- **Log。** 大量的事件紀錄，常常包含促成防禦性程式碼的錯誤條件。
- **事件（Incidents）。** 正式的事件紀錄，附有時間線和連結的事後檢討。
- **Notebook。** 團隊的探索性調查，常常帶有假設和分析。

## 如何搜尋

使用 Datadog MCP。先廣後窄。

1. **找出擁有它的服務。**

   ```
   search_datadog_services (filter by name or team)
   search_datadog_service_dependencies (see upstream/downstream)
   ```

2. **先看儀表板和監視器。**

   ```
   search_datadog_dashboards (query: feature name, service name, symbol)
   search_datadog_monitors   (same queries)
   ```

   當某個儀表板或監視器涵蓋目標時，記下它的查詢和觀察的門檻。這個門檻常常就是「為什麼這被限制在 N？」的答案。

3. **目標周圍的指標。**

   ```
   search_datadog_metrics (by name pattern, e.g., the feature or symbol)
   get_datadog_metric_context (metadata: description, units, tags)
   get_datadog_metric (timeseries; "was there a spike around the PR date?")
   ```

   把指標的軌跡和目標的新增/修改日期關聯起來，是強力的支持證據：「`payment_timeout` 指標在 2023-11-03 飆高，而重試邏輯在 2023-11-06 合併。」

4. **Log。縮小範圍，不要傾倒。**

   ```
   search_datadog_logs (raw log patterns near the target, set use_log_patterns=true)
   analyze_datadog_logs (SQL-style aggregations, only when you need counts)
   ```

   用符號、錯誤字串或功能名稱搜尋。**強烈偏好有時間限制的查詢**（例如改動前後 30 天）。

5. **APM span 和 trace。**

   ```
   aggregate_spans    (stats: "how often does this endpoint fail?")
   search_datadog_spans (inspect individual spans)
   get_datadog_trace  (a specific trace ID)
   ```

   對逾時、重試、慢路徑和跨服務行為很有用。

6. **事件。**

   ```
   search_datadog_incidents (by title, team, date range)
   get_datadog_incident     (full detail for a specific incident)
   ```

   如果目標看起來是防禦性的，搜尋它被加入那段時間附近的事件。時間線中包含「為 X 新增防禦性檢查」的事件，幾乎就是直接證據。

## 這裡的好證據長什麼樣子

- 一個監視器的查詢和門檻，與程式碼強制的限制一致（程式碼限制在 100，監視器在請求超過每分鐘 100 次時警報）
- 一個由目標作者建立的儀表板，其中的小工具對應到程式碼量測或防範的東西
- 一個指標顯示在程式碼合併前正式環境出現飆高，之後數值穩定
- 一筆事件紀錄引用了目標程式碼、相同的符號或相同的錯誤字串
- log 顯示防禦性程式碼會防止的特定錯誤模式，時間戳記落在改動之前的時間窗中

## 常見陷阱

- **相關不等於因果。** PR 之前飆高、之後穩定只是暗示，不是定論，因為同一時間窗中可能有其他改動落地。檢查相鄰的 PR。
- **過度擬合你找到的圖表。** 圖表反映的是製作者的框架。一張名為「重試成功率」的圖表，是團隊在意重試成功的證據，而不是某一行程式碼存在的原因。
- **消失的遙測。** 指標可能被改名、刪除，或保留期限很短。如果你找不到相關時間窗的資料，那是缺口，不是查無結果。
- **大規模的雜訊。** 積極地依服務、標籤和時間窗縮小 log 搜尋範圍。用 `analyze_datadog_logs` 彙總，而不是傾倒原始 log。
- **有埋點 != 是原因。** 一個指標顯示有人在意到要量測某件事，不代表程式碼*因為*它而被加入。和 commit/PR 日期交叉比對。

## 要回傳什麼

每個相關的項目：
- 類型（儀表板 / 監視器 / 指標 / log 模式 / trace / 事件 / notebook）
- 標題或名稱
- 連結或識別碼（儀表板 ID、監視器 ID、指標名稱、事件 ID）
- 擁有者/作者以及建立/修改日期
- 與問題相關的具體條件、查詢或引文（盡可能逐字）
- 相關性：這對目標程式碼暗示了什麼，以及關聯有多強
