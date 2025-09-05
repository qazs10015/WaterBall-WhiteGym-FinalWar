import { State } from "../class/State";
import { Role } from "../interface/Role";

export class Poisoned extends State {
    duration: number = 3;

    override OnEntry() {
        super.OnEntry();
        console.log("💚 中毒了！每回合失去15點生命值（3回合）");
    }

    override OnTurnStart(role: Role) {
        if (this.duration > 0) {
            role.HP -= 15;
            console.log(`💚 中毒效果：失去15點生命值，當前HP: ${role.HP}`);

            if (role.HP <= 0) {
                console.log("💀 因中毒而死亡！");
            }
        }
    }

    override OnExit() {
        console.log("💚 中毒狀態結束");
    }
}
