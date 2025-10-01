import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";
import { CurseDeBuff } from "../../roleState/permanent/CurseDeBuff";

export class CurseStrategy implements ActionStrategy {
    name = "詛咒術";
    mpCost = 100;
    damage = 0;
    targetCount = 1; // 詛咒術針對 1 位敵人
    executeAction(self: Role, target: Role[]): Role[] {
        if (self.mp < this.mpCost) {
            throw new Error("MP 不足，無法施放詛咒術");
        } else {
            // (MP: 100 — 目標： 1 位敵軍＊) - 目標角色會受到來自於行動角色的詛咒。
            target[0].addDeBuff(new CurseDeBuff(self));

            self.mp -= this.mpCost;
        }

        return target;
    }
}