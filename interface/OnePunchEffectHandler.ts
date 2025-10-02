import { Role } from "./Role";

export interface OnePunchEffectHandler {

    nextHandler: OnePunchEffectHandler | null;

    executeOnePunchEffect(role: Role): Role | null;
}