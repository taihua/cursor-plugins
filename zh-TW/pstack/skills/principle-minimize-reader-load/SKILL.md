---
name: principle-minimize-reader-load
description: "在審查或整理難以追蹤的程式碼時套用。計算從問題到答案之間有幾層，以及讀者腦中要記住多少隱藏狀態；合併只有一個呼叫者的包裝層，縮小可變狀態的範圍。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-minimize-reader-load/SKILL.md`](../../../../pstack/skills/principle-minimize-reader-load/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Minimize Reader Load（降低閱讀負擔）

閱讀負擔，就是讀者為了理解程式碼必須付出的工作量。它有兩個彼此獨立的軸向：問題和答案之間要追蹤的層數，以及讀者腦中要記住的隱藏或可變狀態。兩者都要守住。

- 合併只做轉發的層級：只有一個呼叫者的包裝層、沒有第二個實作的轉接器、直通的方法。把它們內聯。
- 縮小狀態的範圍：回傳值勝過修改、區域變數勝過欄位、欄位勝過模組狀態、模組狀態勝過全域變數。用推導取代同步。
- 在邊界上寫明一次不變條件，而不是在每個使用者那裡都寫。

檢驗標準：一個新讀者能在 30 秒內回答「X 從哪裡來？」和「什麼會改變 X？」嗎？如果不能，就砍掉層級或砍掉狀態。
