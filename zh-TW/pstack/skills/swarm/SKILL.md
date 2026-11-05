---
name: swarm
description: "平行派出 N 個 worker、等它們全部完成，並回傳一份報告。用於 /swarm、「swarm this」，或平行的涵蓋檢查、競賽、關卡賽和探索。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/swarm/SKILL.md`](../../../../pstack/skills/swarm/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Swarm（蜂群）

## 開始

在啟動任何東西之前，開一份待辦清單，每個階段一項。

1. 界定
2. 分派
3. 彙整
4. 回報

## Phase A：界定（Frame）

1. 說明完成判定式，以及 swarm 必須回傳的成品或報告。
2. 選擇形狀。分成區塊、讓 N 個 worker 用相同的任務說明競賽，或兩者混合。競賽或混合形狀的話，在派遣前宣告 `first pass`（第一個通過的）、`rank all`（全部排名）或 `best-of`（取最佳）。
3. 從 `~/.cursor/rules/pstack-models.mdc` 中的 `swarm workers` 設定行選擇 worker 模型。如果規則或該行不存在，用 `grok-4.7-xhigh-fast`。如果是 `auto` 或 `inherit-parent`，省略 `model`，讓 worker 使用主模型。如果 Task 工具拒絕某個 slug，就用預設值並說明。如果它連預設值都拒絕，就從它的錯誤訊息中選同一家族最接近的有效 slug。模型競賽的話，事先寫明每一組的模型。依 **poteto-mode** 技能的「子代理」章節，為每個子代理選擇工作需要的推理等級與快速或標準速度。
4. 當 worker 會寫入時，給每個 worker 自己可寫的輸出位置。當 worker 要驗證或量測 commit 時，每份任務說明都要寫明確切的 SHA。量測類的任務說明還要寫明方法（樣本數、一個樣本是什麼、順序）。worker 在結果中記錄這兩者。

## Phase B：分派（Fan out）

在同一則訊息中派出全部 N 個 worker，使用 `subagent_type: generalPurpose`、`environment: "cloud"`、`run_in_background: true`，以及第 3 步的模型（`auto` 或 `inherit-parent` 時不設定）。只有當 worker 需要存取使用者電腦上的東西時，才用 `environment: "local"`。

當 worker 必須從一個非預設的已推送分支開始時，傳入 `cloud_base_branch`。

每份任務說明都要能獨立成立。包含目標、範圍、確切的區塊或競賽組別、如何驗證，以及要回報什麼。報告使用 `PASS`、`ISSUES` 或 `BLOCKED` 並附上證據。能證明缺陷的 worker 回報 `ISSUES`，並列出它能證明的每個問題，而不只是第一個。

如果某個 worker 掉隊了，就以 N-1 繼續並註明。

## Phase C：彙整（Aggregate）

讀取最終結果。沒有記錄任務說明所指定的 SHA 和方法的結果要丟掉，並重新派出那個 worker 一次。第二次仍然沒有時，記錄為缺口。缺口不算通過。涵蓋檢查的話，每個必要的區塊都需要一個結果。競賽的話，套用事先宣告的選擇規則：first pass、rank all 或 best-of。不要貼上 worker 的原始輸出。

## Phase D：回報（Report）

在聊天中回傳一份整合報告，包含結果表、每個問題一行說明、缺口或掉隊者，以及使用的競賽規則（如果有的話）。
