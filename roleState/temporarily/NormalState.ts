import { State } from "../../interface/State";

export class NormalState extends State {
    name: string = 'Normal-正常';

    constructor() {
        super(0);
    }

    // onTurnStart(state: State, role: Role): Role {
    //     throw new Error("Method not implemented.");
    // }
    // onAttack(state: State, role: Role): Role {
    //     throw new Error("Method not implemented.");
    // }
    // onDoAction(state: State, role: Role): Role {
    //     throw new Error("Method not implemented.");
    // }

}