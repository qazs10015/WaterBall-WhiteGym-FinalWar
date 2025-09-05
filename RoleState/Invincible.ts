import { State } from "../class/State";

export class Invincible extends State {
    duration: number = 2;

    override OnEntry() {
        console.log("🌟 獲得無敵狀態！（2回合）");
    }

    override OnModifyDamage(damage: number): number {
        console.log("✨ 無敵狀態生效，免疫傷害！");
        return 0; // 無敵狀態下不受任何傷害
    }

    override OnExit() {
        console.log("🌟 無敵狀態結束");
    }
}
