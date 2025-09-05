import { Map } from "../class/Map";
import { State } from "../class/State";
import { Direction } from "../enum/Direction";
import { Normal } from "../RoleState/Normal";
import { MapObj } from "./MapObj";

export abstract class Role implements MapObj {

    /** x 座標 */
    x: number = 0;

    /** y 座標 */
    y: number = 0;

    /**
     * 血量
     */
    abstract HP: number;

    /**
     * 狀態
     */
    state: State = new Normal();

    /**
     * 面向
     * 1: 上
     * 2: 下
     * 3: 左
     * 4: 右
     */
    direction: Direction = Direction.Up;

    /**
     * 移動到指定方向
     * @param direction 移動方向
     * @param map 地圖實例，用於檢查碰撞
     * @returns 是否成功移動
     */
    Move(direction: Direction, map?: Map): boolean {
        this.direction = direction;

        if (!map) return false;

        // 計算新位置
        const newPos = this.getNewPosition(direction);

        // 檢查是否到達地圖邊界
        if (map.IsReachEdge(newPos.x, newPos.y)) {
            return false; // 不能移出地圖邊界
        }

        // 檢查新位置是否有其他物件
        const objectAtNewPos = this.getObjectAtPosition(newPos.x, newPos.y, map);

        if (objectAtNewPos) {
            // 發生觸碰
            const touchResult = this.Touch(objectAtNewPos);
            if (touchResult === 'treasure') {
                // 觸碰到寶藏，可以移動到該位置並消耗寶藏
                map.RemoveMapObj(objectAtNewPos);
                this.x = newPos.x;
                this.y = newPos.y;
                return true;
            } else {
                // 其他物件阻擋移動
                return false;
            }
        }

        // 沒有障礙物，可以移動
        this.x = newPos.x;
        this.y = newPos.y;
        return true;
    }

    /**
     * 根據方向計算新位置
     */
    private getNewPosition(direction: Direction): { x: number, y: number } {
        let newX = this.x;
        let newY = this.y;

        switch (direction) {
            case Direction.Up:
                newY -= 1;
                break;
            case Direction.Down:
                newY += 1;
                break;
            case Direction.Left:
                newX -= 1;
                break;
            case Direction.Right:
                newX += 1;
                break;
        }

        return { x: newX, y: newY };
    }

    /**
     * 檢查指定位置是否有物件
     */
    private getObjectAtPosition(x: number, y: number, map: Map): MapObj | null {
        // 檢查是否有其他角色在該位置
        for (const obj of map.currentMapObj) {
            if (obj && obj !== this && obj.x === x && obj.y === y) {
                return obj;
            }
        }
        return null;
    }

    abstract Attack(map: Map): void;

    Touch(mapObj: MapObj) {
        console.log(`角色在 (${this.x}, ${this.y}) 觸碰到了位於 (${mapObj.x}, ${mapObj.y}) 的物件`);

        // 處理不同類型的物件觸碰
        if (mapObj.constructor.name === 'Obstacle') {
            console.log("觸碰到障礙物，無法通過！");
        } else if (mapObj.constructor.name === 'Treasure') {
            // 使用類型斷言來調用 ExecuteItemEffect 方法
            (mapObj as any).ExecuteItemEffect(this);
            return 'treasure'; // 返回特殊標記表示觸碰到寶藏
        } else if (mapObj.constructor.name === 'Monster' || mapObj.constructor.name === 'Character') {
            console.log("觸碰到其他角色，無法佔據同一格！");
        }
        return null;
    }

    EnterState(state: State) {
        state.OnExit();
        this.state = state;
        state.OnEntry();
    }
}