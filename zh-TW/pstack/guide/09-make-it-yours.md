# 打造你自己的版本

poteto-mode 是一個人的風格。它底下的劇本、路由和模型角色，套上你的風格一樣好用。這一頁涵蓋：產生個人模式、記下一次工作的教訓、修正 repo 讓 agent 不再重複犯錯、撰寫一個聚焦的技能，以及在信任技能修改之前先測試它。

**從比你想像中更小的地方開始。** 第一天你不需要很多技能，甚至不需要整個 plugin。用白話下提示詞，觀察 agent 在哪裡失敗，當同一個失敗出現兩次時，再加一個技能或一個檢查。

## 用 `/automate-me` 產生你自己的模式

```text
/automate-me
```

你不用描述自己的風格，因為 [`/automate-me`](../../../pstack/skills/automate-me/SKILL.md) 會從你的歷史紀錄中讀出來。它會挖掘目前工作區最近的對話紀錄，找出重複出現的偏好——你喜歡怎樣的回覆、怎樣委派、怎樣驗證、怎樣的程式碼、文字和流程——然後問你哪些模式真的是你。它透過 Cursor 內建的 `create-skill` 流程起草 `.cursor/skills/<你的名字>-mode/SKILL.md`，用 [`/unslop`](../../../pstack/skills/unslop/SKILL.md) 整理草稿，並從 worktree 開一個 PR，讓你像審查其他改動一樣審查它。

習慣改變時，再跑一次：

```text
/automate-me 用上次修改之後的所有紀錄更新我的模式技能
```

更新模式只會挖掘技能上次修改之後的紀錄。它會保留你沒有推翻的規則、修改有新證據的規則，並只為新的模式加入新章節。

## 用 `/reflect` 記下一次工作的教訓

在一個讓你學到東西的任務結束後，立刻執行：

```text
/reflect 這花了太久時間。把學到的東西記下來，下次別再重蹈覆轍。
```

[`/reflect`](../../../pstack/skills/reflect/SKILL.md) 會把對話紀錄交給三個平行的審查者，接著一個綜合者把提案分成 `Accepted`（接受）、`Rejected`（拒絕）、`Backlog`（待辦），並在修改任何技能前等你核准。**只有當一個提案會改變未來的決定時，才核准它。** 一次奇怪的工作經驗是軼事，不是規則。

## 用 `/correct` 修正環境

當你一次又一次為同一個錯誤糾正 agent，修正應該放進 repo，而不是放進你下一個提示詞。依照「撐得住的程度」排序各種選項：

1. 用架構或更好的資料結構，讓錯誤**不可能**發生。
2. 用型別，或用錯誤訊息會指出修法的 lint 或 CI 檢查來**擋住**它。
3. 用測試**抓到**它。
4. 寫成文件或 agent 規則。agent 跳過規則時什麼都不會失敗，所以這排最後。

人工審查不在清單上。一個必須在每個 PR 上抓同一個錯誤的審查者，正是這個方法要解決的問題。[`/correct`](../../../pstack/skills/correct/SKILL.md) 會做這件事：

```text
/correct agent 一直直接呼叫資料庫客戶端，而不是透過 repository 層
```

它會讀最近的 commit、還原紀錄、審查留言，以及解釋繞路寫法的註解，然後把錯誤分類。一類錯誤發生兩次就算數。它會從最常見的類別開始，每類一個 commit，在最高可行的層級修正，並證明每個新檢查確實會在一個真實的過去錯誤上失敗。它也會在 agent 指令檔裡維護一張表，把每條規則和「強制執行它的東西」配對，這樣沒有任何東西強制執行的規則就會被當成重複錯誤顯示出來。回覆會列出每一類錯誤、它的證據、選擇的層級，以及為什麼更高的層級行不通。

不給參數執行它，它會自己從歷史中找出錯誤類別。`/reflect` 和 `/correct` 分工如下：`/reflect` 從**一次工作**改善**技能**；`/correct` 改變 **repo**，讓一類錯誤不會再回來。當修正需要一個新的邊界時，搭配 `/architect`。[平行跑多個專案](./07-overnight.md#平行跑多個專案) 有一個對整個 repo 同時做這兩件事的提示詞。

## 撰寫一個聚焦的技能

當你已經知道想記下的工作流程時：

```text
/poteto-mode 寫一個技能，用來驗證這個 repo 的資料庫遷移
```

寫技能會對應到[撰寫或修改技能劇本](../../../pstack/skills/poteto-mode/playbooks/authoring-a-skill.md)，它會走 Cursor 內建的 `create-skill`、驗證 frontmatter 和連結，並透過「開 PR」劇本交付結果。給 agent 看的文字比給人看的標準更高，因為一句沒幫助的話會變成未來某個 agent 照做的指令。讓劇本把關這個標準，不要徒手寫 `SKILL.md`。

有兩種特殊情況有自己的產生器。必須操作你的 app 並證明行為的技能是「驗證技能」，請改用 [`/create-verification-skill`](../../../pstack/skills/create-verification-skill/SKILL.md) 和 [`/maintain-verification-skill`](../../../pstack/skills/maintain-verification-skill/SKILL.md)。用模型檢查器、數學證明或其他驗證器檢查程式碼性質的技能是「形式驗證技能」，請用 [`/create-formal-verification-skill`](../../../pstack/skills/create-formal-verification-skill/SKILL.md) 和 [`/maintain-formal-verification-skill`](../../../pstack/skills/maintain-formal-verification-skill/SKILL.md)。[驗證並出貨](./06-verify-and-ship.md#用形式驗證技能證明一個性質) 涵蓋這兩種。

## 用 `/technical-writing` 依標準寫文件

技能不是你唯一會交付的文字。文件、RFC、README、PR 描述和 commit 訊息：

```text
/technical-writing 審查 README 的修改
```

[`/technical-writing`](../../../pstack/skills/technical-writing/SKILL.md) 套用一套分層的標準。它的目標是讓一個疲憊的工程師**第一次讀就懂**。它會先決定文件的類型（教學、操作指南、參考手冊或概念解說），再逐句處理：誰做了什麼、一句一個想法、沒有任何能有兩種解讀的句子。用它來審查你或 agent 剛寫好的東西，或在要求寫文件時一開始就點名它。

> 註：這個技能的標準是針對英文寫作設計的（例如簡化技術英文 STE、Global English）。

## 盲測技能的修改

技能的修改會影響未來每一次工作，所以要把它當成實驗來測試。採用別人的技能也一樣：在留下它之前，先確認它在**你的**工作上確實讓 agent 變得更好。

```text
/poteto-mode 對這個技能修改跑 eval 劇本。兩個版本用同樣的任務，候選者保持盲測。
```

當一個技能一直出錯，而你知道它應該怎麼做時，在同一個任務裡修改並測試它：

```text
/poteto-mode 更新審查技能，讓它會標出漏掉的資料庫遷移，並對這個修改做 eval。
```

一開始就要求做評測，能讓修改保持誠實。從一次糟糕經驗寫出來的修正，往往會對那次經驗過度擬合；修改多次之後，技能就會漂移。評測能在漂移出貨之前抓到它。

[評測劇本](../../../pstack/skills/poteto-mode/playbooks/eval.md) 是圍繞一種失敗模式設計的：**觀察者效應**。知道自己在被評測的 agent 會表現得不一樣。所以候選 agent 拿到的是看起來很自然的任務、在清理過的資料夾裡，永遠不會看到「eval」或「candidate」這些字，也永遠不知道彼此存在。一個評審在中性標籤下替所有輸出打分數；「是否有照著指示鏈走」則是依據每個候選者**實際讀了哪些檔案**來評分，而不是依它自己說了什麼。

接受判定之前，自己讀過每一份輸出。如果你不同意評審，先懷疑評分標準，再懷疑你自己的判斷。

## 用 `/make-bot-ui` 做機器人介面

有一個看情況使用的技能是給 Grok Bot 使用者的。[`/make-bot-ui`](../../../pstack/skills/make-bot-ui/SKILL.md) 會做一個小頁面，上面的按鈕可以透過 webhook 例行程序喚醒機器人。例如，你可以在一個審查佇列中左右滑動，每一次滑動就請機器人處理那一項。你電腦上的一個伺服器會保管 webhook 的傳送者金鑰，所以金鑰永遠不會跑到瀏覽器或聊天裡。這個技能也涵蓋如何在 Tailscale 上公開這個頁面。

**陷阱：** 不要因為技能表現不好就在任務進行到一半時修改它。用它自己的 PR 去修，讓任務繼續進行。跟功能開發糾纏在一起出貨的技能修改，審查時看不見，也無法評測。

下一頁：[食譜與陷阱](./10-recipes-and-pitfalls.md)。
