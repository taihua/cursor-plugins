---
name: principle-boundary-discipline
description: "在接上驗證、錯誤處理或框架轉接器時套用。把防護集中在系統邊界（CLI、設定、網路、外部 API）；信任內部型別，把商業邏輯放在純函式中。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-boundary-discipline/SKILL.md`](../../../../pstack/skills/principle-boundary-discipline/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Boundary Discipline（邊界紀律）

在資料跨越系統邊界（CLI 參數、設定檔、外部 API、網路）的地方做驗證、型別收窄和錯誤處理。在內部就信任型別：不重複驗證，也不做多餘的 nil 檢查。在邊界把原始資料解析成領域型別，並讓傳輸和框架的型別不出現在公開介面上。商業邏輯放在沒有框架相依的純函式中。呼叫它們的外殼要薄。

兩個檢驗。這筆資料此刻正在跨越邊界嗎？如果不是，驗證就是多餘的。這能不能是一個外殼只需要呼叫的純函式？如果能，就把它抽出來。
