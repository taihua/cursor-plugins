---
name: principle-experience-first
description: "在產品、UX 或功能範圍的取捨出現時套用。選擇使用者的驚喜，而不是實作上的方便；寧可出貨較少但打磨好的功能，也不要較多但粗糙的。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-experience-first/SKILL.md`](../../../../pstack/skills/principle-experience-first/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Experience First（體驗優先）

當實作上的方便和使用者的驚喜衝突時，選擇驚喜。

- 每個功能、控制項和選項都必須有存在的理由
- 少出貨，出好貨（三個功能的精緻體驗勝過十個功能的粗糙體驗）
- 決定前先做原型（在用完即丟的 HTML 中做設計決策，比在正式程式碼中便宜）
- 把細節做對（轉場、對齊、間距、回饋、錯誤狀態）
- 收緊核心迴圈（每個功能都應該服務核心工作流程，否則就讓開）

使用者是使用這份工作成果的任何人。對 UI 來說是終端使用者。對函式庫或內部 API 來說，是匯入它的同事。下一個維護這段程式碼的工程師也是使用者。用同樣的方式衡量他們的體驗，並從他們的角度說明影響。

基礎應該服務體驗。Foundational Thinking 決定工作的**順序**，這條原則決定**目標**。
