# Routing map example（導向地圖範例）

把這個檔案複製到 `.cursor/automations/benny/` 之外，例如 `.cursor/benny/routing.md`，並取代每個佔位符。把 `routing.map_path` 指向那份副本。套件更新不能覆寫它。

分類技能把它當作資料。一條路線需要來自回報或原因追溯的證據。光是關鍵字符合是不夠的。

> 譯註：YAML 保留原樣。

```yaml
routes:
  - name: "billing-example"
    match:
      product_areas:
        - "billing-area-placeholder"
      code_paths:
        - "billing-code-path-placeholder"
      error_signatures:
        - "billing-error-placeholder"
    destination:
      slack_channel: "billing-channel-placeholder"
      tracker_team: "billing-team-placeholder"
    owners:
      - "billing-owner-placeholder"
    allow_feature_owner_ping: false

  - name: "desktop-example"
    match:
      product_areas:
        - "desktop-area-placeholder"
      code_paths:
        - "desktop-code-path-placeholder"
      error_signatures:
        - "desktop-error-placeholder"
    destination:
      slack_channel: "desktop-channel-placeholder"
      tracker_team: "desktop-team-placeholder"
    owners:
      - "desktop-owner-placeholder"
    allow_feature_owner_ping: false

fallback:
  destination: ""
  owners: []
  allow_feature_owner_ping: false

ping_policy:
  default: "off"
  allow:
    - "configured-feature-owner"
    - "confirmed-regression-author"
  deny:
    - "broad-on-call-group"
    - "unverified-owner"
```

## 規則

- 除非有一個團隊願意接收所有沒符合的回報，否則讓 `fallback.destination` 保持空白。
- 使用穩定的產品區域、程式路徑和錯誤特徵。
- 不要在公開的副本中放入私人資料。
- 不要把原始的使用者或頻道 ID 貼進會被公開的範例中。
- 在目標團隊同意之前，保持關閉功能負責人通知。
- 轉介是告訴回報者要去哪裡。自動化永遠不跨頻道貼文。
