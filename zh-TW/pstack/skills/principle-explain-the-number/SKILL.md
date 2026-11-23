---
name: principle-explain-the-number
description: "在量測之前，以及在你信任、回報或根據一個量測數字（加速、退步、吞吐量、延遲或 eval 結果）採取行動之前套用。找出限制它的因素，並排除它其實量到你以為的工作以外的東西。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-explain-the-number/SKILL.md`](../../../../pstack/skills/principle-explain-the-number/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Explain the Number（解釋這個數字）

- **執行前先寫下決策。** 說出什麼樣的結果會改變它，以及雜訊的下限。當每次執行之間的差異比效果本身還大時，就停下。
- **問「為什麼不是兩倍？」** 從效能分析或執行期間擷取的計數器，說出限制結果的資源或程式路徑。讀程式碼得出的猜測不算瓶頸。
- **列出這個數字還可能在量什麼**（錯誤、被跳過或被快取的工作、從未執行的程式碼、沒有調校的一方、雜訊、一個小到無關緊要的部分），並用證據逐一排除。
- **讓執行次數、差異範圍和瓶頸跟著數字走。**

效能數字的話，跑 [benchmark-checklist](../benchmark-checklist/SKILL.md) 技能。eval 結果的話，問：每次執行都有完成任務嗎？差距在不同試驗和不同模型之間都成立嗎？這個情境重要嗎？
