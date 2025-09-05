import { Action } from "../enum/Action";
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
        if (this.duration > 0) this.duration -= 1;
    }

    OnModifyDamage(damage: number) {
    }


    OnTurnStart(role: Role) {

    }

    OnTurnEnd(role: Role) {

    }

    // private Exit() {

    // }

    OnExit() {

    }

    OnAction(action: Action) {

    }
}