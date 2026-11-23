---
name: principle-build-the-lever
description: "適用於任何不簡單的工作，不只是大量重複的工作：修改、遷移、分析、檢查。打造能完成或證明它的工具（codemod、腳本、產生器，或讓子代理遵循的技能），而不是手動做。工具就是審查者可以重跑的成品。"
disable-model-invocation: true
---

> 本文為 [`pstack/skills/principle-build-the-lever/SKILL.md`](../../../../pstack/skills/principle-build-the-lever/SKILL.md) 的繁體中文翻譯，僅供閱讀理解。agent 實際執行時讀的是英文原檔。

# Build the Lever（打造槓桿）

當工作不簡單時，打造能完成它的工具（codemod、腳本、產生器或可重跑的檢查），而不是手動做。門檻是「是否簡單」，而不是「是否重複」。只有一兩個明顯的修改時才跳過工具。

- 第一個單元手動做，再打造工具，並在那個單元上重跑它來證明它。讓它可以安全地重跑。
- 確定性的工具勝過分派。真的要分派時，把做法、驗證契約和界線寫成一個代理會讀、但無法修改的技能。
- 套用這條原則會產生一個檔案。diff 中沒有任何腳本、codemod、產生器或代理技能，就代表你沒有套用它。當工作會延續到工作階段之後時，提交它。
- 打造能完成或證明工作的最小腳本，永遠不要做成框架。
