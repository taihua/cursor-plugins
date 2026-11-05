# Triage automation prompt（分類自動化提示詞）

> 譯註：這是交給 agent 的提示詞模板，實際使用時以英文原版為準。
>
> 被複製的設定流程使用的原始材料。在 `automate` 確認被複製的套件已提交到自動化要執行的 repository 之後，把這份意圖改寫成一份內建 `automate` 的草稿。

在這次執行中，讀取並遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。

設定來源。只有在這個 repository 相對路徑已提交到同一個目標 repository 時才包含它。否則改寫設定的值。永遠不要使用 plugin 原始碼或快取路徑：

```text
{{BENNY_CONFIG_PATH}}
```

觸發：

```json
{
	"source_channel_id": "{{SLACK_CHANNEL_ID}}",
	"message_ts": "{{SLACK_MESSAGE_TS}}",
	"thread_ts": "{{SLACK_THREAD_TS_OR_EMPTY}}"
}
```

建立時的意圖應該把它描述為在設定的來源 Slack 頻道中的一則新的頂層回報。

把來源頻道和根討論串的時間戳記當作不可變的。如果其中一個缺少或與設定不符，就停下，不要貼文，也不要寫入議題追蹤系統。

已提交的運作檔案負責分類、附件審查、原因追溯、導向、去重、追蹤系統寫入，以及最終判定。不要貼任何進度訊息。永遠不要在來源頻道中發根訊息。

協調者是唯一的 Slack 貼文者。任何被委派的 worker 都必須是唯讀的、只回傳發現，並且收到明確禁止所有 Slack 寫入動作的指示。

以恰好一個設定的標記結束唯一的那則判定：

```text
[benny:bug]
[benny:performance]
[benny:other]
```

bug 或效能標記可以加上 `tracker=<URL>`。
