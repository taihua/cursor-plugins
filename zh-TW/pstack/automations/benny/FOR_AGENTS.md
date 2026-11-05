# benny automation intent（benny 自動化的意圖）

> 本文為 [`pstack/automations/benny/FOR_AGENTS.md`](../../../../pstack/automations/benny/FOR_AGENTS.md) 的繁體中文翻譯，僅供閱讀理解。實際設定時請讓 agent 讀英文原檔。

## 我想自動化什麼

我想要兩個在同一個 Slack 問題回報頻道中協同運作的 Cursor 自動化。

### 自動化 1：分類問題回報

- 觸發：當有人在我設定的來源 Slack 頻道中貼出一則新的頂層回報時，我希望這個自動化針對那則回報啟動，並保留它原本的討論串座標。
- 行為：我希望它讀討論串和附件，把回報分類為 bug 或效能問題、功能請求、問題或回饋，或轉介，並在導向之前追溯最可能負責的那一層。
- 追蹤系統：我希望它在我設定的追蹤系統中搜尋重複項目，更新一個有把握的重複項目，並且只為明確全新的 bug 建立工單。
- 工具：我需要 Slack 討論串的讀取與回覆權限、我設定的追蹤系統整合，以及我選用的導向地圖。
- 結果：我希望在來源討論串中恰好有一則回覆，內容是簡短的判定，加上 `[benny:bug]`、`[benny:performance]` 或 `[benny:other]`。bug 或效能標記可以附上追蹤系統的網址。
- 界線：我永遠不希望這個自動化在來源頻道中發一則根訊息（新的頂層訊息）。

### 自動化 2：重現並修正確認過的 bug

- 觸發：我希望這個自動化從同一則新的頂層回報，或設定時選擇的其他支援的觸發方式啟動，然後在原本的討論串中等待可信的分類標記。
- 關卡：當有人明確負責修正時，我希望它停下。如果既有的 PR 或已合併的 commit 可能修好了這份回報，我要的是驗證，而不是一個互相競爭的改動。
- 行為：我希望它使用我設定的 control 轉接器和功能地圖，透過真實的 UI 重現確切的症狀兩次，並擷取截圖、影片，以及一次唯讀的狀態交叉檢查。
- 修正：我希望它驗證既有的 PR，而不是覆寫它們。在確認重現之後，它可以嘗試一次有範圍限制的根本原因修正、在測試便宜時使用 tdd、對影響範圍做冒煙測試，並且只有在前後對照的證據通過時才開一個草稿 PR。
- 工具：我需要 Slack 討論串的讀取與回覆權限、repository 與歷史的存取權限、建立草稿 PR 的權限、我設定的追蹤系統，以及我的 control 轉接器。
- 結果：我希望在來源討論串或選用的維運討論串中看到證據和經驗證的結果，以及一個選用的草稿 PR。更新應該簡潔。
- 界線：我永遠不希望這個自動化在來源頻道中發一則根訊息。

### 共用規則

- 我希望來源頻道和根討論串的座標在整個執行過程中保持不變。
- 我把工具和除錯用的機器人當作證據，而不是委派或修正的負責人。
- 我允許子代理幫忙，但它們不能貼文到 Slack，也不能拿到 Slack 的憑證。
- 我希望這整個套件被提交到目標 repository 的 `.cursor/automations/benny/`。它的 `SKILL.md` 檔案是直接的自動化指示，而不是註冊的 plugin 技能。
- 我希望只透過目標 repository 已提交的 `.cursor/settings.json` 啟用 pstack，而且只為了共用的相依技能，例如 `how`、`why`、`tdd`、`unslop` 和需要的原則技能。
- 我希望每個上線的自動化提示詞都直接讀它已提交的運作檔案。我不要 plugin 快取路徑、複製的摘錄或斜線技能的探索。
- 我把使用者擁有的設定、功能地圖、導向地圖和機密放在 `.cursor/automations/benny/` 之外，讓套件更新時不會覆寫它們。
- 當頻道座標、追蹤系統存取權、control 轉接器或功能地圖缺少或不確定時，我希望兩個自動化都「安全地失敗」（fail closed，停下而不是繼續）。
- 我只要草稿 PR。不要合併或部署。

### 我的設定

- 來源 Slack 頻道：`<channel>`
- 選用的維運頻道：`<channel or none>`
- repository 和預設分支：`<repo>`、`<branch>`
- 追蹤系統：`<類型、團隊、專案、標籤、收件狀態>`
- 導向地圖：`<路徑或 none>`
- 分類身分：`<Slack 身分>`
- control 技能：`<設定的技能或轉接器>`
- 功能地圖：`<在被複製的套件之外、已提交到同一 repo 的路徑，或要改寫描述的行為>`
- 模型：`<分類、重現、程式碼、媒體審查>`
- 狀態 emoji 字串：`<已看到、重現中、已重現、受阻、修正中、失敗、已開 PR>`
- 預算：`<輪詢、判定等待、後續追蹤、重現、拒絕、修正>`
- 選用的 bot token 能力：`<無、檔案下載，或可編輯的維運狀態>`

從 [`configuration.example.yaml`](./templates/configuration.example.yaml) 和 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md) 開始。把它們複製到這個套件之外並填好，例如放在 `.cursor/benny/` 底下。把機密值放在機密管理器或環境變數中。

## 給 agent

人類是透過讓 Cursor 讀這個檔案來進入設定的。不要去找或呼叫一個被探索到的 benny 斜線技能。

1. 詢問哪個 repository 要執行這些自動化。
2. 把包含這個 `FOR_AGENTS.md` 的資料夾當作來源套件。
3. 把整個來源套件合併到 `<target-repository>/.cursor/automations/benny/`。
4. 保留每個只存在於目的地的檔案。永遠不要刪除無關的檔案，或覆寫使用者擁有的設定、功能地圖或導向地圖。
5. 當目的地中某個由來源管理的路徑上的既有檔案不同時，審查 diff 並合併，不要丟掉本地的修改。如果所有權不明確，在取代它之前停下來詢問。
6. 確認被複製的 `FOR_AGENTS.md` 和 `skills/setup-benny/SKILL.md` 存在於目標 repository 中。
7. 直接從目標 repository 讀取並遵循 `.cursor/automations/benny/skills/setup-benny/SKILL.md`。

我希望你把這個項目合併到目標 repository 的 `.cursor/settings.json`：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

保留每個無關的設定和 plugin。當既有檔案使用 jsonc 時，保留註解和有效的 jsonc 語法。

我要由一個以目標 repository 為根目錄的全新 agent 來驗證。確認 pstack 的 `how`、`why`、`tdd`、`unslop` 以及 benny 使用的原則技能，在專案範圍內都能解析。不要把從目前工作階段或使用者範圍安裝載入的技能算進去。

如果專案範圍的 plugin 無法使用，或任何共用相依無法解析，停下並說明什麼失敗了。不要把 `.cursor/automations/benny/skills/` 加到 plugin manifest 中，也不要期待它的檔案出現在斜線技能清單中。

告訴我：在啟用任一個自動化之前，必須提交 `.cursor/settings.json`、`.cursor/automations/benny/` 以及任何被引用、不含機密的設定。在我明確要求之前，不要建立或更新任何自動化。

第一次建立時，用內建的 `/automate` 為分類建立一次、為重現與修正建立一次。在開始第二個之前，先完成第一個自動化的草稿審查、核准、就緒檢查，以及 Automations 編輯器的交接。

把這份意圖和完成的設定改寫進每份草稿。分類提示詞必須讀並遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。重現提示詞必須讀並遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。只有在 `/automate` 確認這些 repo 相對路徑已提交到自動化要執行的 repository 之後，才使用它們。

對於既有的自動化，不要用 `/automate` 檢查或更新它們。驗證設定，然後使用被複製的設定檔中簡潔的欄位檢查清單，讓我可以直接在各自的編輯器中修改每個自動化。不要建立重複的。
