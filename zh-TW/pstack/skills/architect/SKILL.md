---
name: architect
description: "在寫程式之前先草擬型別、函式簽名和模組結構，然後在實作填入時持續參與。用於 /architect、「architect this」、「design this」，或直接跳去寫程式會鎖定錯誤形狀的不簡單工作。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/architect/SKILL.md`](../../../../pstack/skills/architect/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Architect（架構師）

寫程式之前，先追蹤這次改動碰到的每個系統，然後為它草擬兩種不同的形狀（型別、函式簽名、模組邊界），選出其中每份狀態只有一個擁有者、每個任務只有一種做法、呼叫者需要知道的東西最少的那一個。如果繞路寫法反覆出現，就重新設計，而不是打補丁。

對於大型或有爭議的設計，執行 **arena** 技能，而不是自己一個人草擬。
