---
name: technical-writing
description: "分層的技術寫作標準：Diátaxis 結構、Google 開發者風格的句子、STE 指令規則、Global English 語法。用於 /technical-writing，或撰寫或審查文件、RFC、README、PR 描述或 commit 訊息時。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/technical-writing/SKILL.md`](../../../../pstack/skills/technical-writing/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

> 譯註：這份標準是針對**英文**技術寫作設計的（STE 是「簡化技術英文」，Global English 是「讓非母語讀者也能讀懂的英文」）。部分規則（冠詞、-ing、序列逗號）是英文特有的，但大部分精神——一句一個意思、說誰做了什麼、避免歧義——也適用於中文寫作。

# Technical writing（技術寫作）

寫到讓一個疲憊的工程師第一次讀就懂。四層全部套用。

有三條規則凌駕於各層之上：

- **刪掉每一個沒有作用的字。** 如果句子少了某個字仍然成立，那個字就該刪。「In order to」就是「to」。「It is important to note that」（值得注意的是）就是什麼都不用寫。
- **用簡短的日常用字。** 用「use」，不用「utilize」。用「help」，不用「facilitate」。用「do」，不用「perform」。一個長字必須用精確度來換取它的長度。
- **當某條規則讓句子變差時，用別的方式修正句子，或者不要動它。** 一個遵守所有規則、聽起來卻像機器寫的句子，就是失敗的。

程式碼庫就是詞彙表。寫出真實的符號、檔案、旗標或指令名稱，而不是同義詞或對它的描述。

不要發明術語。用開發者會說出口的字：「move」、「delete」、「a budget that only decreases」（只會下降的預算），而不是「evacuate」、「ratchet」或「endgame」。一個有名稱的模式，只要文件在第一次出現時說明它的意思就沒問題。如果你發現一個新的違規用詞，在回覆中把它和替代詞作為 `unslop` 抽象比喻規則的新增項目提出，附上 diff。不要直接修改那個技能。

## 變化節奏

一份文件可以遵守每一層，卻仍然讀起來像機器寫的：每句話都被剪得很短、沒有任何觀點、沒有任何具體的東西。

- 刻意混合句子長度。短句讓重點落地。長句則承載一個事實以及它的條件或後果。
- 一句一個想法，不代表每句都一樣長。拆開承載兩個想法的句子，保留承載一個想法的長句。
- 在模式允許的地方表達觀點。解說（explanation）會權衡取捨，所以說出你對它們的看法，而不是列出優缺點。參考資料（reference）則保持乾燥。
- 具體勝過無菌。不要寫「schema 改動可能會造成問題」，要寫「欄位改名會讓建置失敗」。

## 先選模式（Diátaxis）

一份文件，一種模式。兩個問題決定它：內容是用來引導行動（做）還是理解（想）？它服務的是學習還是工作？

- 行動 + 學習：**教學（tutorial）**。
- 行動 + 工作：**操作指南（how-to）**。
- 理解 + 工作：**參考資料（reference）**。
- 理解 + 學習：**解說（explanation）**。

這個指南針可以用在整份文件，也可以用在單一句子上。

**教學：從做中學。** 學習者的成功是你的責任，不是他們的。開頭說明學習者會做出什麼，而不是他們會「學到」什麼。每一步都產生可見的結果，要早、要頻繁。告訴他們應該看到什麼：預期的輸出、提示字元的變化、某一行 log。把解釋砍到一個子句加一個連結。保持具體。用「我們」、用指令寫：「首先，做 x。現在，做 y。」

**操作指南：達成目標的步驟。** 解決一個人遇到的問題，而不是機器能執行的某個操作。假設讀者有能力，跳過教學。只有行動：不離題、不講背景、不為了完整而完整，改用連結。允許分岔和判斷：「如果你想要 x，就做 y。」用任務為指南命名：「How to calibrate the radar array（如何校準雷達陣列）」，而不是「Radar array calibration（雷達陣列校準）」。

**參考資料：供查閱的事實。** 只描述。不指示、不說服、不表達意見。要乾燥、完整、篤定。陳述事實、選項、限制和錯誤，不加保留語氣。鏡像被描述事物的結構，讓程式碼和文件可以一起被瀏覽。把內容放在讀者預期的地方。盡可能從程式碼產生。

**解說：理解與原因。** 一個有邊界的主題，離開產品也能讀。每個標題前面都應該能隱含地加上「關於……」。以一個真實的「為什麼」問題為錨點。給出脈絡：設計決策、歷史、限制、替代方案。觀點只在這裡被允許，其他地方都不行。

不要混合模式：教學中不放參考表格，參考資料中不手把手教學，操作指南中不辯論。改為拆開並連結。

## 對讀者寫句子（Google 開發者風格）

- 用「你」對讀者說話，使用現在式。只有真的會在之後發生的事才用「will」。
- 說出誰做了什麼：「編譯器檢查」，而不是「被檢查」。只有在動作者未知或無關緊要時，被動語態才沒問題。
- 把指示寫成命令句：「點選 Submit。」直接陳述事實。永遠不要寫「應該被完成」。
- 把條件放在指示之前：「要刪除文件，點選 Delete。」
- 先寫常見的情況，例外放後面。
- 聽起來像一位懂行的朋友。不用流行術語、不用比喻性語言、指示中不用「請」，在步驟中永遠不要說「簡單地」、「很容易」或「很快地」。如果真的很簡單，讀者就不會來這裡了。
- 不要預告（「我們很快就會支援……」），也不要讓連續的句子以同樣的片語開頭。
- 用能說明連結去向的文字做連結：頁面標題或簡短描述。永遠不要用「點這裡」。偏好在頁面上給一句脈絡，而不是把讀者連走。
- 標題承載重點，而不只是主題（「先選模式」，而不是「模式」）。使用句首大寫。任務型標題是單純的動詞片語（「建立一個實例」），概念型標題是名詞片語。每頁一個 h1，不跳過層級。
- 順序用編號清單，其他一律用項目符號。用一個完整的句子引入清單。讓項目保持平行。
- 程式碼用程式碼字型。UI 元素用粗體。使用序列逗號（serial comma）。不寫「etc.」，而是事先說明清單不完整。

## 讓陳述一次載入一個（STE 規則）

- 每個句子一個指示。其他地方每個句子一個想法。
- 拆開超過約 20 個字（英文單字）的指示，以及超過約 25 個字的其他句子。
- 把警告或條件放在它所保護的步驟之前：「如果熱油碰到你的皮膚，可能會受傷。」
- 保留「the」和「a」：「Remove backup file」有兩種讀法，「Remove the backup file」只有一種。
- 給每個字一個意思和一個用途，然後一直維持。如果「check」代表檢查，就不要也用它來表示限制。
- 每個動作選一個字並堅持使用：用「start」，不要這裡用「start」、那裡用「initiate」。
- 把步驟寫成直接的命令句，永遠不要寫成敘述，也永遠不要用被動語態：「安裝元件」，而不是「元件必須被安裝」。
- 能避免就避免「-ing」字。

## 不留任何有兩種讀法的句子（Global English）

- 讓「only」和「not」這類字緊鄰它們修飾的字：「only fails on growth」和「fails only on growth」說的是不同的事。
- 拆開長串的名詞：「the proto import budget check script」改成「the script that checks the proto-import budget」（檢查 proto 匯入預算的那個腳本）。
- 讓每個「it」、「they」和「this」都指向一個明顯的東西。有疑慮時就重複名詞。永遠不要用「this」或「which」指向整個子句。
- 不要省略動詞：「Phase 1 moves the converters and Phase 2 the runtime」讓 Phase 2 沒有動詞。給它一個。
- 保留顯示結構的小字，例如「Ensure that the switch is off」中的「that」。永遠不要為了字數而犧牲清楚。
- 當重複冠詞能避免誤讀時，在一串項目中重複它：當兩者是不同的東西時，寫「the client and the host」，而不是「the client and host」。
- 當一個句子可能有兩種分組方式時，說清楚「and」或「or」連接的是哪些部分。「Both...and」、「either...or」和「if...then」是免費的消歧義工具。
- 用句號，不用分號。用新句子取代長破折號。
- 讓括號中的文字是一個完整的文法單位，或自成一句。永遠不要用「(s)」表示複數。
- 不用斜線：寫「a、b 或兩者」，而不是「a/b」或「and/or」。
- 每個東西在所有地方都用同一個名稱。一份文件對同一個東西說「the gate」、「the ratchet」和「the budget check」，等於在教三個東西。沒有改變的東西不要去動它。
- 跳過慣用語、口語、拉丁文縮寫和比喻。

## 語氣與 repo 特定事項

- 對這個技能碰到的每份文件套用 **unslop** 技能。那個技能擁有垃圾模式的目錄：AI 詞彙、填充詞、保留語氣、格式上的痕跡。
- PR 描述和 commit 訊息也是寫作。除了 Diátaxis 以外的每一層都適用於它們。PR 內文是一份審查者一分鐘內就能讀完的簡報。不要貼上 swarm log、SHA 清單或指標表格，用連結。
- 產品 UI 字串不是文件。那些要用你產品的文案指南。
- 程式碼片段用 tab 縮排。寫真實的路徑。讓每個數量或樹狀結構的主張在落地它的那個 commit 上都是真的，並附上能重新產生它的指令。

## 實例

修改前：

> Configuration of the proto import ratchet budget script parameters is performed via budget.json. Note that it's important to remember that running with --write, which updates the committed budget to reflect the current count, should only be done when lowering it. If exceeded, CI fails.

修改後：

> `budget.mjs` reads the committed budget from `budget.json` and counts the files that import protos. If the count exceeds the budget, CI fails. Run `budget.mjs --write` only to lower the budget.

（中文意思：`budget.mjs` 從 `budget.json` 讀取已提交的預算，並計算匯入 proto 的檔案數。如果數量超過預算，CI 就會失敗。只有在要降低預算時才執行 `budget.mjs --write`。）
