---
name: principle-type-system-discipline
description: "在設計型別、審查函式簽名，或用任何靜態型別語言寫程式時套用。讓不合法的狀態無法被表示、為有語意的基本型別加上品牌、在邊界解析外部資料、窮舉所有變體、從權威 schema 推導型別。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-type-system-discipline/SKILL.md`](../../../../pstack/skills/principle-type-system-discipline/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Type System Discipline（型別系統紀律）

讓編譯器拒絕不可能的狀態、不匹配的基本型別和未處理的變體。偏好讓錯誤和特殊情況從定義上就不存在，而不是增生一堆處理器。TypeScript 語法請見 `typescript-best-practices` 技能。

- **為有語意的基本型別加上品牌（brand）。** `UserId` 和 `OrderId` 底層都是字串，但不應該可以互換。給每一個自己的型別，例如 TypeScript 中的 branded intersection，或其他語言的 newtype。在建立時驗證一次，下游就信任型別。如果兩個參數共用同一個基本型別卻代表不同的意義，就為它們加上品牌。
- **外部資料在被解析之前都是無型別的。** RPC 酬載、JSON、IPC 訊息、CLI 參數、設定檔、環境變數、資料庫列。在每個邊界都要有一個解析函式，把非結構化的輸入轉換成型別化的模型。**boundary-discipline** 原則技能說明了驗證要放在哪裡。
- **從權威 schema 推導型別。** 當 protocol buffer、OpenAPI 規格、GraphQL schema、資料庫遷移、design token 檔案或其他檔案擁有某個形狀時，從它推導，而不是手寫一個平行的型別。見 **encode-lessons-in-structure** 原則技能。
