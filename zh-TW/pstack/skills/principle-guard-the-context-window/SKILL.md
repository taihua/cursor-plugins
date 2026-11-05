---
name: principle-guard-the-context-window
description: "在上下文快滿時套用：大量輸出、長檔案、重複讀取、分派規劃。大量內容交給子代理；主對話只保留摘要，不放原始資料。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-guard-the-context-window/SKILL.md`](../../../../pstack/skills/principle-guard-the-context-window/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Guard the Context Window（守護上下文視窗）

**為什麼：** 上下文溢出會降低推理品質、產生壓縮造成的失真，並讓進度停擺。

**模式：**
- **規劃階段大小並限制範圍。** 限制每個階段處理的檔案數、設定回合預算、把機制本身的成本算進去。

> 譯註：原檔內文就是這麼短，主要規則寫在上方的 description 中。
