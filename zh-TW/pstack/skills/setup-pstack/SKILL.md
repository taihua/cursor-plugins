---
name: setup-pstack
description: 設定 pstack 每個角色使用哪個模型，以及推理預算。偵測你可用的模型，並寫一份永遠套用、會覆寫技能預設值的規則。用於 /setup-pstack、「設定 pstack 模型」、「pstack 預算」，或修改 pstack 的模型選擇。
---

> 本文為 [`pstack/skills/setup-pstack/SKILL.md`](../../../../pstack/skills/setup-pstack/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Setup pstack（設定 pstack）

寫出 `~/.cursor/rules/pstack-models.mdc`，一份永遠套用的規則，設定 pstack 每個角色使用的模型。

## 步驟

### 1. 偵測可用的模型

列舉在這次工作階段中你可以傳給 `Task` 子代理的模型 slug。這是可靠的來源。如果 Cursor 也提供能列出使用者有權使用之模型的 API 或 CLI，為了完整性優先使用它。如果你一個都偵測不到，請使用者貼上他們能使用的 slug。永遠不要寫入一個你沒確認可用的真實 slug。別名 `inherit-parent` 和 `auto` 永遠有效，即使它們不是偵測到的 slug。

### 2. 載入目前狀態

預設的角色對模型對應，就是下面第 5 步所示的規則形狀。如果 `~/.cursor/rules/pstack-models.mdc` 已經存在，讀取它，並把它的 `# budget` 行和各角色的值當作目前的選擇。否則從那些預設值開始。角色不在第 5 步中的行（例如 `how critics`）來自已退役的角色，把它拿掉。

### 3. 預算、對應與確認

**(a) 詢問預算。** 偏好用 AskQuestion，而不是自由文字。提供這四個選項，使用這些確切的標籤；如果規則有記錄目前的預算，就說出來。沒有規則時，說明 `large` 等同於技能預設值。

- `unlimited — max reasoning`（無限 — 最高推理）
- `large — xhigh reasoning`（大 — 極高推理）
- `medium — high reasoning`（中 — 高推理）
- `small — medium reasoning`（小 — 中等推理）

**(b) 套用它。** 從技能預設值建立工作表；重新執行時，保留任何你在家族、清單或別名（`inherit-parent`、`auto`）上改過的角色。`unlimited`、`large`、`medium`、`small` 會把每個真實 slug（包括小組項目）的推理等級 token 分別設為 `max`、`xhigh`、`high` 或 `medium`。推理等級 token 是最後一個 token，或在結尾的 `fast` 之前的那一個，等級順序為 `max` > `xhigh` > `high` > `medium` > `low`。如果結果不是偵測到的 slug，就用同一家族中、等級等於或低於目標的最高等級偵測 slug；都沒有的話，就把這個角色標示為需要選擇。`inherit-parent` 和 `auto` 不變。所以 `unlimited` 會把 `claude-opus-5-5-xhigh` 變成 `claude-opus-5-5-max`。Grok 的 slug 最高只到 `xhigh`，所以在 `unlimited` 下，備案會讓 Grok 停在 `xhigh`，並保持 `grok-4.7-xhigh-fast` 不變。`large` 保持兩個預設值不變。`small` 會把它們變成 `claude-opus-5-5-medium` 和 `grok-4.7-medium-fast`。

**(c) 顯示角色並確認。** 顯示每個角色及其模型，把任何不在偵測集合中的真實 slug 標示為需要選擇。也列出第 2 步拿掉的每一行。詢問要原樣接受，還是修改特定角色，提供偵測到的模型加上 `inherit-parent` 和 `auto` 作為選項（兩者都代表：這個角色使用主聊天的模型，Auto 使用者就是這樣保持在 Auto 上）。偏好用 AskQuestion，而不是自由文字。對於小組角色（arena runners、architect runners、interrogate reviewers），值是一個清單，每一項跑一個子代理（包括別名項目），所以清單長度決定數量。`arena cross-judge pool` 也是清單，但 Arena 只跑一個評審。它只會依清單順序嘗試與父代理不同家族的值，所以依偏好排序。`inherit-parent` 或 `auto` 值永遠不會當評審。`swarm workers` 是每個 worker 的預設模型，除非某次競賽或比較為每一組指定了其他模型。

### 4. 驗證

寫入的每個真實 slug 都必須在偵測集合中。`inherit-parent` 和 `auto` 永遠通過。如果選擇的某個真實 slug 不可用，停下並重新詢問。

### 5. 寫入規則

寫入 `~/.cursor/rules/pstack-models.mdc`，設定 `alwaysApply: true`，加上一行 `# budget` 寫明選擇的標籤和它的目標等級，以及每個角色一行，使用和 poteto-mode 相同的標籤。覆寫整個檔案，讓重新執行保持冪等。形狀如下（設定檔內容保留英文原樣）：

```
---
description: pstack per-role model choices (overrides skill defaults)
alwaysApply: true
---
# pstack model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat model (omit Task `model`). Alias entries in a panel list still count toward its fan-out.
# budget: large (xhigh)
feature, refactoring: grok-4.7-xhigh-fast
bug-fix: grok-4.7-xhigh-fast
perf-issue: grok-4.7-xhigh-fast
hillclimb: grok-4.7-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh
hardest tasks: claude-opus-5-5-xhigh
how explorer: grok-4.7-xhigh-fast
how explainer: claude-opus-5-5-xhigh
why investigators: grok-4.7-xhigh-fast
why synthesizer: claude-opus-5-5-xhigh
reflect tooling: grok-4.7-xhigh-fast
reflect judgment, divergent, synthesizer: claude-opus-5-5-xhigh
arena runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
arena cross-judge pool: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
swarm workers: grok-4.7-xhigh-fast
architect runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
interrogate reviewers: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
```

### 6. 確認

告訴使用者規則已經寫入，而且會套用到新的工作階段。重新執行這個技能會更新它。

### 7. 提議驗證技能（選擇性）

檢查專案是否有能操作真實 app 來取得證據的方法（一個 `verify-*` 技能，或既有的測試框架）。如果沒有，提議一次：「要不要一個專案專用的驗證技能，讓 agent 能像使用者一樣操作 app 並證明改動有效？我可以用 /create-verification-skill 產生一個。」答應的話，呼叫 `/create-verification-skill`（不論 pstack 安裝在哪裡都能解析：工作區、使用者或 plugin）。拒絕的話，不再推銷，繼續往下。

### 8. 提議形式驗證技能（選擇性）

檢查專案是否已經有形式驗證技能（一個對程式碼執行模型檢查器、證明或其他驗證器的專案技能）。如果沒有，提議一次：「要不要一個形式驗證技能，讓 agent 能證明你程式碼的某個關鍵性質在範圍內的每種情況下都成立，而不只是測試碰得到的情況？我可以用 /create-formal-verification-skill 產生一個。」答應的話，呼叫 `/create-formal-verification-skill`（不論 pstack 安裝在哪裡都能解析：工作區、使用者或 plugin）。拒絕的話，不再推銷，繼續往下。
