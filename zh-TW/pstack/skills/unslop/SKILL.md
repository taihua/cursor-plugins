---
name: unslop
description: 從任何文字中刪除 AI 痕跡。
disable-model-invocation: true
---

> 本文為 [`pstack/skills/unslop/SKILL.md`](../../../../pstack/skills/unslop/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

> 譯註：這份規則是針對**英文**寫作設計的，許多例子（如 delve、tapestry、em dash）是英文特有的 AI 腔。中文寫作可以參考精神：少用空泛詞、少用破折號、句子要短、說具體的事。

# Unslop（去除 AI 腔）

編輯文字以移除 AI 的寫作模式。掃描下列模式，然後改寫。保留意思，並符合預期的語氣。

## 要偵測並修正的模式

規則編號是穩定的 id，其他技能會引用。被移除的規則會留下空號。

### 內容

3. **膚淺的 -ing 片語。** 「highlighting...」、「ensuring...」、「reflecting...」、「showcasing...」、「fostering...」（凸顯…、確保…、反映…、展現…、促進…）。刪掉，或用真實的來源展開。
5. **模糊的出處。** 「專家認為」、「產業報告指出」、「有些評論者主張」。說出來源，或刪掉。

### 用語

7. **AI 詞彙。** Additionally、crucial、delve、enduring、enhance、fostering、garner、interplay、intricate、landscape（抽象用法）、pivotal、showcase、tapestry（抽象用法）、testament、underscore、vibrant。換成平實的詞。
8. **「是」的花俏說法。** 「serves as」、「stands as」、「boasts」、「features」（作為、堪稱、擁有、具備）。說「是」或「有」。
9. **「不只是 X，更是 Y。」** 直接說出重點。
10. **三的法則。** 不要硬把想法湊成三個一組。用自然的數量。
11. **同義詞輪替。** 在同一段裡交替使用主角、主要角色、核心人物、英雄。選一個，重複使用。
12. **假範圍。** 「從 X 到 Y」，而 X 和 Y 並不在一個有意義的尺度上。直接列出主題。

### 風格

13. **過度使用長破折號（em dash）。** 完全避免長破折號。只用句號或逗號（不用括號、不用短破折號、不用連字號替代破折號）。如果某個想法需要分開，就結束句子或用逗號。
14. **過度使用冒號。** 冒號放在清單或範例前面沒問題，但不能當句中的連接詞。「If you're coming from traditional automation: instead of registering event handlers, you describe conditions」，這裡的冒號沒有增加任何東西。改寫成讓重點不靠比較框架也能成立：「Describing when the scheduler should fire works best as plain English.」意思相同，不靠拐杖式的標點。
15. **過度使用粗體。** 不要把每個專有名詞或縮寫都加粗。
16. **行內標題式清單。** 徵兆是一個粗體標籤加冒號，然後重述同一行：「**Performance:** Performance improved...」。把這些改成段落文字。一個以句號結尾、點出項目名稱、後面接著真正新細節的粗體開頭（「**Schema in TypeScript.** Tables live in one file.」）沒問題，不算 AI 痕跡。
17. **標題每字大寫（Title case）。** 用句首大寫（sentence case）。
18. **裝飾性 emoji。** 從標題和項目符號中移除。
19. **彎引號。** 用直引號。

### 溝通殘留

20. **聊天機器人用語。** 「希望這有幫助！」、「如果…請告訴我」、「當然！」、「沒問題！」、「找到確鑿證據了！」移除。
22. **奉承的語氣。** 「好問題！你說得完全正確！」直接回應。

### 填充詞

23. **填充片語。** 「In order to」改成「To」。「Due to the fact that」改成「Because」。刪掉「It is important to note that」（值得注意的是）。
24. **過度保留。** 「could potentially possibly be argued that it might」（或許可能可以說它也許）改成「may」（可能）。
25. **空泛的結論。** 「未來一片光明。」說出具體的計畫或事實。

### 行話

26. **抽象的比喻名詞。** Substrate（基底）、wedge、wedge in（加入）、vector（方式、方法）、locus、vantage、nexus、primitive 當名詞用、harness 當比喻用、「API surface」中的 surface、bedrock、scaffolding 當比喻用、modality、paradigm、gold-plating（超出工作所需）、ratchet 當比喻用（用機制的真名，或「只會收緊的上限」）、evacuate 用於搬移程式碼（move out）、endgame（最後階段）、north star、flywheel。這些詞讀起來很技術，但通常有更平實具體的詞。選具體的詞。

### 白話

27. **說它做什麼，而不是它感覺如何。** 「資料庫近在手邊」、「你讀得懂的 SQL」、「跟著你的 schema 走的型別」說的是一種感覺。修正方式是說出機制或數字：「`.toSQL()` 回傳送到資料庫的確切字串」、「欄位改名會讓建置失敗」。問自己這句話要讀者做什麼或知道什麼，然後寫那個。如果你無法把它重述成具體的指示、事實或數字，就刪掉它。再多一個檢查：如果這句話可以原封不動出現在另一個專案的文件中，它就沒有說出關於這個專案的任何事。刪掉它。
28. **縮短或拆開密集的句子。** 如果讀者必須回頭重讀才能理解一句話，就把它拆成兩句或拿掉子句。一句一個想法。
29. **主動語態。** 偏好主動語態。抓出「is/are/was/were + 過去分詞」並說出動作者：「queries are validated」（查詢被驗證）改成「the compiler validates queries」（編譯器驗證查詢），「the file is parsed by the loader」改成「the loader parses the file」。只有在動作者未知、或真的不重要時，被動語態才沒問題。
30. **刪掉副詞，或用更強的動詞。** 「runs quickly」（跑得很快）改成「is fast」或直接給數字，「significantly improves」（顯著改善）改成量到的差異。用副詞撐著一個弱動詞，代表動詞選錯了。
31. **偏好平實的詞。** 「utilize」和「leverage」改成「use」，「facilitate」改成「help」，「numerous」改成「many」，「in the event that」改成「if」。比較花俏的同義詞很少更清楚。
32. **矯揉造作的文字。** 在有字面說法的地方用比喻或修飾：格言（「wire it or delete it」）、為了效果的修辭片段、擬人化的程式碼（「計畫保管著它」）、比喻性的動詞（「搭便車」、「站在…之上」）、套語式的框架。「A dial worth turning」（值得轉一轉的旋鈕）改成「a parameter worth varying」（值得調整的參數）。說你的意思。比喻名詞由第 26 條處理。
33. **過度壓縮。** 省略冠詞、沒有動詞的片段、符號式說話，以及讓讀者需要解碼而不是閱讀的縮寫。「Parser rejects bad date → exit 2, no write」改成「The parser rejects a bad date, exits with code 2, and writes nothing.」寫完整的句子，帶冠詞和動詞，並把箭頭和縮寫寫出來。
