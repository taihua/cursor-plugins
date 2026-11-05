---
name: poteto-help
description: 引導使用者完成 pstack 設定、使用 /poteto-mode，以及為任務挑選技能、劇本或原則。輸入 /poteto-help 加上問題。
disable-model-invocation: true
---

> 本文為 [`pstack/skills/poteto-help/SKILL.md`](../../../../pstack/skills/poteto-help/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Poteto help（Poteto 求助）

回答使用者關於 pstack 的問題、交給他們一段可以送出的提示詞，並連結答案出處的檔案。對於求助問題，不要開始做工作。使用者問的是「怎麼做」，而跑一次 pstack 會花真實的 token，所以讓他們自己送出提示詞。

要求做工作的訊息，例如「用 pstack 修這個 bug」，不是求助問題。讀 [`poteto-mode`](../poteto-mode/SKILL.md)，在它之下做工作，並提一次「用自訂模式（Custom Mode）可以讓它保持開啟」。

這個檔案把問題對應到握有答案的技能和指南頁面。細節由那些檔案負責。在引用你導向的檔案之前先讀它，當它和這份地圖不一致時，相信它。這裡的連結指向已安裝的 plugin，使用者可能打不開，所以給使用者檔案的公開版本：`https://github.com/cursor/plugins/blob/main/pstack/` 後面接上它的路徑。

## 搞清楚他們需要什麼

從訊息和對話中推斷需求。一個有指名的情境，例如「哪個技能可以審查 PR？」，直接到它的章節。如果需求仍不清楚，問一個有以下選項的選擇題，然後只回答他們選的章節：

- 完成設定
- 用 `/poteto-mode` 開始一個任務
- 為某個情境挑一個技能
- 修正一次出錯的執行
- 把 pstack 變成我自己的

檢查會改變答案的狀態，只有在它真的會改變答案時才提：

- 沒有 `~/.cursor/rules/pstack-models.mdc`，代表這位使用者還沒跑過 `/setup-pstack`，所以每個角色都使用預設模型。
- 專案中沒有 `verify-*` 技能或其他 app 測試框架，代表 agent 沒有用腳本操作 app 的方法。當問題是關於證明一個改動有效時，提 `/create-verification-skill`。
- 專案中沒有形式驗證技能，代表沒有任何性質被檢查到測試觸及範圍之外。當問題是關於競態、不變條件或其他測試很少碰到的情況時，提 `/create-formal-verification-skill`。當已經有一個、而它涵蓋的程式碼在它記錄的最後同步 commit 之後改變了，如果問題碰到那段程式碼，就提 `/maintain-formal-verification-skill`。

當模型規則不存在、而且這件事重要時，問使用者現在要不要為每個角色選模型和推理預算。當使用者是新手、問題是關於設定或成本，或答案取決於跑哪些模型時，這件事就重要。每個聊天最多問一次。如果需求也不清楚，就兩個問題一起問。提供兩個選擇：

- 現在：給他們 `/setup-pstack` 讓他們輸入，同時也回答他們的問題。
- 之後：回答他們的問題，並加一行說明在他們跑 `/setup-pstack` 之前，每個角色都維持預設模型。

## 完成設定

1. 在聊天中用 `/add-plugin pstack` 安裝，或從側邊欄的 Customize 安裝。
2. 執行 [`/setup-pstack`](../setup-pstack/SKILL.md)。它會詢問推理預算、為每個角色對應一個模型，並寫一份規則。規則會套用到新的聊天。然後，除非專案已經有了，它會各提議一次為專案產生驗證技能和形式驗證技能。
3. 用 `/poteto-mode`、一個目標和一個能通過或失敗的檢查，開始一個真實的任務。

安裝之後，在使用者呼叫某個技能之前什麼都不會改變。只有 `/setup-pstack` 會從使用者的話語中自動載入。[README](../../README.md) 和[指南第 1 頁](../../docs/guide/01-setup.md)有詳細說明。依 [`references/prompting.md`](./references/prompting.md)，提議和他們一起構思第一個提示詞。

如果擔心的是成本，就說明 token 花在哪裡，以及如何少花一點。pstack 會在子代理和審查小組上多花 token。重跑 `/setup-pstack` 並選擇較小的預算或較便宜的模型。設為 `auto` 或 `inherit-parent` 的角色會使用聊天的模型，當聊天跑在 Auto 或較便宜的模型上時能省 token。較短的小組清單會跑較少的子代理，每一項一個。把 `/poteto-mode` 留給需要嚴謹的工作。

pstack 是為 Cursor 打造的，但也能在 Claude Code 中安裝：先 `/plugin marketplace add cursor/plugins`，再 `/plugin install pstack@cursor-plugins`。在那裡，每個指令都要加 `pstack:` 前綴，例如 `/pstack:poteto-mode`。[Claude Code 對照說明](../../docs/harness/claude-code.md)列出 Cursor 名稱的對應，而需要 Cursor 專屬功能（例如 Bugbot 或 Automations）的步驟會被跳過，並附上一行說明。

其他工具也能讀這些技能，因為它們使用 Agent Skills 格式。但大部分工作流程技能，包括 `/poteto-mode`、`/how`、`/why` 和 `/teach`，都會用各角色的模型派出 Cursor 子代理，而自訂模式和 `/loop` 是 Cursor 的功能，所以那些部分在別處可能無法運作。

## 用 `/poteto-mode` 開始一個任務

`/poteto-mode` 會把任務對應到一個劇本、把劇本的步驟複製到待辦清單，並在步驟需要時執行其他技能。它跳過的步驟會以 `skip: <原因>` 留在清單中。好的提示詞說明目標以及如何判斷完成。它不列出技能，因為手寫的順序往往會漏掉或打亂劇本本來會保留的步驟。在幫忙構思提示詞之前，先讀 [`references/prompting.md`](./references/prompting.md)。[指南第 2 頁](../../docs/guide/02-poteto-mode.md)有範例。

`/poteto-mode` 是否保持開啟，取決於使用者如何啟動它：

- 在 `/poteto-mode` 上按 Enter，會把技能附加到一則訊息上。隨著對話進行，它會逐漸淡掉。
- 在 Mac 上按 Option+Enter、在 Windows 上按 Alt+Enter，或從技能項目選 Use as Mode，會把它變成自訂模式。它在每一輪都留在上下文中，直到使用者退出模式，而且不會干擾閒聊的回合。
- Cursor 的文件列出 Agents 視窗和 CLI 支援自訂模式。在其他地方，每個新任務都以 `/poteto-mode` 開始。

提到這件事時，連結 [Cursor 的技能文件](https://cursor.com/docs/skills)。在聊天途中說「新任務」，會讓模式重新對應一個新的劇本。`/poteto-mode` 已經會為它的劇本步驟派出的子代理使用 `poteto-agent`。要讓你自己的子代理也有同樣的風格，用 `subagent_type: "poteto-agent"` 派出它。

## 挑一個技能

預設答案是 `/poteto-mode`，它會在步驟需要時執行大部分其他技能。當使用者想要比劇本給的更多或更少某樣東西時，才直接點名某個技能。推薦前先讀過那個技能，並給一個範例提示詞。

| 使用者想要 | 技能 |
|---|---|
| 嚴謹地做任何不簡單的任務 | [`/poteto-mode`](../poteto-mode/SKILL.md) |
| 在開始前確認 agent 理解了他們的目標和問題 | [`/in-your-own-words`](../in-your-own-words/SKILL.md) |
| 送出前把提示詞改寫得更深而不是更大：頂尖專業人士會加什麼、他們的原始材料和方法，以及一個外部檢查。它回傳提示詞，不做任務 | [`/sharpen`](../sharpen/SKILL.md) |
| 知道程式碼現在怎麼運作，或新程式碼該放在哪裡 | [`/how`](../how/SKILL.md) |
| 知道程式碼為什麼長這樣，或某個數字從哪裡來 | [`/why`](../why/SKILL.md) |
| 用白話理解一個改動或子系統 | [`/teach`](../teach/SKILL.md) |
| 追上自己最近在某個主題上的工作 | [`/recall`](../recall/SKILL.md) |
| 用白話和小圖示追上這個聊天自從他們上一則訊息之後的變化，列出每件等他們決定的事，光看回覆就能決定 | [`/ketchup`](../ketchup/SKILL.md) |
| 像 `/ketchup` 一樣追上進度，但用有字幕的投影片短片，等待的決定以文字放在下面 | [`/ketchup-video`](../ketchup-video/SKILL.md) |
| 知道一個小 diff 可能弄壞它以外的什麼 | [`/blast-radius`](../blast-radius/SKILL.md) |
| 在寫跨越函式邊界的程式碼之前，先定好型別和模組形狀 | [`/architect`](../architect/SKILL.md) |
| 對同一份需求做好幾次嘗試，合併成最好的一個 | [`/arena`](../arena/SKILL.md) |
| 以雲端 agent 對各區塊平行檢查，或讓 worker 競賽 | [`/swarm`](../swarm/SKILL.md) |
| 讓不同模型審查一份 diff 並試著弄壞它 | [`/interrogate`](../interrogate/SKILL.md) |
| 有便宜的本機測試時，以測試先行的方式修 bug | [`/tdd`](../tdd/SKILL.md) |
| 在 `.ts` 或 `.tsx` 工作中套用 TypeScript 規則 | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| 審查前拿掉註解，由一個不是作者的審查者來做 | [`/no-comments`](../no-comments/SKILL.md) |
| 清掉文字中的 AI 痕跡 | [`/unslop`](../unslop/SKILL.md) |
| 依標準寫文件、RFC、README、PR 描述或 commit 訊息 | [`/technical-writing`](../technical-writing/SKILL.md) |
| 用白話再聽一次上一則回覆 | [`/bro`](../bro/SKILL.md) |
| 給 agent 一個用腳本操作 app 並證明行為的方法 | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| 讓驗證技能和它的功能地圖重新與 app 一致 | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| 形式驗證一個競態、不變條件或其他測試很少碰到的性質 | [`/create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| 在形式驗證涵蓋的程式碼改變後讓它重新一致，並了解某個失敗是偏移還是 bug | [`/maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| 用一張由 TLA+ 模型檢查過的圖，向 PM 或設計師呈現使用者看到的東西，以及到達每個違反規則之狀態的最短路徑 | [`/statechart`](../statechart/SKILL.md) |
| 在回報或根據一個效能數字行動之前先檢驗它 | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| 執行一個大型或跨領域的改動，或一個離開後才回來審查的改動 | [`/figure-it-out`](../figure-it-out/SKILL.md) |
| 在執行期間保留決策紀錄，並在之後審查它 | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| 為每個角色選模型和推理預算 | [`/setup-pstack`](../setup-pstack/SKILL.md) |
| 把自己的工作習慣變成個人的 mode 技能 | [`/automate-me`](../automate-me/SKILL.md) |
| 把一個完成的任務教會的東西變成技能修改 | [`/reflect`](../reflect/SKILL.md) |
| 讓 agent 不再在這個 repo 重複犯同樣的錯 | [`/correct`](../correct/SKILL.md) |
| 做一個按鈕能透過 webhook 喚醒 Grok Bot 的頁面 | [`/make-bot-ui`](../make-bot-ui/SKILL.md) |
| 在 pstack 中找到方向 | `/poteto-help` |

如果這個資料夾旁邊有某個技能資料夾沒出現在表中，讀它的 frontmatter，依它的描述導向。`principle-*` 資料夾在下面的原則部分涵蓋。

容易混淆的選擇：

- `/how` 解釋程式碼做什麼。`/why` 解釋原因。`/teach` 跑其中一個或兩個，並用白話解釋結果。
- `/arena` 給每個 worker 同一份需求，並合併最好的部分。`/swarm` 把工作分成區塊或競賽，並回傳一份報告。
- `/architect` 在定好設計後會直接實作。加上「with checkpoint」可以在它寫程式之前審查設計。
- `/interrogate` 審查 diff。`/blast-radius` 尋找 diff 以外的破壞，並證明讓改動安全的那個關鍵事實。
- `/recall` 跨最近的聊天重建脈絡。`/ketchup` 只涵蓋這個聊天自從使用者上一則訊息之後的內容。接續某一個特定的聊天或分支是 Session pickup 劇本。
- `/figure-it-out` 設計一次嚴謹的執行。Orchestrate 劇本執行一個橫跨多天、很多 PR 的計畫。Autonomous run 劇本把一個任務推到一個完成條件。

不在 pstack 中的：

- `/deslop`、`control-cli` 和 `control-ui` 在 `cursor-team-kit` plugin 中。
- `/loop` 和 `/create-skill` 是 Cursor 內建的。
- pstack 沒有 `/orchestrate` 技能。Orchestrate 是 `/poteto-mode` 的一個劇本。如果斜線選單出現 `/orchestrate`，那是別的 plugin 提供的。

## 劇本與原則

劇本是 `/poteto-mode` 內部的步驟清單，不是技能，所以沒有斜線指令。在 `/poteto-mode` 中，描述任務就會選到一個，而這些說法會直接指名一個：

- 「babysit this pr」或「check on pr 123」執行 Babysit。它把 PR 推到可合併並停在那裡。除非使用者要求合併、落地或出貨，否則它不合併。
- 「land the stack」執行 Shipping。
- 「take over this branch」執行 Session pickup。
- 「pause safely」執行 Pause safely。
- 「full autopilot on this queue」執行 Autopilot-full。「autopilot, don't merge」執行 Autopilot-stack。
- 「run the eval playbook」執行 Eval。

沒有 `/poteto-mode` 的話，像「babysit this pr」這樣的說法可能會改為啟動 Cursor 自己做同樣工作的技能。[`poteto-mode`](../poteto-mode/SKILL.md) 的「劇本」章節列出每個劇本以及它何時適用。[指南第 6 頁](../../docs/guide/06-verify-and-ship.md)涵蓋開 PR、看顧 PR 和合併 PR。

pstack 沒有規劃技能。Cursor 的 Plan 模式可以和它一起用。對於跨階段或堆疊 PR 的工作，請 `/poteto-mode` 做計畫會執行[多階段計畫劇本](../poteto-mode/playbooks/multi-phase-plan.md)，它寫計畫但不實作。對於設計問題，原型劇本或 `/architect` 會先用程式碼解決它。

原則是單一規則的技能，`/poteto-mode` 會讀它們並在回覆中引用。使用者很少直接呼叫，而是用名稱來引導，例如「apply prove it works. show me the real output.」輸入 `/principle-<name>` 仍然可以按需載入一條。[指南第 8 頁](../../docs/guide/08-principles.md)列出了它們。

## 修正一次出錯的執行

| 症狀 | 修正 |
|---|---|
| 模式在幾輪之後就不再套用 | 它是用 Enter 啟動的。改用自訂模式啟動，或每個任務都以 `/poteto-mode` 開始。 |
| 一個問題被當成上一個任務的下一步 | 說「新任務」，或說這一輪不需要模式。 |
| 新的模型選擇沒有效果 | `/setup-pstack` 的規則套用在新的聊天。開一個新的。 |
| 執行花費比預期多 | 見「完成設定」中關於成本的段落。 |
| 某個技能沒有自動載入 | 只有 `/setup-pstack` 會從使用者的話語自動載入。其他的要在使用者輸入時、或 `/poteto-mode` 執行它們時才載入，而它並不會執行每個技能。 |
| 平行的 agent 互相覆蓋 | 給每個 agent 自己的 worktree，或用雲端 agent 執行，每個都有自己的機器。 |
| 整夜執行有動作但什麼都沒完成 | `/loop` 需要一個能通過或失敗的檢查，而不是一段時間長度。見[指南第 7 頁](../../docs/guide/07-overnight.md)。 |
| 回覆因為建置全綠就宣稱成功 | 要求真實的指令、流程、儲存的值或效能分析。那就是 prove-it-works 原則。 |

對於偏掉的執行，[`references/prompting.md`](./references/prompting.md) 有一行就能引導的說法。[指南第 10 頁](../../docs/guide/10-recipes-and-pitfalls.md)有更多陷阱，以及值得複製的食譜。

## 把 pstack 變成我自己的

- [`/automate-me`](../automate-me/SKILL.md) 從使用者自己的紀錄起草一個個人的 mode 技能，和 `/poteto-mode` 並用。
- 工作階段結束後的 [`/reflect`](../reflect/SKILL.md)，會把它的教訓變成由使用者核准的技能修改。
- `/poteto-mode write a skill for <workflow>` 會執行撰寫技能劇本。Eval 劇本會盲測技能的修改。
- 用它自己的 PR 修正表現不好的技能，而不是在出問題的功能工作中修。

[指南第 9 頁](../../docs/guide/09-make-it-yours.md)涵蓋了以上每一項。

## 回覆

以答案開頭。在程式碼區塊中最多給一個範例提示詞，適合時從 [`references/recipes.md`](./references/recipes.md) 改編，然後附上那個檔案的連結。保持簡短，除非使用者要求整份地圖。
