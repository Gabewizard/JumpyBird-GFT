import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
import { GameControl } from './GameControl';

const { ccclass, property } = _decorator;

@ccclass('PipePool')
export class PipePool extends Component {
    @property({ type: Prefab })
    pipePairPrefab: Prefab | null = null;

    @property({ type: GameControl })
    gameControl: GameControl | null = null;

    private pool = new NodePool();
    private activePipes: Node[] = [];
    private spawnTimer = 0;
    private readonly speed = 100;
    private readonly spawnInterval = 2.1;

    update(deltaTime: number) {
        if (!this.gameControl?.isPlaying) return;

        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer -= this.spawnInterval;
            this.spawnPipe();
        }

        for (let i = this.activePipes.length - 1; i >= 0; i--) {
            const pair = this.activePipes[i];
            const top = pair.getChildByName('pipe-top');
            const bottom = pair.getChildByName('pipe-bottom');
            if (!top || !bottom) continue;

            const x = top.position.x - this.speed * deltaTime;
            top.setPosition(x, top.position.y, 0);
            bottom.setPosition(x, bottom.position.y, 0);

            if (x < -180) {
                this.activePipes.splice(i, 1);
                pair.active = false;
                this.pool.put(pair);
            }
        }
    }

    private spawnPipe() {
        if (!this.pipePairPrefab) return;

        const pair = this.pool.get() ?? instantiate(this.pipePairPrefab);
        pair.active = false;

        const top = pair.getChildByName('pipe-top');
        const bottom = pair.getChildByName('pipe-bottom');
        if (!top || !bottom) {
            console.error('PipePair needs pipe-top and pipe-bottom children.');
            pair.destroy();
            return;
        }

        pair.parent = this.node;
        pair.setSiblingIndex(2);
        pair.setPosition(0, 0, 0);

        const height = Math.random() * 140 - 70;
        top.setPosition(190, 220 + height, 0);
        bottom.setPosition(190, -220 + height, 0);

        pair.active = true;
        this.activePipes.push(pair);
    }

    onDestroy() {
        this.pool.clear();
    }
}