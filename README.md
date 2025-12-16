# Phaser Games - 遊戲開發學習專案

## 專案目標
從零開始學習遊戲開發，逐步累積經驗，最終目標是開發可上架 Steam 的完整遊戲。

## 技術選型
- **遊戲框架**：Phaser 3
- **語言**：TypeScript
- **打包工具**：Vite
- **桌面版**：Electron（未來 Steam 上架用）

## 開發路線

| 階段 | 專案 | 學習目標 | 狀態 |
|------|------|----------|------|
| 1 | 俄羅斯方塊 | 遊戲迴圈、格子系統、碰撞偵測 | 🚧 進行中 |
| 2 | 貪食蛇 / 2048 | 強化陣列操作 | ⏳ 待開始 |
| 3 | 卡牌遊戲 | UI 系統、場景切換 | ⏳ 待開始 |
| 4 | 戰棋遊戲 | 回合制、AI 邏輯 | ⏳ 待開始 |
| 5 | 橫向塔防（梅露可類） | 完整遊戲 + 多人連線 | ⏳ 待開始 |

## 未來擴充計畫
- [ ] PWA 支援（手機網頁版）
- [ ] Capacitor 包裝（App Store / Google Play）
- [ ] Electron 包裝（Steam 上架）
- [ ] 多人連線（Node.js + Socket.IO）
- [ ] 收費機制（綠界 / Stripe）

## 開發者背景
- 前端工程師，熟悉 JavaScript / TypeScript / Vue 3
- 遊戲開發新手，透過 Side Project 學習

## 專案結構（規劃）
```
PhaserGames_test_tetris/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.ts              # 入口
│   ├── scenes/              # 遊戲場景
│   │   ├── BootScene.ts     # 資源載入
│   │   ├── MenuScene.ts     # 主選單
│   │   └── GameScene.ts     # 遊戲主場景
│   ├── objects/             # 遊戲物件
│   ├── utils/               # 工具函數
│   └── types/               # 型別定義
└── assets/                  # 圖片、音效資源
```

## 快速開始
```bash
# 安裝依賴
- pnpm install
- pnpm add phaser
- pnpm add -D vite typescript # 安裝開發工具 -D 表示這是「開發時才需要」的工具，不會包進最終遊戲裡。

# 開發模式
npm run dev

# 打包
npm run build
```

## 參考資源
- [Phaser 3 官方文件](https://phaser.io/docs)
- [Phaser 3 範例](https://phaser.io/examples)
- [Phaser 3 TypeScript 模板](https://github.com/photonstorm/phaser3-typescript-project-template)

## 備註
- 使用繁體中文開發
- AI 輔助開發（Windsurf + Claude）

## 學習方式
> **重要：這是一個學習專案，不是趕進度的專案。**

- 每次只學一個小概念
- 逐步建立，不要一次生成完整結構
- 像教初學者一樣，慢慢理解每一行程式碼的意義
- 確保理解後再進入下一步
