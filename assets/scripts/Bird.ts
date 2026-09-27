import {
    _decorator, Collider2D, Component, Contact2DType,
    EventKeyboard, Input, input, KeyCode,
    PhysicsSystem2D, RigidBody2D, Vec2, Vec3, EPhysics2DDrawFlags
} from 'cc';
import { GameControl } from './GameControl';
import { PipePool } from './PipePool';

const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {
    @property({ type: GameControl })
    gameControl: GameControl | null = null;

    @property({ type: PipePool })
    pipePool: PipePool | null = null;

    private body: RigidBody2D | null = null;
    private hasCrashed = false;
    private startPosition = new Vec3();

    start() {
        this.startPosition = this.node.position.clone();
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None;
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
        if (this.hasCrashed) {
            this.restartGame();
            return;
        }

        if (!this.gameControl || !this.body) return;

        if (!this.gameControl.isPlaying) {
            this.gameControl.startGame();
        }

        this.body.gravityScale = 1;
        this.body.linearVelocity = new Vec2(0, 7);
        this.gameControl.playSwoosh();
    }

    private restartGame() {
        if (!this.gameControl || !this.pipePool || !this.body) return;

        this.pipePool.resetPipes();
        this.body.gravityScale = 0;
        this.body.linearVelocity = new Vec2(0, 0);
        this.body.angularVelocity = 0;
        this.node.setPosition(this.startPosition);
        this.gameControl.resetGame();
        this.hasCrashed = false;
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
