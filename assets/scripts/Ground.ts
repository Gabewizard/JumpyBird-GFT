import { _decorator, Component, Node, UITransform } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Ground')
export class Ground extends Component {
    @property({ type: Node })
    ground1: Node | null = null;

    @property({ type: Node })
    ground2: Node | null = null;

    @property
    speed = 100;

    update(deltaTime: number) {
        const first = this.ground1;
        const second = this.ground2;
        if (!first || !second) return;

        const groundWidth = first.getComponent(UITransform)?.width;
        const canvasWidth = this.node.getComponent(UITransform)?.width;
        if (!groundWidth || !canvasWidth) return;

        first.setPosition(
            first.position.x - this.speed * deltaTime,
            first.position.y,
            first.position.z
        );
        second.setPosition(
            second.position.x - this.speed * deltaTime,
            second.position.y,
            second.position.z
        );

        const exitX = -(canvasWidth + groundWidth) / 2;

        if (first.position.x <= exitX) {
            first.setPosition(second.position.x + groundWidth, first.position.y);
        }
        if (second.position.x <= exitX) {
            second.setPosition(first.position.x + groundWidth, second.position.y);
        }
    }
}