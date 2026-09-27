import {
    _decorator, Component, EventKeyboard, Input, input,
    KeyCode, RigidBody2D, Vec2, PhysicsSystem2D
} from 'cc';
import { GameControl } from './GameControl';

const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {
    @property({ type: GameControl })
    gameControl: GameControl | null = null;

    private body: RigidBody2D | null = null;

    start() {
        PhysicsSystem2D.instance.gravity = new Vec2(0, -320);
        this.body = this.getComponent(RigidBody2D);
        if (this.body) {
            this.body.gravityScale = 0;
            this.body.linearVelocity = new Vec2(0, 0);
        }
    }

    onEnable() {
        input.on(Input.EventType.MOUSE_DOWN, this.flap, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDisable() {
        input.off(Input.EventType.MOUSE_DOWN, this.flap, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.SPACE) this.flap();
    }

    private flap() {
        if (!this.gameControl || !this.body) return;

        if (!this.gameControl.isPlaying) {
            this.gameControl.startGame();
        }

        this.body.gravityScale = 1;
        this.body.linearVelocity = new Vec2(0, 7);
    }
}