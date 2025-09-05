import { Role } from "../interface/Role";

export class Character extends Role {

    HP: number = 300;
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    Attack(target: Role): void {
        // ex:target.HP -= 10;
    }
} 
