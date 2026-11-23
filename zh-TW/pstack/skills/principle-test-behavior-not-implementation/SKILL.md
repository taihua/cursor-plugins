---
name: principle-test-behavior-not-implementation
description: "在你撰寫、修改或保留測試時套用。斷言程式的使用者觀察得到的東西，這樣行為壞掉時測試會失敗，只改內部時測試仍會通過。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-test-behavior-not-implementation/SKILL.md`](../../../../pstack/skills/principle-test-behavior-not-implementation/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Test Behavior, Not Implementation（測行為，不測實作）

測試是對「程式碼的使用者透過它的介面能觀察到什麼」的主張：回傳值、錯誤、他們能讀回來的狀態，以及對外部系統的影響。私有的 helper、內部呼叫順序和中間資料都是實作。

用兩個想像中的修改來評判每個測試：

- **弄壞行為**（錯誤的值、被跳過或發生兩次的效果）。如果測試仍然通過，它就什麼也沒證明。常見原因有：寬鬆的斷言、預期值是由受測程式碼算出來的，以及斷言的是測試自己建構的資料。
- **改變內部**，並保持每個可觀察的結果不變。如果測試失敗了，它就被釘死在實作上。

保留能抓到第一種修改、又能撐過第二種修改的測試。其餘的重寫或刪掉。用一個具體的輸入，透過公開介面驅動程式碼，並從需求推導預期值。外部服務收到的東西是行為；對內部 helper 的呼叫則不是。「這件事永遠不會發生」要搭配一個它確實會發生的案例。斷言呼叫者據以分支的錯誤型別，而不是錯誤訊息。
