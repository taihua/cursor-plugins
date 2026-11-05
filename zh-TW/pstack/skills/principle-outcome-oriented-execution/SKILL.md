---
name: principle-outcome-oriented-execution
description: "在有明確階段邊界的計畫性重寫與遷移中套用。直接收斂到目標架構；不要用用完即丟的相容程式碼來保留平順的中間狀態。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-outcome-oriented-execution/SKILL.md`](../../../../pstack/skills/principle-outcome-oriented-execution/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Outcome-Oriented Execution（以結果為導向）

為預期中、可驗證的最終狀態做最佳化，而不是保留平順的中間狀態。

**為什麼：** 讓每個中間步驟都完全穩定，往往會產生暫時的相容程式碼，而它最後會變成長期的技術債。直接收斂到目標架構，並在明確的驗證邊界上證明正確性。

**核心規則：**
- 最終狀態的完整性優先於過渡期的穩定性
- 當中間的損壞是有計畫、有範圍且可逆的，就可以接受

**護欄：**
- 用於有明確階段邊界的計畫性重寫與遷移
- 宣告哪裡可以接受暫時的損壞
- 遷移期間，對正在修改的區域保留高訊號的檢查
- 計畫完成時，要求完整的靜態與執行期驗證
