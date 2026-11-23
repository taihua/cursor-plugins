---
name: arena
description: "針對同一個任務平行派出 N 個候選，挑一個當基底，把落選者最強的部分嫁接進去。用於 /arena、「arena this」、「把它丟進競技場」，或當對一個不簡單的成品只嘗試一次會鎖定錯誤形狀時。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/arena/SKILL.md`](../../../../pstack/skills/arena/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Arena（競技場）

在啟動任何東西之前，開一份待辦清單，每個階段一項（Frame、Fan out、Cross-judge、Pick、Graft、Verify）。

## Phase A：界定（Frame）

每個候選都拿到同樣的提示詞，所以提示詞就是契約。

1. 說明每個候選要產出的成品。
2. 推導評分標準：3～6 條具體、可評分的準則，說明在**這個**任務上什麼算成功。它是 Phase D 中挑選者的工具。候選只看得到任務。
3. 從 `~/.cursor/rules/pstack-models.mdc` 中的 `arena runners` 設定行選擇執行者，預設是 `claude-fable-5-2-high`、`claude-opus-5-5-high-fast` 和 `gemini-4-neon-xhigh`。`auto` 或 `inherit-parent` 項目代表主模型，所以省略 `model` 並派出 `generalPurpose`。如果 Task 工具拒絕某個 slug，就用同一家族最接近的有效 slug，或拿掉這個席位，至少保留兩個執行者，並說明。家族依前綴區分，最長的符合者優先：`claude-fable-*`、`claude-*` 和 `gemini-*`，比對前先去掉開頭的 `cursor-`。其他 slug 的家族是它第一個連字號之前的文字。涵蓋多個設計方向時派出更多執行者；當工作的瓶頸在「產出量」而不是「判斷力」時，重複使用同一個模型。依 **poteto-mode** 技能的「子代理」章節，為每個子代理選擇推理等級。
4. 依 **separate-before-serializing-shared-state** 原則技能，給每個候選自己的輸出位置（可以的話用 git worktree，否則用 `/tmp/arena-<slug>/candidate-<n>/`）。

## Phase B：分派（Fan out）

在同一則訊息中以 `run_in_background: true` 派出全部 N 個子代理，每個都給：任務、共享基礎資料的路徑、它自己的輸出路徑，以及指示——產出成品，並附上一份簡短的理由說明，列出它考慮過的替代方案和它拒絕了什麼。

如果某個候選沒有產出任何東西，就以 N-1 繼續，並記錄這個掉隊者。

## Phase C：交叉評審（Cross-judge）

在所有 Phase B 的候選完成之後，從 `~/.cursor/rules/pstack-models.mdc` 中的 `arena cross-judge pool` 設定行派出一個唯讀的評審，預設是 `claude-opus-5-5-high-fast`、`gemini-4-neon-xhigh`。評審永遠不能和父代理同一個廠商，而且在這項檢查中 Fable 算是 Claude，所以使用第一個來自其他廠商的項目。`auto` 或 `inherit-parent` 項目代表主模型。如果你不知道父代理的模型，就用第一個真實的 slug，並說明廠商檢查沒有執行。如果 Task 工具拒絕某個 slug，就用同一家族最接近的有效 slug，再來是下一個這樣的項目，或者跳過評審，並說明。在你於 Phase D 閱讀的同時，評審依路徑標籤，就每條評分準則為每個候選打分數，並推薦一個基底。

## Phase D：挑選基底（Pick）

挑選之前，從頭到尾讀完每個候選。依評分標準逐條為每個候選評分，而不是憑整體感覺；如果 Phase C 有跑評審，就和評審比較。對基底的意見一致，確認了這個選擇。意見不一致代表你們之中有一方有偏差，或評分標準有歧義。決定前讀過雙方的理由。

挑選未來的維護者最容易擴充、又不會破壞不變條件的那個基底。當兩個感覺不相上下時，依 Laziness Protocol，偏好邊界更乾淨或 API 更小的那個。

## Phase E：嫁接（Graft）

再走一遍每個落選的候選，找出值得移植到基底的東西，通常每個候選一兩樣，而不是大部分。依 **redesign-from-first-principles** 原則技能，手動把每個嫁接融入進去，讓結果在同一個心智模型下保持一致。不要機械式地貼上。

如果候選收斂到同一個形狀，那是強烈的共識。記錄下來，並出貨這個共識的形狀，不需要嫁接。如果它們極度分歧，代表 Phase A 界定得不夠清楚。重新界定並重跑，而不是把分歧平均掉。

## Phase F：驗證（Verify）

依 **prove-it-works** 原則技能，像驗證任何其他輸出一樣驗證綜合後的成品。如果驗證發現了競技場漏掉的問題，要嘛是 Phase A 錯了（重新界定並重跑），要嘛是某個候選抓到了它而你漏掉了嫁接（回到 Phase E）。不要掩蓋它。

## 輸出

一個綜合後的成品，旁邊附上一份簡短的綜合說明，寫明基底及原因、交叉評審的判定（或 Phase C 跳過了評審）、每個嫁接及其來源候選、拒絕了什麼及原因、任何收斂或掉隊者，以及驗證結果。
