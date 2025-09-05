import { TreasureItem } from "../enum/TreasureItem";
import { MapObj } from "../interface/MapObj";
import { Role } from "../interface/Role";

export class Treasure implements MapObj {
    x: number = 0;
    y: number = 0;

    item: TreasureItem | null = null;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    ExecuteItemEffect(role: Role) {

    }
}