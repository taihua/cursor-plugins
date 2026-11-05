---
name: principle-subtract-before-you-add
description: "在安排新增、重構或重寫的順序時套用。先移除死程式碼、多餘的驗證和殘留的空殼引用，再在更簡單的基礎上建構。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-subtract-before-you-add/SKILL.md`](../../../../pstack/skills/principle-subtract-before-you-add/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Subtract Before You Add（先減再加）

演進一個系統時，先移除複雜度，再建構。預設採取刪減。

讓簡化成為持續的投資。離開時，讓設計比你接手時稍微更簡單、更有能力，而介面維持一樣大或更小。

- 移除排在建構之前
- 先刪再打磨（先做到最小，再投資在品質上）
- 為觀察到的使用方式設計，而不是推測的邊界情況
- 除了規格要求的之外，不要推測性的驗證器、解析器或防護
- 簡化提示詞（移除多餘的指示、過度的模板）
- 當一個引用沒有任何新內容時，刪掉它，而不是留下一個空殼
