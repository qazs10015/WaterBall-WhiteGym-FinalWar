import { Hero } from '../class/Hero';
import { Slime } from '../class/Slime';
import { Troop } from '../class/Troop';

describe('Troop', () => {
    let troop: Troop;

    beforeEach(() => {
        troop = new Troop();
    });

    test('應該正確初始化空的團隊', () => {
        expect(troop.team).toEqual([]);
        expect(troop.team.length).toBe(0);
    });

    test('應該能生成指定數量的團隊成員', () => {
        const members = troop.generateTeamMember(3);

        expect(members).toHaveLength(3);
        expect(troop.team).toHaveLength(3);

        // 檢查每個成員的屬性
        members.forEach((member, index) => {
            expect(member.id).toBe(index + 1);
            expect(member.name).toBe(`角色${index + 1}`);
            expect(member.hp).toBe(500);
            expect(member.mp).toBe(300);
            expect(member.str).toBe(50);
            expect(member.isAlive).toBe(true);
        });
    });

    test('應該能在現有團隊基礎上增加成員', () => {
        // 先生成 2 個成員
        troop.generateTeamMember(2);
        expect(troop.team).toHaveLength(2);

        // 再生成到 5 個成員
        const newMembers = troop.generateTeamMember(5);
        expect(newMembers).toHaveLength(3); // 只新增了 3 個
        expect(troop.team).toHaveLength(5); // 總共 5 個

        // 檢查 ID 是否連續
        troop.team.forEach((member, index) => {
            expect(member.id).toBe(index + 1);
        });
    });

    test('應該能添加單個團隊成員', () => {
        const hero = new Hero(99, '自定義英雄', 200, 100, 60);
        const result = troop.addNewTeamMember(hero);

        expect(troop.team).toHaveLength(1);
        expect(troop.team[0]).toBe(hero);
        expect(result).toBe(troop.team);
    });

    test('應該能正確篩選存活的團隊成員', () => {
        // 生成一些成員
        troop.generateTeamMember(3);

        // 讓一個成員死亡
        troop.team[1].hp = 0;
        troop.team[1].isAlive = false;

        const aliveMembers = troop.getAliveTeamMember();

        expect(aliveMembers).toHaveLength(2);
        expect(aliveMembers).toContain(troop.team[0]);
        expect(aliveMembers).toContain(troop.team[2]);
        expect(aliveMembers).not.toContain(troop.team[1]);
    });

    test('當所有成員都死亡時應該返回空陣列', () => {
        troop.generateTeamMember(2);

        // 讓所有成員死亡
        troop.team.forEach(member => {
            member.hp = 0;
            member.isAlive = false;
        });

        const aliveMembers = troop.getAliveTeamMember();
        expect(aliveMembers).toHaveLength(0);
    });

    test('應該能混合不同類型的角色', () => {
        const hero = new Hero(1, '英雄', 200, 100, 60);
        const slime = new Slime();

        troop.addNewTeamMember(hero);
        troop.addNewTeamMember(slime);

        expect(troop.team).toHaveLength(2);
        expect(troop.team[0]).toBeInstanceOf(Hero);
        expect(troop.team[1]).toBeInstanceOf(Slime);
    });
});