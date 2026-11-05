# TypeScript patterns（TypeScript 模式範例）

`SKILL.md` 中每條規則的程式碼範例。背後的原則與語言無關，見 **type-system-discipline** 和 **boundary-discipline** 原則技能。

> 譯註：程式碼保留原樣，只把註解中的 Don't / Do 譯為「不要 / 要」。

## Branded types（品牌型別）

為基本型別加上品牌，讓它們無法被混用。在邊界驗證一次，下游程式碼就信任型別。

```ts
type AgentId = string & { readonly __brand: "AgentId" };

function isAgentId(input: string): input is AgentId {
  return isUUID(input);
}

function parseAgentId(input: string): AgentId {
  if (!isAgentId(input)) throw new Error(`Invalid agent id: ${input}`);
  return input;
}

function focusAgent(id: AgentId): void {
  /* 輸入是可信的 */
}
```

使用 `readonly __brand: 'X'` 這個形狀。不要發明新的慣例。

## Discriminated unions（可辨識聯合）

用一個字面值鑑別欄位來建模變體。每個變體都有同名的欄位，而每個變體的值都是唯一的，所以不可能的組合無法被表示。

```ts
// 不要。布林值加上可選欄位，會讓互相矛盾的狀態存在。
type DiffState = { loading: boolean; diff?: GitDiff; error?: string };

// 要。只有合法的狀態存在。
type DiffState =
  | { kind: "loading" }
  | { kind: "ready"; diff: GitDiff }
  | { kind: "error"; error: string };
```

選一個鑑別欄位名稱（`kind`、`type`、`tag`）並堅持使用。

## Constructive modeling（建構式建模）

用全部合法的部件組成型別，而不是用執行期檢查去限制一個鬆散的型別。

非空，透過可變長度 tuple：

```ts
type NonEmpty<T> = [T, ...T[]];

// 不要：T[] 加上每個呼叫者都必須重複的長度檢查
function pickWinner(entries: string[]): string {
  if (entries.length === 0) throw new Error("no entries");
  return entries[Math.floor(Math.random() * entries.length)];
}

// 要：這個型別的空值根本不可能存在
function pickWinner(entries: NonEmpty<string>): string {
  return entries[Math.floor(Math.random() * entries.length)];
}
```

當收到的是一般的 `T[]` 時，用守衛收窄一次。之後這個事實就隨著型別傳遞：

```ts
const isNonEmpty = <T>(arr: T[]): arr is NonEmpty<T> => arr.length > 0;
```

偶數長度，用成對表示：

```ts
type Pairs<T> = [T, T][];
```

時間範圍，用開始加上持續時間表示：

```ts
// 不要：用註解保存不變條件
type TimeRange = { start: Date; end: Date }; // start <= end

// 要：負的範圍寫不出來；需要時再推導 end
type TimeRange = { start: Date; durationMs: number };
```

讓 `durationMs` 保持為一般的 number。只有當原始數字可能被傳到預期為持續時間的地方時，才為它加上品牌（依 Branded types），不要反射性地加。選擇能讓壞狀態無法被建構的表示方式，再在上面提供你需要的讀取方式（`pairs.flat()`、一個 `rangeEnd()` helper）。

## Simplest total type（最簡單的完全型別）

不要什麼都強化。當對 `T[]` 的每個操作都是完全（total）的時候，就保持 `T[]`：

```ts
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0); // [] 是 0，沒問題
```

當鬆散的型別迫使你在使用處說謊時，才強化它。徵兆是 `!`、`arr[0] as T`，以及「不應該發生」的 throw：

```ts
// 不要：把部分性偷渡過編譯器
function newestSession(sessions: Session[]): Session {
  return sessions.at(0)!;
}

// 要：強化輸入；斷言就消失了
function newestSession(sessions: NonEmpty<Session>): Session {
  return sessions[0];
}
```

把結果弱化成 `Session | undefined` 是另一種完全的簽名。

## 用 `unknown` 取代 `any`

外部資料永遠是 `unknown`。使用前先收窄。

```ts
// 不要
function handle(input: any) {
  return input.foo.bar;
}

// 要
function handle(input: unknown) {
  if (typeof input === "object" && input !== null && "foo" in input) {
    // 已收窄；編譯器會驗證存取
  }
}
```

外部來源包括 RPC 酬載、`JSON.parse`、`postMessage`、IPC、檔案內容、環境變數、資料庫查詢結果。

## Schema 先於手寫守衛

在為外部資料寫一個逐一檢查屬性的型別守衛之前，先找 repo 的執行期 schema 函式庫和既有的 schema。讓一個 schema 負責驗證，並從它推導 TypeScript 型別。不要同時維護一個 schema、一個重複的 interface 和一個守衛，讓它們有機會彼此偏離。

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["admin", "member"]),
});

type User = z.infer<typeof UserSchema>;

function parseUser(input: unknown): User {
  return UserSchema.parse(input);
}
```

當失敗是預期中的分支時，用 `safeParse`。當 repo 使用其他 schema 函式庫時，用對應的推導 helper。不要為了一個守衛而新增 schema 相依套件。這條規則偏好程式碼庫已經信任的 schema 系統。

## 不用 `as` 轉型

每個 `as` 都是潛在的執行期當機。只在型別系統驗證過主張之後才轉型。

```ts
import { z } from "zod";

// 不要
const user = data as User;

// 不要
function isUser(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}

// 要
const userSchema = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof userSchema>;

function parseUser(data: unknown): User {
  return userSchema.parse(data);
}
```

當型別先存在時，用驗證器所證明的型別來標註它。這樣編譯器會拒絕一個證明得比型別少的驗證器。把下面物件中的 `name` 拿掉，賦值就會編譯失敗。

```ts
type User = { id: string; name: string };

const userSchema: z.ZodType<User> = z.object({ id: z.string(), name: z.string() });
```

從既有程式碼中重構掉 `as` 時，找出 TypeScript 為什麼無法推導：

- 缺少鑑別欄位：加一個，改成可辨識聯合。
- 來源型別太寬（例如 `Record<string, unknown>`）：收窄它。
- 沒有型別的邊界：用擁有該形狀的 schema 解析。只有在沒有 schema 時才新增一個。
- 真的無法表達：用品牌型別或 `satisfies`。

## 收窄的優先順序

從最好到最後手段：

1. **可辨識聯合的 switch / if。** 編譯器會自動收窄。
2. **`in` 運算子。** `"key" in obj` 會收窄到含有該鍵的變體。
3. **`typeof` / `instanceof`。** 用於基本型別和類別實例。
4. **自訂型別守衛。** 當上面的都不夠時。
5. **`as` 轉型。** 只在驗證之後。

```ts
function area(s: Shape): number {
  if ("radius" in s) return Math.PI * s.radius ** 2; // 收窄為 circle
  return s.width * s.height; // 收窄為 rect
}
```

## 型別守衛

守衛必須真的驗證它的主張。說謊的守衛比 `as` 更糟。

```ts
function isCircle(s: Shape): s is Shape & { kind: "circle" } {
  return s.kind === "circle";
}
```

可以的話，優先用鑑別欄位收窄。

## 窮舉性

在 default 分支中，把鑑別欄位賦值給一個 `never` 型別的區域變數。

```ts
// 有回傳值的 switch
function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;
    case "rect":
      return s.width * s.height;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }
  }
}

// 沒有回傳值的 switch
function handle(s: Shape): void {
  switch (s.kind) {
    case "circle":
      drawCircle(s);
      break;
    case "rect":
      drawRect(s);
      break;
    default: {
      const _exhaustive: never = s;
      void _exhaustive;
    }
  }
}
```

有回傳值的 switch 用 return 寫法，敘述式的 switch 用 void 寫法。

## 用 `satisfies` 取代 `as`

`satisfies` 會驗證，但不會放寬字面型別。

```ts
// 不要。會放寬，失去字面型別。
const config = { theme: "dark", cols: 3 } as Config;

// 要。既驗證，又保留字面型別。
const config = { theme: "dark", cols: 3 } satisfies Config;
// config.theme 是 "dark"（字面值），而不是 string
```

## 邊界驗證

在資料進入的地方驗證一次，內部就信任型別。見 **boundary-discipline** 原則技能。

- **線路格式**（proto、JSON-RPC）：用 `ignoreUnknownFields` 解析，讓向前相容的改動不會弄壞舊客戶端。
- **持久化的 JSON：** 帶版本號的資料塊，解析時用 try/catch 包起來。
- **不要在呼叫鏈深處重新驗證。**

## 從 schema 推導的型別

當 `.proto`、OpenAPI 規格、GraphQL schema 或資料庫遷移已經定義了某個形狀時，從產生的型別推導，而不是複製一份。

```ts
// 不要。重複的形狀，schema 改變時就會偏離。
type CheckSummary = {
  totalCount: number;
  checks: { name: string; status: string }[];
};
function renderChecks(s: CheckSummary) {
  /* ... */
}

// 要。從產生的 schema 型別推導。
import type { ChecksMessage } from "<generated module>";
function renderChecks(s: Pick<ChecksMessage, "totalCount" | "checks">) {
  /* ... */
}
```

在寫新的 interface 之前，先考慮 `Pick`、`Omit`、`Parameters`、`ReturnType`、`Awaited`、`typeof`。

## 物件參數

```ts
// 不要。兩個參數對調了還是能編譯。
openFile(uri, {
  startLineNumber: 10,
  startColumn: 1,
  endLineNumber: 10,
  endColumn: 1,
});

// 要。與順序無關，自我說明。
openFile({
  uri,
  selection: {
    startLineNumber: 10,
    startColumn: 1,
    endLineNumber: 10,
    endColumn: 1,
  },
});
```

熱路徑上例外：每幀渲染、tokenizer、parser，以及任何配置成本會有影響的緊密迴圈。
