# Code Archaeology（程式碼考古：git + repo 內部）

## 這個來源包含什麼

- commit 歷史（訊息、日期、作者、diff）
- PR 描述、審查留言和討論串（透過 `gh`）
- 行內程式碼註解、TODO、FIXME、棄用說明
- ADR（架構決策紀錄），如果 repo 有保存的話
- 測試，它們的名稱和斷言常常編碼了促成某次改動的邊界情況
- 在同一個 commit 中被修改的相關檔案（共同變動訊號）
- repo 中的 CHANGELOG 項目和版本說明
- commit 訊息和 PR 內文中的議題/工單 ID

最值得信賴的來源，直接與程式碼綁定，而且最完整。所有經過 repo 的東西都應該在這裡。

## 如何搜尋

擴展種子 commit 清單：

```bash
# 跨越改名的歷史
git log --follow --oneline -- <file>

# Pickaxe：新增或移除這段確切文字的 commit
git log -S '<exact_string_from_code>' -- <file>

# 或用模式：
git log -G '<regex>' -- <file>

# 每一行是誰在什麼時候寫的
git blame -L <start>,<end> <file>

# 單一 commit 的完整 diff
git show <hash>

# 兩點之間影響這個檔案的 commit
git log <old>..<new> -p -- <file>
```

尋找 repo 之外的文件：

```bash
# ADR 常放在 docs/adr/ 或類似的地方
rg -l -i 'architecture.decision' --glob '*.md'

# 目標附近的 TODO 和 FIXME
rg -n -C2 '(TODO|FIXME|HACK|XXX|NOTE)' <target_file>

# 相關的測試
rg -l '<symbol>' --glob '*test*'
```
