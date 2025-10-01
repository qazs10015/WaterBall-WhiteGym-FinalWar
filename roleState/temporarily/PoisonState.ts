import { Role } from "../../interface/Role";
import { State } from "../../interface/State";
import { SpreadPositionDeBuff } from "../permanent/SpreadPositionDeBuff";
import { NormalState } from "./NormalState";

export class PoisonState extends State {

    name: string = 'Poison-中毒';

    override onTurnStart(state: State, role: Role): Role {
        if (role.hp > 0) {
            // 每回合結束時，扣除 10 點生命值
            const poisonDamage = 10;
            role.hp -= poisonDamage;
            console.log(`${role.name} 因為中毒受到 ${poisonDamage} 點傷害，剩餘 HP: ${role.hp}`);
        }

        if (role.hp <= 0) {
            role.hp = 0;
            role.isAlive = false;

            console.log(`${role.name} 因為中毒而死亡！`);

            // 角色死亡時，附加 deBuff，效果是附近的隊友會感染中毒狀態
            role.addDeBuff(new SpreadPositionDeBuff(role));

            // 傳染給隊伍中其他成員
            role.troop?.team.forEach(member => {
                if (member.isAlive && member.id !== role.id) {
                    member.changeState(this);
                    console.log(`${member.name} 因為 ${role.name} 的死亡而感染中毒狀態！`);
                }
            });

            // 角色死亡強制歸零回合數
            this.duration = 0;
        }
        return role;
    }

    override onTurnEnd(state: State, role: Role): Role {

        this.duration -= 1;

        if (this.duration <= 0) {
            console.log(`${role.name} 的 ${this.name} 狀態結束。`);
            // 狀態結束後，恢復為正常狀態
            role.changeState(new NormalState());
        }

        return role;
    }
}