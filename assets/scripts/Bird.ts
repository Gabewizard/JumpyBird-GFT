import {
    _decorator, Component, EventKeyboard, Input, input,
    KeyCode, tween, Tween, Vec3
} from 'cc';
import { GameControl } from './GameControl';

const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {
    @property({ type: GameControl })
    gameControl: GameControl | null = null;

    onEnable() {
        input.on(Input.EventType.MOUSE_DOWN, this.flap, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDisable() {
        input.off(Input.EventType.MOUSE_DOWN, this.flap, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        Tween.stopAllByTarget(this.node);
    }

    private onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.SPACE) this.flap();
    }

    private flap() {
        if (!this.gameControl) return;

        if (!this.gameControl.isPlaying) {
            this.gameControl.startGame();
        }

        Tween.stopAllByTarget(this.node);

        tween(this.node)
            .by(0.15, { position: new Vec3(0, 45, 0) }, { easing: 'sineOut' })
            .by(0.35, { position: new Vec3(0, -45, 0) }, { easing: 'sineIn' })
            .start();
    }
}