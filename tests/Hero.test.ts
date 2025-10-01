import { BasicAttackStrategy } from "../class/actionStrategy/BasicAttackStrategy";
import { Hero } from "../class/Hero";
import { Player } from "../class/Player";

describe('Hero', () => {
    let hero: Hero;

    beforeEach(() => {
        hero = new Hero(1, '英雄', 500, 50, 100);
    });

    test('應該正確初始化英雄屬性', () => {
        expect(hero.name).toBe('英雄');
        expect(hero.hp).toBe(500);
        expect(hero.mp).toBe(50);
        expect(hero.str).toBe(100);
        expect(hero.isAlive).toBe(true);
    });

    // 基本攻擊
    test('使用基本攻擊攻擊一個敵人', () => {

        const enemy = new Player(2, '敵人', 300, 30, 80);

        expect(hero.str).toBe(100);

        expect(enemy.hp).toBe(300);

        hero.executeAction(new BasicAttackStrategy(), [enemy]);
        expect(enemy.hp).toBe(200);
    })
})