# benny

> 本文為 [`pstack/automations/benny/README.md`](../../../../pstack/automations/benny/README.md) 的繁體中文翻譯，僅供閱讀理解。

benny 提供兩個處理 Slack 問題回報的 Cursor 自動化。一個負責分類每份回報。另一個負責重現確認過的 bug，並可能準備一個小的草稿修正。

這個資料夾中的檔案是預設不啟用的設定與自動化原始檔。它們不會出現為斜線指令技能。

## 設定方式

1. 讓 Cursor 讀 [`FOR_AGENTS.md`](./FOR_AGENTS.md)，並指定目標 repository。
2. 讓設定流程把整個資料夾合併到目標的 `.cursor/automations/benny/`。它必須保留只存在於目的地的檔案，並審查衝突，而不是覆寫本地的修改。
3. 讓設定流程在目標 repository 的 `.cursor/settings.json` 中啟用 pstack，以使用共用的相依技能：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

4. 把使用者擁有的設定放在被複製的套件之外，例如 `.cursor/benny/`。改編 [`configuration.example.yaml`](../../../../pstack/automations/benny/templates/configuration.example.yaml) 和 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md)。
5. 在啟用任一個自動化之前，提交 `.cursor/settings.json`、`.cursor/automations/benny/`，以及任何不含機密的設定。
6. 審查每份新的自動化草稿，或在編輯器中更新既有的自動化。然後送出一份無害的測試回報，並確認每則來源頻道中的貼文都留在原本的討論串中。
