import { Role } from "../../interface/Role";
import { State } from "../../interface/State";

export class PetrochemicalState extends State {

    name: string = 'Petrochemical-石化';

    override onDoAction(state: State, role: Role): boolean {
        // 實作石化狀態的行為
        return true;
    }
}
