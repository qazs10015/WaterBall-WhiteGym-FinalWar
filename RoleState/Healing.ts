import { State } from "../class/State";
import { Role } from "../interface/Role";

export class Healing extends State {
    duration: number = 5;
    maxHP: number = 300; // 假設最大血量為300

    override OnEntry() {
        console.log("💖 獲得恢復狀態！每回合恢復30點生命值（5回合）");
    }

    override OnTurnStart(role: Role) {
        if (this.duration > 0 && role.HP < this.maxHP) {
            const healAmount = Math.min(30, this.maxHP - role.HP);
            role.HP += healAmount;
            console.log(`💖 恢復效果：恢復${healAmount}點生命值，當前HP: ${role.HP}`);

            if (role.HP >= this.maxHP) {
                console.log("💖 已滿血，恢復狀態提前結束");
                this.duration = 0;
            }
        }
    }

    override OnExit() {
        console.log("💖 恢復狀態結束");
    }
}
