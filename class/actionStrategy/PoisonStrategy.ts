import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";
import { PoisonState } from "../../roleState/temporarily/PoisonState";

export class PoisonStrategy implements ActionStrategy {
    name = "中毒術";
    mpCost = 80;
    damage = 0;
    targetCount = 1; // 中毒術針對 1 位敵人

    executeAction(self: Role, target: Role[]): Role[] {
        // (MP: 80 — 目標： 1 位敵軍＊) - 使目標角色獲得三回合的中毒狀態（包含當前回合）
        if (self.mp < this.mpCost) {
            throw new Error("MP 不足，無法施放中毒術");
        } else {
            target.forEach(t => {
                t.changeState(new PoisonState(3));
            });
            self.mp -= this.mpCost;
        }

        return target;
    }
}