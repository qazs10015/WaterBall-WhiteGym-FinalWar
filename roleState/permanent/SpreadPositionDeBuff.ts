import { DeBuff } from "../../interface/Debuff";
import { Role } from "../../interface/Role";
import { PoisonState } from "../temporarily/PoisonState";

export class SpreadPositionDeBuff implements DeBuff {

    from: Role;

    constructor(from: Role) {
        this.from = from;
    }

    onRoleDead(role: Role[]): Role[] {

        // 角色附近的隊友會感染為中毒狀態
        role.forEach(member => {
            if (member.isAlive && member.id !== this.from.id) {
                member.changeState(new PoisonState(3));
                console.log(`${member.name} 因為 ${this.from.name} 的死亡而感染中毒狀態！`);
            }
        });
        return role;
    }

}