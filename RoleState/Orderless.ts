import { State } from "../class/State";
import { Action } from "../enum/Action";
import { Direction } from "../enum/Direction";
import { Role } from "../interface/Role";

export class Orderless extends State {
    duration: number = 3;
    currentRestriction: 'vertical' | 'horizontal' = 'vertical';
    actionRestriction: 'moveOnly' | 'attackOnly' | 'none' = 'none';

    override OnEntry() {
        console.log("🌀 陷入混亂狀態！移動和動作受到限制（3回合）");
        this.randomizeRestriction();
    }

    override OnTurnStart(role: Role) {
        if (this.duration > 0) {
            this.randomizeRestriction();
            const restrictionText = this.currentRestriction === 'vertical' ? '上下' : '左右';
            const actionText = this.actionRestriction === 'moveOnly' ? '（只能移動）' :
                this.actionRestriction === 'attackOnly' ? '（只能攻擊）' : '';
            console.log(`🌀 混亂效果：本回合只能進行${restrictionText}移動${actionText}`);
        }
    }

    private randomizeRestriction() {
        this.currentRestriction = Math.random() < 0.5 ? 'vertical' : 'horizontal';

        // 隨機決定動作限制
        const rand = Math.random();
        if (rand < 0.33) {
            this.actionRestriction = 'moveOnly';
        } else if (rand < 0.66) {
            this.actionRestriction = 'attackOnly';
        } else {
            this.actionRestriction = 'none';
        }
    }

    canMove(direction: Direction): boolean {
        if (this.duration <= 0) return true;

        if (this.currentRestriction === 'vertical') {
            return direction === Direction.Up || direction === Direction.Down;
        } else {
            return direction === Direction.Left || direction === Direction.Right;
        }
    }

    override OnAction(action: Action, direction: Direction): boolean {
        if (this.duration <= 0) return true;

        if (this.actionRestriction === 'moveOnly' && action === Action.Attack) {
            console.log("🌀 混亂狀態：當前回合無法攻擊，只能移動！");
            return false;
        }

        if (this.actionRestriction === 'attackOnly' && action === Action.Move) {
            console.log("🌀 混亂狀態：當前回合無法移動，只能攻擊！");
            return false;
        }

        // 如果是移動動作，檢查方向限制
        if (action === Action.Move && direction) {
            if (!this.canMove(direction)) {
                const restrictionText = this.currentRestriction === 'vertical' ? '上下' : '左右';
                const directionName = this.getDirectionName(direction);
                console.log(`🌀 混亂狀態：當前只能進行${restrictionText}移動，無法朝${directionName}移動！`);
                return false;
            }
        }

        return true;
    }

    private getDirectionName(direction: Direction): string {
        switch (direction) {
            case Direction.Up: return "上";
            case Direction.Down: return "下";
            case Direction.Left: return "左";
            case Direction.Right: return "右";
            default: return "未知";
        }
    }

    override OnExit() {
        console.log("🌀 混亂狀態結束");
    }
}
