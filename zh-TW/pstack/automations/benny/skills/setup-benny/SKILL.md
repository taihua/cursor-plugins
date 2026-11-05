---
name: setup-benny
description: 設定 Benny，並準備它的分類與重現自動化。在安裝 Benny，或修改它的 Slack、追蹤系統、repository、導向、control、模型或預算設定時使用。
disable-model-invocation: true
---

> 本文為 [`pstack/automations/benny/skills/setup-benny/SKILL.md`](../../../../../../pstack/automations/benny/skills/setup-benny/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Set up Benny（設定 Benny）

Benny 是 pstack 內部一個預設不啟用的自動化套件。plugin manifest 只公開 pstack 一般的技能根目錄；這個檔案和兩個運作檔案都不是斜線指令技能。

人類是透過讓 Cursor 讀套件的 `FOR_AGENTS.md` 來進入設定的。引導流程會把整個套件複製到目標 repository，然後直接讀取位於 `.cursor/automations/benny/skills/setup-benny/SKILL.md` 的這個檔案。

Benny 需要外部設定和兩個上線的 Cursor 自動化。

在使用者明確要求之前，不要建立或更新任何自動化。永遠不要把機密值放進 plugin 檔案、提示詞或已提交的設定中。

## 1. 複製套件並啟用共用的 pstack 技能

在詢問 Benny 設定之前、以及在呼叫內建的 `/automate` 技能之前，先做這一步。

詢問哪個 repository 要執行這些自動化。來源套件是包含 `FOR_AGENTS.md` 的資料夾。目的地是 `<target-repository>/.cursor/automations/benny/`。

把整個來源套件合併到目的地：

1. 目的地不存在時就建立它。
2. 把每個來源檔案複製到相同的相對路徑。
3. 保留只存在於目的地的檔案。安裝或更新時永遠不要刪除無關的檔案。
4. 把使用者擁有的設定、功能地圖和導向地圖放在目的地之外。永遠不要覆寫它們。
5. 當一個既有的、由來源管理的檔案不同時，檢查 diff 並合併，不要丟掉本地的修改。如果所有權不明確，在取代它之前停下來詢問。
6. 確認目的地包含 `FOR_AGENTS.md`、這個設定檔、兩個運作檔案、它們的參考資料，以及模板。

如果這個檔案已經是從目標目的地讀取的，就把複製視為完成，並在繼續之前執行同樣的驗證。

把 pstack 加到目標 repository 的 `.cursor/settings.json`。如果檔案或 `.cursor` 資料夾不存在，就建立它。

把這個項目合併到既有的 JSON 或 JSONC 中：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

保留每個無關的頂層設定和其他每個 plugin 項目。如果 `plugins.pstack` 已經存在，只修改它的 `enabled` 值。當檔案使用 JSONC 時，保留註解和有效的 JSONC 語法。修改後驗證檔案。

重新載入目標專案，或開一個以它為根目錄的全新 agent。確認這些共用的 pstack 技能能從專案範圍解析：

- `how`
- `why`
- `tdd`
- `unslop`
- `principle-separate-before-serializing-shared-state`
- `principle-minimize-reader-load`
- `principle-guard-the-context-window`
- `principle-sequence-verifiable-units`
- `principle-fix-root-causes`
- `principle-prove-it-works`

不要把從目前工作階段或使用者範圍 plugin 載入的技能算進去。這個檢查必須顯示，目標 repository 中的全新 agent 是透過專案設定取得 pstack 的。

如果無法進行專案範圍的 plugin 安裝，或任何共用相依無法解析，停下並說明失敗原因。

Benny 的檔案是直接從 `.cursor/automations/benny/` 讀取的。不要把那個資料夾加到 plugin manifest，也不要期待它的 `SKILL.md` 檔案出現在斜線技能清單中。

告訴使用者：在啟用任一個自動化之前，必須提交 `.cursor/settings.json`、`.cursor/automations/benny/` 以及任何被引用、不含機密的設定。除非使用者要求，否則不要替他們提交。

一旦這個檢查通過，上線的自動化提示詞就可以透過穩定的 repository 相對路徑讀取已提交的運作檔案。它們不能嵌入 plugin 快取路徑或複製檔案內容。

## 2. 改編設定

打開這些被複製的範例：

- `../../templates/configuration.example.yaml`
- `../reproduce-and-fix-issues/references/feature-map.example.md`

在 `.cursor/automations/benny/` 之外建立使用者擁有的副本。這些是設定檔，不是套件檔案。範例位置：

- 專案設定，例如 `.cursor/benny/configuration.yaml`
- 專案功能地圖，例如 `.cursor/benny/feature-map.md`
- 專案導向地圖，例如 `.cursor/benny/routing.md`
- 使用者設定，例如 `~/.config/benny/configuration.yaml`
- 使用者功能地圖，例如 `~/.config/benny/feature-map.md`

為自動化可能重現的每個面向使用者的功能，填寫一個功能地圖章節。保持使用者的視角。不要把實作細節或目前的程式路徑凍結在地圖中。

不要修改被複製的範例。套件更新可能會在審查衝突後更新由來源管理的檔案，但永遠不能碰使用者擁有的副本。

當全新的自動化 checkout 必須讀取它們時，偏好目標 repository 中已提交、不含機密的檔案。否則把需要的值改寫進上線的提示詞中。只有在內建的 `/automate` 技能確認某個 repository 檔案已提交到自動化執行的 repository 之後，才引用它。

對已提交的套件和設定檔使用穩定的 repository 相對路徑。永遠不要從上線的自動化引用 plugin 原始碼資料夾或 plugin 快取路徑。

## 3. 填入必要的選擇

詢問或確認：

- 來源 Slack 頻道 ID
- 選用的維運或狀態頻道 ID
- Repository 網址和預設分支
- 分類身分或 Slack 使用者 ID
- 議題追蹤系統的類型、團隊、專案、標籤和收件狀態
- 追蹤系統轉接器技能或 MCP 動作
- 選用的導向地圖路徑
- 必要的 control 技能名稱
- 必要的面向使用者功能地圖路徑
- 狀態 emoji 字串
- PR 網址格式
- 輪詢和工作量預算
- 分類、重現、程式碼工作和媒體審查的模型 slug

只使用使用者的 Cursor 模型選擇器或支援模型清單中顯示為可用的模型 slug。不要猜測 slug，也不要沿用私有的預設值。

來源頻道、分類身分、repository、追蹤系統轉接器、control 技能和功能地圖都必須明確。如果任何必要的值仍然有歧義，就讓設定失敗。

在儲存之前，對最終的自動化名稱、描述和提示詞墊片使用 pstack 的 `unslop` 技能。

## 4. 檢查整合能力

分類自動化需要：

- 對設定的來源 Slack 頻道及其討論串的讀取權限
- 在該頻道中回覆討論串的權限
- 當回報包含媒體時，附件 metadata 和檔案下載權限
- 透過設定的議題追蹤系統轉接器進行搜尋、讀取、建立和更新的權限

重現自動化需要：

- 對來源討論串的讀取權限
- 在來源頻道中回覆討論串的權限
- 選用的、在設定的維運頻道中貼文和編輯的權限
- Repository 讀取和歷史存取權限
- 一個能開草稿 PR 的 PR 動作
- 設定的 control 轉接器技能

讀取和貼文偏好使用設定的 Cursor Slack 動作。選用的 `BENNY_SLACK_BOT_TOKEN` 可以填補狹窄的缺口，例如編輯一則維運狀態訊息或下載附件。把值存在機密管理器或環境變數中，而不是 YAML 中。

不要使用未公開的整合端點。

## 5. 準備導向地圖

如果使用者想要轉介或通知負責人：

1. 把 `../triage-issue-reports/references/routing.example.md` 複製到 `.cursor/automations/benny/` 之外。
2. 把每個佔位符換成公開的或組織內部的值。
3. 預設關閉通知負責人。
4. 只允許通知設定的功能負責人，或確認很可能造成退步的作者。

如果沒有設定導向地圖，分類可以為回報分類，但不能猜測目的地或負責人。

## 6. 驗證 control 轉接器

讀 `../reproduce-and-fix-issues/references/control-adapter.md` 和使用者完成的功能地圖。

確認被指名的技能能夠：

- 啟動目標 app
- 透過真實的 UI 瀏覽每個地圖上的功能
- 透過宣告的轉接器動作操作地圖上的狀態
- 在不強制結果的情況下檢查狀態
- 擷取截圖
- 開始和停止錄影
- 清理它的程序和暫存資料

如果缺少任何能力，就讓重現自動化保持停用。它必須安全地失敗，而不是宣稱一次它沒有實際執行的重現。

## 7. 準備上線的自動化

詢問這是第一次建立，還是設定既有的自動化。

兩種情況都從被複製的套件中讀 `../../FOR_AGENTS.md`，作為使用者意圖的主要來源。用它來了解兩個觸發方式、工具、指示、結果和共用規則。

### 第一次建立

一次建立一個自動化。

對每個自動化：

1. 讀對應的被複製提示詞模板，作為次要的內部原始材料。
2. 把 `FOR_AGENTS.md`、完成的 Benny 設定和模板的意圖，轉成一份完整的自然語言請求。
3. 告訴上線的提示詞去讀並遵循它在 `.cursor/automations/benny/` 底下確切的、已提交的運作檔案。
4. 使用穩定的 repository 相對路徑，而不是 plugin 原始碼或快取路徑。不要把運作檔案的內容複製到上線的提示詞中。
5. 讀並遵循內建的 `automate` 技能。
6. 讓 `automate` 探索 Slack 頻道、repository 和已連接的整合。
7. 讓 `automate` 確認被複製的套件和任何被引用的設定檔，已提交到自動化將會執行的同一個 repository 中。
8. 讓 `automate` 顯示它的草稿表格、取得核准、詢問就緒狀態，並打開 Automations 編輯器。
9. 在開始下一個之前，完成這個自動化的編輯器交接。

依設定填好後，給 `automate` 這份完整的分類意圖：

- 名稱 `benny-triage`。
- 每次執行都讀並遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。
- 在設定的來源 Slack 頻道中，每則新的頂層回報都觸發。
- 讀取觸發的討論串，只在其中回覆。
- 使用設定的議題追蹤系統整合。
- 分類、檢查證據、追溯原因、去重，並且只建立明確的新 bug。
- 以一則只在討論串中的判定結束，附上設定的 `[benny:bug]`、`[benny:performance]` 或 `[benny:other]` 標記，以及選用的追蹤系統網址。
- 永遠不要在來源頻道中發根訊息。

分類的編輯器交接完成後，給 `automate` 這份完整的重現與修正意圖：

- 名稱 `benny-reproduce`。
- 每次執行都讀並遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。
- 在設定的來源 Slack 頻道中，對同樣的新頂層回報觸發。
- 使用設定的 repository 和預設分支。
- 讀取來源討論串，只在其中回覆。
- 包含建立 PR 的能力，以及設定的追蹤系統、control 轉接器和功能地圖需求。除非 `automate` 確認同一個 repository 中有符合條件的已提交檔案，否則改寫地圖上的使用者路徑和狀態。
- 在行動之前等待可信的分類標記。
- 透過地圖上的真實 UI 重現確切的症狀兩次，並擷取證據。
- 驗證既有的修正，而不是覆寫它。
- 只有在確認重現之後才嘗試一次選用的、有範圍限制的修正，然後在證據和檢查都通過時開一個草稿 PR。
- 永遠不要在來源頻道中發根訊息。

不要重複 `automate` 的 Slack、repository、整合、完整性、認證、草稿審查、核准、就緒或編輯器交接工作。

### 既有的自動化

內建的 `automate` 技能只用於建立。不要用它來搜尋、檢查或更新既有的自動化。

完成設定、導向、control 轉接器和功能地圖的驗證。然後給使用者這份簡潔的編輯器檢查清單。

對既有的分類自動化，更新：

- 名稱和描述
- 讀取 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md` 的直接指示
- 新頂層 Slack 回報的觸發方式和來源頻道
- Slack 討論串的讀取和回覆能力
- 議題追蹤系統整合
- 改寫過的分類指示、只在討論串中回覆的規則，以及 Benny 判定標記

對既有的重現自動化，更新：

- 名稱和描述
- 讀取 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md` 的直接指示
- 對應的 Slack 觸發方式和來源頻道
- Repository 和預設分支
- Slack 討論串的讀取和回覆能力
- PR 動作
- 追蹤系統、control 轉接器和功能地圖需求
- 改寫過的標記等待、證據、驗證和有範圍限制的修正指示

請使用者直接在各自的 Automations 編輯器中更新每個既有的自動化。不要建立替代品或重複的自動化。

### 建立的界線

永遠不要直接呼叫自動化後端服務或後端自動化工具。永遠不要使用帶有草稿欄位的瀏覽器網址。永遠不要建立或打開 Cursor 協議的深層連結。對於新的自動化，唯一的完成路徑是內建 `automate` 技能經過審查的 Automations 編輯器交接。

在編輯器儲存後、討論串安全測試通過之前，不要啟用任一個自動化。

## 8. 測試討論串安全

使用一個測試頻道或一則無害的測試回報。

測試之前，確認目標 repository 的 `.cursor/settings.json`、`.cursor/automations/benny/` 以及每個被引用、不含機密的設定檔，都已提交到自動化 checkout 使用的分支上。確認兩個上線的提示詞都指向它們確切的、已提交的運作檔案。如果任何檢查失敗，就停下。告訴使用者自動化還不能啟用。

驗證：

1. 分類儲存了根 `thread_ts`，並以回覆的形式恰好張貼一則判定。
2. 判定包含一個設定的標記。
3. 重現只接受來自設定的分類身分的標記。
4. 重現保持同樣不可變的來源座標。
5. 沒有出現任何來源頻道的根訊息。
6. 被委派的 worker 無法使用任何 Slack 寫入動作。
7. 缺少座標、父訊息被刪除，或預檢失敗時，不會產生任何貼文和追蹤系統議題。

只有在七項檢查全部通過後，才開放正常流量。
