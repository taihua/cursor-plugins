---
name: principle-separate-before-serializing-shared-state
description: "當並行的角色可能寫入同一個檔案、分支、鍵或狀態物件時套用。先消除共享；只有當「單一共享寫入者」是真正的不變條件時，才從結構上序列化。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md`](../../../../pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Separate Before Serializing Shared State（先分離，再序列化共享狀態）

當並行的角色可能共享可變狀態時，先問它們是否真的需要同一個可變物件。如果不需要，就消除共享。當共享是真的需要時，從結構上強制序列化：lockfile、循序的階段、獨佔的所有權。指示和慣例不是並行控制。

**為什麼：** 對共享狀態的並行寫入會造成競態條件，它們時有時無、難以重現、除錯成本高。

**模式：**
1. **找出共享的可變狀態**（兩方都讀也都寫的檔案、兩方都推送的分支、兩方都定義又都使用的 API）。
2. **預設：消除共享的寫入目標。** 問：這些角色需要一個標準物件，還是它們在發布彼此獨立的事實？給每個角色它自己擁有的檔案、鍵、分支或狀態資料夾，只在讀取/回報的邊界合併。兩個 worker 各自把自己的 `lastX` 欄位寫進同一個 `state.json`，仍然是共享修改。`indexer-state.json` + `metrics-state.json` 就不是。
3. **只有當單一共享寫入目標是真正的不變條件時，才從結構上序列化存取**（lockfile、循序階段、單一寫入者角色，或原子性的 compare-and-swap）。把「我們需要一個鎖」當作需要檢查的設計異味，而不是預設答案。
