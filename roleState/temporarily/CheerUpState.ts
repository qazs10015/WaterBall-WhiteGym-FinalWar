import { Role } from "../../interface/Role";
import { State } from "../../interface/State";

export class CheerUpState extends State {
    name: string = 'CheerUp-鼓舞';
    override onAttack(state: State, role: Role): Role {
        return role;
    }
}