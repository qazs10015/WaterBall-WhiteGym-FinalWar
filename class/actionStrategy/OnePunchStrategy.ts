import { Role } from '../../interface/Role';
import { ActionStrategy } from './../../interface/ActionStrategy';
export class OnePunchStrategy implements ActionStrategy {

    name = '一拳攻擊';
    mpCost = 180;
    damage = 0;
    targetCount = 1; // 一拳攻擊針對 1 位敵人

    executeAction(self: Role, target: Role[]): Role[] {
        throw new Error('Method not implemented.');
    }
}