import { ActionStrategy } from "../interface/ActionStrategy";
import { AI } from "../interface/AI";
import { Role } from "../interface/Role";
import { State } from "../interface/State";
import { NormalState } from "../roleState/temporarily/NormalState";

export class Player extends AI {


    constructor(
        id: number,
        name: string,
        hp: number,
        mp: number,
        str: number,
        state: State = new NormalState(),
    ) {
        super(id, name, hp, mp, str);
    }

    // 實作 Role 抽象方法
    defense(damage: number): number {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
        }
        console.log(`${this.name} 受到 ${damage} 點傷害，剩餘 HP: ${this.hp}`);
        return this.hp;
    }

    executeAction(action: ActionStrategy, target: Role[]): void {
        // 根據選擇的行動執行攻擊
        const damage = this.str;
        target.forEach(t => {
            console.log(`${this.name} 對 ${t.name} 造成 ${damage} 點傷害`);
            t.defense(damage);
        });
    }

    // 實作 AI 抽象方法
    protected getAvailableSkills(): ActionStrategy[] {

        return this.skill;
    }

    protected getCandidateTargets(allRoles: Role[]): Role[] {
        // 玩家可以攻擊所有存活的敵人
        return allRoles;
    }

}