/*
 * Game: Jumpy Bird
 * Author: Gabriel F. Toninelli
 * Purpose: Manage the score and game state for a 2D bird game.
 * Date: September 27, 2026
 */

import { _decorator, AudioClip, AudioSource, Component, Label, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {
    @property({ type: Label })
    scoreLabel: Label | null = null;

    @property({ type: Node })
    startLabel: Node | null = null;

    @property({ type: Node })
    gameOverLabel: Node | null = null;

    @property({ type: AudioClip })
    pointSound: AudioClip | null = null;

    @property({ type: AudioClip })
    swooshSound: AudioClip | null = null;

    @property({ type: AudioClip })
    hitSound: AudioClip | null = null;

    @property({ type: AudioClip })
    dieSound: AudioClip | null = null;

    public isPlaying = false;
    private score = 0;

    private playDieSound = () => {
        if (this.dieSound) {
            this.getComponent(AudioSource)?.playOneShot(this.dieSound, 1);
        }
    };

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
        if (this.pointSound) {
            this.getComponent(AudioSource)?.playOneShot(this.pointSound, 1);
        }
    }

    public playSwoosh() {
        if (this.swooshSound) {
            this.getComponent(AudioSource)?.playOneShot(this.swooshSound, 1);
        }
    }

    public gameOver() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        if (this.gameOverLabel) this.gameOverLabel.active = true;

        if (this.hitSound) {
            this.getComponent(AudioSource)?.playOneShot(this.hitSound, 1);
        }
        if (this.dieSound) {
            this.scheduleOnce(this.playDieSound, 0.25);
        }
    }

    public resetGame() {
        this.unschedule(this.playDieSound);
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
