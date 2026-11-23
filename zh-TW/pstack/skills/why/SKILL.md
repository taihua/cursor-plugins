---
name: why
description: "用於「為什麼 X 這樣運作」、「我們為什麼選了 Y」、設計理由、退步、事後檢討，或有數據支持的門檻值。回傳一份附出處、關於決策與取捨的解讀。執行期行為用 how。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/why/SKILL.md`](../../../../pstack/skills/why/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Why（為什麼）

根據紀錄回答，而不是根據程式碼：讀引入目標的 commit 和 PR 討論，以及之後每一次改動的 commit 和 PR 討論；如果這條紀錄很薄，再查其他來源。引用作者寫下的內容，把你自己的推論標明為推論，並說出紀錄回答不了什麼。
