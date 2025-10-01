import { ActionStrategy } from "../interface/ActionStrategy";
import { Role } from "../interface/Role";
import { NormalState } from "../roleState/temporarily/NormalState";

export class Hero extends Role {

    constructor(
        id: number,
        name: string,
        hp: number,
        mp: number,
        str: number,
        skill: ActionStrategy[] = [],
        state: NormalState = new NormalState(),
    ) {
        super(id, name, hp, mp, str, skill);
    }

    // 實作抽象方法 - 玩家角色的具體實作
    defense(damage: number): number {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
        }
        console.log(`${this.name} 受到 ${damage} 點傷害，剩餘 HP: ${this.hp}`);
        return this.hp;
    }

    pickAction(idx: number): ActionStrategy {
        if (idx < 0 || idx >= this.skill.length) {
            throw new Error("無效的技能編號");
        }

        return this.skill[idx];
    }

    pickTarget(roles: Role[]): Role[] {
        // 玩家角色由玩家選擇目標，這裡可以是 UI 介面
        const aliveRoles = roles.filter(role => role.isAlive);
        if (aliveRoles.length === 0) {
            throw new Error("沒有可攻擊的目標");
        }
        // 暫時返回第一個存活的目標（實際應該由玩家選擇）
        console.log(`${this.name} 選擇目標，請從可攻擊目標中選擇`);
        return aliveRoles;
    }

    executeAction(action: ActionStrategy, target: Role[]): void {
        // 執行玩家選擇的動作
        action.executeAction(this, target);
        // const damage = this.str;
        // console.log(`${this.name} 對 ${target.name} 造成 ${damage} 點傷害`);
        // target.defense(damage);
    }
}