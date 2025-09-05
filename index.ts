import * as readline from "readline";
import { Game } from "./class/Game";
import { Direction } from "./enum/Direction";

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
    console.log("🎮 歡迎來到二維地圖冒險遊戲！");
    console.log("目標：消滅所有怪物並保持生存！\n");

    const game = new Game();
    game.GameStart();

    if (!game.map || !game.map.character) {
        console.log("❌ 遊戲初始化失敗");
        rl.close();
        return;
    }

    // 主遊戲循環
    while (true) {
        // 主角回合開始處理
        if (game.map.character.onTurnStart) {
            game.map.character.onTurnStart();
        }

        // 顯示當前遊戲狀態
        console.log("\n" + "=".repeat(50));
        console.log(`🦸 主角血量: ${game.map.character.HP}/${game.map.character.maxHP || 300}`);
        console.log(`🎯 剩餘怪物: ${game.map.Monster.length}`);
        console.log(`📍 主角位置: (${game.map.character.x}, ${game.map.character.y})`);
        console.log(`👁️  面向方向: ${getDirectionName(game.map.character.direction)}`);
        if (game.map.character.getStateName) {
            console.log(`✨ 當前狀態: ${game.map.character.getStateName()}${game.map.character.state.duration > 0 ? ` (剩餘${game.map.character.state.duration}回合)` : ''}`);
        }
        console.log("=".repeat(50));

        // 顯示地圖
        game.map.UpdateMapInfo(game.map.size);

        // 檢查遊戲是否結束
        const gameStatus = game.map.isGameOver();
        if (gameStatus.isOver) {
            console.log("\n🎯 " + gameStatus.reason);
            break;
        }

        // 玩家選擇動作
        const action = await askQuestion<string>('\n請選擇動作:\n1: 向上移動\n2: 向下移動\n3: 向左移動\n4: 向右移動\n5: 攻擊\n6: 退出遊戲\n請輸入選擇 (1-6): ');

        // 處理玩家動作
        let actionSuccess = false;
        if (game.map?.character) {
            switch (action.trim()) {
                case '1':
                    console.log('\n向上移動...');
                    actionSuccess = game.map.character.moveCharacter(Direction.Up, game.map);
                    break;
                case '2':
                    console.log('\n向下移動...');
                    actionSuccess = game.map.character.moveCharacter(Direction.Down, game.map);
                    break;
                case '3':
                    console.log('\n向左移動...');
                    actionSuccess = game.map.character.moveCharacter(Direction.Left, game.map);
                    break;
                case '4':
                    console.log('\n向右移動...');
                    actionSuccess = game.map.character.moveCharacter(Direction.Right, game.map);
                    break;
                case '5':
                    console.log('\n執行攻擊...');
                    game.map.character.Attack(game.map);
                    actionSuccess = true; // 攻擊總是可以執行
                    break;
                case '6':
                    console.log('\n結束遊戲！');
                    rl.close();
                    return;
                default:
                    console.log('\n❌ 無效輸入，請輸入 1-6 之間的數字');
                    continue;
            }

            if (!actionSuccess && action !== '5') {
                console.log('💥 動作失敗！');
            }
        }

        // 主角回合結束處理
        if (game.map.character.onTurnEnd) {
            game.map.character.onTurnEnd();
        }

        // 執行怪物回合
        if (game.map) {
            game.map.executeMonsterTurns();
        }

        // 添加小延遲讓玩家有時間閱讀信息
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 遊戲結束，關閉 readline
    rl.close();
}

function getDirectionName(direction: number): string {
    switch (direction) {
        case 1: return "上 ⬆️";
        case 2: return "下 ⬇️";
        case 3: return "左 ⬅️";
        case 4: return "右 ➡️";
        default: return "未知";
    }
}


main();