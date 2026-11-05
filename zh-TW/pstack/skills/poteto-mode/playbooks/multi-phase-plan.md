### Multi-phase or multi-PR plan（多階段或多 PR 計畫）

**你負責計畫，不負責程式碼。計畫是一份檢查清單，由負責人一格一格執行，操作者則根據證據稽核。** 計畫就是交付物。不要實作。

1. 當改動只有一兩個檔案、做法很明顯時，跳過計畫。說明這一點並停下。
2. 動筆前，用原型解決未決的問題。每個問題跑一次 `playbooks/prototype.md`。保留分支、SHA 和截圖，放進附錄 A。只有在沒有任何執行能解決的產品或偏好判斷時才問操作者，並給出選項（**never-block-on-the-human** 原則技能）。
3. 用 `subagent_type: "poteto-agent"` 的子代理進行探索，並依「子代理」章節明確指定模型（**guard-the-context-window** 原則技能）。依「子代理」章節，為每個子代理選擇工作需要的推理等級與快速或標準速度。每個子代理回傳檔案指標、慣例、測試指令和進入點。不要貼上大量原始內容。
4. 把下面的骨架複製到計畫檔案中，填滿每個佔位符。除非操作者指定路徑，否則把檔案寫在 agent store 的 `docs/` 底下。依顯示的順序保留每個標題和每個子區塊。每個 PR 一節。一個 PR 是一個帶有自己證據的改動（**sequence-verifiable-units** 原則技能）。在 **How to read this** 中寫明執行劇本。當執行可以合併時選 `playbooks/autopilot-full.md`；當由操作者合併 PR 時選 `playbooks/autopilot-stack.md`；常駐的計畫則用 `playbooks/orchestrate.md`。
5. 完整依 `/technical-writing` 撰寫，然後 `/unslop`。內文只用一種 Diátaxis 模式：操作指南（how-to）。附錄放解釋和參考資料。每個標題都陳述任務或發現。不用長破折號。句中不用冒號。
6. 執行 `node pstack/skills/poteto-mode/scripts/check-plan.mjs <plan.md>`，修正它印出的每一行（**encode-lessons-in-structure** 原則技能）。
7. 交回。貼出計畫路徑和腳本的輸出，然後停下。執行要等操作者明確同意後，在計畫指定的執行劇本下開始。

**驗證。** 光靠測試不足以構成驗證。只有當一個 PR 的 unit（單元）、live（即時）和 perf（效能）格子都打勾時，它才算驗證過（**prove-it-works** 原則技能）。這句話就是驗證規則，每個驗證區塊都以它開頭。即時區塊是強制的。依 **swarm** 技能，在 PR head 上用 `swarm workers` 模型（預設 `grok-4.7-xhigh-fast`）跑十條檢查線，透過真實介面的 control 技能操作它。每條檢查線是一個格子，包含一個具體情境、它儲存的截圖，以及它的通過判定式。其中一條是 **Regression lane against trunk（對主線的回歸檢查線）**。它在主線和 head 上跑同一個承重情境。如果主線沒有這個功能，這條線就記錄這個事實，並改為把關 diff 新增的行為加上使用者等待的最終狀態，而不是捏造一個主線結果。效能關卡是雙邊的：主線和 head 都必須產出指定的指標。如果主線缺少這個功能，也要把 diff 新增的工作隔離出來，為那份工作加上使用者等待的端到端狀態設定一個絕對預算。不要在不同的情境之間宣稱比率。效能區塊要寫明指標、交錯執行的探測、先量測的主線基準，以及含有失敗門檻數字的規則。改變互動的 PR 需要審查關卡：操作者在合併前於聊天中用截圖和影片審查它。沒有改變互動的 PR 寫 `**Review gate.** None. <PR id> is not review-gated.`，底下不放格子。

**Control 技能。** 依介面選擇。瀏覽器、Electron 和網頁 UI 用 `cursor-team-kit` 的 `control-ui`。CLI 和 TUI 用 `cursor-team-kit` 的 `control-cli`。原生行動裝置用 repo 中任何能操作模擬器的技能。碰到兩種介面的 PR，兩種介面都要有檢查線。沒有 control 技能的介面是附錄 C 中的風險，它的即時區塊仍要寫明每條檢查線如何操作它。

> 譯註：下面的骨架是 agent 要照抄的模板，`check-plan.mjs` 會檢查英文標題與固定句子，所以實際使用時必須用英文原版。這裡把說明文字翻成中文，標題保留英文並附上中文說明，方便理解結構。

````markdown
# <Program> plan（<計畫名稱> 計畫）

<十行以內。改了什麼、為誰而改、這個計畫要落實的規則，以及依序排列的 PR id。>

## How to read this（如何閱讀本文）

一個格子是一個工作單元。每個格子都寫明能勾選它的證據。巢狀的格子是上一個格子的子步驟。只有當證據存在時才勾選格子：一個檔案、一行 log、一張截圖、一次測試執行或一個 SHA。內文是操作指南，附錄負責解釋與記錄。

本計畫執行 `pstack/skills/poteto-mode/playbooks/<執行劇本>.md`。<由誰合併，以及哪些 PR id 屬於操作者、停在可合併狀態。>

光靠測試不足以構成驗證。只有當一個 PR 的 unit、live 和 perf 格子都打勾時，它才算驗證過。

## Program checklist（計畫檢查清單）

### Arm the program（啟動計畫）

- [ ] 向操作者說明協議和本計畫，然後停下。只有在操作者明確同意後才開始執行。
- [ ] 計畫開始時從主線讀取以下內容，每個 tick 都重新讀取。
  - [ ] `git show origin/main:pstack/skills/poteto-mode/playbooks/<執行劇本>.md`
  - [ ] `git show origin/main:pstack/skills/swarm/SKILL.md`
  - [ ] `git show origin/main:<control 技能路徑>`
  - [ ] `git show origin/main:pstack/skills/poteto-mode/playbooks/opening-a-pr.md`
  - [ ] `git show origin/main:pstack/skills/<計畫使用的其他每個子技能>`
- [ ] 操作者同意後，用下面的 tick 提示詞把稽核 tick 啟動為 `/loop 1h`。永遠不要把節奏交給記憶。
- [ ] 逐字使用這段 tick 提示詞（原文為英文，以下為中文意譯）：「從主線重新讀取執行劇本。依它稽核整個運作，並在這個 tick 中修正偏移。探查每條進行中的檢查線，只依實際效果判斷進度。讓卡住的檢查線停下，並立刻派出替代者。然後，只有當稽核發現先前狀態訊息沒有回報過的追蹤變化時——例如開了 PR、程式就緒的 head、啟動或結束了一個回合、一個判定、一次合併、一個卡住的 agent 以及採取的行動、新增或解除的阻礙，或只有操作者能做的決定——才在聊天中向操作者張貼一則簡短的狀態訊息。列出每個這樣的變化，其他都不要。不要重複表格、已合併清單或沒變的阻礙。如果稽核沒有發現任何變化，就不輸出任何回覆文字結束這個回合。無論如何，都在你的決策紀錄中記錄這個 tick 的一列，該列寫明回報了哪些項目，或寫無。」
- [ ] 操作者下令暫停或撤退時，立刻向每個負責人送出零寫入命令。

### Spawn owners（派出負責人）

- [ ] 每個 PR 派一個負責人，負責執行劇本所指定的完整生命週期。
- [ ] 遵循這張相依關係圖。只有在父 PR 合併後才開始相依的工作，或者當執行劇本使用堆疊時，以父分支為基底。
  - [ ] <PR id> 和 <PR id> 彼此獨立、最先進行。兩者都從 `main` 開分支。
  - [ ] <PR id> 在 <PR id> 之後。
- [ ] 守住檔案邊界。<PR id 或類別> 只碰 `<glob>`。
- [ ] 守住審查關卡。<PR ids> 改變了互動，合併前要等操作者在聊天中用截圖和影片審查。

### PR mechanics, for every PR（每個 PR 的操作細節）

- [ ] 決定一次代碼平台。預設用 `gh`；如果 `command -v origin` 成功、而且 Origin 能解析這個 repository，所有 PR 操作都用 `origin pr`。記錄任何改用 `gh` 的備案。永遠不要要求 `gt`。
- [ ] 依 **Opening a PR**，以 ready 狀態開 PR，永遠不用 draft。執行環境有內建 PR 工具時就用它，否則依已決定的代碼平台用 `origin pr create --status open --base <base-branch>` 或 `gh pr create --base <base-branch>`。堆疊中的子 PR 以父分支為目標。
- [ ] 在面向 PR 的推送前，跑一次 repo 的 lint 和型別檢查。推送時保持 hook 開啟。
- [ ] 每次 commit 前跑 `/deslop`，審查前跑 `/no-comments`。
- [ ] 依 `../references/bugbot-triage.md` 分類每一則 Bugbot 和安全審查留言。
- [ ] 在程式就緒報告和 babysit 之前，rebase 到目前的主線。修正回合中保持那個合併基底。只有在合併準備時、與主線發生 `git merge-tree` 衝突時、CI 失敗是來自主線上的改動時，或已知會碰到相同檔案的並行改動落地時，才再 rebase。

### Verdict and merge, for every PR（每個 PR 的判定與合併）

- [ ] 完整的 swarm 在程式就緒的 head 上跑一次。只有新行為、重新設計或大量新 diff 才再跑一次完整的 swarm。rebase、合併衝突的解決或小修正，在新 head 上由單一驗證者檢查；只改措辭則不需要。每次完整 swarm 依 `pstack/skills/swarm/SKILL.md` 執行：一條關卡檢查線；PR 的 **Verify, live** 區塊中的十條即時檢查線；它的 **Verify, perf** 區塊中的效能檢查線；兩條以上各有焦點的稽核檢查線，讀 diff 和收據、不相信 PR 內文。根代理在判定前稽核可合併報告中的收據。
- [ ] 依執行劇本的阻擋規則評判每個發現。沒有任何發現阻擋時，判定就是乾淨的。標記為 `Regression lane against trunk.` 的檢查線中，主線行為上的失敗記在主線上，不會阻擋這個 PR。新的 head 需要新的判定，除非結果在 `playbooks/shipping.md` 的 patch-id 規則下仍然有效。
- [ ] <執行劇本中的合併或交接規則，加上 `playbooks/shipping.md` 中的 patch-id 規則。>

### Boot recipe, for every live lane（每條即時檢查線的啟動步驟）

每條即時檢查線在 PR head 上，跑在自己的雲端虛擬機中。透過 `cursor-team-kit` 的 `control-ui` 或 `control-cli` 操作。

- [ ] `git fetch origin <head-branch> && git checkout <head SHA>`。
- [ ] <啟動後端和介面。等待就緒。>
- [ ] <只透過 control 技能的指令輸入。寫明唯讀的診斷方式。>
- [ ] 把每張截圖存到 `/tmp/swarm-<pr-id>/worker-<n>/<slug>.png`，並在報告中回傳路徑。

## <以動詞片語描述的任務> (<PR id>)

**Depends on（依賴）.** <PR id，或 None。>

**Files（檔案）.**

- [ ] 修改 `<path>`。
- [ ] 建立 `<path>`。
- [ ] 刪除 `<path>`。

**Build（建構）.**

- [ ] <一個改動。寫明符號和檔案。>

**You see（你會看到）.**

- [ ] <一個可觀察的結果，附上確切的 log 行或畫面狀態。>

**Verify, unit（單元驗證）.** 光靠測試不足以構成驗證。只有當一個 PR 的 unit、live 和 perf 格子都打勾時，它才算驗證過。

- [ ] <測試檔案和它新增的案例。> 執行 `<command>`。

**Verify, live（即時驗證）.** 光靠測試不足以構成驗證。只有當一個 PR 的 unit、live 和 perf 格子都打勾時，它才算驗證過。依啟動步驟，在 PR head 上用 `<swarm workers 模型>` 跑十條檢查線。

- [ ] 第 1 條。對主線的回歸檢查線（Regression lane against trunk）。在主線和 head 上跑 <同一個承重情境>。如果主線缺少這個功能，記錄這一點，並改為把關 <diff 新增的行為加上使用者等待的最終狀態>。儲存 `<slug>.png`。當 <判定式> 時通過。
- [ ] 第 2 條。<情境。> 儲存 `<slug>.png`。當 <判定式> 時通過。
- [ ] 第 3～10 條。（格式同上，每條一個情境、一張截圖、一個判定式。）

**Verify, perf（效能驗證）.** 光靠測試不足以構成驗證。只有當一個 PR 的 unit、live 和 perf 格子都打勾時，它才算驗證過。

- [ ] 指標。<在主線和 head 上都量測的東西。如果主線缺少這個功能，也寫明 diff 新增的工作以及使用者等待的端到端狀態。>
- [ ] 探測。<在主線和 head 上交錯執行的指令或程序。兩邊都必須產出這個指標。>
- [ ] 基準。先記錄主線的 <數值>。
- [ ] 規則。<head 對主線的比較，以及失敗的門檻數字。如果情境不同，改為對 diff 新增的工作和使用者可見的最終狀態設定絕對預算，而不是使用無效的比率。>

**Review gate（審查關卡）.** 操作者在合併前審查。

- [ ] 把第 <n> 條檢查線的截圖複製到 `<media path>/<pr-id>-review-<slug>.png`。
- [ ] 在一台檢查線虛擬機上錄製一段 30～60 秒的改動影片，存為 `<media path>/<pr-id>-review.mp4`。
- [ ] 在聊天中貼出截圖和影片。停在可合併狀態，等操作者按下按鈕。

**Merge（合併）.**

- [ ] 根代理在確切的 head SHA 上給出乾淨的判定。
- [ ] Bugbot 分類完成。
- [ ] 判定之後已 rebase 到目前的主線，patch-id 沒有改變。
- [ ] <負責人自己 squash-merge 它的 PR，或由根代理把它加到基底分支堆疊中，由操作者從下往上落地。>

## Close the program（結束計畫）

- [ ] 上面每個格子都已附上證據並打勾。
- [ ] 用執行劇本指定的報告格式回覆操作者。

## Appendix A. Prototype evidence（附錄 A：原型證據）

<每個由原型回答的未決問題，附上分支、SHA 和成品連結。每個仍未被證明的問題。>

## Appendix B. Alternatives rejected（附錄 B：被拒絕的替代方案）

<每個被考慮過的做法，以及它落選的原因。>

## Appendix C. Risks（附錄 C：風險）

<每個風險、它落在哪個 PR，以及負責人要注意什麼。>

## Appendix D. Links and reading list（附錄 D：連結與閱讀清單）

<修改前要讀的文件。哪些 PR 要用 `pstack/skills/how/SKILL.md` 和 `pstack/skills/interrogate/SKILL.md`。依 `pstack/skills/show-me-your-work/SKILL.md` 留下的紀錄。>
````

**回覆：** 計畫路徑、PR id 及其相依關係和需要審查關卡的集合、原型證明了什麼以及什麼仍未被證明，以及檢查腳本的輸出。
