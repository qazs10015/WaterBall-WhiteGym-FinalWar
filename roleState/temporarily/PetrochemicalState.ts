import { Role } from "../../interface/Role";
import { State } from "../../interface/State";
import { NormalState } from "./NormalState";

export class PetrochemicalState extends State {

    name: string = 'Petrochemical-石化';

    override onDoAction(state: State, role: Role): boolean {
        // 實作石化狀態的行為
        console.log(`${role.name} 被石化，無法行動！`);

        return false;
    }

    override onTurnEnd(state: State, role: Role): Role {

        this.duration -= 1;

        if (this.duration <= 0) {
            console.log(`${role.name} 的 ${this.name} 狀態結束。`);
            // 狀態結束後，恢復為正常狀態
            role.changeState(new NormalState());
        }

        return role;
    }
}
