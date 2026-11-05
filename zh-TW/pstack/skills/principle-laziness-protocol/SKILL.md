---
name: principle-laziness-protocol
description: "在重構、評估 diff 大小，或想要加入抽象、層級或訊號傳遞時套用。偏好刪除，以及能解決問題的最小改動。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-laziness-protocol/SKILL.md`](../../../../pstack/skills/principle-laziness-protocol/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Laziness Protocol（懶惰協議）

- **整合決策。** 不要在好幾個地方重複同一個選擇。把它放在單一的真實來源後面，再以一個簡單的旗標傳遞結果。
- **最小化 diff。** 做能解決問題的最小改動。行數少勝過「優雅」的樣板程式碼。
