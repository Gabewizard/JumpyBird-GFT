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
            const pipe = this.activePipes[i];
            pipe.setPosition(pipe.position.x - this.speed * deltaTime, pipe.position.y, 0);

            if (pipe.position.x < -180) {
                this.activePipes.splice(i, 1);
                this.pool.put(pipe);
            }
        }
    }

    private spawnPipe() {
        if (!this.pipePairPrefab) return;

        const pipe = this.pool.get() ?? instantiate(this.pipePairPrefab);
        pipe.parent = this.node;
        pipe.setSiblingIndex(2);
        pipe.setPosition(190, Math.random() * 140 - 70, 0);
        this.activePipes.push(pipe);
    }

    onDestroy() {
        this.pool.clear();
    }
}