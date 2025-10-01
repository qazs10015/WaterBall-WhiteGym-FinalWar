
import { NormalState } from "../roleState/temporarily/NormalState";
import { ActionStrategy } from "./ActionStrategy";
import { DeBuff } from "./Debuff";
import { State } from "./State";

export abstract class Role {
    id: number;
    hp: number;
    mp: number;
    str: number;
    roleState: State;
    name: string;
    skill: ActionStrategy[];
    deBuff: DeBuff[];
    phase: number;
    isAlive: boolean;

    constructor(
        id: number,
        name: string,
        hp: number,
        mp: number,
        str: number,
        skill: ActionStrategy[] = [],
        roleState: State = new NormalState(),
        deBuff: DeBuff[] = [],
        phase: number = 0,
        isAlive: boolean = true
    ) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.mp = mp;
        this.str = str;
        this.roleState = roleState;
        this.skill = skill;
        this.deBuff = deBuff;
        this.phase = phase;
        this.isAlive = isAlive;
    }

    // 抽象方法，子類必須實作
    abstract defense(damage: number): number;

    abstract pickAction(idx: number): ActionStrategy;
    abstract pickTarget(roles: Role[]): Role[];
    abstract executeAction(action: ActionStrategy, target: Role[]): void;

    // 預設實作，子類可以覆蓋

    showSkillList() {
        console.log(this.skill.map((item, idx) => `${idx}: ${item.name}`).join(", "));
    }

    addDeBuff(deBuff: DeBuff): DeBuff[] {
        this.deBuff.push(deBuff);
        return this.deBuff;
    }

    removeDeBuff(deBuff: DeBuff): DeBuff[] {
        const index = this.deBuff.indexOf(deBuff);
        if (index > -1) {
            this.deBuff.splice(index, 1);
        }
        return this.deBuff;
    }

    changeState(state: State): void {
        this.roleState = state;
        console.log(`${this.name} 的狀態變更為 ${state.constructor.name}`);
    }

    nextPhase() {
        this.phase++;
        console.log(`${this.name} 進入 S${this.phase}`);
    }

    resetPhase() {
        this.phase = 0;
        console.log('行動階段結束');
    }
}