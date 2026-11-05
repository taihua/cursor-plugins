# pstack in Claude Code（在 Claude Code 中使用 pstack）

> 本文為 [`pstack/docs/harness/claude-code.md`](../../../../pstack/docs/harness/claude-code.md) 的繁體中文翻譯，僅供閱讀理解。
>
> 譯註：這份文件是給 agent 看的對照表，告訴它在 Claude Code 中執行 pstack 技能時，要把 Cursor 的名稱換成什麼。

pstack 的技能使用 Cursor 的名稱。在 Claude Code 中，每個工作階段讀這個檔案一次，然後用下面的表格對照技能中的每個 Cursor 名稱。`<pstack>` 代表放著 `skills/` 和 `docs/` 的資料夾。如果某個 Cursor 欄位沒有對應的列，就拿掉它並說明。永遠不要傳入工具 schema 會拒絕的欄位或值。

## 工具

| Cursor | Claude Code |
| --- | --- |
| `Task` | `Agent` |
| `AskQuestion` | `AskUserQuestion`。在 `-p` 模式下它不存在，所以用一般文字提問。 |
| 開一份待辦清單 | 如果工作階段提供 `TodoWrite` 就用它。否則把清單放在你的回覆中，並在每個階段更新。 |
| 執行另一個 pstack 技能（`/name` 或「**name** 技能」） | `Read` `<pstack>/skills/<name>/SKILL.md` 並遵循它。`Skill` 工具會拒絕大部分 pstack 技能。當你告訴使用者要輸入它時，寫 `/pstack:<name>`。 |
| `Grep`、`Glob` | 當工作階段沒有 `Grep` 或 `Glob` 時，用 `Bash` 搭配 `rg`。 |

## 子代理欄位

| Cursor | Claude Code |
| --- | --- |
| `subagent_type: generalPurpose` | `subagent_type: "general-purpose"` |
| `poteto-agent`、`comment-sicko` | `pstack:poteto-agent`、`pstack:comment-sicko` |
| `readonly: true` | `subagent_type: "Explore"`。它保留 `Bash`，所以任務說明中也要寫「不要修改檔案」，並在之後檢查 `git status`。 |
| `readonly: false` | `general-purpose`。它保留工作階段的 MCP 伺服器。 |
| `environment: "cloud"` | `isolation: "worktree"`。寫明 worker 要 checkout 的分支或 commit。 |
| `environment: "local"` | 省略。 |
| `cloud_base_branch: <b>` | 告訴 worker 先 checkout `<b>`。 |
| `run_in_background: true` | 省略。子代理預設就在背景執行，完成時會通知你。 |
| `resume` | 派出一個新的 agent，並把之前的結果貼到它的任務說明中。 |
| `file_attachments` | 在任務說明中列出路徑。 |

## 模型

| Cursor | Claude Code |
| --- | --- |
| `claude-<family>-<version>-<effort>[-fast]`，例如 `claude-opus-5-5-xhigh` | `model: "opus"` 和 `effort: "xhigh"`。`model` 只接受 `opus`、`sonnet`、`haiku`、`fable`。拿掉 `-fast`。 |
| `grok-*`、`gpt-*` 或其他非 Claude 的 slug | 省略 `model`，讓 agent 使用工作階段的模型，並說明這一點。 |
| `auto` 或 `inherit-parent` | 省略 `model`。 |
| `pstack-models.mdc` 規則，`~/.cursor/rules/pstack-models.mdc` | `~/.claude/rules/pstack-models.md`。Claude Code 會把它載入每個新的工作階段，所以它的角色設定行已經在上下文中。如果不在，就讀這個檔案。如果檔案或該角色的設定行不存在，就使用技能的預設 slug。 |
| 角色值 `<model> <effort>`，例如 `opus high` | `model: "opus"` 和 `effort: "high"`。 |

## setup-pstack

Claude Code 會把 `~/.claude/rules/` 中的每個 `.md` 檔案載入每個新的工作階段，所以 `setup-pstack` 會把它的規則寫在那裡。遵循它的步驟，並做以下改變：

- 偵測。偵測到的模型是 `Agent` 工具 schema 列出的 `model` 值，每個搭配它的 `effort` 值中的一個推理等級。把真實的模型寫成 `<model> <effort>`，例如 `opus xhigh`。推理等級是最後一個 token，所以預算步驟照原樣就能運作。
- 預設值。用上面的列對照每個預設 slug：`claude-opus-5-5-xhigh` 是 `opus xhigh`，`grok-4.7-xhigh-fast` 是 `inherit-parent`。
- 寫入。寫入 `~/.claude/rules/pstack-models.md`，不加 frontmatter，然後是註解行、`# budget` 行，以及第 5 步中每個角色一行。覆寫整個檔案。永遠不要把角色設定行放在 `CLAUDE.md` 或 `AGENTS.md` 中。

## 路徑

| Cursor | Claude Code |
| --- | --- |
| `.cursor/skills/`、`~/.cursor/skills/` | `.claude/skills/`、`~/.claude/skills/` |
| `~/.cursor/plugins/`、`.cursor-plugin/plugin.json` | `~/.claude/plugins/`、`.claude-plugin/plugin.json` |
| `.cursor/rules/*.mdc`、永遠套用的規則 | `CLAUDE.md`，或沒有 `CLAUDE.md` 時用 `AGENTS.md`。Claude Code 永遠不讀 `.mdc` 檔案。模型規則是例外，見「模型」。 |
| `https://github.com/cursor/plugins/blob/main/pstack/<path>` | 當 `<pstack>/<path>` 檔案存在時就用它。plugin 附帶技能、`docs/guide/` 和 `README.md`。讀本機的副本，永遠不要去抓網路版。使用者需要連結時，才給他們網址。 |
| `~/.cursor/projects/<slug>/agent-transcripts/` 中的對話紀錄 | `~/.claude/projects/<slug>/<session>.jsonl`。slug 是工作區路徑把每個 `/` 和 `.` 換成 `-`，所以 `/Users/you/proj` 是 `-Users-you-proj`。直接在那個資料夾中最新的 `.jsonl` 就是目前的工作階段。它的 `<session>/subagents/` 資料夾放著子代理的對話紀錄。只讀這個工作區的資料夾。 |

## Cursor 專屬功能

Claude Code 沒有 Cursor Automations、Bugbot、Cursor 雲端 agent 或內建 PR 工具。當某個步驟需要其中之一時，在你的回覆中寫一行 `Skipped in Claude Code: <step>. <reason>.`，然後繼續下一步。不要停下、詢問或重試。當後面的步驟需要被跳過的步驟產生的東西（例如網址或金鑰）時，留一個佔位符，並在那一行中寫出它。

| Cursor | Claude Code |
| --- | --- |
| Cursor Automations：例行程序（routine）、`update_state` 例行程序呼叫、`api2.cursor.sh/automations` webhook、例行程序喚醒，以及 `SendToUser` secret 請求 | 用那一行說明並跳過。 |
| Bugbot | GitHub PR 上的 Bugbot 留言就是一般的審查討論串，所以用步驟給的代碼平台指令分類它們。當 PR 沒有 Bugbot 檢查或留言時，跳過啟動、等待或設定 Bugbot 的步驟。 |
| Cursor 雲端 agent | `environment: "cloud"` 對應到 worktree，如「子代理欄位」所述。跳過需要雲端 agent 本身的步驟，例如它的儀表板狀態或它自己的機器。 |
| 內建 PR 工具 | 使用步驟給的代碼平台指令，例如 `gh pr create`。這不算跳過，所以不用寫那一行。 |
