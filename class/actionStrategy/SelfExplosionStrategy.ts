import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";

export class SelfExplosionStrategy implements ActionStrategy {
    name = "自爆術";
    mpCost = 200;
    damage = 150;
    targetCount = -2; // 自爆術針對所有人
    executeAction(self: Role, target: Role[]): Role[] {
        if (self.mp < this.mpCost) {
            throw new Error("MP 不足，無法施放自爆術");
        } else {
            // (MP: 200 — 目標：所有敵軍＊) - 對所有目標角色造成 150 點傷害，並且行動角色自己會死亡。
            target.forEach(t => {
                t.defense(this.damage);
            });
            self.mp -= this.mpCost;
            self.hp = 0; // 行動角色自己會死亡
            self.isAlive = false;
        }

        return target;
    }
}