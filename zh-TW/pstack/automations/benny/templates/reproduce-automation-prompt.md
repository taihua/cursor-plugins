# Reproduce automation prompt（重現自動化提示詞）

> 譯註：這是交給 agent 的提示詞模板，實際使用時以英文原版為準。
>
> 被複製的設定流程使用的原始材料。在 `automate` 確認被複製的套件已提交到自動化要執行的 repository 之後，把這份意圖改寫成一份內建 `automate` 的草稿。

在這次執行中，讀取並遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。

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

建立時的意圖應該把它描述為在設定的來源 Slack 頻道中的一則新的頂層回報。它應該包含設定的 repository、預設分支、議題追蹤系統、control 轉接器、功能地圖，以及建立草稿 PR 的能力。

把來源頻道和根討論串的時間戳記當作不可變的。如果其中一個缺少或與設定不符，就停下，不要貼文。

在這個確切的討論串中，等待來自設定的分類身分、設定的分類標記。只有在 `[benny:bug]` 或 `[benny:performance]` 時才繼續。

在嘗試重現之前，要求設定的 control 轉接器技能。透過真實的 UI 重現那個確切、具辨識性的症狀兩次。驗證既有的 PR 或 commit，而不是覆寫它們。只有在確認重現、並通過運作檔案中的修正關卡之後，才嘗試有範圍限制的修正。

協調者是唯一的 Slack 貼文者。每個子代理的提示詞都必須禁止 `SendSlackMessage`、`PostToSlack`、`chat.postMessage` 以及所有其他 Slack 寫入。子代理只回傳發現。

永遠不要在來源頻道中發根訊息。
