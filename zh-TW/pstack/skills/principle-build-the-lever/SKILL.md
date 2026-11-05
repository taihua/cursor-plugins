---
name: principle-build-the-lever
description: "適用於任何不簡單的工作，不只是大量重複的工作：修改、遷移、分析、檢查。打造能完成或證明它的工具（codemod、腳本、產生器，或讓子代理遵循的技能），而不是手動做。工具就是審查者可以重跑的成品。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-build-the-lever/SKILL.md`](../../../../pstack/skills/principle-build-the-lever/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Build the Lever（打造槓桿）

當工作不簡單時，打造能完成它的工具，而不是手動做。

codemod、產生器或腳本每次都用同樣的方式做事，而且重跑免費。工具是一個審查者可以閱讀並重跑來檢查工作的成品。手動完成的改動只能靠重做一遍來重新驗證。一個確定性的腳本把「相信我」變成「跑這個」。

預設要打造槓桿。只有當任務很簡單——一兩個一眼就看得出來的明顯修改——時才跳過。

- 第一個單元手動做，學會做法，再打造工具。在那個單元上重跑工具，並和你手動完成的版本做 diff 來證明它。讓槓桿可以安全地重跑。
- 修改用 codemod 或腳本，重複性的檔案用產生器，分析用「倒進 sqlite 再查詢」，驗證用可重跑的檢查。
- 確定性的槓桿勝過分派。如果工具能一次處理所有單元，就自己跑它。不要分派代理去手動套用腳本就能做的事。
- 當你把工作分派給子代理時，把槓桿寫成一個它們都會讀的技能：做法、驗證契約和「不可碰觸」的界線都放在同一個成品裡。把它放在代理的寫入範圍之外，讓它們無法默默修改契約。
- 套用這條原則會產生一個檔案。如果你引用了它，但 diff 中沒有任何 codemod、腳本、產生器或代理技能，那你就沒有套用它。
- 當工作會延續到工作階段之後時，提交這個槓桿。

門檻是「是否簡單」，而不是「是否重複」。當槓桿能讓工作變得可檢查時，即使是一次性的工作也值得一個槓桿。依 [Laziness Protocol](../principle-laziness-protocol/SKILL.md)，打造能完成或證明工作的最小腳本，永遠不要做成框架。

和 [Encode Lessons in Structure](../principle-encode-lessons-in-structure/SKILL.md) 不同，後者是把反覆出現的指示變成持久的護欄。這條原則關注的是眼前工作的吞吐量與可審查性。關於把驗證本身寫成腳本，見 [Prove It Works](../principle-prove-it-works/SKILL.md)。
