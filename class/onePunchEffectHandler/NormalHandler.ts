import { State } from "../../enum/State";
import { OnePunchEffectHandler } from "../../interface/OnePunchEffectHandler";
import { Role } from "../../interface/Role";

export class NormalHandler implements OnePunchEffectHandler {
    nextHandler: OnePunchEffectHandler | null;

    constructor(handler: OnePunchEffectHandler | null) {
        this.nextHandler = handler;
    }

    // 如果目標角色的當前狀態為正常狀態，對目標角色造成 100 點傷害。
    executeOnePunchEffect(role: Role): Role | null {
        if (role.roleState.name === State.Normal) {
            role.hp -= 100;
            console.log(`${role.name} 目前處於正常狀態，受到 100 點傷害。`);
            return role;
        } else if (this.nextHandler) {
            return this.nextHandler.executeOnePunchEffect(role);
        }
        return null;
    }

}