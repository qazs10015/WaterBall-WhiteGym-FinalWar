import { Role } from "./Role";

export interface ActionStrategy {
    name: string;
    mpCost: number;
    damage: number;

    targetCount: number; // 可選屬性，表示目標數量

    executeAction(self: Role, target: Role[]): Role[];
}