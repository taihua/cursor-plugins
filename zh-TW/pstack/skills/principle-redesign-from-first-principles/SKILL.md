---
name: principle-redesign-from-first-principles
description: "在把新需求整合進既有設計時套用。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-redesign-from-first-principles/SKILL.md`](../../../../pstack/skills/principle-redesign-from-first-principles/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Redesign From First Principles（從第一原理重新設計）

整合一個改動時，不要把它硬接到既有設計上。把這個需求當作從一開始就是基礎假設來重新設計。

- 讀過所有受影響的檔案，理解目前的設計
- 問自己：「如果我們帶著這個新需求從頭寫，我們會做出什麼？」
- 把改動傳播到每一個引用處：型別、文件、範例、理由說明的章節
- 思考整個重新設計，然後以漸進的方式交付

這是在把改動整合進既有設計時，保留選擇彈性的方法。
