import { Role } from '../../interface/Role';
import { CheerupHandler as CheerUpHandler } from '../onePunchEffectHandler/CheerupHandler';
import { HpMoreThan500Handler } from '../onePunchEffectHandler/HpMoreThen500Handler';
import { NormalHandler } from '../onePunchEffectHandler/NormalHandler';
import { PetrochemicalHandler } from '../onePunchEffectHandler/PetrochemicalHandler';
import { PoisonHandler } from '../onePunchEffectHandler/PoisonHandler';
import { ActionStrategy } from './../../interface/ActionStrategy';
export class OnePunchStrategy implements ActionStrategy {

    name = '一拳攻擊';
    mpCost = 180;
    damage = 0;
    targetCount = 1; // 一拳攻擊針對 1 位敵人

    executeAction(self: Role, target: Role[]): Role[] {
        return new HpMoreThan500Handler(new PetrochemicalHandler(new PoisonHandler(new CheerUpHandler(new NormalHandler(null))))).executeOnePunchEffect(target[0]) ? target : [];
    }
}