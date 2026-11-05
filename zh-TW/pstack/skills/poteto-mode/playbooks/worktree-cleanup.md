### Worktree and simulator cleanup（worktree 與模擬器清理）

1. 快照並稽核。記錄 `df -h /`，然後執行 `scripts/worktree-audit.sh [-b <pr-base-ref>] [repo-path]`（principle-build-the-lever）。沒有 `-b` 時，它會對照 `origin/HEAD` 檢查 `MERGED`，所以當 PR 的目標是其他分支時，要傳入 `-b origin/<branch>`。它從 `git worktree list` 讀取路徑，絕不手打，因為手打的 `myrepo-worktrees/x` 會漏掉位於 `.cursor/worktrees/myrepo/x` 的那個（principle-encode-lessons-in-structure）。它依大小、年齡、合併狀態、未提交的工作、PR 狀態，以及最近碰過它的聊天，為每個 worktree 分類，然後建議一個分組。掃描對話紀錄很慢，所以放在背景執行。
2. 分組只是建議，不是許可。釘選和進行中的聊天才是真正的依據（principle-prove-it-works）。從使用者或側邊欄取得那份清單，並逐一交叉比對每個候選。這個工具曾經把使用者釘選的 worktree 標成 `safe`，所以以釘選清單為準。
3. 刪除前驗證使用狀況。對每一列 `verify-recent-chat`，或任何你有疑慮的項目，分派子代理去讀對話紀錄，回報該聊天是否被釘選或仍在進行，以及它碰了哪些 worktree（principle-guard-the-context-window，對話紀錄屬於大量內容）。一個被釘選的聊天會透過背景子代理，在相鄰的 worktree 中產生 arena 和重現用的樹，即使它們的名稱從沒出現在側邊欄，也仍在使用中。依「子代理」章節，為每個子代理選擇工作需要的推理等級與快速或標準速度。
4. 遇到不可逆的損失要暫停。`wip:N` 代表 N 個被追蹤但未提交的修改。先顯示 diff 並取得決定，因為刪掉一個乾淨的 worktree 可以從它的分支復原，但未提交的工作就沒了。`scratch:N` 是未追蹤的拋棄式檔案，可以安全刪除，但要列出檔名。依「自主」章節，乾淨、已合併且未使用的就直接進行。`wip` 和使用中的要暫停。
5. 刪除確認過的清單。每個路徑執行 `git worktree remove --force <path>`。如果資料夾因為被忽略的建置產物而殘留，就 `rm -rf` 它，再執行 `git worktree prune`。分支 ref 會保留，所以不會遺失任何 commit。用 `df -h /` 確認並重新列出。
6. 模擬器和其他可回收的東西。模擬器通常是下一個最大的收穫。`xcrun simctl --set testing delete all`（XCTestDevices 複本）、`xcrun simctl delete unavailable`，以及 `xcrun simctl runtime list` 後用 `runtime delete <id>` 刪除舊的 runtime。需要時還有：Xcode 的 `DerivedData` 和 `iOS DeviceSupport`、`~/Library/Application Support/Cursor`（`state.vscdb.backup`，以及 `snapshots/roots/<root>`，其中以你當作工作區開啟的資料夾命名的 `<root>` 會膨脹）、套件快取（pnpm、uv、brew、yarn）。只清除使用者沒說要保留的快取。

這是唯一一個會刪除使用者狀態、又沒有程式碼審查能抓到失誤的劇本，所以上面這些關卡就是審查。

**回覆：** 前後的 `df -h /` 與回收的空間、被刪除的 worktree，以及每個被保留的項目的一行理由（被哪個聊天使用中，或有未提交的工作）。
