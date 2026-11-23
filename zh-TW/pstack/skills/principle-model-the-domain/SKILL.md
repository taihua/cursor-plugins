---
name: principle-model-the-domain
description: "在撰寫有狀態的邏輯，或程式碼分支很多、在多個檔案中重複同一種結構假設時套用。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-model-the-domain/SKILL.md`](../../../../pstack/skills/principle-model-the-domain/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Model the Domain（為領域建模）

把領域編碼在一個資料結構中，而不是散落在各處的條件判斷裡。正確的結構會讓不合法的狀態無法被表示，並刪掉分支。

考慮使用：用狀態機取代散落的布林值或階段檢查；用型別化模型取代鬆散的參數；用 map、註冊表或 discriminated union 取代散布在各檔案中的分支；用 reducer 取代臨時的狀態修改；當存取模式需要時，使用索引、佇列或正規化的集合。

不要硬套。如果形狀已經清楚、局部、而且不太可能擴張，就保留平凡的程式碼；對於只增加間接層、卻沒有移除分支或不合法狀態的抽象，要抱持懷疑。

你跳過這條原則的徵兆是：一個功能讓 if/else 鏈多長出一個分支，或出現第二個必須和第一個保持同步的布林值。
