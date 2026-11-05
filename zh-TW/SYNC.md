# 跟上官方更新

官方（[cursor/plugins](https://github.com/cursor/plugins)）修改英文檔案時，用這份流程找出哪些中文檔需要跟著改，並只翻譯改到的那幾行。

## 原理

[`sync-manifest.json`](./sync-manifest.json) 記錄了每個中文檔是根據哪一版英文翻的（每個檔案記一個 git blob 雜湊值）。工具會直接抓官方最新的 `main`，逐檔比對：

- 雜湊值不同，代表英文改過了，中文需要更新。
- 官方多了新檔、而這裡還沒有中文版，代表需要新翻。
- 官方刪掉的檔案，中文版也可以刪。

這個工具不依賴你 fork 的 `main`，所以你的個人分支不用先同步官方。中文檔都放在獨立的 `zh-TW/` 資料夾，就算之後 merge 官方的改動也不會有衝突。

## 指令

在 repo 根目錄執行：

```bash
node zh-TW/tools/sync.mjs status
```

列出需要更新、新增和已刪除的檔案。

```bash
node zh-TW/tools/sync.mjs diff
```

顯示每個過期檔案的英文改動（只有改到的行）。加上路徑可以只看一個檔，例如 `diff pstack/skills/how/SKILL.md`。

```bash
node zh-TW/tools/sync.mjs mark pstack/skills/how/SKILL.md
```

中文檔更新完之後，把它記錄為「已跟上目前的官方版本」。用 `mark --all` 可以一次記錄全部。

## 請 Claude 幫你更新

開一個新的 Claude Code 工作階段，貼上這段話就好：

```text
在 zh-TW/SYNC.md 的流程下更新中文翻譯：
1. 跑 node zh-TW/tools/sync.mjs status 和 diff。
2. 對每個過期的檔案，只把英文改到的部分翻進對應的 zh-TW 檔案，其他段落不要動。翻譯風格沿用既有的中文檔（專有名詞、指令、檔名、程式碼保留英文）。
3. 新增的英文檔就照同樣風格新翻；官方刪掉的檔案就把中文版刪掉。
4. 跑 node zh-TW/tools/sync.mjs mark --all，再跑一次 status 確認全部歸零。
5. commit 並 push 到我的翻譯分支。
```

## 對應規則

英文 `X` 的中文版在 `zh-TW/X`。例如 `pstack/skills/how/SKILL.md` 對應 `zh-TW/pstack/skills/how/SKILL.md`。唯一的例外是根目錄的 `README.md`，它對應 `zh-TW/README.md`（那份是導讀和 plugin 總表，不是逐句翻譯）。

工具只追蹤 `README.md` 和 `pstack/` 底下的 `.md`、`.yaml`、`.tsv` 檔。程式碼和 `statechart` 的測試資料不追蹤。
