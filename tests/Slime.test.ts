import { Hero } from '../class/Hero';
import { Slime } from '../class/Slime';

describe('Slime', () => {
    let slime: Slime;

    beforeEach(() => {
        slime = new Slime();
    });

    test('應該正確初始化史萊姆屬性', () => {
        expect(slime.name).toBe('史萊姆');
        expect(slime.hp).toBe(100);
        expect(slime.mp).toBe(0);
        expect(slime.str).toBe(50);
        expect(slime.isAlive).toBe(true);
        expect(slime.seed).toBe(0);
    });

    test('受到傷害後應該正確扣血', () => {
        const damage = 30;
        const remainingHp = slime.defense(damage);

        expect(slime.hp).toBe(70);
        expect(remainingHp).toBe(70);
        expect(slime.isAlive).toBe(true);
    });

    test('當 HP 降到 0 或以下時應該死亡', () => {
        const damage = 150; // 超過史萊姆的 HP
        slime.defense(damage);

        expect(slime.hp).toBe(0);
        expect(slime.isAlive).toBe(false);
    });

    test('應該返回正確的可用技能', () => {
        const skills = (slime as any).getAvailableSkills();
        expect(Array.isArray(skills)).toBe(true);
        expect(skills).toEqual(slime.skill);
    });

    test('應該正確選擇候選目標', () => {
        const hero = new Hero(1, '英雄', 100, 50, 40); // 移除 roleState 參數
        const roles = [slime, hero];

        const candidates = (slime as any).getCandidateTargets(roles);
        expect(candidates).toEqual(roles); // 包含所有角色
    });

    test('應該能執行任何行動', () => {
        // 由於 canExecuteAction 總是返回 true
        const canExecute = (slime as any).canExecuteAction({});
        expect(canExecute).toBe(true);
    });

    test('seed 屬性應該正確初始化', () => {
        expect(slime.seed).toBe(0);

        // 測試 seed 可以被修改
        slime.seed = 5;
        expect(slime.seed).toBe(5);
    });

    test('史萊姆應該正確繼承 AI 類', () => {
        // 檢查史萊姆是否有 AI 的 seed 屬性
        expect(slime).toHaveProperty('seed');
        expect(typeof slime.seed).toBe('number');
    });
});