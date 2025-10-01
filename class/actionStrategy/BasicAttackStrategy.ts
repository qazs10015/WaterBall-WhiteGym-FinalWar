import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";

export class BasicAttackStrategy implements ActionStrategy {
    name = "基本攻擊";
    mpCost = 0;
    damage = 0;
    targetCount = 1; // 基本攻擊針對 1 位敵人

    executeAction(self: Role, target: Role[]): Role[] {
        // (MP: 0 — 目標： 1 位敵軍＊) - 對目標角色造成值為行動角色 STR 的傷害。
        // （例如：如果行動角色的 STR 為 100，則會對目標角色造成 100 傷害）
        this.damage = self.str;
        target.forEach(t => {
            t.defense(this.damage);

            console.log(`${self.name} 攻擊 ${t.name}`);
        });
        return target;
    }
}