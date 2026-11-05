---
name: principle-attack-the-premise
description: "當兩個以上共用同一前提的修法在同一關卡失敗時套用。先把前提寫下來並直接測試它，再寫下一個建立在它之上的修法。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-attack-the-premise/SKILL.md`](../../../../pstack/skills/principle-attack-the-premise/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Attack the Premise（質疑前提）

當兩個以上共用同一前提的修法在同一關卡失敗時，懷疑的應該是前提，而不是修法。

**為什麼：** 每個失敗的修法，都是反對它所假設之信念的證據。在同一前提上再做第三個修法，就是把力氣花在證據早已表明不是原因的地方。

**模式：**
- **把前提寫下來。** 前提就是每個失敗修法都假設的那一句話。
- **在下一個修法之前測試前提。** 找出一個「如果前提是錯的，結果就會不同」的觀察，然後去做它。看失敗是如何分布的，而不只是看它們有多大。依 [Build the Lever](../principle-build-the-lever/SKILL.md) 讓這個檢查可以重跑。
- **跟著證據走。** 如果證據與前提矛盾，原因就在別處。找出失敗之間有哪些共同點是前提沒有預測到的。如果證據證實了前提，就依 [Fix Root Causes](../principle-fix-root-causes/SKILL.md) 問下一個「為什麼」。之前的修法可能處理的是結果而不是原因。
- **移除條件，而不是補償它**，依 [Laziness Protocol](../principle-laziness-protocol/SKILL.md)。如果證據顯示某個部分總是落在輸的那一邊，就改變把它放在那裡的東西。一個在事後收拾的機制會把原因留在原地，還讓每次執行都多做工。

**停止點：** 在前提被寫下並測試之前，不要開始下一個修法。

這條原則和 [Redesign from First Principles](../principle-redesign-from-first-principles/SKILL.md) 不同，後者是圍繞新需求重建設計；這條則是質疑目前設計所假設的一個事實。
