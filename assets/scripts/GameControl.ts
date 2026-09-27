/*
 * Game: Jumpy Bird
 * Author: Gabriel F. Toninelli
 * Purpose: Manage the score and game state for a 2D bird game.
 * Date: September 27, 2026
 */

import { _decorator, Component, Label, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {
    @property({ type: Label })
    scoreLabel: Label | null = null;

    @property({ type: Node })
    startLabel: Node | null = null;

    @property({ type: Node })
    gameOverLabel: Node | null = null;

    public isPlaying = false;
    private score = 0;

    start() {
        this.resetGame();
    }

    public startGame() {
        this.isPlaying = true;
        if (this.startLabel) this.startLabel.active = false;
        if (this.gameOverLabel) this.gameOverLabel.active = false;
    }

    public addPoint() {
        if (!this.isPlaying) return;
        this.score++;
        this.updateScoreLabel();
    }

    public gameOver() {
        this.isPlaying = false;
        if (this.gameOverLabel) this.gameOverLabel.active = true;
    }

    public resetGame() {
        this.score = 0;
        this.isPlaying = false;
        this.updateScoreLabel();

        if (this.startLabel) this.startLabel.active = true;
        if (this.gameOverLabel) this.gameOverLabel.active = false;
    }

    private updateScoreLabel() {
        if (this.scoreLabel) this.scoreLabel.string = String(this.score);
    }
}