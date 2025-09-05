import { Action } from "../enum/Action";
import { Direction } from "../enum/Direction";
import { Role } from "../interface/Role";

export abstract class State {

    /** 
     * 持續回合數
     */
    abstract duration: number;

    // protected Entry() {
    //     if (this.duration > 0) this.duration -= 1;
    //     this.OnEntry();
    // }

    OnEntry() {
    }

    OnModifyDamage(damage: number): number {
        return damage; // 默認不修改傷害
    }


    OnTurnStart(role: Role) {

    }

    OnTurnEnd(role: Role) {
        // 在回合結束時扣減持續時間
        if (this.duration > 0) {
            this.duration -= 1;
        }
    }

    // private Exit() {

    // }

    OnExit() {

    }

    OnAction(action: Action, direction: Direction): boolean {
        return true; // 默認允許所有動作
    }
}