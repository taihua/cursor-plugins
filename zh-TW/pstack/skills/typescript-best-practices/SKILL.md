---
name: typescript-best-practices
description: TypeScript 最佳實踐。在讀取或編輯任何 .ts 或 .tsx 檔案時使用。
paths: ["**/*.ts", "**/*.tsx"]
disable-model-invocation: true
---

> 本文為 [`pstack/skills/typescript-best-practices/SKILL.md`](../../../../pstack/skills/typescript-best-practices/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# TypeScript best practices（TypeScript 最佳實踐）

先套用 **type-system-discipline** 原則技能。

| 規則 | 摘要 |
|------|---------|
| Discriminated unions（可辨識聯合） | 用一個 `kind` 字面值鑑別欄位來建模變體，讓不可能的狀態無法被表示。不要用一包可選欄位。 |
| Branded types（品牌型別） | 用 `& { readonly __brand: "X" }` 為基本型別加上品牌，讓它們無法被混用。在邊界驗證一次。品牌來自一個會實際驗證的型別守衛（`input is AgentId`），永遠不是來自 `as`。 |
| Constructive modeling（建構式建模） | 把形狀建構成讓不合法的值無法被建立。非空用 `[T, ...T[]]`，偶數長度用 `[T, T][]`，範圍用 `start` 加 `duration`。不是執行期防護，也不是期待精煉型別。 |
| Simplest total type（最簡單的完全型別） | 只要對 `T[]` 的每個操作都保持完全（total），就維持用 `T[]`。只有在鬆散型別迫使你用 `!`、強制轉型或「不應該發生」的 throw 時，才強化成 `NonEmpty<T>`。 |
| 用 `unknown` 取代 `any` | 外部資料是 `unknown`。 |
| Schema 先於守衛 | 在手寫逐一檢查屬性的型別守衛之前，先使用 repo 的執行期 schema 函式庫，並從 schema 推導型別，例如 `z.infer`。 |
| 不用 `as` 轉型 | 每個 `as` 都是一個等著發生的執行期當機。只在驗證之後才轉型。 |
| 收窄的優先順序 | 鑑別欄位 switch > `in` 運算子 > `typeof`/`instanceof` > 自訂型別守衛 > `as`。 |
| 型別守衛 | 必須真的驗證它的主張。說謊的守衛比 `as` 更糟，因為 bug 藏在一個宣稱安全的名稱後面。命名為 `isX` 或 `hasX`。 |
| 窮舉性 | 在 default 分支中內聯 `const _exhaustive: never = x;`，讓新增變體時編譯器會報錯。 |
| 用 `satisfies` 取代 `as` | 驗證值，又不會把字面型別放寬。 |
| 邊界驗證 | 在資料進入的地方把它解析成一個有名稱的領域型別。`Record<string, unknown>`（不管怎麼寫）止步於那次解析。內部就信任型別。見 **boundary-discipline** 原則技能。 |
| 從 schema 推導的型別 | 在宣告新 interface 之前，先考慮 `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof`。 |
| 物件參數 | 傳物件而不是位置參數，讓參數順序自我說明。熱路徑上（每幀渲染、tokenizer、parser）例外。 |
| 真實的測試 | 能執行的東西就不要 mock。偏好框架真正的測試基本元件並搭配洩漏/釋放檢查，並在執行中的建置版本驗證 UI。只 mock 你無法在本機執行的東西。 |
| 結構化的遙測 | 偏好結構化的 logger 診斷資訊，帶有足以從一個 id 除錯的脈絡。出貨的程式碼中不要有 `console.log`。 |

範例：`references/patterns.md`。
