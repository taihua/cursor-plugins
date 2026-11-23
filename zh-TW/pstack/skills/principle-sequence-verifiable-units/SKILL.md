---
name: principle-sequence-verifiable-units
description: "適用於多步驟工作（大範圍掃描、遷移、一連串相似的修改），以及你如何堆疊 commit 與 PR。把工作拆成每個都以可驗證狀態結束的小單元，檢查完一個再做下一個，並安排交付順序，讓整串變更能自我證明給審查者看。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-sequence-verifiable-units/SKILL.md`](../../../../pstack/skills/principle-sequence-verifiable-units/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Sequence work into verifiable units（把工作排序成可驗證的單元）

把工作排成小單元，每個都以一個你能檢查的狀態結束；在目前這個變綠之前，不要往前推進。

在大範圍掃描、遷移或一連串相似的修改中，每個單元都是一組前後對照：已知良好的狀態、一個改動、跑檢查、繼續。即使修改是由工具做的，也要跑每個單元的檢查。

依能證明這項工作的順序交付：先放失敗的測試，再放修正。先刪減，再重塑。先擷取基準，再處理。每個 commit 都能獨立落地。
