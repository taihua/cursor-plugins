---
name: reflect
description: 針對目前的對話紀錄派出三個平行的審查子代理，找出學到的東西，並把每一項導向對某個既有技能的具體修改。當使用者說 reflect 時使用。
disable-model-invocation: true
---

> 本文為 [`pstack/skills/reflect/SKILL.md`](../../../../pstack/skills/reflect/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Reflect（反思）

從目前的對話中挖出持久有用的心得，再把它們導向技能的修改。

當使用者說「reflect」或「/reflect」時呼叫。當對話很瑣碎、離題，或已經被父代理正確遵循的既有技能涵蓋時就跳過。一次性的事件不算心得。

## 1. 找到目前的對話紀錄

在分派之前，先在系統提示詞指定的 `agent-transcripts/` 目錄中找到這次對話的紀錄。不要對 `~/.cursor/projects/*/` 做 glob，那會跨越工作區邊界，讀到無關專案的私人聊天。

```bash
ls -t <agent-transcripts>/*.jsonl <agent-transcripts>/*/*.jsonl <agent-transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10
```

這涵蓋了舊的扁平結構（`<id>.jsonl`）、目前的巢狀結構（`<id>/<id>.jsonl`）和子代理結構（`<parent>/subagents/<child>.jsonl`）。對每個候選檔案，讀第一行 JSONL。選出 `message.content[0].text` 包含本次對話開頭使用者提示詞的那個檔案。如果都不符合，就改傳一份精簡的工作階段摘要。

## 2. 平行派出三個審查者

一則訊息、三個 `Task` 呼叫，`subagent_type: generalPurpose`，agent 模式（`readonly: false`）。審查者需要 MCP 權限來查詢對話紀錄中引用的工單、聊天串和監控追蹤，而 readonly 會拿掉 MCP。

每個審查者和綜合者都對應 `pstack-models.mdc` 規則中的一個角色設定行和一個預設值。把 `model` 設為該行的值；如果規則或該行不存在，就設為預設值。當值是 `auto` 或 `inherit-parent` 時，不設定 `model`。如果 Task 工具拒絕某個 slug，就用預設值並說明。如果它連預設值都拒絕，就從它的錯誤訊息中選同一家族最接近的有效 slug。依 **poteto-mode** 技能的「子代理」章節，為每個子代理選擇工作需要的推理等級與快速或標準速度。

| 視角 | 角色設定行 | 預設 `model` | 提示詞模板 |
|---|---|---|---|
| Judgment（判斷） | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/judgment-reviewer.md` |
| Tooling（工具） | `reflect tooling` | `grok-4.7-xhigh-fast` | `references/tooling-reviewer.md` |
| Divergent（發散） | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/divergent-reviewer.md` |

逐字傳入每個模板，在標記處替換成對話紀錄路徑或摘要。審查者在 `Task` 回應內文中回傳發現。

## 3. 綜合

一個 `Task` 呼叫，`subagent_type: generalPurpose`，`model` 取自 `reflect judgment, divergent, synthesizer` 設定行（預設 `claude-opus-5-5-xhigh`），agent 模式（`readonly: false`）。它會透過 MCP 抽查引用，而 readonly 會拿掉 MCP。逐字傳入 `references/synthesizer.md`，並在標記處內嵌每個審查者的完整輸出。它回傳一份 Accepted / Rejected / Backlog（接受 / 拒絕 / 待辦）清單。

## 4. 結構性強制檢查

任何由 lint 規則、腳本、metadata 旗標或執行期檢查來強制會更可靠的 Accepted 項目，移到 Backlog。見 **encode-lessons-in-structure** 原則技能。

## 5. 套用

呈現綜合者完整的 Accepted / Rejected / Backlog 輸出，並在套用任何 Accepted 修改之前等待明確的核准。使用者會挑選子集，也可能改變導向。技能的修改會影響組織中未來的每個 agent。不要自動套用。

把每個 Backlog 項目直接提交到團隊的 devex 或待辦追蹤系統，不用等待。只有 Accepted 清單需要等核准。

永遠不要修改 `plugins/cache/` 底下的技能。核准前，顯示它的目的地：`.cursor/skills/<skill>/` 或 `~/.cursor/skills/<skill>/`。核准後，把技能資料夾複製到那裡，修改副本。永遠不要開 PR 或推送。

確切遵循每一列被核准項目的導向（Routing）：

- 對既有技能的瑣碎修改（一行項目、精簡一句話、修正一個過時的事實）：父代理直接做。
- 對既有技能的實質修改（一個新章節、一張新的模式表格、超過約 10 行）：交給 Cursor 內建的 `create-skill` 技能，並執行它的草擬 / 測試 / 迭代迴圈。
- `tune description: <skill path>`（技能存在，但在應該觸發時沒有觸發）：交給 `create-skill`，並執行它的描述最佳化迴圈。
- `new skill via create-skill: <kebab-name>`：把建立交給 `create-skill`。不要臨時自己發明它的形狀。

如果你的環境附有 SKILL.md 驗證器，在宣告完成前對每個碰過的技能跑它。

## 6. 為使用者總結

簡短清單，不要開場白：

- 已套用的修改：`<skill path>`。改了什麼，每項一行。
- 新建立的技能：`<skill path>`。每項一行（很少見）。
- 已提交到 devex 追蹤系統的待辦：`<issue title>`（`<tags>`）。每項一行。
- 已放棄：每個被拒絕的發現一行，加上綜合者給的理由。
