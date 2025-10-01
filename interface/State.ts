import { Role } from "./Role";

export abstract class State {

    abstract name: string;

    duration: number;

    constructor(duration: number) {
        this.duration = duration;
    }

    /** 回合開始前 */
    onTurnStart(state: State, role: Role): Role {
        // Implement turn start logic here
        return role;
    }

    /** 攻擊前 */
    onAttack(state: State, role: Role): Role {
        // Implement attack logic here
        return role;
    }

    /** 執行動作前 */
    onDoAction(state: State, role: Role): boolean {
        // Implement action logic here
        return true;
    }
}