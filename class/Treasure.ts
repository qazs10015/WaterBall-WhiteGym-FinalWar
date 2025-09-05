import { TreasureItem } from "../enum/TreasureItem";
import { MapObj } from "../interface/MapObj";
import { Role } from "../interface/Role";
import { Accelerated } from "../RoleState/Accelerated";
import { Healing } from "../RoleState/Healing";
import { Invincible } from "../RoleState/Invincible";
import { Orderless } from "../RoleState/Orderless";
import { Poisoned } from "../RoleState/Poisoned";
import { Stockpile } from "../RoleState/Stockpile";
import { Teleport } from "../RoleState/Teleport";

export class Treasure implements MapObj {
    x: number = 0;
    y: number = 0;
    item: TreasureItem;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.item = this.generateRandomItem();
    }

    /**
     * 根據機率隨機生成寶物內容
     */
    private generateRandomItem(): TreasureItem {
        const random = Math.random();

        // 根據機率分配寶物
        if (random < 0.1) return TreasureItem.SuperStar;           // 0.1
        else if (random < 0.35) return TreasureItem.Poison;        // 0.25
        else if (random < 0.55) return TreasureItem.AccelerationPotion; // 0.2
        else if (random < 0.7) return TreasureItem.HealingPotion;  // 0.15
        else if (random < 0.8) return TreasureItem.DevilFruit;     // 0.1
        else if (random < 0.9) return TreasureItem.KingsRock;      // 0.1
        else return TreasureItem.DokodemoDoor;                     // 0.1
    }

    /**
     * 執行寶物效果
     */
    ExecuteItemEffect(role: Role) {
        console.log(`🎁 觸碰到寶物：${this.getItemName()}`);

        switch (this.item) {
            case TreasureItem.SuperStar:
                role.EnterState(new Invincible());
                break;
            case TreasureItem.Poison:
                role.EnterState(new Poisoned());
                break;
            case TreasureItem.AccelerationPotion:
                role.EnterState(new Accelerated());
                break;
            case TreasureItem.HealingPotion:
                role.EnterState(new Healing());
                break;
            case TreasureItem.DevilFruit:
                role.EnterState(new Orderless());
                break;
            case TreasureItem.KingsRock:
                role.EnterState(new Stockpile());
                break;
            case TreasureItem.DokodemoDoor:
                role.EnterState(new Teleport());
                break;
        }
    }

    /**
     * 獲取寶物名稱
     */
    private getItemName(): string {
        switch (this.item) {
            case TreasureItem.SuperStar: return "無敵星星";
            case TreasureItem.Poison: return "毒藥";
            case TreasureItem.AccelerationPotion: return "加速藥水";
            case TreasureItem.HealingPotion: return "補血罐";
            case TreasureItem.DevilFruit: return "惡魔果實";
            case TreasureItem.KingsRock: return "王者之印";
            case TreasureItem.DokodemoDoor: return "任意門";
            default: return "未知寶物";
        }
    }

    // /**
    //  * 獲取寶物顯示符號
    //  */
    // getDisplaySymbol(): string {
    //     switch (this.item) {
    //         case TreasureItem.SuperStar: return "⭐";
    //         case TreasureItem.Poison: return "💚";
    //         case TreasureItem.AccelerationPotion: return "⚡";
    //         case TreasureItem.HealingPotion: return "💖";
    //         case TreasureItem.DevilFruit: return "🍎";
    //         case TreasureItem.KingsRock: return "💎";
    //         case TreasureItem.DokodemoDoor: return "🚪";
    //         default: return "💎";
    //     }
    // }
}