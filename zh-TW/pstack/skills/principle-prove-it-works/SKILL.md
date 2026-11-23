---
name: principle-prove-it-works
description: "在完成任務後、宣告完成前套用。對真實成品驗證（實際執行功能、讀出實際數值、檢查 diff），而不是用替代指標、自我回報或「它能編譯」。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-prove-it-works/SKILL.md`](../../../../pstack/skills/principle-prove-it-works/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Prove It Works（證明它能用）

直接檢查真實的東西來驗證每個輸出：實際執行功能、讀出實際的數值、檢查 diff。替代指標（檔案修改時間、自我回報、快取的輸出、「它能編譯」）都不算數。檢查失敗時，先懷疑觀察的方法，再懷疑系統。

能的話，把檢查寫成腳本。一個能重跑比較的確定性腳本，勝過一次性的目測。把它的輸出放在人類看得到的地方，只有在之後需要可稽核的紀錄時才提交它。
