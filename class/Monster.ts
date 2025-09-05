import { Role } from "../interface/Role";

export class Monster extends Role {

    HP: number = 1;
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    Attack(target: Role): void {
        // ex:target.HP -= 1;
    }
}
