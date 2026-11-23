---
name: principle-foundational-thinking
description: "在寫邏輯之前套用：選擇核心型別與資料結構、安排先搭骨架還是先做功能的順序、思考並行的角色共享了什麼。把資料結構弄對，下游的程式碼就會顯而易見。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-foundational-thinking/SKILL.md`](../../../../pstack/skills/principle-foundational-thinking/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Foundational Thinking（基礎思考）

寫邏輯之前先把資料的形狀弄對。及早定義核心型別、追蹤每一種存取模式，並選擇符合主要路徑的結構。DRY（不重複）的是結構，而不是每一行。

在角色之間共享狀態之前，先問：如果另一個角色同時修改它，會發生什麼事？如果答案不是「什麼都不會發生」，就把它隔離。

骨架優先。對之後每個階段都有幫助的東西（CI、測試、共用型別）要先做，但要在移除死程式碼之後。讓 commit 保持小而單一目的。
