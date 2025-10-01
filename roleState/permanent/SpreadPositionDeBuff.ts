import { DeBuff } from "../../interface/Debuff";
import { Role } from "../../interface/Role";

export class SpreadPositionDeBuff implements DeBuff {

    from: Role;

    constructor(from: Role) {
        this.from = from;
    }

    onRoleDead(role: Role[]): Role[] {

        // 角色附近的隊友會感染為中毒狀態

        return role;
    }

}