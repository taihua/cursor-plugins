### Opening a PR（開 PR）

在每個其他劇本的結尾被呼叫。

**Worktree。** 在從 main 分出的 git worktree 中工作。子代理會繼承它。同一個分支上的多個 `Task` 呼叫各自有自己的 worktree，或在它們之間執行 `git fetch && git reset --hard origin/<branch>`。分支髒了、有無關的工作：把 patch 拿出來、開新的 worktree、再套用。worktree 亂成一團：從 main 重設，以最小方式重做。

**Commit。** 大方地 commit。開 PR 前 rebase 成小而有序的 commit。每個 commit 都是未來的 PR：可以落地、依序講述故事。修正屬於剛做的 commit 時就 amend；可以分開時就做新的 commit。commit 內文不要重述標題。

**PR。** commit 前對 diff 跑 `cursor-team-kit` 的 `/deslop`，審查前跑 `/no-comments`。每個 PR 標題、描述和 commit 內文都用 `/technical-writing` 撰寫（除了 Diátaxis 以外的每一層，並套用 STE 詞彙規則：一個動作用一個字、保留冠詞、能用簡單動詞就不用 `-ing`），然後套用 `/unslop`。

**標題。** Conventional Commits 格式 `type(scope): subject`，結尾不加句號。type 例如 `feat`、`fix`、`docs`、`refactor`、`test`、`chore` 或 `perf`。scope 是範圍，例如 `pstack` 或 `poteto-mode`。subject 簡短、用祈使句，當某個真實符號承載這個改動時就寫出它，例如 `fix(pstack): retarget opening-a-pr babysit trigger`。

**描述。** PR 內文是一份一分鐘的簡報，不是實驗筆記，給手上有 diff 的審查者看。它說明改動為什麼存在、它刻意不包含什麼、它可能弄壞什麼，以及你如何證明它能用。寫簡短、簡單的句子，少用識別字，不要大段文字。內文會變成 squash commit 的內文，所以讓那個 commit 保持在約 40 行以內。使用 `##` 標題而不是粗體開頭，依以下順序，沒有內容的章節就拿掉：

- `## Why`：問題和做法，1～3 句短句。不要 SHA、rebase 系譜或「基於 main」這類開場白。
- `## What changed`：1～3 個短項目。只有當真實的符號或路徑承載這個改動時才寫出它。重新命名或重新指定時，兩邊都要寫。
- `## Scope`：一定要有。1～3 個短項目，說明它涵蓋什麼、以及刻意不包含什麼（後續工作、已知缺口）。不要符號、路徑或逐檔說明。
- `## Tradeoffs`：只寫審查者原本會問到的、被拒絕的替代方案。沒有真正的選擇時就跳過。
- `## Blast Radius`：1～2 句，說明它影響誰或什麼，以及為什麼那是安全或有風險的。如果 main 是紅的，說明讓它維持紅色的代價。
- `## Verification`：1～3 個項目，每個都是一條真實的執行路徑和它的結果。效能：一個主要數字加單位，`之前 → 之後`，以及一個連到 arena 或 swarm 資料夾看其餘內容的連結。不要樣本數方法論、swarm 敘述或指標表格。

章節之後，當影片或截圖能證明某個主張時就附上。完整的 SHA、swarm 或 arena 各線的敘述、槓桿修正的長文、逐檔檢查清單和「CLEAN」判定放在連結的成品中，不要放在內文。

**代碼平台（Forge）。** 在第一次 PR 操作前決定代碼平台，並在建立、編輯、檢視、監看和合併時都沿用這個選擇。預設是 GitHub CLI（`gh`）。如果 `command -v origin` 成功、而且 Origin 能解析這個 repository，優先使用 `origin pr ...`。如果沒有 Origin 或它無法解析這個 repository，就留在 `gh` 並記錄這個備案。不要要求 Graphite（`gt`）。

**內建 PR 工具。** 當執行環境提供內建 PR 工具時，建立、編輯、重新指定基底和標記為 ready 都透過它，永遠不透過代碼平台的 CLI。用 CLI 建立的 PR 會缺少工具所追蹤的資訊。工具沒涵蓋的事，以及執行環境沒有這種工具時的所有 PR 操作，使用已決定的代碼平台。

**大小與堆疊。** 寧可五個窄的 PR，也不要一個大 PR。堆疊是一條基底分支鏈。根 PR 以主線為目標。每個子分支 rebase 到父分支的確切頂端，它的 PR 以父分支為目標。當父 PR 合併時，依 `playbooks/shipping.md` 第 4 步把子 PR 移到主線上。沒有內建 PR 工具時，依已決定的代碼平台，用 `origin pr create --status open --base <parent-branch>` 或 `gh pr create --base <parent-branch>` 建立子 PR，用 `origin pr edit <pr> --base <parent-branch>` 或 `gh pr edit <pr> --base <parent-branch>` 重新指定基底。只有獨立的工作才從主線開分支。在堆疊上做大量工作前，先 rebase 到主線。

**就緒狀態。** 每個 PR 都以 ready 狀態開啟，永遠不要開成 draft。內建 PR 工具可能預設為 draft，所以每次透過它建立時都設定 `draft: false`。用 Origin 時傳入 `--status open`。用 `gh` 時省略 `--draft`。如果 PR 仍然以 draft 開啟，透過 PR 工具把它標為 ready，或依已決定的代碼平台執行 `origin pr ready <number>` 或 `gh pr ready <number>`。在提到 PR 狀態之前，先執行 `origin pr view <number>` 或 `gh pr view <number>`。

**Babysit。** 開 PR 不會啟動 babysit。貼出網址，繼續建構。先完成這個階段或整個堆疊。只有當使用者在整個堆疊都存在後要求時，才另外跑一次 babysit。為每個新 PR 都跑 babysit 會拖慢建構，並把檢查浪費在之後波次會重啟的 commit 上。當回饋偏離意圖時要反駁。

開 PR 的子代理會執行 `/deslop` 和 `/no-comments`，並貼出網址。它不做 babysit 就回到父代理，除非它是 Autopilot-full 或 Autopilot-stack 的負責人。那個負責人的任務說明指派了 babysit 迴圈，這正是 `playbooks/babysit.md` 在等的請求。負責人在回報程式就緒後開始迴圈、回報可合併，並且不受本文與 `playbooks/babysit.md` 中「整個堆疊建好前不 babysit」規則的限制。
