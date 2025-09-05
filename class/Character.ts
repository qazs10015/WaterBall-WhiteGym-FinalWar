import { Action } from "../enum/Action";
import { Direction } from "../enum/Direction";
import { MapObj } from "../interface/MapObj";
import { Role } from "../interface/Role";
import { Erupting } from "../RoleState/Erupting";
import { Normal } from "../RoleState/Normal";
import { Map } from "./Map";
import { Monster } from "./Monster";

export class Character extends Role {

    HP: number = 300;
    maxHP: number = 300;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        // 隨機設定初始面向
        this.direction = this.getRandomDirection();
    }

    /**
     * 回合開始處理
     */
    onTurnStart() {
        this.state.OnTurnStart(this);

        // 檢查狀態持續時間
        if (this.state.duration <= 0 && this.state.constructor.name !== 'Normal') {
            this.state.OnExit();
            this.EnterState(new Normal());
        }
    }

    /**
     * 回合結束處理
     */
    onTurnEnd() {
        this.state.OnTurnEnd(this);

        // 檢查狀態持續時間
        if (this.state.duration <= 0 && this.state.constructor.name !== 'Normal') {
            this.state.OnExit();
            this.EnterState(new Normal());
        }
    }

    /**
     * 受到傷害
     */
    takeDamage(damage: number) {
        const actualDamage = this.state.OnModifyDamage(damage);
        this.HP = Math.max(0, this.HP - actualDamage);

        if (actualDamage > 0) {
            console.log(`主角受到 ${actualDamage} 點傷害，當前HP: ${this.HP}`);
        }
    }

    /**
     * 主角攻擊方法 - 根據當前狀態決定攻擊類型
     */
    Attack(map: Map): void {
        // 通知狀態：即將執行攻擊動作，檢查是否被允許
        if (!this.state.OnAction(Action.Attack, this.direction)) {
            return; // 動作被狀態阻止
        }

        // 檢查是否為爆發狀態
        if (this.state instanceof Erupting && this.state.isEruptingAttack()) {
            // 爆發狀態下的全地圖攻擊
            console.log(`💥 主角在 (${this.x}, ${this.y}) 發動爆發攻擊 - 全地圖攻擊！`);

            const eruptingState = this.state as Erupting;
            const damage = eruptingState.getEruptingDamage();

            // 攻擊所有怪物
            const monstersKilled: Monster[] = [];
            for (const monster of map.Monster) {
                monster.HP -= damage;
                console.log(`怪物在 (${monster.x}, ${monster.y}) 受到 ${damage} 點爆發傷害！`);

                if (monster.HP <= 0) {
                    monstersKilled.push(monster);
                    console.log(`怪物在 (${monster.x}, ${monster.y}) 被爆發攻擊擊殺！`);
                }
            }

            // 移除死亡的怪物
            for (const monster of monstersKilled) {
                const index = map.Monster.indexOf(monster);
                if (index > -1) {
                    map.Monster.splice(index, 1);
                }
            }

            console.log(`💥 爆發攻擊完成！總共擊殺了 ${monstersKilled.length} 隻怪物！`);
            return;
        }

        // 普通攻擊 - 清除面前整條線上的所有怪物
        console.log(`主角在 (${this.x}, ${this.y}) 朝 ${this.getDirectionName(this.direction)} 方向發動攻擊！`);

        const monstersKilled: Monster[] = [];
        let currentX = this.x;
        let currentY = this.y;

        // 從主角位置開始，沿著面向方向檢查
        while (true) {
            // 計算下一格位置
            switch (this.direction) {
                case Direction.Up:
                    currentY -= 1;
                    break;
                case Direction.Down:
                    currentY += 1;
                    break;
                case Direction.Left:
                    currentX -= 1;
                    break;
                case Direction.Right:
                    currentX += 1;
                    break;
            }

            // 檢查是否到達地圖邊界
            if (map.IsReachEdge(currentX, currentY)) {
                break;
            }

            // 檢查該位置是否有障礙物，如果有則攻擊無法穿越
            const obstacle = map.Obstacle.find((obs: MapObj) => obs.x === currentX && obs.y === currentY);
            if (obstacle) {
                console.log(`攻擊被 (${currentX}, ${currentY}) 的障礙物阻擋！`);
                break;
            }

            // 檢查該位置是否有怪物
            const monster = map.Monster.find((mon: Monster) => mon.x === currentX && mon.y === currentY);
            if (monster) {
                monstersKilled.push(monster);
                console.log(`擊殺了位於 (${currentX}, ${currentY}) 的怪物！`);
            }
        }

        // 從地圖中移除被殺死的怪物
        for (const monster of monstersKilled) {
            const index = map.Monster.indexOf(monster);
            if (index > -1) {
                map.Monster.splice(index, 1);
            }
        }

        if (monstersKilled.length === 0) {
            console.log("攻擊沒有擊中任何怪物。");
        } else {
            console.log(`總共擊殺了 ${monstersKilled.length} 隻怪物！`);
        }
    }

    /**
     * 主角移動，包含移動結果的詳細信息
     */
    moveCharacter(direction: Direction, map: Map): boolean {

        // 通知狀態：即將執行移動動作，檢查是否被允許
        if (!this.state.OnAction(Action.Move, direction)) {
            return false; // 動作被狀態阻止
        }

        const oldX = this.x;
        const oldY = this.y;

        const success = this.Move(direction, map);

        if (success) {
            console.log(`主角從 (${oldX}, ${oldY}) 移動到 (${this.x}, ${this.y})`);
        } else {
            console.log(`主角無法從 (${oldX}, ${oldY}) 向 ${this.getDirectionName(direction)} 移動`);
        }

        return success;
    }

    /**
     * 獲取隨機方向
     */
    private getRandomDirection(): Direction {
        const directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    /**
     * 獲取方向名稱
     */
    private getDirectionName(direction: Direction): string {
        switch (direction) {
            case Direction.Up: return "上";
            case Direction.Down: return "下";
            case Direction.Left: return "左";
            case Direction.Right: return "右";
            default: return "未知";
        }
    }

    /**
     * 獲取當前狀態名稱
     */
    getStateName(): string {
        switch (this.state.constructor.name) {
            case 'Normal': return "正常";
            case 'Invincible': return "無敵";
            case 'Poisoned': return "中毒";
            case 'Accelerated': return "加速";
            case 'Healing': return "恢復";
            case 'Orderless': return "混亂";
            case 'Stockpile': return "蓄力";
            case 'Erupting': return "爆發";
            case 'Teleport': return "瞬身";
            default: return "未知";
        }
    }
}
