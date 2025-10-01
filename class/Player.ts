import { ActionStrategy } from "../interface/ActionStrategy";
import { AI } from "../interface/AI";
import { Role } from "../interface/Role";
import { State } from "../interface/State";
import { NormalState } from "../roleState/temporarily/NormalState";
import { BasicAttackStrategy } from "./actionStrategy/BasicAttackStrategy";
import { FireBallStrategy } from "./actionStrategy/FireballStrategy";
import { WaterBallStrategy } from "./actionStrategy/WaterBallStrategy";

export class Player extends AI {

    constructor(
        id: number,
        name: string,
        hp: number,
        mp: number,
        str: number,
        state: State = new NormalState(),
        skills: ActionStrategy[] = [],
    ) {
        // 為 Player 設置技能：基本攻擊、火球術、水球術
        if (skills.length === 0) {
            skills = [
                new FireBallStrategy(),
                new WaterBallStrategy(),
                new BasicAttackStrategy(),
            ];
        }

        super(id, name, hp, mp, str, skills, state);
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
        console.log(`${this.name} 對 ${target.map(t => t.name).join(", ")} 使用了 ${action.name}。`);

        // 呼叫技能的 executeAction 方法
        action.executeAction(this, target);

        // 顯示傷害結果
        target.forEach(t => {
            if (action.damage > 0) {
                console.log(`${this.name} 對 ${t.name} 造成 ${action.damage} 點傷害。`);
            }

            // 檢查目標是否死亡
            if (!t.isAlive) {
                console.log(`${t.name} 死亡。`);
            }
        });
    }

    // 實作 AI 抽象方法
    protected getAvailableActions(): ActionStrategy[] {
        return this.skill;
    }

    protected getCandidateTargets(allRoles: Role[]): Role[] {
        // 玩家可以攻擊所有存活的敵人
        return allRoles.filter(role => role.isAlive);
    }

    protected canExecuteAction(action: ActionStrategy): boolean {
        // 檢查是否有足夠的 MP
        return this.mp >= action.mpCost;
    }
}