---
name: how
description: "用於「X 怎麼運作」、修改前的程式碼導覽，以及關於位置 / 所有權 / 分層的問題（「這該放在哪裡」、「哪個套件擁有這個」、「這是正確的層嗎」）。解釋子系統架構、執行流程、上手用的心智模型。動機相關的問題用 why。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/how/SKILL.md`](../../../../pstack/skills/how/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# How（怎麼運作）

探索程式碼庫來回答「X 怎麼運作？」的問題。以資深工程師帶人上手某個子系統的程度產出架構解釋：足以建立一個可用的心智模型，但不要多到讀起來像加了註解的原始碼。

每次派遣都是一個 Task 子代理，使用 `subagent_type: generalPurpose` 和 `readonly: true`。探索者使用 `pstack-models.mdc` 規則中的 `how explorer` 設定行（預設 `grok-4.7-xhigh-fast`），每個解說者使用 `how explainer` 設定行（預設 `claude-opus-5-5-xhigh`）。把 `model` 設為該行的值；如果規則或該行不存在，就設為預設值。當值是 `auto` 或 `inherit-parent` 時，不設定 `model`。如果 Task 工具拒絕某個 slug，就用預設值並說明。如果它連預設值都拒絕，就從它的錯誤訊息中選同一家族最接近的有效 slug。依 **poteto-mode** 技能的「子代理」章節，為每個子代理選擇工作需要的推理等級與快速或標準速度。

## 1. 評估複雜度

如果範圍有歧義，說明你的解讀並開始探索。使用者可以再調整方向。

- **簡單**（單一模組、小工具、範圍很窄的問題，例如「函式 X 怎麼運作」）：不派探索者。派一個解說者一次完成探索和解釋，用 `references/explainer-prompt.md` 建構提示詞，但不含探索者發現的章節。跳到第 4 步。
- **複雜**（跨越多個檔案或服務的子系統、跨領域的功能、完整的架構概覽）：到第 2 步。

有疑慮時，走簡單的路。

## 2. 探索（僅複雜情況）

把問題拆成 2～4 個角度，每個是子系統中不同的一塊。在同一則訊息中派出所有探索者，每個都用 `references/explorer-prompt.md` 並填入它的角度。

## 3. 綜合（僅複雜情況）

所有探索者都回報後，派一個解說者，用 `references/explainer-prompt.md` 並填入每個探索者的發現。

## 4. 呈現

呈現解說者的輸出。為了清楚或補上對話中的脈絡而做輕微的修改沒問題，但不要大幅改寫。

## 輸出格式

解釋使用 `references/explainer-prompt.md` 中定義的章節，不適用的就拿掉：Overview（概覽）、Key Concepts（關鍵概念）、How It Works（運作方式）、Where Things Live（程式碼位置）、Gotchas（陷阱）。
