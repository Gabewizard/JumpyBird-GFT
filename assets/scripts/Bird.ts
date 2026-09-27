import {
    _decorator, Collider2D, Component, Contact2DType,
    EventKeyboard, Input, input, KeyCode,
    PhysicsSystem2D, RigidBody2D, Vec2, EPhysics2DDrawFlags
} from 'cc';
import { GameControl } from './GameControl';

const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {
    @property({ type: GameControl })
    gameControl: GameControl | null = null;

    private body: RigidBody2D | null = null;
    private hasCrashed = false;

    start() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape;
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
        this.getComponent(Collider2D)?.on(
            Contact2DType.BEGIN_CONTACT, this.onBeginContact, this
        );
    }

    onDisable() {
        input.off(Input.EventType.MOUSE_DOWN, this.flap, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.getComponent(Collider2D)?.off(
            Contact2DType.BEGIN_CONTACT, this.onBeginContact, this
        );
    }

    private onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.SPACE) this.flap();
    }

    private flap() {
        if (!this.gameControl || !this.body || this.hasCrashed) return;

        if (!this.gameControl.isPlaying) {
            this.gameControl.startGame();
        }

        this.body.gravityScale = 1;
        this.body.linearVelocity = new Vec2(0, 7);
    }

    private onBeginContact() {
        if (this.hasCrashed || !this.gameControl?.isPlaying) return;

        this.hasCrashed = true;
        this.gameControl.gameOver();

        if (this.body) {
            this.body.linearVelocity = new Vec2(0, 0);
            this.body.gravityScale = 0;
        }
    }
}