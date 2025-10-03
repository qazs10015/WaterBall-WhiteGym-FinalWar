import { ActionStrategy } from "../../interface/ActionStrategy";
import { Role } from "../../interface/Role";
import { Slime } from "../Slime";

export class SummonStrategy implements ActionStrategy {
    name = "召喚術";
    mpCost = 150;
    damage = 0;
    targetCount = 0; // 召喚術不針對任何人
    executeAction(self: Role, target: Role[]): Role[] {
        // (MP: 150 — 目標： 無) - 召喚一位「史萊姆(Slime)」 角色。
        // 史萊姆擁有 100 HP、0 MP、50 STR，沒有任何技能，並且初始為正常狀態。
        // 此史萊姆角色將會加入行動角色所屬軍隊的尾端，並且，在此回合中史萊姆已能開始行動。
        // 另外，當史萊姆死亡時且召喚者仍活著，召喚者可以增加 30 點 HP。
        if (self.mp < 150) {
            throw new Error("MP 不足，無法召喚");
        }

        self.troop?.addNewTeamMember(this.summonSlime());

        return [self];
    }

    private summonSlime(): Role {
        return new Slime();
    }
}