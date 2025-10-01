import { Role } from "../../interface/Role";
import { State } from "../../interface/State";
import { NormalState } from "./NormalState";

export class CheerUpState extends State {
    name: string = 'CheerUp-鼓舞';
    override onAttack(state: State, role: Role): Role {
        role.str += 50;
        return role;
    }

    override onTurnEnd(state: State, role: Role): Role {

        this.duration -= 1;

        if (this.duration <= 0) {
            console.log(`${role.name} 的 ${this.name} 狀態結束。`);
            // 狀態結束後，恢復為正常狀態
            role.changeState(new NormalState());
            role.str -= 50;
        }

        return role;
    }

}