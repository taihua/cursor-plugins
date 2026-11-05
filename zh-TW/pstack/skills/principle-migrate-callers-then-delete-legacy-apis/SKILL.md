---
name: principle-migrate-callers-then-delete-legacy-apis
description: "在舊呼叫端仍存在時引入新的內部 API 時套用。在同一波中遷移呼叫端並刪除舊 API，而不是保留相容層。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md`](../../../../pstack/skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Migrate Callers Then Delete Legacy APIs（遷移呼叫端後刪除舊 API）

- 更新測試以斷言新的契約，並刪除只是在保護重構前實作細節的測試

**適用時機：**
- 沒有外部使用者依賴向後相容性
- 專案能承受協調好的破壞性改動
- 新 API 是某個簡化或重構計畫的一部分

> 譯註：原檔內文就是這麼短，主要規則寫在上方的 description 中。
