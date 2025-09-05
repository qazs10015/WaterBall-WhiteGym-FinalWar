import { MapObj } from "../interface/MapObj";
import { Character } from './Character';
import { Monster } from './Monster';
import { Obstacle } from "./Obstacle";
import { Treasure } from "./Treasure";

export class Map {
    /** 
     * 地圖尺寸
    */
    size: number = 0;

    character: Character | null = null;
    Monster: Monster[] = [];
    Obstacle: MapObj[] = [];
    Treasure: MapObj[] = [];


    get currentMapObj() {
        return [this.character, ...this.Monster, ...this.Treasure, ...this.Obstacle];
    }

    constructor(size: number) {

        this.size = size;
        this.InitMapObj();
    }

    InitMapObj() {

        const occupiedPositions = new Set<string>();

        const { x, y } = this.GetUniquePosition(occupiedPositions);
        this.character = new Character(x, y);

        // 隨機產生3~5個怪物並放置在不重複的位置
        const monsterCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < monsterCount; i++) {
            const { x, y } = this.GetUniquePosition(occupiedPositions);
            const monster = new Monster(x, y);
            this.Monster.push(monster);
        }

        // 隨機產生3~5個寶物並放置在不重複的位置
        const treasureCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < treasureCount; i++) {
            const { x, y } = this.GetUniquePosition(occupiedPositions);
            const treasure: Treasure = new Treasure(x, y);
            this.Treasure.push(treasure);
        }

        // 隨機產生3~5個障礙物並放置在不重複的位置
        const obstacleCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < obstacleCount; i++) {
            const { x, y } = this.GetUniquePosition(occupiedPositions);
            const obstacle: MapObj = { x, y };
            this.Obstacle.push(obstacle);
        }

        this.UpdateMapInfo(this.size);

    }

    /** 顯示目前地圖資訊 */
    UpdateMapInfo(size: number) {

        // 創建空白地圖
        const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill('　'));

        this.currentMapObj.forEach(obj => {
            if (obj) {
                let symbol = '　';
                if (obj instanceof Character) symbol = '🦸';
                else if (obj instanceof Monster) symbol = '👹';
                else if (obj instanceof Treasure) symbol = '💎';
                else if (obj instanceof Obstacle) symbol = '🧱';

                grid[obj.y][obj.x] = symbol;
            }
        });

        // 印出地圖
        console.log('   ' + Array.from({ length: size }, (_, i) => i).join('  '));
        grid.forEach((row, y) => {
            console.log(`${y}  ${row.join(' ')}`);
        });
    }

    RemoveMapObj(mapObj: MapObj) {
        // 從相應的陣列中移除物件
        if (mapObj instanceof Monster) {
            const index = this.Monster.indexOf(mapObj);
            if (index > -1) {
                this.Monster.splice(index, 1);
            }
        } else if (mapObj instanceof Treasure) {
            const index = this.Treasure.indexOf(mapObj);
            if (index > -1) {
                this.Treasure.splice(index, 1);
            }
        } else {
            // 處理障礙物
            const index = this.Obstacle.indexOf(mapObj);
            if (index > -1) {
                this.Obstacle.splice(index, 1);
            }
        }
    }

    /**
     * 執行所有怪物的回合
     */
    executeMonsterTurns(): void {
        if (!this.character) return;

        console.log("=== 怪物回合開始 ===");

        // 為每個怪物執行行動，使用倒序遍歷避免陣列修改問題
        for (let i = this.Monster.length - 1; i >= 0; i--) {
            const monster = this.Monster[i];
            if (monster.HP > 0) {
                monster.performAction(this, this.character);
            } else {
                // 移除死亡的怪物
                this.Monster.splice(i, 1);
                console.log(`怪物在 (${monster.x}, ${monster.y}) 已死亡，從地圖上移除`);
            }
        }

        console.log("=== 怪物回合結束 ===");
    }

    /**
     * 檢查遊戲是否結束
     */
    isGameOver(): { isOver: boolean, reason: string } {
        if (!this.character || this.character.HP <= 0) {
            return { isOver: true, reason: "主角死亡，遊戲結束！" };
        }

        if (this.Monster.length === 0) {
            return { isOver: true, reason: "所有怪物已被消滅，恭喜獲勝！" };
        }

        return { isOver: false, reason: "" };
    }

    // 判斷是否到達地圖邊界
    IsReachEdge(x: number, y: number) {
        return x < 0 || x >= this.size || y < 0 || y >= this.size;
    }

    // 隨機的地圖位置
    private RandomPosition() {
        const x = Math.floor(Math.random() * this.size);
        const y = Math.floor(Math.random() * this.size);
        return { x, y };
    }

    // 獲取不重複的位置
    private GetUniquePosition(occupiedPositions: Set<string>) {
        let x: number, y: number, positionKey: string;
        do {
            const position = this.RandomPosition();
            x = position.x;
            y = position.y;
            positionKey = `${x},${y}`;
        } while (occupiedPositions.has(positionKey));

        occupiedPositions.add(positionKey);
        return { x, y };
    }

}