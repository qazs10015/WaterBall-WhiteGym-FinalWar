import * as readline from "readline";
import { Hero } from "./class/Hero";
import { RPG } from "./class/RPG";
import { AI } from "./interface/AI";

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

    // 開始遊戲
    // 隊伍 1 先開始
    // 目前角色順序編號
    let roleOrderIdx = 0;
    const currentTeam = rpg.teams[rpg.round - 1 % 2 ? 1 : 0]; // 主隊伍
    const enemyTeam = rpg.teams[rpg.round - 1 % 2 ? 0 : 1]; // 敵對隊伍

    const memberCount = currentTeam?.getAliveTeamMember().length || 0;
    const aliveMembers = currentTeam?.getAliveTeamMember() || [];

    // console.log(currentTeam);

    while (!rpg.isEndGame()) {
        const role = aliveMembers[roleOrderIdx]; // 直接使用索引取得角色

        // 輪到 <角色名稱> (HP: <HP>, MP: <MP>, STR: <STR>, State: <狀態>)。
        console.log(`輪到 ${role?.name} (HP: ${role?.hp}, MP: ${role?.mp}, STR: ${role?.str}, State: ${role?.roleState.name})。`);

        // S1
        role?.nextPhase();

        // 英雄的選擇行為
        if (role instanceof Hero) {
            const skillIdx = await askQuestion<string>(`選擇行動:${role.skill.map((item, idx) => `(${idx}) <${item.name}>`).join(" ")}`);
            const targetCount = role.skill[parseInt(skillIdx)]?.targetCount || 0;
            const pickedAction = role.skill[parseInt(skillIdx)];

            // S2
            role?.nextPhase();

            const selectedTarget = await askQuestion<string>(`選擇 ${targetCount} 位目標: ${enemyTeam.getAliveTeamMember().map((member, idx) => `(${idx}) <${member.name}>`)}`);

            const pickedEnemyIdxList = selectedTarget.split(' ').map(numStr => parseInt(numStr)).filter(num => !isNaN(num));

            // targetCount > 0 才需要指定
            if (targetCount > 0) {
                // 驗證輸入並重試直到正確
                const maxValidIndex = enemyTeam.getAliveTeamMember().length - 1;

                // 檢查輸入是否合法（數量和範圍都要正確）
                function isValidInput(list: number[]): boolean {
                    return list.length === targetCount &&
                        list.every(idx => idx >= 0 && idx <= maxValidIndex);
                }

                while (!isValidInput(pickedEnemyIdxList)) {
                    const invalidIndex = pickedEnemyIdxList.findIndex(item => item > maxValidIndex || item < 0);

                    // 根據不同的錯誤情況顯示對應的錯誤訊息
                    if (invalidIndex !== -1) {
                        console.log(`❌ 目標編號必須在 0 到 ${maxValidIndex} 之間，你輸入了 ${pickedEnemyIdxList[invalidIndex]}`);
                    } else if (pickedEnemyIdxList.length < targetCount) {
                        console.log(`❌ 你需要選擇 ${targetCount} 位目標，但只選了 ${pickedEnemyIdxList.length} 位`);
                    } else if (pickedEnemyIdxList.length > targetCount) {
                        console.log(`❌ 你只能選擇 ${targetCount} 位目標，但選了 ${pickedEnemyIdxList.length} 位`);
                    }

                    const retry = await askQuestion<string>(
                        `請重新選擇 ${targetCount} 位目標: ${enemyTeam.getAliveTeamMember().map((m, i) => `(${i}) <${m.name}>`).join(" ")}`
                    );
                    const newList = retry.split(' ').map(s => parseInt(s)).filter(n => !isNaN(n));
                    // 更新原陣列內容（pickedEnemyIdxList 為 const，但內容可變）
                    pickedEnemyIdxList.splice(0, pickedEnemyIdxList.length, ...newList);
                }
            }

            const pickedEnemy = pickedEnemyIdxList.map(idx => enemyTeam.getAliveTeamMember()[idx]).filter(member => member !== undefined);
            console.log(pickedEnemy);
            const targets = role.pickTarget(pickedEnemy);

            // S3
            role.nextPhase();
            role.executeAction(pickedAction, targets);


        } else if (role instanceof AI) {

        }

        role.resetPhase();
        roleOrderIdx++;


    }
}


main();