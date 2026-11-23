---
name: principle-type-system-discipline
description: "在設計型別、審查函式簽名，或用任何靜態型別語言寫程式時套用。讓不合法的狀態無法被表示、為有語意的基本型別加上品牌、在邊界解析外部資料、窮舉所有變體、從權威 schema 推導型別。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-type-system-discipline/SKILL.md`](../../../../pstack/skills/principle-type-system-discipline/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Type System Discipline（型別系統紀律）

讓編譯器拒絕不可能的狀態、不匹配的基本型別和未處理的變體。

- **為有語意的基本型別加上品牌（brand）。** 如果兩個參數共用同一個基本型別卻代表不同的意義，就給每一個自己的型別。在建立時驗證一次。
- **外部資料在被解析之前都是無型別的。** JSON、RPC 酬載、CLI 參數、設定、環境變數和資料庫列，都要在邊界經過一個回傳型別化模型的解析函式。
- **從權威 schema 推導型別。** 當某個 schema 檔案擁有某個形狀時，從它推導型別，而不是手寫一個平行的型別。

TypeScript 語法請見 **typescript-best-practices** 技能。
