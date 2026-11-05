---
name: why
description: "用於「為什麼 X 這樣運作」、「我們為什麼選了 Y」、設計理由、退步、事後檢討，或有數據支持的門檻值。找出可用的 MCP，平行查詢每個證據類別（版本控制、議題追蹤、長篇文件、即時聊天、基礎設施監控、錯誤追蹤、產品分析資料倉儲），然後回傳一份附出處、關於決策與取捨的解讀。執行期行為用 how。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/why/SKILL.md`](../../../../pstack/skills/why/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Why（為什麼）

調查程式碼背後的動機和意圖。搭配的 `how` 技能回答程式碼做什麼、如何運作；`why` 回答是哪些力量塑造了它的形狀。

下面每次派遣都對應 `pstack-models.mdc` 規則中的一個角色設定行和一個預設值。把 `model` 設為該行的值；如果規則或該行不存在，就設為預設值。當值是 `auto` 或 `inherit-parent` 時，不設定 `model`。如果 Task 工具拒絕某個 slug，就用預設值並說明。如果它連預設值都拒絕，就從它的錯誤訊息中選同一家族最接近的有效 slug。依 **poteto-mode** 技能的「子代理」章節，為每個子代理選擇工作需要的推理等級與快速或標準速度。

每次派遣都是 `generalPurpose`，`readonly: false`（agent 模式）。**不要用 readonly/Ask 模式。** 它會拿掉 MCP 存取權，讓以 MCP 為基礎的調查者和綜合者的引用抽查都失效。調查者仍然不應該寫入任何東西。

## 運作姿態

以一位**謹慎、小心、精確的調查者**運作。誠實區分你知道的和你推論的。完整的信心框架和措辭指南請讀 `references/epistemics.md`。綜合者必須遵循它。

## 第 1 步：理解目標和問題

**目標**通常是一段程式碼、一個模式、一個功能，或一個有名稱的設計決策。**問題**通常是設計理由、取捨、促成它的邊界情況、外部限制、死程式碼，或一次廣泛的歷史掃描。

如果目標很模糊（「我們為什麼這樣做？」卻沒有明確的指涉對象），就從對話脈絡中做出最好的猜測（打開的檔案、最近的修改、游標位置、剛剛討論的東西）。簡短說明你的解讀，讓使用者在你猜錯時可以調整方向，然後繼續。

## 第 2 步：建立程式碼錨點

派出調查者之前，先在主對話中建立種子脈絡：檔案路徑和行號範圍、關鍵符號（函式、類別、常數）、最近幾個碰到目標的 commit、合併 commit 中的 PR 編號（標題行中的 `(#1234)` 模式），以及任何連結的工單 ID。執行 `git blame -L <start>,<end> <file>` 找最後修改的 commit、`git log --follow -p -- <file>` 取得跨越改名、含 patch 的完整歷史、`git log --oneline -20 -- <file>` 看能顯示 PR 編號的最近 commit，以及 `git log -1 --format=%B <commit>` 擷取 PR 編號。然後對任何實質的 commit 拉出 PR 內文和討論：`gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews`。這個錨點會交給每個調查者和綜合者。

## 第 3 步：派出平行調查者

**預設進行完整的平行調查。** 目標是一份完整的涵蓋地圖，而不是最小的那份。查無結果就記錄下來，不要跳過搜尋。

### 探索

派出調查者之前，從 Cursor 環境列出可用的 MCP。有可用工具清單時就用它，否則檢查 Cursor 公開的 `mcps/` 目錄中有哪些啟用的 MCP 伺服器。

把每個可用的 MCP 對應到一個證據類別：

1. 版本控制歷史
2. 議題 / 工單追蹤
3. 長篇文件
4. 即時團隊聊天
5. 基礎設施監控
6. 錯誤 / 例外追蹤
7. 產品分析資料倉儲

版本控制永遠可以透過 git 和 `gh` 取得。其他六類，依 MCP 名稱、伺服器說明、工具名稱和資源描述來分類。如果某個 MCP 可能適合不只一個類別，選擇符合它主要證據的那個。在涵蓋地圖中記錄有歧義的情況。

每個有對應 MCP 的類別派一個調查者，全部在同一則訊息中派出讓它們同時執行，每個只負責恰好一個工具或 MCP。不要叫一個 agent 涵蓋多個 MCP。`model`：`why investigators` 設定行，預設 `grok-4.7-xhigh-fast`。

每個調查者的提示詞是填好的 `references/investigator-prompt.md`，再加上：
- 所選 MCP 的類別做法 `references/sources/<source>.md`，依 `references/source-playbook.md` 中的範例改編
- **如果目標程式碼看起來是防禦性的**（null 檢查、重試邏輯、逾時處理、流量限制、feature flag、對外流量防護、OOM 處理），加上 `references/sources/incident-postmortem.md`
- 程式碼錨點和使用者的原始問題

### 調查者名單，每個可用的證據類別一個

下面每個類別都有獨特的位置，能挖出某一種形狀的「為什麼」，寫在「最擅長」之後。用它來知道預期會拿回什麼、在某個類別查無結果時說出缺口，以及只有在極少見、可證明無關的情況下，用來為跳過辯護。

1. **版本控制**（git 歷史、PR 用的 `gh`、程式碼註解、測試）。一定要派，這是唯一保證存在的來源。最擅長：*在審查時記錄下來的實作當下理由*。
2. **議題 / 工單追蹤**（例如 Linear、Jira、GitHub Issues、Plane、Shortcut MCP）。最擅長：*產品或商業上的驅動力*。當原因來自工程之外時最有力。
3. **長篇文件**（例如 Notion、Confluence、Google Docs、Coda MCP）。最擅長：*在變成程式碼之前就寫下的長篇設計理由*。
4. **即時團隊聊天**（例如 Slack、Discord、Microsoft Teams、Mattermost MCP）。最擅長：*從沒寫進文件的即時討論*。當版本控制、工單和文件的紀錄很薄時尤其重要。
5. **基礎設施監控**（例如 Datadog、New Relic、Honeycomb、Grafana、Splunk MCP）。最擅長：*促成這段程式碼的基礎設施與執行期現實*。當目標是在對某個基礎設施訊號做出反應（逾時、重試、流量限制、斷路器）時最有力。
6. **錯誤 / 例外追蹤**（例如 Sentry、Rollbar、Bugsnag、Airbrake MCP）。最擅長：*促成防禦性或修正性程式碼的具體例外和錯誤軌跡*。對 catch 區塊、null 防護、型別檢查、重試和其他防禦最有力。
7. **產品分析資料倉儲**（例如 Databricks、Snowflake、BigQuery、ClickHouse、dbt、Redshift MCP）。最擅長：*塑造程式碼的產品與資料現實*。對受 flag 控制的程式碼、由實驗驅動的出貨、資料遷移，以及「這個數字是從哪來的」這類問題最有力。

### 何時跳過一個調查者

只有在附上**明確、書面的理由**時才可以，而且理由要寫進最終的 Sources Consulted。兩種有效的理由：

- **這個環境中沒有該類別可用的 MCP。** 把它標為缺口，而不是選擇：「即時團隊聊天已跳過。沒有對應的 MCP 可用，所以無法搜尋對話紀錄。」
- **該來源可證明是無關的**，而不只是「大概無關」。門檻很高：「錯誤 / 例外追蹤已跳過。目標是一個沒有執行期程式路徑的建置腳本。」

如果你的範圍評估顯示這是一個單一 commit 的瑣碎目標，而 PR 描述已經包含完整答案，你可以直接在主對話中回答，但**只有在**確認所有七類可用的搜尋都是多餘的之後。明確說出來。這應該很少見。

## 第 4 步：綜合

派出一個綜合者。`model`：`why synthesizer` 設定行，預設 `claude-opus-5-5-xhigh`。它會拿到：
1. 調查者的發現，包括任何查無結果，以及附理由跳過的類別
2. 程式碼錨點
3. 使用者的原始問題
4. `references/epistemics.md` 中的認識論框架
5. `references/synthesizer-prompt.md` 中的綜合者提示詞模板

## 第 5 步：呈現

把綜合者的輸出呈現給使用者。你可以為了清楚做輕微編輯，或補上對話中的脈絡，但**不要改寫信心程度的用語**。

## 輸出格式

結構就是 `references/synthesizer-prompt.md` 中的那個：The Question（問題）、The Code in Question（相關程式碼）、What We Found（我們發現了什麼）、What We Can Reasonably Infer（我們可以合理推論什麼）、Competing Hypotheses（競爭的假設）、What We Don't Know（我們不知道什麼）、Sources Consulted（查詢過的來源）、Confidence Summary（信心摘要）。視需要調整，但要保持信心程度的區分，並讓 Sources Consulted 保持每個調查者一行，包括查無結果或被跳過的那些，並附上原因。

在 Sources Consulted 之後，如果使用者的 `why` 問題是修改這段程式碼的前置工作，就把沿革發現轉換成一組 Preserve / Change / Avoid / Risk（保留 / 修改 / 避免 / 風險）限制，用來規劃這次改動。

## 要避免的常見失敗模式

- **近因偏誤（Recency bias）。** 以為最近的 commit 就是權威。目前的形狀往往是許多更早決策的累積。往回追溯。
