import { DeBuff } from "../../interface/Debuff";
import { Role } from "../../interface/Role";

export class CurseDeBuff implements DeBuff {

    from: Role;

    constructor(from: Role) {
        this.from = from;
    }

    onRoleDead(role: Role[]): Role[] {
        // 當受詛咒者死亡時且施咒者仍活著，施咒者的 HP 將會被加上受詛咒者的剩餘 MP。
        // 每一位角色都可能受到多次詛咒。如果詛咒是來自於同一位施咒者，效果並不會疊加；
        // 而如果詛咒是來自於不同位施咒者，則每一位施咒者都將在受詛咒者死亡時獲得相同數量的剩餘 MP。
        if (this.from.isAlive) {
            const totalMp = role.reduce((acc, r) => acc + r.mp, 0);
            this.from.hp += totalMp;
            console.log(`${this.from.name} 因為 ${role.map(r => r.name).join("、")} 的死亡，獲得 ${totalMp} 點 HP！`);
        }
        return role;
    }
}