import { Direction } from "../enum/Direction";
import { Role } from "../interface/Role";
import { Map } from "./Map";

export class Monster extends Role {

    HP: number = 1;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        // 隨機設定初始面向
        this.direction = this.getRandomDirection();
    }

    Attack(map: Map): void {
        // 怪物攻擊地圖上的角色（如果在攻擊範圍內）
        if (map.character && this.isCharacterInAttackRange(map.character)) {
            map.character.HP -= 50; // 怪物攻擊造成50點傷害
            console.log(`怪物在 (${this.x}, ${this.y}) 攻擊了角色，造成 50 點傷害！`);
        }
    }

    /**
     * 怪物的AI行動邏輯
     * @param map 地圖實例
     * @param character 主角實例
     */
    performAction(map: Map, character: Role): void {
        // 檢查主角是否在攻擊範圍內（相鄰格子）
        if (this.isCharacterInAttackRange(character)) {
            console.log(`怪物在 (${this.x}, ${this.y}) 發現主角在攻擊範圍內，進行攻擊！`);
            this.Attack(map);
        } else {
            // 嘗試朝主角方向移動，如果無法移動則隨機移動
            console.log(`怪物在 (${this.x}, ${this.y}) 嘗試移動...`);
            if (!this.moveTowardsCharacter(map, character)) {
                this.randomMove(map);
            }
        }
    }

    /**
     * 檢查角色是否在攻擊範圍內（相鄰格子）
     */
    private isCharacterInAttackRange(character: Role): boolean {
        const dx = Math.abs(this.x - character.x);
        const dy = Math.abs(this.y - character.y);

        // 檢查是否在相鄰格子（包括對角線）
        return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
    }

    /**
     * 朝角色方向移動
     */
    private moveTowardsCharacter(map: Map, character: Role): boolean {
        const dx = character.x - this.x;
        const dy = character.y - this.y;

        let preferredDirections: Direction[] = [];

        // 根據距離決定優先移動方向
        if (Math.abs(dx) > Math.abs(dy)) {
            // 水平距離較大，優先水平移動
            if (dx > 0) preferredDirections.push(Direction.Right);
            if (dx < 0) preferredDirections.push(Direction.Left);
            if (dy > 0) preferredDirections.push(Direction.Down);
            if (dy < 0) preferredDirections.push(Direction.Up);
        } else {
            // 垂直距離較大，優先垂直移動
            if (dy > 0) preferredDirections.push(Direction.Down);
            if (dy < 0) preferredDirections.push(Direction.Up);
            if (dx > 0) preferredDirections.push(Direction.Right);
            if (dx < 0) preferredDirections.push(Direction.Left);
        }

        // 嘗試按優先順序移動
        for (const direction of preferredDirections) {
            if (this.Move(direction, map)) {
                console.log(`怪物從 (${this.x - this.getDirectionOffset(direction).x}, ${this.y - this.getDirectionOffset(direction).y}) 移動到 (${this.x}, ${this.y})`);
                return true;
            }
        }

        return false;
    }

    /**
     * 隨機移動
     */
    private randomMove(map: Map): void {
        const directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
        const shuffledDirections = this.shuffleArray([...directions]);

        for (const direction of shuffledDirections) {
            if (this.Move(direction, map)) {
                console.log(`怪物隨機移動從 (${this.x - this.getDirectionOffset(direction).x}, ${this.y - this.getDirectionOffset(direction).y}) 到 (${this.x}, ${this.y})`);
                return;
            }
        }

        console.log(`怪物在 (${this.x}, ${this.y}) 無法移動`);
    }

    /**
     * 獲取方向偏移量
     */
    private getDirectionOffset(direction: Direction): { x: number, y: number } {
        switch (direction) {
            case Direction.Up: return { x: 0, y: -1 };
            case Direction.Down: return { x: 0, y: 1 };
            case Direction.Left: return { x: -1, y: 0 };
            case Direction.Right: return { x: 1, y: 0 };
            default: return { x: 0, y: 0 };
        }
    }

    /**
     * 打亂陣列順序
     */
    private shuffleArray<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * 獲取隨機方向
     */
    private getRandomDirection(): Direction {
        const directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
        return directions[Math.floor(Math.random() * directions.length)];
    }
}