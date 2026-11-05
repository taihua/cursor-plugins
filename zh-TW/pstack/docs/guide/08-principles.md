# 用原則名稱來引導

pstack 把 24 條原則各做成一個技能。`/poteto-mode` 在每個多步驟任務開始時讀取它們的索引，套用任務觸發的原則，並在回覆中點名每條被套用的原則，以及它改變了哪個決定。

你不需要「呼叫」原則。你用它們的**名稱**來引導。每個名稱都指向一條 agent 已經讀過的完整規則，所以一句話就能比一段說明更精準地扭轉工作方向。

> 中文使用者小提醒：用中文說原則名稱 agent 也聽得懂，但英文名稱最精準。下面每條都附上英文原名，方便你直接引用。

## 實際引導的例子

假設 agent 正準備在三個既有的轉接器旁邊再硬接一個新的：

```text
套用 subtract before you add（先減再加）。先刪掉過時的轉接器，再設計剩下的。
```

假設它因為建置通過就宣稱成功：

```text
套用 prove it works（證明它能用）。實際跑一次匯入流程，給我看寫進去的紀錄。
```

假設兩個平行嘗試正準備寫到同一個分支：

```text
separate before serializing shared state（先分離，再序列化共享狀態）。每個嘗試給它自己的 worktree，不要用鎖。
```

每句話都有效，因為它背後的規則很具體。agent 仍然必須在回覆中說明這條規則改變了哪個決定。**引用了原則卻沒有對應的決定，代表 agent 只是念出規則，並沒有套用它。**

## 24 條原則速覽

**核心原則**決定要做多少、何時重新思考設計：

- [Laziness Protocol（懶惰協議）](../../skills/principle-laziness-protocol/SKILL.md)：偏好刪除，以及能解決問題的最小改動。
- [Foundational Thinking（基礎思考）](../../skills/principle-foundational-thinking/SKILL.md)：寫邏輯之前先選好核心資料結構。
- [Redesign from First Principles（從第一原理重新設計）](../../skills/principle-redesign-from-first-principles/SKILL.md)：把新需求當作從第一天就存在般整合進來。
- [Attack the Premise（質疑前提）](../../skills/principle-attack-the-premise/SKILL.md)：把兩個以上失敗修法共用的前提寫下來，在下一次修正前直接測試它。
- [Subtract Before You Add（先減再加）](../../skills/principle-subtract-before-you-add/SKILL.md)：在其上建構之前，先移除多餘的負擔。
- [Minimize Reader Load（降低閱讀負擔）](../../skills/principle-minimize-reader-load/SKILL.md)：合併讀者必須記在腦中的層級和隱藏狀態。
- [Outcome-Oriented Execution（以結果為導向）](../../skills/principle-outcome-oriented-execution/SKILL.md)：讓重寫直接收斂到目標設計，而不是保留用完即丟的相容狀態。
- [Experience First（體驗優先）](../../skills/principle-experience-first/SKILL.md)：選擇使用者得到的結果，而不是實作上的方便。
- [Exhaust the Design Space（窮盡設計空間）](../../skills/principle-exhaust-the-design-space/SKILL.md)：沒有前例可循時，做兩三個互相競爭的原型。
- [Build the Lever（打造槓桿）](../../skills/principle-build-the-lever/SKILL.md)：打造能完成或證明工作的腳本，讓審查者可以重跑。當 agent 一直手動做同一件事，就讓它寫出它希望擁有的工具或技能。如果腳本能每次都用同樣方式完成某一步，就用腳本，把 agent 留給需要判斷的地方。

**架構原則**決定狀態、驗證和相容性放在哪裡：

- [Model the Domain（為領域建模）](../../skills/principle-model-the-domain/SKILL.md)：把重複的規則編碼成一個結構，而不是散落的條件判斷。
- [Boundary Discipline（邊界紀律）](../../skills/principle-boundary-discipline/SKILL.md)：在邊界驗證，內部就信任型別。
- [Type System Discipline（型別系統紀律）](../../skills/principle-type-system-discipline/SKILL.md)：讓不合法的狀態無法被表示。
- [Make Operations Idempotent（讓操作冪等）](../../skills/principle-make-operations-idempotent/SKILL.md)：重試後收斂到同一個最終狀態。
- [Migrate Callers Then Delete Legacy APIs（遷移呼叫端後刪除舊 API）](../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md)：遷移和刪除在同一波完成。
- [Separate Before Serializing Shared State（先分離，再序列化共享狀態）](../../skills/principle-separate-before-serializing-shared-state/SKILL.md)：先拿掉共享，再考慮加協調機制。

**驗證原則**定義什麼才算證據：

- [Prove It Works（證明它能用）](../../skills/principle-prove-it-works/SKILL.md)：驗證真實的成品，而不是替代指標。
- [Fix Root Causes（修正根本原因）](../../skills/principle-fix-root-causes/SKILL.md)：改程式碼之前，先重現並追溯到原因。
- [Sequence Work into Verifiable Units（排序可驗證單元）](../../skills/principle-sequence-verifiable-units/SKILL.md)：每個小單元都以一次檢查結束，再開始下一個。
- [Test Behavior, Not Implementation（測行為，不測實作）](../../skills/principle-test-behavior-not-implementation/SKILL.md)：斷言程式的使用者觀察得到的東西，這樣行為壞掉時測試會失敗，只改內部時測試仍能通過。
- [Explain the Number（解釋這個數字）](../../skills/principle-explain-the-number/SKILL.md)：在任何人信任或回報一個量測數字前，說出限制它的瓶頸，並排除它其實量到別的東西的可能。[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 把它變成七個你要用實際執行回答的問題。

**委派原則**讓平行工作保持理智：

- [Guard the Context Window（守護上下文視窗）](../../skills/principle-guard-the-context-window/SKILL.md)：大量閱讀交給子代理，主聊天只保留發現。
- [Never Block on the Human（絕不卡在等人）](../../skills/principle-never-block-on-the-human/SKILL.md)：可逆的工作就直接做，再呈現結果。

以及一條**後設原則**：

- [Encode Lessons in Structure（把教訓寫進結構）](../../skills/principle-encode-lessons-in-structure/SKILL.md)：同一個建議說過兩次，就把它變成 lint、檢查或腳本。[`/correct`](../../skills/correct/SKILL.md) 會把它套用到整個 repo，見[打造你自己的版本](./09-make-it-yours.md#用-correct-修正環境)。

不用背這份清單。現在先瀏覽一遍，等你抓到 agent 做了某件「這裡某個名稱本來可以避免」的事時再回來看。詞彙就是這樣記住的。

下一頁：[打造你自己的版本](./09-make-it-yours.md)。
