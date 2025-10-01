import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";
import { CheerUpState } from "../../roleState/temporarily/CheerUpState";

export class CheerUpStrategy implements ActionStrategy {
    name = "鼓舞術";
    mpCost = 100;
    damage = 0;
    targetCount = 3; // 鼓舞術針對 3 位友軍
    executeAction(self: Role, target: Role[]): Role[] {
        // (MP: 100 — 目標：3 位友軍＊) - 使所有目標角色獲得三回合的受到鼓舞狀態（包含當前回合）
        if (self.mp < this.mpCost) {
            throw new Error("MP 不足，無法施放鼓舞術");
        } else {
            target.forEach(t => {
                t.changeState(new CheerUpState(3));
            });
            self.mp -= this.mpCost;
        }

        return target;
    }
}