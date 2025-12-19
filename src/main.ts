import Phaser from 'phaser';

// ===== 遊戲常數 =====
const GAME_WIDTH = 800;   // 遊戲畫面寬度
const GAME_HEIGHT = 600;  // 遊戲畫面高度
const COLS = 10;          // 棋盤寬度（10 格）
const ROWS = 20;          // 棋盤高度（20 格）
const BLOCK_SIZE = 30;    // 每格的像素大小

// O 形方塊（正方形）
const O_SHAPE = [
    [1, 1],
    [1, 1]
];

// 遊戲場景
class GameScene extends Phaser.Scene {
    // 棋盤偏移量
    private offsetX: number = 0;
    private offsetY: number = 0;

    // 當前方塊的位置
    private currentCol: number = 4;  // 從中間開始
    private currentRow: number = 0;  // 從頂部開始

    // 下落計時器
    private dropTimer: number = 0;
    private dropInterval: number = 1000;  // 每 1000 毫秒（1 秒）下落一格

    // 儲存方塊的圖形物件（用於清除重繪）
    private pieceGraphics: Phaser.GameObjects.Rectangle[] = [];

    // 鍵盤物件
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private downKey!: Phaser.Input.Keyboard.Key;
    private leftKey!: Phaser.Input.Keyboard.Key;
    private rightKey!: Phaser.Input.Keyboard.Key;

    // 移動相關
    private moveDelay: number = 0;      // 第一次按住後延遲
    private moveInterval: number = 0;   // 連續移動間隔
    private moveTimer: number = 0;
    private lastMoveDir: number = 0;     // -1 左, 1 右, 0 無

    constructor() {
        super('GameScene');
    }

    // create() 在場景建立時執行一次
    create() {
        // 計算棋盤的起始位置（置中）
        const boardWidth = COLS * BLOCK_SIZE;
        const boardHeight = ROWS * BLOCK_SIZE;
        this.offsetX = (GAME_WIDTH - boardWidth) / 2;
        this.offsetY = (GAME_HEIGHT - boardHeight) / 2;

        // 畫出棋盤格線
        this.drawBoard();

        // 畫出初始方塊
        this.drawCurrentPiece();

        // 建立鍵盤監聽
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.downKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.leftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.dropTimer = 0;
        this.dropInterval = 1000;

        this.moveDelay = 200;      // 第一次按住後延遲
        this.moveInterval = 250;   // 連續移動間隔
        this.moveTimer = 0;
        this.lastMoveDir = 0;     // -1 左, 1 右, 0 無

        // 硬降（Hard Drop）- 空白鍵或上鍵
        this.input.keyboard!.on('keydown-SPACE', () => {
            this.hardDrop();
        });
        this.input.keyboard!.on('keydown-UP', () => {
            this.hardDrop();
        });
    }

    // update() 每幀執行（約 60 次/秒）
    update(_time: number, delta: number) {
        // delta 是距離上一幀的毫秒數
        this.dropTimer += delta;

        // 如果累積時間超過下落間隔
        if (this.dropTimer >= this.dropInterval) {
            this.dropTimer = 0;  // 重置計時器

            // 檢查是否可以繼續下落（還沒到底部）
            if (this.currentRow + O_SHAPE.length < ROWS) {
                this.currentRow += 1;  // 往下移動一格
                this.drawCurrentPiece();  // 重新繪製
            }
        }

        let dir = 0;

        if(this.leftKey.isDown) {
            dir = -1;
        } else if(this.rightKey.isDown) {
            dir = 1;
        }

        if(dir !== 0) {
            if(this.lastMoveDir !== dir) {
                this.tryMove(dir);
                this.moveTimer = 0;
                this.lastMoveDir = dir;

                return;
            }

            this.moveTimer += delta;
           
            const interval = this.moveTimer < this.moveDelay ? this.moveDelay : this.moveInterval;

            if(this.moveTimer >= interval) {
                this.moveTimer = this.moveDelay;
                this.tryMove(dir);
            }
        } else {
            this.moveTimer = 0;
            this.lastMoveDir = 0;
        }
        
        // 向下（加速）- 按住時加速
        if (this.downKey.isDown) {
            this.dropInterval = 25;  // 加速
        } else {
            this.dropInterval = 1000;  // 恢復正常速度
        }
    }

    // 移動方塊
    tryMove(dir: number) {
        const newCol = this.currentCol + dir;

        if (newCol < 0) return;
        if (newCol + O_SHAPE[0].length > COLS) return;

        this.currentCol = newCol;
        this.drawCurrentPiece();
    }

    // 硬降（Hard Drop）- 直接落到最底部
    hardDrop() {
        // 計算最底部的位置
        const maxRow = ROWS - O_SHAPE.length;
        
        // 直接移動到最底部
        this.currentRow = maxRow;
        this.drawCurrentPiece();
        
        // 重置下落計時器
        this.dropTimer = 0;
    }

    // 繪製當前方塊（會先清除舊的）
    drawCurrentPiece() {
        // 清除舊的方塊圖形
        this.pieceGraphics.forEach(rect => rect.destroy());
        this.pieceGraphics = [];

        // 畫新的方塊
        for (let r = 0; r < O_SHAPE.length; r++) {
        for (let c = 0; c < O_SHAPE[r].length; c++) {
            if (O_SHAPE[r][c] === 1) {
            const x = this.offsetX + (this.currentCol + c) * BLOCK_SIZE;
            const y = this.offsetY + (this.currentRow + r) * BLOCK_SIZE;

            const rect = this.add.rectangle(
                x + BLOCK_SIZE / 2,
                y + BLOCK_SIZE / 2,
                BLOCK_SIZE - 2,
                BLOCK_SIZE - 2,
                0xffff00  // 黃色
            );

            this.pieceGraphics.push(rect);  // 儲存起來，下次清除用
            }
        }
        }
    }

    // 畫棋盤格線
    drawBoard() {
        const graphics = this.add.graphics();
        
        // 設定線條樣式：灰色、1px 寬
        graphics.lineStyle(1, 0x333333, 0.8);

        // 畫垂直線（11 條）
        for (let col = 0; col <= COLS; col++) {
            const x = this.offsetX + col * BLOCK_SIZE;
            graphics.moveTo(x, this.offsetY);
            graphics.lineTo(x, this.offsetY + ROWS * BLOCK_SIZE);
        }

        // 畫水平線（21 條）
        for (let row = 0; row <= ROWS; row++) {
            const y = this.offsetY + row * BLOCK_SIZE;
            graphics.moveTo(this.offsetX, y);
            graphics.lineTo(this.offsetX + COLS * BLOCK_SIZE, y);
        }

        // 執行繪製
        graphics.strokePath();

        // 畫棋盤外框（白色）
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeRect(this.offsetX, this.offsetY, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    }

    // 畫一個俄羅斯方塊
    drawPiece(shape: number[][], col: number, row: number, color: number) {
        // 遍歷形狀陣列
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                // 如果這格是 1，就畫一個方塊
                if (shape[r][c] === 1) {
                    const x = this.offsetX + (col + c) * BLOCK_SIZE;
                    const y = this.offsetY + (row + r) * BLOCK_SIZE;
                    
                    // 畫填滿的方塊
                    this.add.rectangle(
                        x + BLOCK_SIZE / 2,  // x 中心點
                        y + BLOCK_SIZE / 2,  // y 中心點
                        BLOCK_SIZE - 2,      // 寬度（留 2px 間隙）
                        BLOCK_SIZE - 2,      // 高度
                        color                // 顏色
                    );
                }
            }
        }
    }
}

// 遊戲設定
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#1a1a2e',
    scene: GameScene
};

// 啟動遊戲
new Phaser.Game(config);