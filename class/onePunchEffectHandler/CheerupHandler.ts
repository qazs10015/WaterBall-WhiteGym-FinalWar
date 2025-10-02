import { State } from "../../enum/State";
import { OnePunchEffectHandler } from "../../interface/OnePunchEffectHandler";
import { Role } from "../../interface/Role";
import { NormalState } from "../../roleState/temporarily/NormalState";

export class CheerupHandler implements OnePunchEffectHandler {

    nextHandler: OnePunchEffectHandler | null = null;

    constructor(handler: OnePunchEffectHandler | null) {
        this.nextHandler = handler;
    }

    // 如果目標角色的當前狀態為受到鼓舞狀態，對目標角色造成 100 點傷害，並將目標角色的狀態恢復成正常狀態。
    executeOnePunchEffect(role: Role): Role | null {
        if (role.roleState.name === State.CheerUp) {
            role.hp -= 100;
            console.log(`${role.name} 受到 100 點傷害，並且鼓舞狀態結束，恢復為正常狀態。`);
            // 狀態結束後，恢復為正常狀態
            role.changeState(new NormalState());
            return role;
        } else if (this.nextHandler) {
            return this.nextHandler.executeOnePunchEffect(role);
        }
        return null;
    }
}