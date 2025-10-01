import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";

export class WaterBallStrategy implements ActionStrategy {
    name = "水球術";
    mpCost = 50;
    damage = 120;
    targetCount = 1; // 水球術針對 1 位敵人
    executeAction(self: Role, target: Role[]): Role[] {
        if (self.mp < this.mpCost) {
            throw new Error("MP 不足，無法施放水球術");
        } else {
            // (MP: 50 — 目標：1 位敵軍＊) - 對目標角色造成 120 點傷害。
            target.forEach(t => {
                t.defense(this.damage);
            });
            self.mp -= this.mpCost;
        }

        return target;
    }
}