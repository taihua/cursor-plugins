# Create a note（建立筆記）

建立筆記讓使用者能從瀏覽器或 CLI 儲存一則有標題的筆記、取消一份未完成的草稿，並從第二個面向使用者的檢視確認已儲存的筆記。

## Sub-features（子功能）

- `create-open` 從每個瀏覽器進入點打開一個空白編輯器。
- `create-save` 持久化標題和內文。
- `create-cancel` 丟棄一份未完成的瀏覽器草稿。
- `create-cli` 從終端機建立同樣形狀的筆記。

## How to get to it (user POV)（怎麼到達，使用者視角）

- 點選瀏覽器工具列中的 `New note` 按鈕。
- 在焦點不在可編輯欄位時，於瀏覽器中按 `n`。
- 在終端機中執行 `notes create --title <title> --body <body>`。

## Driving it with control-notes（用 control-notes 操作）

Preconditions（前置條件）：

- Notes 在 `http://127.0.0.1:4173` 上運作正常。
- 沒有標題為 `Release checklist` 的筆記。
- `control-notes doctor` 回報預期的網址和可拋棄的資料資料夾。

- **打開編輯器。** 點選 `New note`。執行 `control-notes browser click --role button --name "New note"`。一個名為 `Note editor` 的表單出現，焦點在 `Title` 文字框中。
- **輸入內容。** 輸入標題和內文。執行 `control-notes browser fill --role textbox --name "Title" --value "Release checklist"` 和 `control-notes browser fill --role textbox --name "Body" --value "Tag and publish"`。`Save note` 按鈕變為可用。
- **儲存筆記。** 點選 `Save note`。執行 `control-notes browser click --role button --name "Save note"`。一個名為 `Note saved` 的狀態出現，標題顯示 `Release checklist`。
- **確認持久化。** 回到筆記清單並重新打開這則筆記。執行 `control-notes browser click --role link --name "All notes"` 和 `control-notes browser click --role link --name "Release checklist"`。編輯器顯示兩個已儲存的值。
- **取消草稿。** 打開一則新筆記，輸入 `Discard me`，然後點選 `Cancel`。執行 `control-notes browser click --role button --name "New note"`、`control-notes browser fill --role textbox --name "Title" --value "Discard me"` 和 `control-notes browser click --role button --name "Cancel"`。回到筆記清單，而且沒有 `Discard me` 連結。
- **CLI 進入點。** 建立第二則筆記。執行 `control-notes cli -- notes create --title "CLI note" --body "Created from terminal" --format json`。結束碼為 `0`，stdout 包含新筆記的 ID 和標題。
- **證明。** 從 `All notes` 重新打開兩則已儲存的筆記。執行 `control-notes browser snapshot --aria --path artifacts/create-note/list.aria.txt` 和 `control-notes browser screenshot --path artifacts/create-note/list.png`。成品顯示 `Release checklist` 和 `CLI note`。

## Gotchas（陷阱）

- 當文字框有焦點時按 `n`，會輸入這個字元，而不是打開新的編輯器。
- 儲存時標題會被去掉前後空白。斷言渲染出來的標題，而不是草稿的輸入值。
- 光有儲存狀態不足以作為證明。要從清單重新打開筆記。
- 在測試資料清理時移除 `Release checklist` 和 `CLI note`，但保留它們的證明成品。
