import Phaser from 'phaser';
import { 
    GAME_WIDTH, GAME_HEIGHT, COLS, ROWS, BLOCK_SIZE,
    DROP_INTERVAL, FAST_DROP_INTERVAL, MOVE_DELAY, MOVE_INTERVAL 
} from '../config';
import { Tetromino } from '../objects/Tetromino';

export class GameScene extends Phaser.Scene {
    // 棋盤偏移量
    private offsetX: number = 0;
    private offsetY: number = 0;

    // 當前方塊
    private currentPiece!: Tetromino;

    // 下落計時器
    private dropTimer: number = 0;
    private dropInterval: number = DROP_INTERVAL;

    // 儲存方塊的圖形物件（用於清除重繪）
    private pieceGraphics: Phaser.GameObjects.Rectangle[] = [];

    // 鍵盤物件
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private downKey!: Phaser.Input.Keyboard.Key;
    private leftKey!: Phaser.Input.Keyboard.Key;
    private rightKey!: Phaser.Input.Keyboard.Key;

    // 移動相關
    private moveDelay: number = MOVE_DELAY;
    private moveInterval: number = MOVE_INTERVAL;
    private moveTimer: number = 0;
    private lastMoveDir: number = 0;

    constructor() {
        super('GameScene');
    }

    create() {
        // 計算棋盤的起始位置（置中）
        const boardWidth = COLS * BLOCK_SIZE;
        const boardHeight = ROWS * BLOCK_SIZE;
        this.offsetX = (GAME_WIDTH - boardWidth) / 2;
        this.offsetY = (GAME_HEIGHT - boardHeight) / 2;

        // 畫出棋盤格線
        this.drawBoard();

        // 建立當前方塊
        this.currentPiece = new Tetromino('O');

        // 畫出初始方塊
        this.drawCurrentPiece();

        // 建立鍵盤監聽
        this.setupKeyboard();
    }

    // 設定鍵盤監聽
    private setupKeyboard() {
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.downKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.leftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // 硬降（Hard Drop）- 空白鍵或上鍵
        this.input.keyboard!.on('keydown-SPACE', () => {
            this.currentPiece.hardDrop();
            this.drawCurrentPiece();
            this.dropTimer = 0;
        });
        this.input.keyboard!.on('keydown-UP', () => {
            this.currentPiece.hardDrop();
            this.drawCurrentPiece();
            this.dropTimer = 0;
        });
    }

    update(_time: number, delta: number) {
        // 自動下落
        this.dropTimer += delta;

        if (this.dropTimer >= this.dropInterval) {
            this.dropTimer = 0;

            if (this.currentPiece.moveDown()) {
                this.drawCurrentPiece();
            }
        }

        // 左右移動（DAS 機制）
        this.handleHorizontalMovement(delta);

        // 加速下落
        if (this.downKey.isDown) {
            this.dropInterval = FAST_DROP_INTERVAL;
        } else {
            this.dropInterval = DROP_INTERVAL;
        }
    }

    // 處理左右移動（DAS 機制）
    private handleHorizontalMovement(delta: number) {
        let dir = 0;

        if (this.leftKey.isDown) {
            dir = -1;
        } else if (this.rightKey.isDown) {
            dir = 1;
        }

        if (dir !== 0) {
            if (this.lastMoveDir !== dir) {
                // 方向改變，立即移動
                if (this.currentPiece.tryMove(dir)) {
                    this.drawCurrentPiece();
                }
                this.moveTimer = 0;
                this.lastMoveDir = dir;
                return;
            }

            this.moveTimer += delta;

            const interval = this.moveTimer < this.moveDelay 
                ? this.moveDelay 
                : this.moveInterval;

            if (this.moveTimer >= interval) {
                this.moveTimer = this.moveDelay;
                if (this.currentPiece.tryMove(dir)) {
                    this.drawCurrentPiece();
                }
            }
        } else {
            this.moveTimer = 0;
            this.lastMoveDir = 0;
        }
    }

    // 繪製當前方塊
    private drawCurrentPiece() {
        // 清除舊的方塊圖形
        this.pieceGraphics.forEach(rect => rect.destroy());
        this.pieceGraphics = [];

        const { shape, col, row, color } = this.currentPiece;

        // 畫新的方塊
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                    const x = this.offsetX + (col + c) * BLOCK_SIZE;
                    const y = this.offsetY + (row + r) * BLOCK_SIZE;

                    const rect = this.add.rectangle(
                        x + BLOCK_SIZE / 2,
                        y + BLOCK_SIZE / 2,
                        BLOCK_SIZE - 2,
                        BLOCK_SIZE - 2,
                        color
                    );

                    this.pieceGraphics.push(rect);
                }
            }
        }
    }

    // 畫棋盤格線
    private drawBoard() {
        const graphics = this.add.graphics();

        // 設定線條樣式：灰色、1px 寬
        graphics.lineStyle(1, 0x333333, 0.8);

        // 畫垂直線
        for (let col = 0; col <= COLS; col++) {
            const x = this.offsetX + col * BLOCK_SIZE;
            graphics.moveTo(x, this.offsetY);
            graphics.lineTo(x, this.offsetY + ROWS * BLOCK_SIZE);
        }

        // 畫水平線
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
}
