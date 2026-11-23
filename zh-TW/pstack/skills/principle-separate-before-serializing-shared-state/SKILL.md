---
name: principle-separate-before-serializing-shared-state
description: "當並行的角色可能寫入同一個檔案、分支、鍵或狀態物件時套用。先消除共享；只有當「單一共享寫入者」是真正的不變條件時，才從結構上序列化。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md`](../../../../pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Separate Before Serializing Shared State（先分離，再序列化共享狀態）

當並行的角色可能寫入同一個檔案、分支、鍵或物件時，先問它們需要的是一個共享物件，還是在發布彼此獨立的事實。預設給每個角色它自己的檔案、鍵、分支或狀態資料夾，只在讀取狀態的地方合併。兩個 worker 各自把自己的欄位寫進同一個 `state.json`，仍然是共享修改。

只有當單一共享寫入目標是真正的不變條件時，才從結構上序列化存取（lockfile、單一寫入者、循序階段、compare-and-swap）。指示不是並行控制，而「我們需要一個鎖」是一個要先檢查的異味。
