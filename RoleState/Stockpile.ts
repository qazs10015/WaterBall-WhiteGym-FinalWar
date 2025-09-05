import { State } from "../class/State";
import { Role } from "../interface/Role";
import { Erupting } from "./Erupting";

export class Stockpile extends State {
    duration: number = 2;

    override OnEntry() {
        console.log("🔋 進入蓄力狀態！2回合後將爆發（2回合）");
    }

    override OnModifyDamage(damage: number): number {
        if (damage > 0) {
            console.log("🔋 受到攻擊，蓄力被中斷！");
            // 立即恢復正常狀態
            this.duration = 0;
        }
        return damage;
    }

    override  OnTurnEnd(role: Role) {
        if (this.duration === 0) {
            console.log("🔋 蓄力完成，進入爆發狀態！");
            role.EnterState(new Erupting());
        }
    }

    override OnExit() {
        console.log("🔋 蓄力狀態結束");
    }
}
