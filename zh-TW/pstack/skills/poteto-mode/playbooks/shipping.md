### Shipping（出貨）

**落地的內容由你負責。獨立驗證每個 PR，只合併從根部開始的已驗證段落，然後別再碰這串 PR。**

1. **決定使用哪個代碼平台，然後在每個 PR 落地前獨立驗證它。** 預設是 GitHub CLI（`gh`）。如果 `command -v origin` 成功、而且 Origin 能解析這個 repository，所有 PR 操作都用 `origin pr`。否則留在 `gh` 並記錄這個備案。永遠不要要求 Graphite（`gt`）。每個 PR 一個驗證者，每個都是 Cursor 雲端 agent，用對應的 control 技能（例如 `cursor-team-kit` 的 `control-ui` 或 `control-cli`）像使用者一樣執行改動，比較父版本與 head，並在該 PR 上張貼 `PASS`、`PASS+NOTES` 或 `FAIL`。只有沒寫這段程式碼的 agent 給的判定才算數，因為作者檢查的是它「想要」做出的東西。CI 全綠和機器人的核准審查都不算判定，因為兩者都沒有像使用者那樣執行改動。
2. **只合併從底部開始、連續通過驗證的那一段。** 從最低的未合併 PR 往上走，停在第一個沒有 `PASS` 或 `PASS+NOTES` 的 PR。它下面的 PR 就是這一段，最上面那個是上限。疊在未驗證 PR 之上的已驗證 PR 要等，因為沒有下面的程式碼它就無法落地。如果某個 PR 的分支既不包含也不需要那段程式碼，它可以移到主線上自己落地。但它需要一個新的判定，因為舊的判定是在底下有那段程式碼的情況下跑的，而主線沒有。
3. **重新確認判定仍然描述的是目前的程式碼。** 判定涵蓋的是一份 patch，而一次鏈式 rebase 會把它上面的每個 PR 移到新的 SHA，卻不會讓任何檢查失敗。在相信一個較舊的判定前，比較判定時 SHA 和目前 head 的 `git patch-id`。當 patch 只在測試、文件或 lint 設定上有差異時，如果某條檢查線執行的東西在兩個 SHA 上建置結果相同（除了雜訊之外），它的結果就成立。雜訊是指在判定 SHA 的兩次建置之間也會出現的差異，或內嵌的 commit SHA。每種雜訊都要附上它的檔案回報，讓讀者能檢查這個判斷。改動本身仍要接受新的檢查和審查，因為舊的判定從沒看過它。沒有建置輸出的檢查線（例如開發伺服器）無法證明這一點，所以要重跑，並重新驗證任何其他有偏移的東西。
4. **由下而上，一次合併一個 PR。** 永遠合併這一段中最低的未合併 PR，用 `origin pr merge <pr>` 或 `gh pr merge <pr> --squash`。在 Origin 上，單純的指令也會合併你指定的 PR 下面的所有 PR；在 GitHub 上，基底仍是父分支的 PR 會合併進那個分支，而不是主線。回頭讀取 PR 確認結果（`origin pr view <pr>` 或 `gh pr view <pr> --json state,mergedAt,baseRefName`），因為當合併佇列只是把 PR 排入佇列時，合併指令也可能回報成功，而且要求自動合併並不等於合併。已落地的 PR 會顯示為已合併、基底是主線，而不是父分支。只對判定涵蓋其目前 head 的 PR 啟用 `--auto`（Origin 的 merge-when-ready 或 GitHub 的 auto-merge），因為它會把當下準備好的任何 head 合併進去。合併落地後，把基底是已合併分支的 PR 重新指向主線（`origin pr edit <pr> --base <trunk>` 或 `gh pr edit <pr> --base <trunk>`），把它的 patch 移到合併結果上，並用 `--force-with-lease` 推送。判定涵蓋的是 patch，不是它的 commit，所以由第 3 步的 patch-id 規則決定判定是否仍有效。等它的檢查通過且判定仍有效，再合併它。
5. **落地期間不要碰這串 PR。** 第 4 步搬移下一個 PR，是唯一對分支或基底的改動，因為合併會把分支和基底在那一刻包含的任何東西落地，不管有沒有判定。在 GitHub 上，用 `playbooks/babysit.md` 中的佇列監看器（`scripts/watch-pr/watch-pr --queued-stack --stack-prs <由下到上>`）在 `/loop` 下監看，直到它在上限處回報 `COMPLETE`。在 Origin 上，每次 `origin pr checks <pr> --watch` 返回時，就用 `origin pr view <pr> --checks` 重新讀取目前的 PR，直到上限顯示已合併。父 PR 合併後基底移到主線是預期中的事，不是需要修復的損壞。如果合併卡住了，在改任何東西之前先搞清楚原因。
6. **在上限處停下。** 延伸這一段需要新的判定，所以那是重新從第 1 步走一遍。

**回覆：** 已驗證的段落與它的上限、每個 PR 的判定以及是誰產生的、什麼落地了以及你如何確認、下一個缺口需要什麼。
