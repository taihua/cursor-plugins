# 建構變更並清理 diff

所有建構類劇本都遵守同一個紀律：說出你觀察到什麼，讓劇本去要求證據。這一頁示範每種常見建構任務的提示詞該寫什麼，接著是讓 diff 保持好審查的清理習慣。

## 用你知道的事情來下各劇本的提示詞

修 bug 的提示詞：說出症狀，並要求先重現：

```text
/poteto-mode 這個指令在重試後會輸出兩筆紀錄。先重現，再修好並驗證。
```

新功能的提示詞：說出行為，以及什麼**不能**改變：

```text
/poteto-mode 加一個 --json 選項。文字輸出要一個位元組都不變。兩種格式都要驗證。
```

重構的提示詞：在搬動結構之前，先把行為固定下來：

```text
/poteto-mode 把解析邏輯搬到同一個模組，行為零改變。先記錄目前的輸出，搬完後證明輸出沒變。
```

效能的提示詞：說出量測數據，而不是感覺：

```text
/poteto-mode 在這份測試資料上啟動要 1.8 秒。追蹤它、修掉量測到的原因，給我看修正前後的數字。
```

這些都會導向各自的劇本（[修 bug](../../../pstack/skills/poteto-mode/playbooks/bug-fix.md)、[新功能](../../../pstack/skills/poteto-mode/playbooks/feature.md)、[重構](../../../pstack/skills/poteto-mode/playbooks/refactoring.md)、[效能問題](../../../pstack/skills/poteto-mode/playbooks/perf-issue.md)），劇本會補上你沒打出來的步驟：修之前先重現、實作前先命名資料結構、重構前先固定行為、優化前先做效能分析。

想持續改善某一個數字，用[爬坡優化劇本](../../../pstack/skills/poteto-mode/playbooks/hillclimb.md)。給它指標、目標，和最少嘗試次數，它會用一套凍結的量測工具，一次一個假設地反覆迴圈。有進步就保留，其他全部還原。

兩個效能劇本都會對它們的數字跑 [`/benchmark-checklist`](../../../pstack/skills/benchmark-checklist/SKILL.md)。效能問題劇本會檢驗基準值和之後的每個數字；爬坡優化劇本會在凍結量測工具之前先檢驗它。[驗證並出貨](./06-verify-and-ship.md#用-benchmark-checklist-檢驗量測數字) 會說明什麼時候該自己輸入它。

有時你想在修正之前先知道原因。對於正在發生的症狀，例如記憶體洩漏、閒置時 CPU 空轉或畫面異常，[執行期鑑識劇本](../../../pstack/skills/poteto-mode/playbooks/runtime-forensics.md) 會對執行中的程序埋點量測。對於你已經擷取的效能分析檔，[追蹤檔鑑識劇本](../../../pstack/skills/poteto-mode/playbooks/trace-forensics.md) 會讀那個檔案，並把最耗時的堆疊對應回原始碼。兩者都只回傳**診斷**，不做修正：

```text
/poteto-mode 這是啟動很慢時擷取的 cpuprofile。告訴我時間花在哪裡、是哪幾行原始碼造成的。先不要修。
```

## 用 `/tdd` 先寫會失敗的測試

當一個 bug 有便宜的本機測試路徑時，整個提示詞可以只有兩個字：

```text
/tdd 實作
```

在有脈絡的情況下，這就夠了。[`/tdd`](../../../pstack/skills/tdd/SKILL.md) 會寫出「因為預期原因而失敗」的最小測試，然後修正，再重跑測試。如果寫測試需要大量的測試框架設定或脆弱的 mock，這個技能會直說，並改用最接近的可執行檢查。當實際執行指令是更強的證據時，不要硬寫測試。

## 點名載入 TypeScript 規則

[`typescript-best-practices`](../../../pstack/skills/typescript-best-practices/SKILL.md) 把型別系統原則轉成具體規則：discriminated union、在邊界使用 `unknown`、窮舉所有變體、從 schema 推導型別。它**不會**自動載入，所以當任務涉及 `.ts` 或 `.tsx` 檔時，請輸入 `/typescript-best-practices`。

## 提交前先清理

[開 PR 劇本](../../../pstack/skills/poteto-mode/playbooks/opening-a-pr.md) 會在每次提交前對 diff 跑 `/deslop`，並對 PR 描述和 commit 內文套用 [`/unslop`](../../../pstack/skills/unslop/SKILL.md)。`/deslop` 在 `cursor-team-kit` plugin 裡，不在 pstack。如果你沒有它，就用白話要求同樣的結果：移除只是在「旁白」的註解、沒有根據的防禦性檢查、死掉的相容性路徑，以及無關的修改。

清理文字時，`/unslop` 接受一個目標和你額外的規則：

```text
/unslop 處理 README 的修改，不要用破折號
```

你會慢慢發展出自己的簡寫。這個技能從簡短的提示詞也能讀懂意圖，例如「unslop 一下，精簡點」。

## 用 `/no-comments` 拿掉註解

註解需要單獨過一遍，而且不能由寫它的 agent 來做。作者會替自己的註解辯護，就像你會替你的辯護一樣。所以在審查前，把它交給一雙新的眼睛：

```text
/no-comments 處理這份 diff
```

[`/no-comments`](../../../pstack/skills/no-comments/SKILL.md) 會派出 [Comment Sicko](../../../pstack/agents/comment-sicko.md)，一個唯讀的審查員，它的「保留清單」很短：授權聲明、公開 API 的文件註解、解釋程式碼本身無法表達之事的連結、因為無法改變的外部相依而被迫的行為。其他全部移除。你自己程式碼裡的「意外之處」不在保留之列——那個註解會被標記為「需要重構」，而 `/no-comments` 會從根本原因修掉它接受的標記。當註解宣稱某個限制（例如「不要刪除」），這個技能會提議把它寫成型別、測試或 lint 規則。不論哪種情況，註解都會被拿掉。

分工要搞清楚：`/deslop` 清掉**程式碼**裡的垃圾，`/unslop` 清掉**文字**裡的垃圾，`/no-comments` 把**註解**交給一個不是作者的審查員。

**陷阱：** 清理不是可有可無的潤飾。一份充滿旁白式註解和防禦性冗餘的 diff，在審查者眼中看起來就像沒做完，而那些多餘的程式碼正是下一個 bug 藏身之處。如果 diff 感覺很臃腫，**在提交前**就說「deslop 一下」，不要等審查時被指出來。

下一頁：[驗證並出貨](./06-verify-and-ship.md)。
