# Incident & Postmortem Context（事件與事後檢討脈絡）

- **Linear**：尋找標為 `incident`、`sev-*`、`postmortem-action-item`、`reliability` 的工單
- **Slack**：在目標程式碼被加入的日期附近，搜尋 `#sev-*` 和 `#incident-*` 頻道
- **Git**：訊息像「fix for incident」、「add defensive check」，或「revert」之後接著「re-apply with...」的 commit，都是強烈的訊號
