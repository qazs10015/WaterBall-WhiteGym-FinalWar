import { OnePunchEffectHandler } from "../../interface/OnePunchEffectHandler";
import { Role } from "../../interface/Role";

export class HpMoreThan500Handler implements OnePunchEffectHandler {
    nextHandler: OnePunchEffectHandler | null = null;

    constructor(handler: OnePunchEffectHandler) {
        this.nextHandler = handler;
    }

    // 如果目標角色的生命值 ≥ 500，直接對目標角色造成 300 點傷害。
    executeOnePunchEffect(role: Role): Role | null {
        if (role.hp >= 500) {
            role.hp -= 300;
            console.log(`${role.name} 生命值 >= 500，受到 300 點傷害。`);
            return role;
        } else if (this.nextHandler) {
            return this.nextHandler.executeOnePunchEffect(role);
        }
        return null;
    }
}