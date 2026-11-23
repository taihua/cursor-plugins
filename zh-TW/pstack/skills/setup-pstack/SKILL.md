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

預設的角色對模型對應，就是下面第 5 步所示的規則形狀。如果 `~/.cursor/rules/pstack-models.mdc` 已經存在，讀取它，並把它的 `# budget` 行和各角色的值當作目前的選擇。否則從那些預設值開始。角色不在第 5 步中的行（例如 `hardest tasks`、`architect runners`、`reflect tooling` 或 `why investigators`）來自已退役的角色，把它拿掉。

較舊的預設值曾在小組席位放另一個 Gemini 模型，之後換成 `gemini-4-neon-high`。所以在任何規則中，小組角色（`arena runners`、`arena cross-judge pool`、`interrogate reviewers`）裡的 `gemini-4-neon-high` 項目，或 `gemini-4-neon-*` 以外的 `gemini-4-*` 項目，都是舊的預設值。每一個都改成 `gemini-4-neon-xhigh`。其他等級的 Gemini 4 Neon 項目是使用者的選擇，保留不動。告訴使用者你替換了哪些項目。

沒有 `# defaults: 3` 這一行的規則來自較舊的設定。那個舊設定會為每個角色都寫一行，所以其中有些值是舊的預設值，而不是使用者的選擇。在第 3 步之前，替換這些值：

- `arena cross-judge pool` 的清單如果剛好是一個 `claude-fable-*` 項目、一個 `claude-opus-*` 項目和一個 `gemini-*` 項目（順序不限），就改用該角色在第 5 步的清單。Fable 和 Opus 屬於同一個廠商，所以 Fable 項目能當評審的場合，Opus 項目一定也能。
- `# budget: unlimited` 這一行改成 `large`，因為沒有任何角色會超過 `xhigh`。
- 如果規則也沒有 `# defaults: 2` 這一行，那麼符合 `grok-*` 的就是舊 slug。`feature, refactoring`、`bug-fix`、`perf-issue`、`hillclimb` 或 `swarm workers` 裡的舊 slug，改用該角色在第 5 步的預設值。在小組角色（`arena runners`、`arena cross-judge pool`、`interrogate reviewers`）中，清單如果剛好是一個 `claude-opus-*` 項目加一個舊 slug（順序不限），就改用該角色在第 5 步的清單。在其他任何清單中，每個舊 slug 都改成 `claude-opus-5-5-high-fast`。

其他所有值都是使用者的選擇，保留不動，包括其他角色中的舊 slug，以及每個 `inherit-parent` 或 `auto` 值。告訴使用者你替換了哪些值。

### 3. 預算、對應與確認

**(a) 詢問預算。** 偏好用 AskQuestion，而不是自由文字。提供這三個選項，使用這些確切的標籤；如果規則有記錄目前的預算，就說出來。沒有規則時，說明 `large` 等同於技能預設值。

- `large — xhigh reasoning`（大 — 極高推理）
- `medium — high reasoning`（中 — 高推理）
- `small — medium reasoning`（小 — 中等推理）

**(b) 套用它。** 從技能預設值建立工作表；重新執行時，保留任何你在家族、清單或別名（`inherit-parent`、`auto`）上改過的角色。家族依 **arena** 技能 Phase A 的定義，所以 Fable 自成一個家族。每個角色都有一個目標等級，也就是它預設值的推理等級依預算調整後的結果。在 `xhigh` > `high` > `medium` > `low` 這個等級順序上，`large` 保持不變，`medium` 降一級，`small` 降兩級。沒有任何角色會超過 `xhigh`，已經在最低一級的目標就停在那裡。大部分預設值都在 `xhigh`，每個預算標籤寫的就是它們最後落在哪一級。把角色中每個真實 slug（包括小組項目）的推理等級 token 設為該角色的目標等級。推理等級 token 是最後一個 token，或在結尾的 `fast` 之前的那一個。如果結果不是偵測到的 slug，就用同一家族中、等級等於或低於目標的最高等級偵測 slug；都沒有的話，就把這個角色標示為需要選擇。`inherit-parent` 和 `auto` 不變。所以 `medium` 會把 `claude-opus-5-5-xhigh-fast` 變成 `claude-opus-5-5-high-fast`、把 `claude-opus-5-5-high-fast` 變成 `claude-opus-5-5-medium-fast`；`small` 則會把它們變成 `claude-opus-5-5-medium-fast` 和 `claude-opus-5-5-low-fast`。Opus 5.5 永遠跑它的 `-fast` slug，所以每個 Opus 5.5 的值都以 `-fast` 結尾。Fable 5.2 和 Gemini 沒有 fast slug，所以永遠不要寫。Gemini 4 Neon 的 slug 從 `low` 到 `xhigh`，沒有 `max` 或 `fast` slug，所以它的席位跑在最高的 `gemini-4-neon-xhigh`。小組角色中的 Gemini 4 Neon 項目有自己的目標等級，也就是 `xhigh` 依預算調整後的結果，所以 `large` 保持 `gemini-4-neon-xhigh`，`medium` 寫成 `gemini-4-neon-high`，`small` 寫成 `gemini-4-neon-medium`。

**(c) 顯示角色並確認。** 顯示每個角色及其模型，把任何不在偵測集合中的真實 slug 標示為需要選擇。也列出第 2 步拿掉的每一行。詢問要原樣接受，還是修改特定角色，提供偵測到、等級在 `xhigh` 或以下的模型，加上 `inherit-parent` 和 `auto` 作為選項（兩者都代表：這個角色使用主聊天的模型，Auto 使用者就是這樣保持在 Auto 上）。偏好用 AskQuestion，而不是自由文字。對於小組角色（arena runners、interrogate reviewers），值是一個清單，每一項跑一個子代理（包括別名項目），所以清單長度決定數量。`arena cross-judge pool` 也是清單，但 Arena 只跑一個評審。它只會依清單順序嘗試與父代理不同廠商的值，所以依偏好排序。Fable 和其他 Claude 模型屬於同一個廠商。`inherit-parent` 或 `auto` 值永遠不會當評審。`swarm workers` 是每個 worker 的預設模型，除非某次競賽或比較為每一組指定了其他模型。

### 4. 驗證

寫入的每個真實 slug 都必須在偵測集合中，且等級在 `xhigh` 或以下。`inherit-parent` 和 `auto` 永遠通過。如果選擇的某個真實 slug 不可用，停下並重新詢問。

### 5. 寫入規則

寫入 `~/.cursor/rules/pstack-models.mdc`，設定 `alwaysApply: true`，加上 `# defaults: 3` 這一行、一行 `# budget` 寫明選擇的標籤和該標籤所寫的推理等級，以及每個角色一行，使用和 poteto-mode 相同的標籤。覆寫整個檔案，讓重新執行保持冪等。形狀如下（設定檔內容保留英文原樣）：

```
---
description: pstack per-role model choices (overrides skill defaults)
alwaysApply: true
---
# pstack model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat model (omit Task `model` and spawn `generalPurpose`). Alias entries in a panel list still count toward its fan-out.
# defaults: 3
# budget: large (xhigh)
feature, refactoring: claude-opus-5-5-xhigh-fast
bug-fix: claude-opus-5-5-xhigh-fast
perf-issue: claude-opus-5-5-xhigh-fast
hillclimb: claude-opus-5-5-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh-fast
arena runners: claude-fable-5-2-high, claude-opus-5-5-high-fast, gemini-4-neon-xhigh
arena cross-judge pool: claude-opus-5-5-high-fast, gemini-4-neon-xhigh
swarm workers: claude-opus-5-5-high-fast
interrogate reviewers: claude-fable-5-2-high, claude-opus-5-5-high-fast, gemini-4-neon-xhigh
```

### 6. 確認

告訴使用者規則已經寫入，而且會套用到新的工作階段。重新執行這個技能會更新它。

### 7. 提議驗證技能（選擇性）

檢查專案是否有能操作真實 app 來取得證據的方法（一個 `verify-*` 技能，或既有的測試框架）。如果沒有，提議一次：「要不要一個專案專用的驗證技能，讓 agent 能像使用者一樣操作 app 並證明改動有效？我可以用 /create-verification-skill 產生一個。」答應的話，呼叫 `/create-verification-skill`（不論 pstack 安裝在哪裡都能解析：工作區、使用者或 plugin）。拒絕的話，不再推銷，繼續往下。

### 8. 提議形式驗證技能（選擇性）

檢查專案是否已經有形式驗證技能（一個對程式碼執行模型檢查器、證明或其他驗證器的專案技能）。如果沒有，提議一次：「要不要一個形式驗證技能，讓 agent 能證明你程式碼的某個關鍵性質在範圍內的每種情況下都成立，而不只是測試碰得到的情況？我可以用 /create-formal-verification-skill 產生一個。」答應的話，呼叫 `/create-formal-verification-skill`（不論 pstack 安裝在哪裡都能解析：工作區、使用者或 plugin）。拒絕的話，不再推銷，繼續往下。
