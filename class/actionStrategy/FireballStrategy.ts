import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";

export class FireBallStrategy implements ActionStrategy {
    name = "火球術";
    mpCost = 50;
    damage = 50;
    targetCount = -1; // 火球術針對所有敵軍
    executeAction(self: Role, target: Role[]): Role[] {
        if (self.mp < this.mpCost) {
            throw new Error("MP 不足，無法施放火球術");
        } else {
            // (MP: 50 — 目標：所有敵軍＊) - 對所有目標角色造成 50 點傷害。
            target.forEach(t => {
                t.defense(this.damage);
            });
            self.mp -= this.mpCost;
        }

        return target;
    }
}
