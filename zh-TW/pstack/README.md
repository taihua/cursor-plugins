# pstack（繁體中文版）

> 本文翻譯自 [`pstack/README.md`](./README.md)。指令、檔名保留英文。看不懂的詞請查 [術語表](../README.md#術語表)。

我是 [poteto](https://x.com/poteto)。我不是總裁也不是執行長，但我在 Meta、Netflix 和 Cursor 處理過數百萬行程式碼。我也是 React 核心團隊成員，協助打造與維護 React Compiler。

現在大家越來越覺得 AI 會寫出太多「垃圾程式碼（slop）」。我同意。我不想像一個由二十個垃圾製造者組成的團隊那樣出貨。沒有品質的產量，不是我追求的目標。**想走得快，先走得深。**

**pstack 是我的答案。** 這些就是我每天在 Cursor 用來交付高品質程式碼的技能。它讓 Cursor 變成一個真正的工程團隊。目標不是寫最多行程式碼，事實上剛好相反：pstack 幫你寫**更少、但品質更高**的程式碼。

**pstack 讓你無懼地平行工作。** 當你能讓一個 agent 深入工作、並信任它寫出好的、可驗證的程式碼，你就能放心地同時開好幾個 agent。用 `poteto-mode` 啟動多個 agent，相信它們會在工作中套用嚴謹的工程原則。

**Cursor 讓你兼得各家之長。** 每個前沿模型都有強項和弱點。pstack 可以搭配任何模型使用。事實上，我很多技能都用「多模型」流程，善用每個模型的特長。

歡迎 fork、改進、變成你自己的版本。也歡迎發 PR！

## 安裝

在 Cursor 聊天框輸入：

```bash
/add-plugin pstack
```

在 Claude Code 裡：

```bash
/plugin marketplace add cursor/plugins
/plugin install pstack@cursor-plugins
```

Claude Code 對第三方市集預設**不會自動更新**，所以 pstack 會停在你安裝的版本。要開啟自動更新：輸入 `/plugin`，打開 **marketplaces** 分頁，選 `cursor-plugins`，再選 **enable auto-update**。想手動更新一次，執行 `claude plugin update pstack@cursor-plugins`。

Claude Code 會在 plugin 的指令和 agent 前面加前綴，所以 `/poteto-mode` 在 Claude Code 裡要打成 `/pstack:poteto-mode`。[Claude Code 對照說明](./docs/harness/claude-code.md) 列出其他 Cursor 名稱的對應。在 Claude Code 中，`/pstack:setup-pstack` 會把你的模型選擇寫到 `~/.claude/rules/pstack-models.md`；遇到只有 Cursor 才有的功能（例如 Bugbot 或 Automations）時，該步驟會被跳過並附上一行說明。

Claude Code 安裝的是 pstack 的「自動產生副本」（包含這份 README 和指南），位置在 repo 根目錄的 [`harness/pstack/`](../../harness/pstack/)。修改 pstack 後，要在 repo 根目錄執行 `node scripts/generate-pstack-harness-trees.mjs` 並提交結果；副本過期時 CI 會失敗。

## 開始使用

只要兩步：

1. 執行 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)，選一個推理預算（reasoning budget），並挑選你要用的模型。
2. 只要是需要嚴謹的工作，就用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。

第一次用？[pstack 新手指南（中文）](./docs/guide/README.md) 會帶你完成第一個真實任務，從設定、下提示詞，到驗證和整夜自動執行。卡住了，或不確定該用哪個技能？問 [`/poteto-help`](./skills/poteto-help/SKILL.md)。

就這樣。其他技能都是「看情況用」，而 `poteto-mode` 會在需要時自動幫你呼叫。預設設定會依模型強項分工：寫程式的工作（新功能、重構、修 bug、效能、爬坡優化）交給 Grok，最難的改動、文字撰寫和判斷交給 Opus 5.5。預設的審查小組是 Opus 5.5 / Grok。用 [`/setup-pstack`](./skills/setup-pstack/SKILL.md) 可以改任何一項。

## 使用方式

在任務一開始使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。它會讀你的需求、從一組「劇本（playbook）」中挑一個，然後在步驟需要時呼叫其他技能。

**請在輸入任務之前，先從 `/` 選單選 `/poteto-mode`**，這樣 Cursor 才會把技能附加到這則訊息上。

### 用 `/poteto-mode` 就對了

這個技能是最主要的捷徑。只要我需要 agent 做嚴謹的工程工作，就用它。它附帶二十三個劇本：

```
/poteto-mode 這個 PR 有個隱藏 bug：即使閒置，畫面捲動位置每 750ms 就會飄移。先重現，再修正並驗證。
```

```
/poteto-mode 我要去睡了。就算 CI 不穩定也要把這一串 PR 合併進去。我希望明早全部都合併好。
```

<details>
<summary>二十三個劇本</summary>

| 劇本 | 用途 |
|---|---|
| [investigation（調查）](./skills/poteto-mode/playbooks/investigation.md) | 只讀不改的問題：X 怎麼運作？Y 為什麼這樣設計？我們確定嗎？ |
| [bug fix（修 bug）](./skills/poteto-mode/playbooks/bug-fix.md) | 重現缺陷、找出根本原因，並用實際執行的證據修好。 |
| [perf（效能）](./skills/poteto-mode/playbooks/perf-issue.md) | 追查一個「量得到」的慢，並對照基準值改善。 |
| [hillclimb（爬坡優化）](./skills/poteto-mode/playbooks/hillclimb.md) | 持續、科學地把一個指標往目標推進：反覆提出假設、量測前後差異，每個被接受的改進一個 commit。 |
| [runtime forensics（執行期鑑識）](./skills/poteto-mode/playbooks/runtime-forensics.md) | 透過埋點量測診斷正在發生的症狀（記憶體洩漏、閒置時 CPU 空轉、畫面閃爍）。 |
| [trace forensics（追蹤檔鑑識）](./skills/poteto-mode/playbooks/trace-forensics.md) | 診斷已擷取的效能分析檔（cpuprofile、trace、spindump、heap snapshot）。 |
| [feature（新功能）](./skills/poteto-mode/playbooks/feature.md) | 新增或修改行為，從一個明確命名的資料結構開始建構。 |
| [refactoring（重構）](./skills/poteto-mode/playbooks/refactoring.md) | 不改變行為、只改結構或形狀的變更。 |
| [prototype（原型）](./skills/poteto-mode/playbooks/prototype.md) | 用完即丟的草稿，便宜地做出設計或行為上的決定，或用實際觀察解決實驗上的分歧。 |
| [visual parity（視覺一致）](./skills/poteto-mode/playbooks/visual-parity.md) | 讓兩個實作的 UI 做到像素級一致。 |
| [authoring a skill（撰寫技能）](./skills/poteto-mode/playbooks/authoring-a-skill.md) | 撰寫或編輯 SKILL.md。 |
| [eval（評測）](./skills/poteto-mode/playbooks/eval.md) | 用盲測檢驗技能或提示詞的修改如何影響 agent 行為。 |
| [babysit（看顧 PR）](./skills/poteto-mode/playbooks/babysit.md) | 把一個 PR 或一串 PR 推到可合併狀態：處理衝突、審查留言、CI。 |
| [shipping（出貨）](./skills/poteto-mode/playbooks/shipping.md) | 獨立驗證已經全綠的 PR 堆疊，再從最底層開始，把連續通過驗證的部分依序合併（預設透過 GitHub，有 Origin 時用 Origin）。 |
| [autonomous run（自主執行）](./skills/poteto-mode/playbooks/autonomous-run.md) | 不中斷地把一個長任務做到完成。 |
| [orchestrate（統籌）](./skills/poteto-mode/playbooks/orchestrate.md) | 交給一個「協調者」聊天視窗的長期專案：跨多天、很多堆疊 PR、一大群子代理。 |
| [autopilot-full（全自動駕駛）](./skills/poteto-mode/playbooks/autopilot-full.md) | 把多個獨立 PR 一路做到合併，每個 PR 一個負責人。程式就緒時由一群驗證者檢查，之後每次修改都會再被重新檢查。 |
| [autopilot-stack（自動駕駛，不合併）](./skills/poteto-mode/playbooks/autopilot-stack.md) | 跟 autopilot-full 一樣，但不合併。做好並驗證 PR 讓你自己審查與合併；只有真的相依時才把 PR 疊在另一個上面。 |
| [session pickup（接手工作）](./skills/poteto-mode/playbooks/session-pickup.md) | 接續或接手先前 agent 做到一半的工作。 |
| [pause safely（安全暫停）](./skills/poteto-mode/playbooks/pause-safely.md) | 乾淨地暫停進行中的工作，之後可以接續。 |
| [multi-phase plan（多階段計畫）](./skills/poteto-mode/playbooks/multi-phase-plan.md) | 跨多個階段或多個堆疊 PR 的工作。 |
| [worktree cleanup（清理工作目錄）](./skills/poteto-mode/playbooks/worktree-cleanup.md) | 回收磁碟空間：在安全檢查下刪除已合併或廢棄的 worktree 與過期的 iOS 模擬器。 |
| [opening a pr（開 PR）](./skills/poteto-mode/playbooks/opening-a-pr.md) | 用小而有序的 commit 開一個可審查的 PR，標題遵守 Conventional Commits 格式，描述寫成簡報風格。所有其他劇本最後都會呼叫它。 |

</details>

呼叫後它會：

1. 把你的任務對應到一個[劇本](./skills/poteto-mode/playbooks/)，並開一份待辦清單，前幾項就是該劇本的步驟（逐字複製）。
2. 步驟執行時，自動轉去呼叫其他技能。
3. 回覆時去掉 AI 腔，並同時考慮「使用者」與「維護者」兩種讀者。

完整規則與劇本在 [`skills/poteto-mode/SKILL.md`](./skills/poteto-mode/SKILL.md)。

**想讓 `/poteto-mode` 在每一輪對話都保持開啟**：從 `/` 選單選它時，按 Option+Enter（Mac）或 Alt+Enter（Windows），而不是 Enter。這會變成一個[自訂模式（Custom Mode）](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，Cursor 的 Agents 視窗和 CLI 都支援。它會每一輪都留在上下文裡，直到你退出模式。單純按 Enter 只會附加到那一則訊息。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 和 Cursor 的 `/loop` 指令搭配效果極好，可以讓 Cursor 連續工作好幾個小時而不犧牲嚴謹度。

## 技能

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 會在步驟需要時自動執行大部分技能（`how`、`why`、`architect`、`arena`、`swarm`、`interrogate`、`unslop`、`no-comments`、`technical-writing`、`tdd` 以及各項原則）。下表是給你想**直接**呼叫某個技能時參考：

```
/how 我們怎麼取消執行中的工作？查詢每個要取消的工作時有沒有 N+1 問題？
```

```
/interrogate 審查這個 PR。
```

<details>
<summary>全部技能</summary>

| 技能 | 什麼時候用 |
|---|---|
| [`/poteto-mode`](./skills/poteto-mode/SKILL.md) | 任何不簡單的任務的預設入口。 |
| [`/poteto-help`](./skills/poteto-help/SKILL.md) | 你是 pstack 新手，或不確定該用哪個技能、劇本或原則。它會先搞清楚你想做什麼，回答那部分，再給你一段可以直接送出的提示詞。只有你親自輸入 `/poteto-help` 才會執行。 |
| [`/in-your-own-words`](./skills/in-your-own-words/SKILL.md) | 你希望 agent 開始前，先用自己的話複述你的目標和問題。只有你親自輸入才會執行。 |
| [`/sharpen`](./skills/sharpen/SKILL.md) | 送出前想讓提示詞「更深」而不是「更長」：頂尖專家會做哪些你沒要求的事、他們會從什麼原始材料開始、用什麼方法和工具、以及有什麼外部檢查能證明結果正確。它交回改寫後的提示詞，保留你的選擇空間，但**不會**去做任務本身。只有你親自輸入才會執行。 |
| [`/how`](./skills/how/SKILL.md) | 想要一個子系統「怎麼運作」的導覽。 |
| [`/why`](./skills/why/SKILL.md) | 想知道某個東西「為什麼」這樣做。它會在執行時找出可用的 MCP，平行查詢各類證據來源（版本控制、議題追蹤、長文件、即時聊天、基礎設施監控、錯誤追蹤、分析資料倉儲）。 |
| [`/recall`](./skills/recall/SKILL.md) | 開始或回到某項工作時，想從你自己的聊天紀錄和共享紀錄重建最近的脈絡，整理成一份精簡的現況摘要。 |
| [`/ketchup`](./skills/ketchup/SKILL.md) | 想知道從你上一則訊息之後，這個聊天裡發生了什麼變化：用白話和小圖示說明，並列出每一件等你決定的事，讓你光看回覆就能決定（即使回覆因此變長）。 |
| [`/ketchup-video`](./skills/ketchup-video/SKILL.md) | 跟 `/ketchup` 一樣，但做成有字幕的投影片短片，等你決定的事則以文字列在下面。 |
| [`/blast-radius`](./skills/blast-radius/SKILL.md) | 你有一個看起來很小的改動，想知道它還可能弄壞什麼；並用實際執行程式碼來證明「它之所以安全」的那個關鍵事實，而不是空口斷言。 |
| [`/architect`](./skills/architect/SKILL.md) | 要寫會跨越函式邊界的程式碼前，先把呼叫端的用法、型別和模組結構定下來。 |
| [`/arena`](./skills/arena/SKILL.md) | 想讓 N 個 agent 平行嘗試同一件事，再挑出各自最好的部分。 |
| [`/swarm`](./skills/swarm/SKILL.md) | 想讓 N 個 worker 分別處理不同區塊或互相競賽，最後彙整成一份報告。 |
| [`/interrogate`](./skills/interrogate/SKILL.md) | 你有一份 diff，想讓不同模型試著把它弄壞，只保留實際執行能證明的發現。 |
| [`/automate-me`](./skills/automate-me/SKILL.md) | 想要一個屬於你自己的 `-mode` 技能，從你實際的工作方式中起草。 |
| [`/make-bot-ui`](./skills/make-bot-ui/SKILL.md) | 想做一個頁面或儀表板，按鈕可以透過 webhook 喚醒 Grok Bot（包含傳送者金鑰的交接和 Tailscale 設定）。 |
| [`/setup-pstack`](./skills/setup-pstack/SKILL.md) | 想指定 pstack 在各個角色使用哪個模型。它會偵測你可用的模型並寫一份設定規則。 |
| [`/reflect`](./skills/reflect/SKILL.md) | 一個長任務完成了，想把這次的做法整理成對技能的修改。 |
| [`/correct`](./skills/correct/SKILL.md) | 你一直在糾正 agent 犯同樣的錯。它從歷史中找出錯誤類型，並在「最有效的層級」修掉每一類（先架構，再型別、lint 與 CI，再測試，文件最後），並維護一張「規則 ↔ 由什麼強制執行」的對照表。 |
| [`/teach`](./skills/teach/SKILL.md) | 你想真正**理解**一個改動或子系統，而不是只看摘要。它會跑 how + why，再一張圖一張圖地編織成一份白話解釋。 |
| [`/tdd`](./skills/tdd/SKILL.md) | 修 bug 時有便宜的本機測試路徑：先寫一個會失敗的測試，再修。 |
| [`/benchmark-checklist`](./skills/benchmark-checklist/SKILL.md) | 你跑了效能測試、量到加速或退步。在你報告或採取行動前，先檢驗這個數字（瓶頸、調校、錯誤、重複執行、端到端的相關性）。 |
| [`/no-comments`](./skills/no-comments/SKILL.md) | 審查前先清掉註解；它會派出 Comment Sicko，修正被接受的發現，並提議把「宣稱的限制」改寫成程式可強制的形式。 |
| [`/typescript-best-practices`](./skills/typescript-best-practices/SKILL.md) | 正在讀或改 TypeScript。把「型別系統紀律」原則落實到具體語法。 |
| [`/figure-it-out`](./skills/figure-it-out/SKILL.md) | 沒有現成劇本適用時，為這個任務設計一份嚴謹、可稽核的劇本。 |
| [`/show-me-your-work`](./skills/show-me-your-work/SKILL.md) | 想要一份可審查的決策紀錄。把決策寫進一個可以提交的 TSV 檔。 |
| [`/create-verification-skill`](./skills/create-verification-skill/SKILL.md) | 你的專案沒有用腳本證明 app 行為的方法。它會產生一個專案專用的驗證技能，附功能地圖，任何語言或平台都適用。 |
| [`/maintain-verification-skill`](./skills/maintain-verification-skill/SKILL.md) | 驗證技能的功能地圖已經跟 app 脫節。做一輪原始碼檢查加一次實際操作，最多產出一個經證實的修正 PR。 |
| [`/create-formal-verification-skill`](./skills/create-formal-verification-skill/SKILL.md) | 測試碰不到會讓競態條件、重試、狀態機、解析器或不安全程式碼出錯的情況。用合適的工具驗證一個性質，並產生專案專用技能，在每次改動時重新檢查。 |
| [`/maintain-formal-verification-skill`](./skills/maintain-formal-verification-skill/SKILL.md) | 形式驗證涵蓋的程式碼在上次檢查後改了。更新模型、測試框架或性質以符合程式碼，重跑，並判斷每個失敗是「驗證本身過時」還是「程式真的有 bug」。 |
| [`/statechart`](./skills/statechart/SKILL.md) | 負責該行為的人需要「看到」它，而不是讀規格。它會檢查 TLA+ 模型，把使用者看到的狀態畫成 Mermaid 狀態圖，標出違反規則的狀態，並給出到達每個問題狀態的最短路徑。 |
| [`/unslop`](./skills/unslop/SKILL.md) | 整理文字，去除 AI 腔。 |
| [`/bro`](./skills/bro/SKILL.md) | 想把上一則訊息用白話、像朋友聊天一樣重講一遍，不要術語。 |
| [`/technical-writing`](./skills/technical-writing/SKILL.md) | 分層的文件寫作標準（Diátaxis + Google 開發者風格 + 簡化技術英文 STE + Global English），適用於文件、RFC、README、PR 描述、commit 訊息。 |

</details>

### 範例

我大多是在任務開頭打 `/poteto-mode`，讓它自己挑劇本，其他技能會在步驟需要時自動觸發。少數幾個我會直接呼叫。

<details>
<summary>所有範例（中文版）</summary>

```
修 bug：      /poteto-mode 這個 PR 有個隱藏 bug：即使閒置，捲動位置每 750ms 就會飄移。先重現，再修正並驗證。
效能：        /poteto-mode 一個很長的清單要一兩秒才載入完，明明有做虛擬化。跑一次 CPU trace 告訴我原因。
新功能：      /poteto-mode 在功能開關（feature flag）後面做一個小功能。驗證它真的能用。
原型：        /poteto-mode 做兩個 markdown 渲染器的原型讓我們比較。每個原型各派一個 agent。
多階段：      /poteto-mode 把這些技能開源成一個 plugin。不能洩漏任何內部資訊，在暫存目錄工作，先給我看相依關係圖。
整夜執行：    /poteto-mode 我要去睡了。就算 CI 不穩定也要把整串 PR 合併。我希望明早全部合併好。
看顧 PR：     /poteto-mode 看一下 PR 123。還有什麼沒處理的嗎？
視覺一致：    /poteto-mode 開啟這個開關時列間距太高。第二張圖才是正確的。重現並修到一模一樣為止。
自己想辦法：  /poteto-mode 我要離開一下。把每個呼叫端從同步 store 遷移到新的非同步 store，行為完全不變。我回來時要能相信它做對了。
how：         /how 我們怎麼取消執行中的工作？查詢每個要取消的工作時有沒有 N+1？
why：         /why 這個 feature flag 為什麼還沒開？
architect：   把這個埋點設計成高訊號、零誤報。先用 /architect 處理。
arena：       /arena 把我的提示詞原封不動送進競技場。我想比較它們的提案和你的。
swarm：       /swarm 用每個套件自己的 check.sh 檢查 packages/ 底下所有套件。每個套件一個 worker，最後一份報告。
interrogate： /interrogate 審查這個 PR。
tdd：         /tdd 實作
unslop：      可以把新的改動 unslop 並精簡一下嗎？
reflect：     /reflect 這花太久了。把學到的東西記下來，下次別再重蹈覆轍。
correct：     /correct
決策紀錄：    /show-me-your-work 保留一份決策紀錄，我回來時要審查。
automate-me： /automate-me
求助：        /poteto-help 我該用哪個技能來審查這個分支？
```

</details>

## `poteto-agent` 與 Comment Sicko 子代理

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 在接收它的那個聊天視窗裡執行。那個聊天擁有劇本、待辦清單，以及所有子代理的派遣。

pstack 也提供 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md)，作為執行過程中派出的子代理的包裝。它在做任何工作前，會完整讀過 `poteto-mode`（包括內嵌的原則索引）。如果改用 `generalPurpose`，就會跳過這一步而逐漸偏離。不要派 `poteto-agent` 去執行劇本本身。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 和 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md) 走同一個包裝。

pstack 還提供 [Comment Sicko](./agents/comment-sicko.md)，一個唯讀的註解審查員，以 `subagent_type: "comment-sicko"` 呼叫。通常透過 [`/no-comments`](./skills/no-comments/SKILL.md) 間接使用，不直接呼叫。

## 原則

二十四個短技能，每個代表一條原則。`poteto-mode` 內嵌了它們的索引，並在任務開始時讀取。獨立的檔案存在，是為了讓其他技能能用名稱引用某條原則，也讓索引能指向每條原則的完整內容。

<details>
<summary>全部二十四條原則</summary>

| 原則 | 分類 | 規則 |
|---|---|---|
| [laziness-protocol（懶惰協議）](./skills/principle-laziness-protocol/SKILL.md) | 核心 | 偏好刪除，以及能解決問題的最小改動。 |
| [foundational-thinking（基礎思考）](./skills/principle-foundational-thinking/SKILL.md) | 核心 | 寫邏輯前先套用：選擇核心型別與資料結構、決定先搭骨架還是先做功能、思考並行的角色共享了什麼。資料結構對了，後面的程式自然顯而易見。 |
| [redesign-from-first-principles（從第一原理重新設計）](./skills/principle-redesign-from-first-principles/SKILL.md) | 核心 | 把新需求當作從第一天就存在的基本假設來重新設計，而不是硬接上去。 |
| [attack-the-premise（質疑前提）](./skills/principle-attack-the-premise/SKILL.md) | 核心 | 當兩個以上共用同一前提的修法都在同一關卡失敗時套用。先把前提寫下來並直接測試它，再寫下一個建立在它之上的修法。 |
| [subtract-before-you-add（先減再加）](./skills/principle-subtract-before-you-add/SKILL.md) | 核心 | 先移除多餘負擔、重複的驗證和殘留的空殼引用，再在更簡單的基礎上建構。 |
| [minimize-reader-load（降低閱讀負擔）](./skills/principle-minimize-reader-load/SKILL.md) | 核心 | 計算從問題到答案之間有幾層、讀者腦中要記住多少隱藏狀態；合併只有一個呼叫者的包裝層，縮小可變狀態的範圍。 |
| [outcome-oriented-execution（以結果為導向）](./skills/principle-outcome-oriented-execution/SKILL.md) | 核心 | 用於有明確階段的計畫性重寫與遷移。直接收斂到目標架構，不要為了讓中間狀態平順而寫用完即丟的相容程式碼。 |
| [experience-first（體驗優先）](./skills/principle-experience-first/SKILL.md) | 核心 | 選使用者的驚喜，而不是實作上的方便；寧可少做幾個打磨好的功能，也不要做一堆粗糙的。 |
| [exhaust-the-design-space（窮盡設計空間）](./skills/principle-exhaust-the-design-space/SKILL.md) | 核心 | 決定前先做 2～3 個互相競爭的原型並排比較。 |
| [build-the-lever（打造槓桿）](./skills/principle-build-the-lever/SKILL.md) | 核心 | 適用於任何不簡單的工作，不只是大量重複的工作：修改、遷移、分析、檢查。打造能完成或證明工作的工具（codemod、腳本、產生器，或讓子代理遵循的技能），而不是手動做。工具本身就是審查者可以重跑的成品。 |
| [model-the-domain（為領域建模）](./skills/principle-model-the-domain/SKILL.md) | 架構 | 把領域規則編碼成一個結構，而不是散落各處的條件判斷。 |
| [boundary-discipline（邊界紀律）](./skills/principle-boundary-discipline/SKILL.md) | 架構 | 把防護集中在系統邊界（CLI、設定、網路、外部 API）；信任內部型別，把商業邏輯放在純函式裡。 |
| [type-system-discipline（型別系統紀律）](./skills/principle-type-system-discipline/SKILL.md) | 架構 | 讓不合法的狀態無法被表示、為有語意的基本型別加上品牌、在邊界解析外部資料、窮舉所有變體、從權威 schema 推導型別。 |
| [make-operations-idempotent（讓操作冪等）](./skills/principle-make-operations-idempotent/SKILL.md) | 架構 | 不論之前跑到一半幾次，最後都收斂到同一個結果。 |
| [migrate-callers-then-delete-legacy-apis（遷移呼叫端後刪除舊 API）](./skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | 架構 | 在同一波工作中遷移呼叫端並刪除舊 API，而不是保留相容層。 |
| [separate-before-serializing-shared-state（先分離，再序列化共享狀態）](./skills/principle-separate-before-serializing-shared-state/SKILL.md) | 架構 | 先消除共享；只有「單一寫入者」真的是不變條件時，才從結構上做序列化。 |
| [prove-it-works（證明它能用）](./skills/principle-prove-it-works/SKILL.md) | 驗證 | 完成任務、宣告完成之前套用。對真實的成品驗證（實際執行功能、讀出實際數值、檢查 diff），而不是用替代指標、自我回報或「它能編譯」。 |
| [fix-root-causes（修正根本原因）](./skills/principle-fix-root-causes/SKILL.md) | 驗證 | 把每個症狀追溯到系統最早出錯的地方並在那裡修。只有當它處理的狀態是合理存在的，加防護才算是修正。 |
| [sequence-verifiable-units（排序可驗證單元）](./skills/principle-sequence-verifiable-units/SKILL.md) | 驗證 | 適用於多步驟工作（大範圍掃描、遷移、一連串相似修改），以及 commit 和 PR 的堆疊方式。把工作拆成每個都能以可驗證狀態結束的小單元，檢查完一個再做下一個，並安排交付順序讓整串變更能自我證明給審查者看。 |
| [test-behavior-not-implementation（測行為，不測實作）](./skills/principle-test-behavior-not-implementation/SKILL.md) | 驗證 | 寫、改或保留測試時套用。斷言程式的使用者看得到的東西，這樣行為壞了測試會失敗，只改內部時測試仍會通過。 |
| [explain-the-number（解釋這個數字）](./skills/principle-explain-the-number/SKILL.md) | 驗證 | 在你相信、回報或根據一個量測數字（加速、退步、吞吐量、延遲或評測結果）採取行動前套用。找出限制它的瓶頸，並排除它其實量到別的東西的可能。 |
| [guard-the-context-window（守護上下文視窗）](./skills/principle-guard-the-context-window/SKILL.md) | 委派 | 大量內容交給子代理處理；主對話只保留摘要，不放原始資料。 |
| [never-block-on-the-human（絕不卡在等人）](./skills/principle-never-block-on-the-human/SKILL.md) | 委派 | 先做下去、展示結果，讓人事後修正方向；只有不可逆的動作才先確認。 |
| [encode-lessons-in-structure（把教訓寫進結構）](./skills/principle-encode-lessons-in-structure/SKILL.md) | 後設 | 把規則寫成 lint、metadata 旗標、執行期檢查或腳本，而不是多寫一段文字。 |

</details>

## 這裡沒有附的東西

`poteto-mode` 會提到，但沒有包含在 pstack 裡的：

- `/deslop` 和 `deslop` 技能在 `cursor-team-kit` plugin 裡。
- `control-cli`（用於 CLI 和 TUI）和 `control-ui`（用於瀏覽器、Electron、網頁）也在 `cursor-team-kit` 裡。
- `/create-skill` 是 Cursor 內建的。Cursor 也內建一個會盯著 PR 的 `/autopilot`。在 `poteto-mode` 裡，詢問 PR 狀態的請求會改走 [babysit 劇本](./skills/poteto-mode/playbooks/babysit.md)。

想要完整功能，就把 `cursor-team-kit` 跟 pstack 一起裝。

## 為什麼沒有「規劃」技能？

Cursor 本身已經有很棒的 Plan 模式，跟 pstack 搭配得很好。但我個人不相信規劃。**最好的規格就是程式碼。** 如果你真的想做計畫，[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 也能處理，只是不是預設行為。

## 變成你自己的

`poteto-mode` 是我的風格。你可能不想要一模一樣的。

輸入 [`/automate-me`](./skills/automate-me/SKILL.md)。它會分析你最近的對話紀錄，依照你實際的工作方式起草一個 `<你的名字>-mode` 技能，底層仍走 pstack。你保留 pstack 作為基礎，同時在 `poteto-mode` 旁邊多一個屬於你的路由技能。

模型也可以設定。輸入 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)。它會偵測你可用的模型，寫一份小小的「永遠套用」規則，把每個角色（寫程式、判斷、審查小組）對應到一個模型。每個技能都會讀這份規則；沒有規則時則使用合理的預設值，所以你只需要覆寫你在意的部分。

當預設值改變時，在改變之前寫的規則仍會釘住舊的預設值。刪掉那些角色的設定行（或刪掉整個檔案），再重新執行 `/setup-pstack`。重新執行時，模型跟預設不同的角色會被保留。

## 自動化

pstack 還附了一套預設不啟用的 [benny 自動化套件](./automations/benny/)。benny 會分類 Slack 上回報的問題，接著用真實 UI 證據重現並修正確認過的 bug。它的檔案不會被註冊成斜線指令技能。

設定方式：讓 Cursor 讀 [`FOR_AGENTS.md`](./automations/benny/FOR_AGENTS.md)。設定過程會把套件複製到目標 repo 的 `.cursor/automations/benny/`，在那裡啟用 pstack 以共用技能，並把使用者設定放在複製的套件之外。benny 跑在 Cursor Automations 上，所以只能在 Cursor 使用。

## 授權

MIT
