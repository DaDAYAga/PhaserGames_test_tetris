import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config';
import { GameScene } from './scenes/GameScene';

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