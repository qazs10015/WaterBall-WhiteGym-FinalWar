import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";

export class SelfHealingStrategy implements ActionStrategy {
    name = "自我治療";
    mpCost = 50;
    damage = 0;
    targetCount = 0; // 自我治療不針對任何人
    executeAction(self: Role, target: Role[]): Role[] {
        if (self.mp < this.mpCost) {
            throw new Error("MP 不足，無法施放自我治療");
        } else {
            // (MP: 50 — 目標：自己) - 增加目標角色（也就是此行動角色自己） 150 點 HP。
            self.hp += 150;
            self.mp -= this.mpCost;
        }

        return [self];
    }
}