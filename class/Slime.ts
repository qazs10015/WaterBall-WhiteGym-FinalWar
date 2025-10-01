import { ActionStrategy } from "../interface/ActionStrategy";
import { AI } from "../interface/AI";
import { Role } from "../interface/Role";
import { BasicAttackStrategy } from "./actionStrategy/BasicAttackStrategy";

export class Slime extends AI {

    constructor() {


        super(
            0,                    // id
            "史萊姆",             // name
            100,                  // hp
            0,                    // mp
            50,                   // str
            [new BasicAttackStrategy()]
        );
    }

    // 實作 Role 抽象方法
    defense(damage: number): number {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
        }
        return this.hp;
    }

    executeAction(action: ActionStrategy, target: Role[]): void {
        // const damage = this.str;
        // console.log(`${this.name} 對 ${target.name} 造成 ${damage} 點傷害`);
        // target.defense(damage);
    }

    // 實作 AI 抽象方法
    protected getAvailableSkills(): ActionStrategy[] {
        return this.skill;
    }

    protected getCandidateTargets(allRoles: Role[]): Role[] {
        return allRoles;
    }

    protected canExecuteAction(action: ActionStrategy): boolean {
        return true;
    }
} 