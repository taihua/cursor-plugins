# Search notes（搜尋筆記）

搜尋讓使用者能依標題或內文找到筆記、檢視一則符合的筆記，並分辨「沒有符合的結果」和「搜尋無法使用」。

## Sub-features（子功能）

- `search-open` 從每個支援的瀏覽器進入點打開搜尋。
- `search-match` 回傳標題和內文的符合結果，而不改變筆記資料。
- `search-open-result` 在筆記編輯器中打開一個結果。
- `search-empty` 對沒有符合結果的查詢顯示完整的空狀態。
- `search-clear` 移除查詢並恢復最近筆記的檢視。
- `search-cli` 從終端機回傳同樣的符合筆記。

## How to get to it (user POV)（怎麼到達，使用者視角）

- 點選瀏覽器工具列中的 `Search` 按鈕。
- 在焦點不在可編輯欄位時，於瀏覽器中按 `/`。
- 在終端機中執行 `notes search <query>`。

## Driving it with control-notes（用 control-notes 操作）

Preconditions（前置條件）：

- Notes 在 `http://127.0.0.1:4173` 上運作正常。
- 可拋棄的資料資料夾包含內文為 `Draft budget` 的 `Quarterly plan`。
- `control-notes doctor` 回報預期的網址和資料資料夾。

- **工具列進入點。** 點選 `Search` 按鈕。執行 `control-notes browser click --role button --name "Search"`。一個名為 `Search notes` 的對話框出現，焦點在它的搜尋框中。
- **鍵盤進入點。** 關閉對話框，讓頁面取得焦點，然後按 `/`。執行 `control-notes browser press --key "/"`。同樣的對話框出現，而且頁面沒有插入斜線。
- **標題符合。** 輸入 `quarterly`。執行 `control-notes browser fill --role searchbox --name "Search notes" --value "quarterly"`。`Search results` 清單包含 `Quarterly plan`，不包含 `Grocery list`。
- **內文符合。** 把查詢換成 `budget`。執行 `control-notes browser fill --role searchbox --name "Search notes" --value "budget"`。結果 `Quarterly plan` 仍然可見，並附有內文符合的摘錄。
- **打開結果。** 點選 `Quarterly plan`。執行 `control-notes browser click --role link --name "Quarterly plan"`。對話框關閉，編輯器標題顯示 `Quarterly plan`。
- **空狀態。** 重新打開搜尋並輸入 `volcano`。執行 `control-notes browser fill --role searchbox --name "Search notes" --value "volcano"`。搜尋完成後，一個名為 `No matching notes` 的狀態出現。
- **清除查詢。** 點選 `Clear search`。執行 `control-notes browser click --role button --name "Clear search"`。搜尋框是空的，`Recent notes` 區域取代了結果清單。
- **CLI 符合。** 從終端機搜尋。執行 `control-notes cli -- notes search "quarterly" --format json`。結束碼為 `0`，stdout 包含一個標題為 `Quarterly plan` 的物件。
- **CLI 未符合。** 搜尋一個不存在的值。執行 `control-notes cli -- notes search "volcano" --format json`。結束碼為 `0`，stdout 為 `[]`。
- **證明。** 擷取有結果的狀態。執行 `control-notes browser snapshot --aria --path artifacts/search/results.aria.txt` 和 `control-notes browser screenshot --path artifacts/search/results.png`。兩個成品都能辨識出 Notes、查詢內容和 `Quarterly plan`。

## Gotchas（陷阱）

- 當編輯器或搜尋框有焦點時按 `/`，會插入文字而不是打開搜尋。
- 結果會在短暫的防抖（debounce）後更新。等待結果清單或空狀態出現，而不是固定時間的 sleep。
- 除非使用者開啟 `Include archived`，否則已封存的筆記會被排除。
- CLI 預設輸出人類可讀的格式。用 `--format json` 做穩定的斷言。
- 打開一個結果會改變瀏覽器狀態。證明另一個查詢之前，先重新打開搜尋。
