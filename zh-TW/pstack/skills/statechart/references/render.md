# Render a chart（渲染圖）

> 譯註：CSS 程式碼保留原樣。

用 npm 套件 `pele@1.9.0` 渲染你要呈現的每個 `.mmd` 檔案，並把 SVG 交給使用者。在 repo 之外安裝 Pele 一次。把每個 SVG 寫在它的 `.mmd` 檔案旁邊，用相同的名稱。API 在 https://pele.run/api。把 `{ limit: 1_000_000, outputLimit: 8_000_000, maxEdges: 10_000 }` 作為 `render` 的選項傳入。Pele 的預設值比一張 500 個狀態的圖可能需要的還小。當 Pele 拋出 `PeleError` 時，把 Mermaid 文字和錯誤呈現給使用者。

## 顏色

Pele 會忽略 Mermaid 的 `theme` 和 `themeVariables`。在 `.pele` 上設定它的 `--pele-*` CSS 變數。https://pele.run/theming 列出了這些變數。指令會給每個狀態它所屬群組的顏色類別，例如 `class sN teal`。它用 `class sN breaks` 或 `class sN mayBreak` 標記每個壞狀態，用 `class sN bugPath` 標記通往 bug 的最短路徑上的每個狀態，用 `class sN repeats` 標記某個 PROPERTY 反例中永遠重複的每個狀態。Pele 會把這些類別放在狀態的節點上。用 CSS 為這些類別上色。

`.mmd` 檔案為 `breaks` 和 `mayBreak` 各有一行 `classDef`，讓任何 Mermaid 檢視器都能顯示 bug 標記。它沒有為群組顏色、`bugPath` 或 `repeats` 寫 `classDef`。Pele 會把每個 `classDef` 的顏色寫成節點上的 `style` 屬性，而 `style` 屬性會勝過一般的 CSS 規則。所以下面的標記規則使用 `!important`。沒有它的話，深色主題會保留淺色的標記顏色。bug 標記設定填色和文字，`bugPath` 和 `repeats` 設定邊框。把標記規則放在群組顏色之後，讓標記顯示在群組顏色之上。

這些顏色只是建議，是舊版技能的顏色。把它們放在每個 SVG 開頭的 `<style>` 元素中。這樣每個 SVG 都會跟隨檢視者的淺色或深色設定。

```css
.pele {
  --pele-bg: #ffffff;
  --pele-fg: #1c1c1c;
  --pele-muted: #656565;
  --pele-line: #808080;
  --pele-surface: #fcfcfc;
  --pele-surface-alt: #f1f1f1;
  --pele-border: #c9c9c9;
}
.pele .blue rect { fill: #c3e0ff; }
.pele .orange rect { fill: #f0d3bf; }
.pele .purple rect { fill: #e3d5ff; }
.pele .yellow rect { fill: #f0dcbf; }
.pele .teal rect { fill: #bfe3df; }
.pele .tan rect { fill: #e5d9ce; }
.pele .pink rect { fill: #ffcbe6; }
.pele .breaks rect {
  fill: #ffecee !important;
  stroke: #e72e3b !important;
  stroke-width: 2.5px !important;
}
.pele .breaks text {
  fill: #cd2834 !important;
}
.pele .mayBreak rect {
  fill: #fff3e6 !important;
  stroke: #e8730c !important;
  stroke-width: 2.5px !important;
}
.pele .mayBreak text {
  fill: #b85a06 !important;
}
.pele .bugPath rect {
  stroke: #1680f3 !important;
  stroke-width: 2.5px !important;
}
.pele .repeats rect {
  stroke: #9b35d6 !important;
  stroke-width: 2.5px !important;
  stroke-dasharray: 6 3;
}
@media (prefers-color-scheme: dark) {
  .pele {
    --pele-bg: #1f1f1f;
    --pele-fg: #f5f5f5;
    --pele-muted: #acacac;
    --pele-line: #939393;
    --pele-surface: #121212;
    --pele-surface-alt: #2c2c2c;
    --pele-border: #4e4e4e;
  }
  .pele .blue rect { fill: #1b3857; }
  .pele .orange rect { fill: #573117; }
  .pele .purple rect { fill: #3c2e57; }
  .pele .yellow rect { fill: #573d17; }
  .pele .teal rect { fill: #174641; }
  .pele .tan rect { fill: #3d3127; }
  .pele .pink rect { fill: #57233e; }
  .pele .breaks rect {
    fill: #2e2021 !important;
    stroke: #cf2b35 !important;
  }
  .pele .breaks text {
    fill: #ff6463 !important;
  }
  .pele .mayBreak rect {
    fill: #2e2619 !important;
    stroke: #d0700f !important;
  }
  .pele .mayBreak text {
    fill: #ffa257 !important;
  }
  .pele .bugPath rect {
    stroke: #116dd2 !important;
  }
  .pele .repeats rect {
    stroke: #9a3fcf !important;
  }
}
```
