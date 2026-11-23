### Opening a PR（開 PR）

在每個其他劇本的結尾被呼叫。

在從主線分出的 git worktree 中工作，並讓無關的工作留在它外面。rebase 成小而可以落地的 commit。commit 前對 diff 跑 `cursor-team-kit` 的 `/deslop`。

標題：`type(scope): subject`，當某個真實符號承載這個改動時就寫出它。內文：一份一分鐘的簡報，少於 40 行，依序使用以下 `##` 標題，沒有內容的就拿掉：`## Why`、`## What changed`、`## Scope`、`## Tradeoffs`（只寫審查者原本會問到的、被拒絕的替代方案）、`## Blast Radius`、`## Verification`。

後續工作依基底分支堆疊。以 ready 狀態開 PR，透過執行環境的 PR 工具並設定 `draft: false`。沒有這種工具時，用 `gh pr create` 且不加 `--draft`；當 Origin 的 CLI 能解析這個 repository 時，用 `origin pr create --status open`。開 PR 不會啟動 babysit。
