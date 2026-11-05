# Source playbooks（來源做法）

why 技能為每個可用的證據類別派出一位調查者，每位讀一份下列特定來源的做法。這些做法是常見 MCP 的具體範例。對於同一類別的其他 MCP，請加以改編。

| 類別 | 做法 | 它記載的範例 MCP |
|---|---|---|
| 版本控制歷史 | [`code-archaeology.md`](./sources/code-archaeology.md) | git、`gh` |
| 議題 / 工單追蹤 | [`linear.md`](./sources/linear.md) | Linear（可改編用於 Jira、GitHub Issues、Plane、Shortcut） |
| 長篇文件 | [`notion.md`](./sources/notion.md) | Notion（可改編用於 Confluence、Google Docs、Coda） |
| 即時團隊聊天 | [`slack.md`](./sources/slack.md) | Slack（可改編用於 Discord、Microsoft Teams、Mattermost） |
| 基礎設施監控 | [`datadog.md`](./sources/datadog.md) | Datadog（可改編用於 New Relic、Honeycomb、Grafana、Splunk） |
| 錯誤 / 例外追蹤 | [`sentry.md`](./sources/sentry.md) | Sentry（可改編用於 Rollbar、Bugsnag、Airbrake） |
| 產品分析資料倉儲 | [`databricks.md`](./sources/databricks.md) | Databricks SQL（可改編用於 Snowflake、BigQuery、ClickHouse、dbt） |

跨類別：

- [`incident-postmortem.md`](./sources/incident-postmortem.md)。如果目標程式碼看起來是防禦性的（null 檢查、重試、逾時、流量限制、feature flag、對外流量防護、OOM 處理），就加上這份。
