import { Role } from "../../interface/Role";
import { State } from "../../interface/State";

export class PoisonState extends State {

    name: string = 'Poison-中毒';

    override onTurnStart(state: State, role: Role): Role {
        return role;
    }
}