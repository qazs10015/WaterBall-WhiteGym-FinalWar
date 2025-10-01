import { Role } from "../interface/Role";
import { NormalState } from "../roleState/temporarily/NormalState";
import { Player } from "./Player";

export class Troop {
    team: Role[] = [];

    constructor() {
    }

    generateTeamMember(number: number, prefix: string): Role[] {
        const members: Role[] = [];
        for (let i = this.team.length; i < number; i++) {
            // 創建 Player 實例而不是抽象的 Role
            const member = new Player(
                i + 1,                  // id
                `${prefix}角色${i + 1}`,         // name
                500,                    // hp
                300,                    // mp
                50,                     // str
                new NormalState(),      // roleState
            );

            members.push(member);
        }
        this.team = [...this.team, ...members]; // 修正：應該是添加到現有團隊，而不是替換
        return members;
    }

    getAliveTeamMember(): Role[] {
        return this.team.filter(member => member.isAlive);
    }

    getSpecificTeamMember(id: number[]): Role[] {
        return this.getAliveTeamMember().filter(member => id.includes(member.id));
    }

    addNewTeamMember(role: Role): Role[] {
        this.team.push(role);
        return this.team;
    }
}