### Trace forensics（追蹤檔鑑識）

**從成品做出的診斷由你負責。**

和 **Runtime forensics** 不同，後者是對執行中的程序埋點。這裡擷取的檔案已經存在。成品是固定的資料集，讀它，不要重跑。工具保持通用：cpuprofile 和 `.json.gz` 用 DevTools 或 trace 解析器，spindump 用文字編輯器，heapsnapshot 用你的 heap 工具。

1. 辨識格式，用正確的工具載入。大型成品在子代理中解析（**principle-guard-the-context-window** 技能），主對話只保留縮減後的發現。依「子代理」章節，為每個子代理選擇工作需要的推理等級與快速或標準速度。
2. 把原始成品轉換成可以查詢的形式。把 trace 或 heap snapshot 倒進 sqlite，每個樣本、frame 或節點一列。先轉成可查詢的形式再讀。
3. 縮小到原因。查詢佔用最多時間的 frame，沿著呼叫樹走到熱路徑。洩漏的話，沿著保留鏈從洩漏物件走到 GC root。spindump 的話，找出卡在 CPU 上或被阻塞的執行緒以及它的等待原因。
4. 歸因到原始碼。透過成品本身的符號，把熱 frame 對應到檔案、符號和行號。沒有原始碼對應的 frame 還不算診斷。解析符號，或直說成品沒有帶符號。
5. 如果你有成對的擷取，對修正前後的成品做 diff 來確認。否則，把發現標示為成品所能支持的最強假設，而不是已確認的原因。
6. 交回附出處的診斷，除非被要求否則不修正。一旦知道原因，就導向 Bug fix 或 Perf issue。吞吐量檢查點只寫一行：`throughput checkpoint: n/a, read-only forensics`。

**回覆：** 成品與格式、縮減後的發現、原始碼位置、成品路徑，以及是否有成對擷取確認了它。
