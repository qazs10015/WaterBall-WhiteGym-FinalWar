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

    Move(direction: Direction) {
        this.direction = direction;
    }

    abstract Attack(target: Role): void;

    Touch(mapObj: MapObj) {
        // Obstacle
        // Treasure
    }

    EnterState(state: State) {
        state.OnExit();
        this.state = state;
        state.OnEntry();
    }
}