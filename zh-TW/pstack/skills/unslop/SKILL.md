---
name: unslop
description: 從任何文字中刪除 AI 痕跡。
disable-model-invocation: true
---

> 本文為 [`pstack/skills/unslop/SKILL.md`](../../../../pstack/skills/unslop/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

> 譯註：這份規則是針對**英文**寫作設計的，許多例子（如 delve、tapestry、em dash）是英文特有的 AI 腔。中文寫作可以參考精神：少用空泛詞、少用破折號、句子要短、說具體的事。

# Unslop（去除 AI 腔）

編輯文字以移除 AI 的寫作模式。掃描下列模式，然後改寫。保留意思，並符合預期的語氣。

規則編號是穩定的 id，其他技能會引用。被移除的規則會留下空號。

3. 不要用沒有增加任何事實的結尾 -ing 片語（「highlighting...」、「ensuring...」，凸顯…、確保…）。
5. 不要用模糊的出處（「專家認為」）。說出來源，或刪掉。
7. 不要用 AI 詞彙：additionally、crucial、delve、enhance、foster、landscape、pivotal、showcase、testament、underscore、vibrant。
8. 說「是」或「有」，不要說「serves as」、「stands as」、「boasts」、「features」（作為、堪稱、擁有、具備）。
9. 不要用「不只是 X，更是 Y」。直接說出重點。
10. 不要硬把想法湊成三個一組。
11. 每個東西一個名稱。重複使用它。
12. 不要用「從 X 到 Y」，除非 X 和 Y 位在一個真實的尺度上。
13. 不用長破折號（em dash）、短破折號（en dash）或當破折號用的連字號，也不用括號取代它們。用句號或逗號。
14. 冒號放在清單或範例前面，永遠不要放在句中當連接詞。
15. 不要把每個專有名詞或縮寫都加粗。
16. 不要用重述同一行的粗體標籤加冒號（「**Performance:** Performance improved...」）。以句號結尾、並加上新細節的粗體開頭沒問題。
17. 標題用句首大寫（sentence case）。
18. 不用裝飾性 emoji。
19. 用直引號。
20. 不用聊天機器人用語（「希望這有幫助！」、「如果…請告訴我」）。
22. 開頭不要稱讚或附和。直接回應。
23. 刪掉填充詞。「In order to」改成「to」。刪掉「it is important to note that」（值得注意的是）。
24. 最多一個保留語氣：「may」（可能）。
25. 不要用空泛的結論。說出具體的計畫或事實。
26. 不用抽象的比喻名詞：substrate、wedge、vector、nexus、primitive、harness、surface、scaffolding、paradigm、ratchet、north star、flywheel。用具體的詞。
27. 說它做什麼，而不是它感覺如何。說出機制或數字。如果一句話可以原封不動出現在另一個專案的文件中，就刪掉它。
28. 一句一個想法。讀者必須重讀的句子就拆開。
29. 主動語態。說出動作者，除非動作者未知或不重要。
30. 刪掉副詞，或用更強的動詞。給出數字。
31. 用平實的詞：用「use」，不用「utilize」或「leverage」。
32. 在有字面說法的地方，不用比喻、格言、擬人化的程式碼或比喻性的動詞。
33. 寫完整的句子，帶冠詞和動詞。把箭頭和縮寫寫出來。
