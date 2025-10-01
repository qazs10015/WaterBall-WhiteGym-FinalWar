import { ActionStrategy } from "../interface/ActionStrategy";
import { AI } from "../interface/AI";
import { Role } from "../interface/Role";
import { BasicAttackStrategy } from "./actionStrategy/BasicAttackStrategy";

export class Slime extends AI {

    constructor() {

        super(
            0,                    // id (會在 Troop.generateTeamMember 中重新設置)
            "史萊姆",             // name
            200,                  // hp
            300,                  // mp  
            50,                   // str
            [new BasicAttackStrategy()]// Slime 只有基本攻擊
        );
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
        // Slime 攻擊一位敵人
        return allRoles.filter(role => role.isAlive);
    }

    protected canExecuteAction(action: ActionStrategy): boolean {
        // 檢查是否有足夠的 MP
        return this.mp >= action.mpCost;
    }
} 