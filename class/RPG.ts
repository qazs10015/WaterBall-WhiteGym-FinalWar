import { BasicAttackStrategy } from './actionStrategy/BasicAttackStrategy';
import { CheerUpStrategy } from './actionStrategy/CheerUpStrategy';

import { CurseStrategy } from './actionStrategy/CurseStrategy';
import { FireBallStrategy } from './actionStrategy/FireballStrategy';
import { OnePunchStrategy } from './actionStrategy/OnePunchStrategy';
import { PetrochemicalStrategy } from './actionStrategy/PetrochemicalStrategy';
import { PoisonStrategy } from './actionStrategy/PoisonStrategy';
import { SelfExplosionStrategy } from './actionStrategy/SelfExplosionStrategy';
import { SelfHealingStrategy } from './actionStrategy/SelfHealingStrategy';
import { SummonStrategy } from './actionStrategy/SummonStrategy';
import { WaterBallStrategy } from './actionStrategy/WaterBallStrategy';
import { Hero } from './Hero';
import { Troop } from './Troop';

export class RPG {
    round: number = 1;

    teams: Troop[] = [];


    get team1(): Troop {
        return this.teams[0];
    }

    set team1(value: Troop) {
        this.teams[0] = value;
    }

    get team2(): Troop {
        return this.teams[1];
    }

    set team2(value: Troop) {
        this.teams[1] = value;
    }

    constructor() {
    }

    startGame() {
        console.log("RPG startGame");
        console.log(`第 ${this.round} 回合開始`);

        // 初始化遊戲狀態，設定雙方隊伍
        this.generateTeam1();
        this.generateTeam2();

        return "遊戲開始！";
    }

    endGame() {
        console.log("RPG endGame");
    }

    isEndGame(): boolean {
        // 當 S3 結束後，RPG 會檢查此場戰鬥是否結束。
        // 如果(1) 英雄 h 死亡，或是(2) 其中一方軍隊已被殲滅，則戰鬥結束；
        // 否則戰鬥繼續

        // 檢查隊伍1是否有存活成員
        const team1Alive = this.team1?.getAliveTeamMember().length || 0;
        // 檢查隊伍2是否有存活成員  
        const team2Alive = this.team2?.getAliveTeamMember().length || 0;

        // 檢查英雄是否死亡（假設英雄是隊伍1的第一個成員）
        const heroAlive = this.team1?.team[0]?.isAlive || false;

        return !heroAlive || team1Alive === 0 || team2Alive === 0;
    }

    private generateTeam1() {
        // Hero 固定在隊伍1的第一個位置
        const hero = new Hero(
            1,                      // id
            "Hero",                 // name
            1000,                   // hp
            500,                    // mp
            100,                    // str
            [
                new BasicAttackStrategy(),
                new SelfHealingStrategy(),
                new WaterBallStrategy(),
                new FireBallStrategy(),
                new PetrochemicalStrategy(),
                new PoisonStrategy(),
                new SummonStrategy(),
                new SelfExplosionStrategy(),
                new CurseStrategy(),
                new CheerUpStrategy(),
                new OnePunchStrategy()
            ]
        );

        this.team1 = new Troop();
        this.team1.addNewTeamMember(hero);
        this.team1.generateTeamMember(5);

        console.log(`隊伍1 成員: ${this.team1.team.map(member => member.name).join(", ")}`);
    }

    private generateTeam2() {
        this.team2 = new Troop();
        this.team2.generateTeamMember(5);

        console.log(`隊伍2 成員: ${this.team2.team.map(member => member.name).join(", ")}`);
    }
}