### Autopilot-stack（自動駕駛不合併版）

執行 Autopilot-full 劇本，但不要合併。

1. **以「停在已驗證」取代第 5 步。** 當每個 PR 在目前的 head 都已驗證且全綠時就停下，然後把 PR 交給操作者。交接之後，沒有操作者的同意，任何人都不能再推送。每個迴圈 tick 的提示詞都要點名這個檔案，這樣每個 tick 都會看到「不合併」的規則。
2. **只有當一個 PR 建立在另一個 PR 之上時，才把它堆疊上去。** 這是第 3 步唯一的例外。依 `playbooks/opening-a-pr.md` 中的 **Size and stacks**，讓這個 PR 以另一個 PR 的分支為基底，而不是主線（trunk）。取代第 2 步的「rebase 到主線」，每個 PR 改為 rebase 到它的父 PR 分支，而堆疊的根部 rebase 到主線。較低的 PR 出現新 head 時，會重新堆疊它上面的 PR；重新堆疊後 `git patch-id` 沒有改變的 PR 保留原本的判定。

**回覆：** 列出每個 PR 及其判定，取代「合併了什麼」。
