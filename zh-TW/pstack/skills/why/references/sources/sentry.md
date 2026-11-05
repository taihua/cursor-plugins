# Sentry Error History（Sentry 錯誤歷史）

## 如何搜尋

使用 Sentry MCP。

1. **定位。** 如果你不知道專案 slug 和組織：

   ```
   find_organizations
   find_projects
   ```

2. **搜尋與目標相關的議題。**

   ```
   search_issues (natural language, e.g., "errors in PaymentService timeout", "unhandled exceptions in uploadFile")
   ```

   用目標處理的例外類別名稱、它的函式或類別名稱、它檢查的錯誤訊息字串，以及它的檔案路徑來建構查詢。

3. **依版本和時間窗縮小範圍。**

   ```
   search_issue_events (filter by release, time, environment, trace ID, tags)
   get_issue_tag_values (for an issue, see distribution across versions, users, environments)
   ```

   對一個可疑的議題，檢查**首次出現**和**最後出現**（停止的時間是否和目標的出貨日一致？）、**受影響的版本**（哪些版本出現過它，哪個版本是修正？），以及**頻率軌跡**（它是否飆高後被解決？）。

4. **取得完整的事件以了解脈絡。**

   ```
   get_sentry_resource (pass a Sentry URL or type+ID)
   ```

   堆疊追蹤有經過目標程式碼嗎？標籤和麵包屑（breadcrumbs）符合目標所防範的條件嗎？

5. **檢查在目標附近落地的版本。**

   ```
   find_releases (around the commit date of the target)
   ```

   把版本號和 PR 的合併日期交叉比對。

6. **節制地使用 Seer。**

   ```
   analyze_issue_with_seer
   ```

   Seer 的 AI 根本原因分析是假設的產生器。把它們當作推論，而不是權威。實際的事件和堆疊追蹤才是主要證據。

## 要回傳什麼

每個相關的議題：
- 議題 ID 和標題
- 專案和組織
- 首次出現 / 最後出現的時間戳記
- 事件數量（以及已知的話，取樣率）
- 受影響的版本
- 一段代表性的堆疊追蹤片段，顯示與目標的關聯（逐字摘錄，而不是摘要）
- 首次/最後出現時間與目標出貨日的相關性
- 議題連結
- 任何作者留言或解決說明
