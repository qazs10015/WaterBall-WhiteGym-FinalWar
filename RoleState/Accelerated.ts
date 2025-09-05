import { State } from "../class/State";
import { Role } from "../interface/Role";

export class Accelerated extends State {
    duration: number = 3;
    hasUsedExtraAction: boolean = false;

    override OnEntry() {
        console.log("⚡ 獲得加速狀態！每回合可進行兩次動作（3回合）");
    }

    override OnModifyDamage(damage: number): number {
        if (damage > 0) {
            console.log("⚡ 受到攻擊，加速狀態被中斷！");
            // 立即恢復正常狀態
            this.duration = 0;
        }
        return damage;
    }

    override OnExit() {
        console.log("⚡ 加速狀態結束");
    }

    canPerformExtraAction(): boolean {
        return !this.hasUsedExtraAction && this.duration > 0;
    }

    useExtraAction() {
        this.hasUsedExtraAction = true;
    }

    override OnTurnEnd(role: Role) {
        this.hasUsedExtraAction = false; // 重置每回合的額外動作標記
    }
}
