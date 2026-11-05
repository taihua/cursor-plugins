# 設定 pstack

這一頁你會安裝 plugin、挑選 pstack 要用的模型，並跑你的第一個任務。設定只要一個指令加上一段簡短對話。

## 安裝 plugin

在 Cursor 聊天框執行：

```text
/add-plugin pstack
```

Cursor 會確認 plugin 已安裝。

在 Claude Code 裡，先執行 `/plugin marketplace add cursor/plugins`，再執行 `/plugin install pstack@cursor-plugins`。Claude Code 會在 plugin 指令前加前綴，所以本指南裡的每個指令在那裡都要加 `pstack:`，例如 `/pstack:setup-pstack`（它會把模型規則寫到 `~/.claude/rules/pstack-models.md`）。其他差異請見 [Claude Code 對照說明](../../../pstack/docs/harness/claude-code.md)。

## 挑選模型

執行：

```text
/setup-pstack
```

[`/setup-pstack`](../../../pstack/skills/setup-pstack/SKILL.md) 會偵測你能用哪些模型、詢問推理預算（reasoning budget）、列出每個角色（寫程式的代理、做判斷的、審查小組），然後問你想怎麼配。回答問題就好。它會寫出 `~/.cursor/rules/pstack-models.mdc`，一份每個 pstack 技能都會讀的小規則檔。

預設以 `xhigh` 推理等級執行，等同於 `large` 預算。`unlimited` 會把每個模型拉到它的最高等級（最高 `max`）：Opus 會到 `max`，Grok 最高只到 `xhigh` 所以維持在那裡。`medium` 和 `small` 會降低推理等級、花更少 token。

你只需要覆寫你在意的部分。規則檔裡沒寫到的角色會使用技能的預設值。想恢復預設，刪掉那個角色那一行即可。重新執行 `/setup-pstack` 時，模型跟預設不同的角色會被保留。當預設值改變時，之前寫的規則仍會釘住舊的預設值，所以請刪掉那些角色的設定行（或整個檔案），再重新執行 `/setup-pstack`。

你可能會想：如果我用 Auto 呢？把某個角色設成 `inherit-parent` 或 `auto`，pstack 就不會指定子代理的 `model` 欄位，子代理會沿用你目前聊天視窗的模型。這兩個值意思相同，而且都**不是**模型名稱。審查小組類的角色值是一個清單，清單裡每一項各跑一個子代理，所以清單長度就決定小組人數。設定時也會設定 `swarm workers`，也就是每個 `/swarm` worker 的預設模型（除非某次競賽替每一組指定了模型）。

## 要不要接受「驗證技能」的提議

設定的最後，`/setup-pstack` 會在你的專案裡找能證明 app 行為的方法：一個 `verify-*` 技能，或既有的測試框架。如果都找不到，它會提議一次，用 [`/create-verification-skill`](../../../pstack/skills/create-verification-skill/SKILL.md) 幫你產生一個。

答應的話，它會寫出 `.cursor/skills/verify-<app>/`，一個專案專用的技能，教 agent 像真正的使用者一樣操作你的 app。交給你之前，它會先證明這個技能確實能跑一次。拒絕的話，設定就繼續往下。你隨時都可以自己執行 `/create-verification-skill`。[驗證並出貨](./06-verify-and-ship.md#建立專案驗證技能) 有深入說明。

**如果你是 pstack 新手，請答應。** 能自己檢查成果的 agent 會一直做到檢查通過為止；不能檢查的 agent 則會把每個結果丟回給你手動檢查。在這整份指南中，驗證技能是回報最大的一項。

接著，除非專案已經有了，設定會再提議一次，用 [`/create-formal-verification-skill`](../../../pstack/skills/create-formal-verification-skill/SKILL.md) 產生「形式驗證」技能。測試只會檢查有人想到要寫的情況；形式驗證技能則會在明確的範圍內，檢查你程式碼的**某一個關鍵性質**在**所有情況**下都成立，例如「同一個工作永遠不會同時執行兩次」。如果你的程式有並行、重試、狀態機或解析器——也就是 bug 代價高、而測試很少碰到出錯情況的地方——就答應。否則就拒絕，之後情況改變再執行。[驗證並出貨](./06-verify-and-ship.md#用形式驗證技能證明一個性質) 有說明。

設定完成後，**開一個新的聊天視窗**。模型規則只會套用在新的工作階段。

## 控制成本

pstack 會在子代理和審查小組上多花 token，這是換取嚴謹的代價。想省一點：

- 重新執行 `/setup-pstack`，選小一點的推理預算或便宜一點的模型。主聊天用強模型、寫程式的角色用便宜快速的模型，是不錯的分配。
- 把某個角色設成 `auto` 或 `inherit-parent`，讓它沿用聊天視窗本身的模型。
- 縮短審查小組清單。每一項都會跑一個子代理。
- 只在需要嚴謹的工作上用 `/poteto-mode`。小而明顯的修改不需要。

## 跑你的第一個任務

挑一個真實但小的任務，像跟同事說明那樣描述它：

```text
/poteto-mode 幫這個指令加一個 --json 選項。原本的文字輸出要一個位元組都不變。兩種輸出都要驗證。
```

注意看待辦清單。前幾項是對應到的劇本步驟（這個提示詞會對應到「新功能」劇本）。如果 `/poteto-mode` 跳過某一步，那一步仍會留在清單上並標記 `skip: <原因>`，讓你看到它選擇不做什麼。

接下來你可以正常地追問。想讓 `/poteto-mode` 在整個聊天中都保持開啟，從 `/` 選單選它時按 Option+Enter（Mac）或 Alt+Enter（Windows），而不是 Enter。這會變成一個[自訂模式（Custom Mode）](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，每一輪都留在上下文中，直到你退出。自訂模式在 Agents 視窗和 CLI 中可用。單純按 Enter 只會把技能附加到一則訊息，隨著對話進行它的影響會逐漸淡掉。

下一頁：[透過 `/poteto-mode` 分派工作](./02-poteto-mode.md)。
