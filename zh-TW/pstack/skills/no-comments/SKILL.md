---
name: no-comments
description: "派出 Comment Sicko、修正被接受的發現，並為宣稱的限制提議可強制的編碼方式。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/no-comments/SKILL.md`](../../../../pstack/skills/no-comments/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# No comments（不要註解）

派出 Comment Sicko。根據被接受的發現採取行動。

尊重 Comment Sicko 的全新觀點。

## 範圍

使用呼叫者給的檔案或 diff。否則，使用目前對基底分支（預設 `main`）的 diff，包括工作目錄。

## 步驟

1. 用 `subagent_type: "comment-sicko"` 派出 `Task`。傳入範圍。依 **poteto-mode** 技能的「子代理」章節，為每個子代理選擇工作需要的推理等級與快速或標準速度。不要重述它的規則。
2. 檢查它的報告和 diff。拒絕以下情況：修改應用程式碼、超出範圍、刪除了受例外保護的註解、錯誤陳述的 `MUST KILL` 理由，以及把刻意保留的程式碼當成有罪的標記。對「我們自己程式碼中的意外之處」提出的重塑標記仍然是可處理的，不要把那些註解恢復。保留的註解只有在證明它涉及我們無法改變的東西時才能留下。稽核被漏掉的、有範圍限制的 lint 和 TypeScript 抑制。涉及正確性或安全性的抑制仍然是可處理的 `MUST KILL`。只有在有確切的例外和有範圍的證明時，才恢復被刪除的註解。在接受單薄的 `IMPORTANT` 或 `do not remove` 刪除或保留之前，對它的符號跑 `/how` 或 `/why`。如果刪除有歧義，不要恢復。如果保留被反駁或仍有歧義，就刪掉它。還原並重跑一次被拒絕的報告，並指出失敗原因。如果第二份也被拒絕，就回報為未解決，並讓 `/no-comments` 失敗。
3. 直接修正簡單的被接受標記：刪掉死路徑、拿掉一個參數，或改用真正的 API。如果任何修正需要一個新形狀，就對被接受的整組標記和周圍程式碼跑一次 `/architect`。停在草稿。architect 負責形狀，第 4 步負責實作。
4. 在範圍內實作最小的根本原因修正。移除每個被點名的繞路寫法。如果根本原因在範圍外，落地範圍內最小的修正，其餘回報為未解決。**principle-fix-root-causes** 和 **principle-redesign-from-first-principles** 技能只用於引導意圖。兩者都不授權擴大範圍，也不授權修正範圍外的實例。永遠不要硬加治標的防護。
5. 限制型註解會說 `do not remove`（不要移除）、`do not change wording`（不要改措辭）或 `talk to X before changing`（修改前先找 X 談）。保留那些涉及我們無法改變之事的註解。提議範圍內最便宜的型別、執行期、測試或 CI lint 強制方式。等待互動式核准。無人看管和 eval 模式需要呼叫者事先核准。如果核准，先編碼再刪除。否則刪除、把限制回報為未解決，並草擬範圍外的工作。
6. 回報刪除數量、恢復的註解、重跑次數、architect 草稿、修正、編碼提議、已完成的編碼、未被強制的限制，以及其他未解決的工作。
