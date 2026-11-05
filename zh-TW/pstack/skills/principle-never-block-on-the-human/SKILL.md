---
name: principle-never-block-on-the-human
description: "在可逆的工作上想問「我該做 X 嗎？」時套用。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-never-block-on-the-human/SKILL.md`](../../../../pstack/skills/principle-never-block-on-the-human/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Never Block on the Human（絕不卡在等人）

人類是非同步監督的。agent 必須保持不被卡住。做出合理的決定、繼續進行，讓人類事後修正方向。因為程式碼改動是可逆且可審查的，一個錯誤的決定通常比卡住等待的代價更小。

- 先做，再呈現。做完工作，展示結果。不要問「我該做 X 嗎？」去做 X，再解釋為什麼。
- 讓系統能自我修復。注意到問題時，記錄下來，並在下一輪修好。
- 不可逆的動作（force-push、刪除正式環境資料、發送對外訊息）仍然需要確認。
- 可逆的動作（寫程式、編輯筆記、拆分任務）應該不被阻擋地進行。
- 產品方向來自人類。執行不應該被卡住。
