import { Role } from "./Role";

export interface DeBuff {

    from: Role;

    /** 角色死亡時觸發 */

    onRoleDead(role: Role[]): Role[];

}