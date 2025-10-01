import { ActionStrategy } from "./ActionStrategy";
import { Role } from "./Role";

export abstract class AI extends Role {
    seed: number = 0;

    // 每位 AI 將會存有一個 seed 屬性，初始值為 0，每位AI 依賴自己的 seed 屬性來做各項決策，每次做完一項決策，seed 的值就會＋1。

    // 在 S1 階段中，AI 會選擇第 seed % 行動數量 個行動。舉例來說，當輪到某 AI 且其 seed = 0 且
    // 擁有四項技能。則此 AI 會選擇第 0 項行動（普通攻擊），而如果 seed = 1，則AI 會選擇第1
    // 項行動（也就是技能1），如果 AI 不具備足夠 MP 來執行技能 1，則 AI 會被迫再決定一次行
    // 動，此時 seed = 2，因此 AI會選擇第 2 項行動，以此類推，直到 AI 選擇了合法的行動為止。

    // 而在 S2 階段中，AI 可能需要選擇一到多位目標角色。假設 AI 要選擇 m 位目標角色，而候選
    // 角色有n位，分別是（U1, U2，...，Un），另 s 為 AI 當前的 seed 值，則 AI 會選擇
    // （Us % n，U(s + 1) % n）...，u(s + m) % n）作為目標角色，選擇完所有目標角色後 seed 的值才會加
    // 一。舉例來說：如果 seed = 2、候選角色有三名：（A, B, C），且 AI 要選擇 2 名目標角色，則
    // 他會選擇（C, A），選完之後 seed = 3。

    // S1 階段：依照 seed 選擇行動
    protected selectActionBySeed(): ActionStrategy {
        const actions = this.getAvailableActions();
        let selectedAction;

        do {
            const actionIndex = this.seed % actions.length;
            selectedAction = actions[actionIndex];

            if (this.canExecuteAction(selectedAction)) {
                return selectedAction;
            }

            // 如果不能執行，seed + 1 重新選擇
            this.seed++;
        } while (true);
    }

    protected updateSeed(): void {
        this.seed++;
    }

    // S2 階段：依照 seed 選擇目標
    protected selectTargetsBySeed(target: Role[], targetCount: number): Role[] {
        if (target.length === 0) {
            throw new Error("沒有可選擇的目標");
        }

        const targets: Role[] = [];
        const startSeed = this.seed;

        for (let i = 0; i < targetCount; i++) {
            const targetIndex = (startSeed + i) % target.length;
            targets.push(target[targetIndex]);
        }

        // 選擇完所有目標後 seed 才 + 1
        this.seed++;

        return targets;
    }

    // 覆蓋父類的 pickAction，使用 seed 邏輯
    override pickAction(idx: number): ActionStrategy {
        const action = this.selectActionBySeed();
        console.log(`${this.name} 選擇行動: ${this.getActionName(action)} (seed: ${this.seed})`);
        return action;
    }

    // 覆蓋父類的 pickTarget，使用 seed 邏輯
    override pickTarget(roles: Role[]): Role[] {
        const candidates = this.getCandidateTargets(roles);
        const targets = this.selectTargetsBySeed(candidates, 1);
        return targets;
    }

    // 子類需要實作的方法
    /** 返回該角色可用的行動列表 */
    protected getAvailableActions(): ActionStrategy[] {
        return this.skill;
    };
    /** 檢查某個行動是否可以執行（如 MP 是否足夠） */
    protected canExecuteAction(action: ActionStrategy): boolean {
        return true
    };
    /** 返回可以選擇的目標列表 */
    protected abstract getCandidateTargets(allRoles: Role[]): Role[];
    /** 返回行動的顯示名稱 */
    protected getActionName(action: ActionStrategy): string {
        return action.name;
    }
}