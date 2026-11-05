# Cursor plugins 繁體中文導讀

這個資料夾是本 repo 的繁體中文翻譯與導讀，給英文不熟的讀者使用。原文仍以各 plugin 資料夾裡的英文檔案為準；指令（例如 `/poteto-mode`）、檔名、程式碼保留英文，因為你在 Cursor 或 Claude Code 裡實際輸入的就是這些字。

## 建議閱讀順序

1. 先讀本頁，了解「plugin 是什麼」和下面的術語表。
2. 讀 [pstack 介紹（中文）](./pstack/README.md)。
3. 照著 [pstack 新手指南（中文，共 10 頁）](./pstack/docs/guide/README.md) 一頁一頁做。

> 小提醒：跟 AI agent 下指令時**可以直接用中文**。例如：
>
> ```text
> /poteto-mode 匯出 CSV 時最後一列會不見。先重現問題，再修好並驗證。
> ```
>
> 斜線開頭的指令名稱（`/poteto-mode`）要照打英文，後面的描述用中文就可以。

## pstack 完整中文版

`zh-TW/pstack/` 是 `pstack/` 的完整繁體中文翻譯，資料夾結構和原版一模一樣，所以原版的 `pstack/X` 就對應到這裡的 `zh-TW/pstack/X`：

| 位置 | 內容 |
|:--|:--|
| [`pstack/README.md`](./pstack/README.md) | pstack 介紹 |
| [`pstack/docs/guide/`](./pstack/docs/guide/README.md) | 新手指南 10 頁 |
| [`pstack/skills/poteto-mode/`](./pstack/skills/poteto-mode/SKILL.md) | 主技能，加上 23 個[劇本](./pstack/skills/poteto-mode/playbooks/) |
| [`pstack/skills/`](./pstack/skills/) | 全部 58 個技能（34 個指令技能 + 24 條原則），含各自的參考檔 |
| [`pstack/agents/`](./pstack/agents/) | `poteto-agent` 和 Comment Sicko 兩個子代理 |
| [`pstack/automations/benny/`](./pstack/automations/benny/README.md) | benny 自動化套件（Slack 問題回報的分類與修正） |
| [`pstack/docs/harness/claude-code.md`](./pstack/docs/harness/claude-code.md) | 在 Claude Code 中使用 pstack 的對照表 |

翻譯原則：

- **只是給人讀的。** AI 執行時讀的仍然是英文原檔，所以這些中文檔案不會改變 pstack 的行為。原版更新時，中文版不會自動同步。
- **專有名詞、指令、檔名、程式碼保留英文。** 例如 `poteto-mode`、`worktree`、`/loop`。第一次出現的術語會在括號中附上中文。
- **程式碼沒有翻譯。** 腳本（`.ts`、`.mjs`、`.sh`）、測試資料和圖片只保留在原版中，中文檔案裡的連結會直接指回原檔。
- **給 agent 的提示詞模板**（例如 `reflect`、`why`、`how` 的 `references/`）也翻成中文方便理解，但實際使用時以英文原版為準。這類檔案的開頭都有標註。
- 每個 `SKILL.md` 開頭都有一行連結，可以回到對應的英文原檔對照閱讀。
- **官方更新時怎麼跟上：** 見 [SYNC.md](./SYNC.md)。

## Plugin 是什麼？

Plugin（外掛）是一包可以裝進 Cursor（或 Claude Code）的擴充功能。一個 plugin 裡通常有：

| 內容 | 說明 |
|---|---|
| **skills（技能）** | 一份 `SKILL.md` 文件，教 AI agent「遇到某類工作時該怎麼做」。安裝後，你打 `/技能名稱` 就能呼叫它。 |
| **rules（規則）** | 永遠套用的規範（`.mdc` 檔），例如程式碼風格。 |
| **agents（子代理）** | 預先設定好的「小幫手 AI」，主 agent 可以把工作分派給它。 |
| **MCP 設定** | 讓 AI 連到外部服務（Gmail、GitHub、Slack…）的設定。 |

本 repo 是一個「plugin 市集」：根目錄的 `.cursor-plugin/marketplace.json` 列出所有 plugin，每個 plugin 是根目錄下一個獨立資料夾。

## 本 repo 的 plugin 一覽

### 開發工具類（Cursor 官方與社群作者）

| 名稱 | 作者 | 中文說明 |
|:--|:--|:--|
| `pstack` | Lauren Tan（poteto） | **本導讀的重點。**「想走得快，先走得深。」一套嚴謹的 agent 工作流程，讓你寫更少、但品質更高的程式碼，並能放心地讓多個 agent 平行工作。👉 [中文介紹](./pstack/README.md) |
| `dyl-stack` | Dylan Gattey | 建立在 pstack 之上的另一種個人風格：重視根本原因而不是貼膏藥、先想清楚再設計、簡潔且經驗證的交付、可以一次貼完的 PR 審查、以及從 Figma 轉成 UI 並用視覺評審檢查。 |
| `teaching` | Cursor | 技能地圖、練習計畫與學習回顧。 |
| `continual-learning` | Eric Zakariasson | 從對話紀錄中逐步萃取重點，更新到 `AGENTS.md`（只留高價值的條列重點）。 |
| `cursor-team-kit` | Eric Zakariasson | Cursor 內部團隊用的工作流程：CI、程式碼審查、出貨、本機自動化與驗證。pstack 有些功能（如 `/deslop`）在這裡。 |
| `thermos` | Cursor | 「熱核級」分支審查：深度的安全性與正確性稽核、嚴格的程式碼品質標準、平行子代理，以及可選的「可直接合併」PR 流程。 |
| `create-plugin` | Cursor | 建立與驗證新的 plugin 骨架。 |
| `ralph-loop` | Cursor | 用「Ralph Wiggum 技巧」讓 AI 反覆自我迭代的迴圈。 |
| `agent-compatibility` | Cursor | 用 CLI 掃描 repo 對 agent 是否友善，並稽核啟動流程、驗證方式與文件是否跟實際相符。 |
| `cli-for-agent` | Eric Zakariasson | 設計「讓 AI agent 好用」的命令列工具的原則：旗標、含範例的說明、管線、錯誤訊息、冪等性、試跑（dry-run）。 |
| `pr-review-canvas` | Cursor | 把 PR 的差異（diff）依重要性分組，畫成審查用的畫布。 |
| `docs-canvas` | Cursor | 把文件畫成可瀏覽的畫布。 |
| `cursor-sdk` | Cursor | 用 TypeScript SDK 打造 app、腳本與自動化。 |
| `origin-apps` | Cursor | 在 Cursor Origin API 上開發的技能：先抓最新 API 規格，再依照憑證、權限範圍、webhook、分頁與錯誤的規則實作；也能規劃如何移植既有的 GitHub App。 |
| `orchestrate` | Cursor | 把大型任務分散給多個雲端 agent 平行處理，含規劃者、執行者、驗證者與結構化交接。 |
| `advisor` | Cursor | 在重大決定前、卡住時、宣告完成前，先去請教一個更強的模型。 |
| `grok-voice` | Eric Zakariasson | 幫 app 加上 Grok 語音：即時語音對語音、語音轉文字、文字轉語音，以及依據紀錄修正語音問題的流程。 |

### 第三方服務整合（`third_party/` 資料夾）

這些 plugin 主要是讓 AI 連上外部服務，功能大多就是「查詢、讀取、建立、更新」該服務的資料。依類別整理：

| 類別 | Plugin |
|:--|:--|
| Google 系列 | Gmail（郵件）、Google Drive（雲端硬碟）、Google Calendar（行事曆）、Google Docs（文件）、Google Sheets（試算表）、Google Slides（簡報）、Google Ads（廣告）、Google Cloud BigQuery（資料倉儲查詢） |
| 微軟系列 | Teams、SharePoint、Power BI、Dynamics 365 Business Central |
| 開發與測試 | GitHub、Playwright（真實瀏覽器操作與測試）、Statsig（功能開關與實驗）、Tailscale（私有網路）、ServiceNow、Vanta（法遵） |
| 業務與 CRM | Salesforce、HubSpot、Attio、Zoho CRM、Zoho Desk、HighLevel、Gong、Outreach、Amplemarket、Clay、Hunter |
| 行銷與廣告 | Klaviyo、Customer.io、MailerLite、Brevo、Semrush、Ahrefs、Similarweb、Profound、Meltwater、Meta Ads、X Ads、TikTok for Business |
| 人資與招募 | Ashby、Workable、Juicebox、Upwork、Workday、Rippling、Gusto |
| 會議與筆記 | Zoom、Fireflies、Otter.ai、Fathom、Circleback、Craft、Mem、Readwise、Coda、Guru（知識庫） |
| 專案與任務 | Todoist、Smartsheet、Wrike、Calendly、Lark、Lark Base、Feishu（飛書） |
| 表單與文件簽署 | Typeform、Jotform、Docusign |
| 財務與會計 | QuickBooks Online、Xero、Zoho Books、Brex、Navan、Square、Jobber、Finance、Finary、OnePay |
| 投資與券商 | Robinhood、Coinbase、eToro、Interactive Brokers、Webull、Questrade、S&P Global、PitchBook、Daloopa、X Money |
| 其他 | X（推特）、WhatsApp Business、RingCentral Phone / Chat、Shopify、Gopuff、GoDaddy、Gamma（生成簡報）、Excalidraw（手繪圖表）、Framer（網站）、Stable（郵件掃描）、Databricks Genie One |

完整英文清單與原始描述見根目錄的 [README.md](../README.md)。

## 術語表

讀 pstack 文件時會一直看到這些字，先認識它們會輕鬆很多：

| 英文 | 中文 | 意思 |
|:--|:--|:--|
| agent | AI 代理 | 會自己讀程式、跑指令、改檔案的 AI 助手。 |
| subagent | 子代理 | 主 agent 派出去做一小塊工作的另一個 AI。 |
| skill | 技能 | 一份教 agent 怎麼做某件事的說明書，用 `/名稱` 呼叫。 |
| playbook | 劇本／作業手冊 | 針對某類工作（修 bug、做新功能…）的固定步驟清單。 |
| prompt | 提示詞 | 你打給 AI 的那段話。 |
| repo（repository） | 程式碼庫 | 一個專案的所有程式碼與歷史紀錄。 |
| branch | 分支 | 程式碼的一條平行開發線。 |
| worktree | 工作目錄副本 | 同一個 repo 的另一份獨立資料夾，讓多個 agent 不會互相覆蓋檔案。 |
| commit | 提交 | 一次存檔紀錄。 |
| PR（pull request） | 合併請求 | 請別人審查並把你的分支合併進主線。 |
| stack（PR stack） | PR 堆疊 | 一串依序相依的 PR，下面的先合併。 |
| merge | 合併 | 把變更併入主線。 |
| diff | 差異 | 這次改了哪些行。 |
| CI | 持續整合 | 每次推送後自動跑測試與檢查的系統。「CI 綠了」= 全部通過。 |
| repro（reproduce） | 重現 | 先讓 bug 確實發生一次，證明你理解它。 |
| root cause | 根本原因 | 問題最早出錯的地方，而不是表面症狀。 |
| verify / verification | 驗證 | 用真實執行結果證明東西真的能用。 |
| evidence | 證據 | 指令輸出、截圖、影片、數值等可以檢查的東西。 |
| refactor | 重構 | 不改變行為，只改程式結構。 |
| perf（performance） | 效能 | 速度、記憶體等。 |
| prototype | 原型 | 用完即丟的試作品，用來快速比較方案。 |
| slop | 垃圾內容 | AI 常產生的冗長、空洞、多餘的程式碼或文字。`unslop`/`deslop` 就是清掉它們。 |
| token | 字元單位 | AI 計費與處理文字的單位；用越多越花錢。 |
| context window | 上下文視窗 | AI 一次能「記住」的內容量。 |
| model | 模型 | 背後的 AI，例如 Opus、Grok。 |
| loop | 迴圈 | 讓 agent 重複「檢查→修改→驗證」直到達成目標。 |
| MCP | 模型上下文協定 | 讓 AI 連接外部工具與服務的標準。 |
| frontmatter | 檔頭設定 | Markdown 檔最上方 `---` 包住的設定區塊。 |
