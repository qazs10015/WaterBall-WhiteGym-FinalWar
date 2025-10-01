import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";
import { PetrochemicalState } from "../../roleState/temporarily/PetrochemicalState";

export class PetrochemicalStrategy implements ActionStrategy {
    name = "石化術";
    mpCost = 100;
    damage = 0;
    targetCount = 1; // 石化術針對 1 位敵人
    executeAction(self: Role, target: Role[]): Role[] {
        if (self.mp < this.mpCost) {
            throw new Error("MP 不足，無法施放石化術");
        } else {
            // (MP: 100 — 目標：1 位敵軍＊) - 使目標角色獲得三回合的石化狀態（包含當前回合）
            target.forEach(t => {
                t.changeState(new PetrochemicalState(3));
            });
            self.mp -= this.mpCost;
        }

        return target;
    }
}
