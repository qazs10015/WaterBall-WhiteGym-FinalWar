import { Map } from "./Map";

export class Game {

    map: Map | null = null;


    GameStart() {
        this.map = new Map(5);

    }

    GameEnd() {

    }
}