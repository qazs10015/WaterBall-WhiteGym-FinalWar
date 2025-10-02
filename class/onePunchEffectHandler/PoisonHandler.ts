import { State } from "../../enum/State";
import { OnePunchEffectHandler } from "../../interface/OnePunchEffectHandler";
import { Role } from "../../interface/Role";

export class PoisonHandler implements OnePunchEffectHandler {
    nextHandler: OnePunchEffectHandler | null = null;

    constructor(handler: OnePunchEffectHandler | null) {
        this.nextHandler = handler;
    }

    // 如果目標角色的當前狀態為中毒狀態或是石化狀態，對目標角色造成三次 80 點傷害。
    executeOnePunchEffect(role: Role): Role | null {
        if (role.roleState.name === State.Poison) {
            role.hp -= 80;
            console.log(`${role.name} 目前處於中毒狀態，受到 80 點傷害。`);

            role.hp -= 80;
            console.log(`${role.name} 目前處於中毒狀態，受到 80 點傷害。`);

            role.hp -= 80;
            console.log(`${role.name} 目前處於中毒狀態，受到 80 點傷害。`);
            return role;
        } else if (this.nextHandler) {
            return this.nextHandler.executeOnePunchEffect(role);
        }
        return null;
    }
}