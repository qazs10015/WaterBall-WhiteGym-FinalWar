import { State } from "../class/State";
import { Role } from "../interface/Role";
import { Teleport } from "./Teleport";

export class Erupting extends State {
    duration: number = 3;


    override OnEntry() {
        console.log("💥 進入爆發狀態！攻擊範圍擴充至全地圖（3回合）");
    }

    override OnTurnEnd(role: Role) {
        if (this.duration === 0) {
            console.log("💥 爆發狀態結束，獲得瞬身狀態！");
            role.EnterState(new Teleport());
        }
    }

    override OnExit() {
        console.log("💥 爆發狀態結束");
    }

    // 判斷是否為爆發狀態的攻擊
    isEruptingAttack(): boolean {
        return this.duration > 0;
    }

    // 爆發狀態下的攻擊力
    getEruptingDamage(): number {
        return 50;
    }
}
