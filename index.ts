import * as readline from "readline";
import { RPG } from "./class/RPG";
import { Role } from "./interface/Role";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion<T>(query: string): Promise<T> {
    return new Promise(resolve => rl.question(query, (answer) => {
        // 對於字符串類型，直接返回輸入值
        resolve(answer as T);
    }));
}

async function main() {
    const rpg = new RPG();
    console.log(rpg.startGame());


    // 遊戲主循環
    while (!rpg.isEndGame()) {
        // 取得當前隊伍和敵對隊伍
        const currentTeamIndex = (rpg.round - 1) % 2;
        const currentTeam = rpg.teams[currentTeamIndex];
        const enemyTeam = rpg.teams[1 - currentTeamIndex];

        const aliveMembers = currentTeam?.getAliveTeamMember() || [];

        console.log(`\n=== 隊伍 ${currentTeamIndex + 1} 的回合 ===`);

        // 當前隊伍的所有存活成員依序行動
        for (const role of aliveMembers) {
            if (rpg.isEndGame()) break;

            // 回合開始前的狀態處理
            role.roleState.onTurnStart(role.roleState, role);

            // 檢查角色是否可以行動
            if (role.roleState.onDoAction(role.roleState, role)) {
                console.log(`\n輪到 ${role.name} (HP: ${role.hp}, MP: ${role.mp}, STR: ${role.str}, State: ${role.roleState.name})。`);

                // S1: 進入行動階段
                role.nextPhase();

                let pickedAction = null;
                let targets: Role[] = [];

                // 判斷是否為玩家控制的角色 (Hero)
                if (role.name === 'Hero') {
                    // 玩家控制 - 需要用戶輸入，包含 MP 驗證
                    let validAction = false;
                    while (!validAction) {
                        console.log(`選擇行動：${role.skill.map((item, idx) => `(${idx}) ${item.name}`).join(" ")}`);
                        const skillIdx = await askQuestion<string>('請輸入行動編號：');
                        const selectedAction = role.skill[parseInt(skillIdx)];

                        // 檢查 MP 是否足夠
                        if (selectedAction && role.mp >= selectedAction.mpCost) {
                            pickedAction = selectedAction;
                            validAction = true;
                        } else if (selectedAction) {
                            console.log(`你缺乏 MP，不能進行此行動。`);
                            console.log(`${selectedAction.name} 需要 ${selectedAction.mpCost} MP，但你只有 ${role.mp} MP。`);
                        } else {
                            console.log(`無效的行動編號，請重新選擇。`);
                        }
                    }

                    // S2
                    role.nextPhase();

                    const targetCount = pickedAction?.targetCount || 0;
                    if (targetCount !== 0) {
                        if (targetCount === -1) {
                            // 火球術：攻擊所有敵人
                            targets = enemyTeam.getAliveTeamMember();
                            console.log(`選擇所有敵人: ${enemyTeam.getAliveTeamMember().map((member, idx) => `(${idx}) ${member.name}`).join(" ")}`);
                        } else if (targetCount === -2) {
                            // 自爆術：攻擊所有人（包括己方和敵方）
                            const allTargets = [
                                ...currentTeam.getAliveTeamMember(),
                                ...enemyTeam.getAliveTeamMember()
                            ];
                            targets = allTargets;
                            console.log(`選擇所有人: ${allTargets.map((member, idx) => `(${idx}) ${member.name}`).join(" ")}`);
                        } else {
                            const selectedTarget = await askQuestion<string>(`選擇 ${targetCount} 位目標: ${enemyTeam.getAliveTeamMember().map((member, idx) => `(${idx}) ${member.name}`).join(" ")}，請以空格分開目標編號，例如 "0 2": `);
                            const pickedEnemyIdxList = selectedTarget.split(' ').map(numStr => parseInt(numStr)).filter(num => !isNaN(num));

                            // 驗證輸入
                            const maxValidIndex = enemyTeam.getAliveTeamMember().length - 1;
                            function isValidInput(list: number[]): boolean {
                                return list.length === targetCount &&
                                    list.every(idx => idx >= 0 && idx <= maxValidIndex);
                            }

                            while (!isValidInput(pickedEnemyIdxList)) {
                                const invalidIndex = pickedEnemyIdxList.findIndex(item => item > maxValidIndex || item < 0);

                                if (invalidIndex !== -1) {
                                    console.log(`❌ 目標編號必須在 0 到 ${maxValidIndex} 之間，你輸入了 ${pickedEnemyIdxList[invalidIndex]}`);
                                } else if (pickedEnemyIdxList.length < targetCount) {
                                    console.log(`❌ 你需要選擇 ${targetCount} 位目標，但只選了 ${pickedEnemyIdxList.length} 位`);
                                } else if (pickedEnemyIdxList.length > targetCount) {
                                    console.log(`❌ 你只能選擇 ${targetCount} 位目標，但選了 ${pickedEnemyIdxList.length} 位`);
                                }

                                const retry = await askQuestion<string>(
                                    `請重新選擇 ${targetCount} 位目標: ${enemyTeam.getAliveTeamMember().map((m, i) => `(${i}) ${m.name}`).join(" ")}: `
                                );
                                const newList = retry.split(' ').map(s => parseInt(s)).filter(n => !isNaN(n));
                                pickedEnemyIdxList.splice(0, pickedEnemyIdxList.length, ...newList);
                            }

                            targets = pickedEnemyIdxList.map(idx => enemyTeam.getAliveTeamMember()[idx]).filter(member => member !== undefined);
                        }
                    }
                } else {
                    // AI 控制 - 自動執行
                    pickedAction = role.pickAction(0);

                    // S2
                    role.nextPhase();

                    // AI 根據技能類型自動選擇目標範圍
                    let targetPool: Role[] = [];
                    const targetCount = pickedAction?.targetCount || 0;

                    if (targetCount === -1) {
                        // 火球術：只攻擊敵人
                        targetPool = enemyTeam.getAliveTeamMember();
                    } else if (targetCount === -2) {
                        // 自爆術：攻擊所有人
                        targetPool = [
                            ...currentTeam.getAliveTeamMember(),
                            ...enemyTeam.getAliveTeamMember()
                        ];
                    } else {
                        // 其他技能：攻擊敵人
                        targetPool = enemyTeam.getAliveTeamMember();
                    }

                    targets = role.pickTarget(targetPool);
                }

                // S3: 執行行動
                role.nextPhase();

                if (pickedAction && targets.length >= 0) {

                    // 執行動作前有狀態需要處理
                    const _role = role.roleState.onAttack(role.roleState, role);
                    _role.executeAction(pickedAction, targets);


                }

            } else {
                console.log(`${role.name} 目前狀態為 ${role.roleState.name}，無法行動。`);
            }


            // 重置階段
            role.resetPhase();
        }

        // 切換到下一個隊伍（下一回合）
        rpg.round++;

        console.log(`第 ${rpg.round + 1} 回合開始`);
    }

    // 遊戲結束
    rpg.endGame();
    rl.close();
}

// 啟動遊戲
main().catch(console.error);