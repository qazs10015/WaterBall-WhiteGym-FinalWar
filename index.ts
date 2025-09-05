import * as readline from "readline";
import { Game } from "./class/Game";
import { Direction } from "./enum/Direction";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion<T>(query: string): Promise<T> {
    return new Promise(resolve => rl.question(query, (answer) => {
        const num = parseInt(answer);
        if (!isNaN(num)) {
            resolve(num as T);
        } else if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'n') {
            resolve((answer.toLowerCase() === 'y') as T);
        } else {
            resolve(answer as T);
        }
    }));
}

async function main() {

    const game = new Game();
    game.GameStart();

    // 角色是否要上下移動
    const moveDirection = await askQuestion<string>('請選擇移動方向 1:上 2:下 3:左 4:右 (輸入數字) ');

    // 移動是否合法 
    const isValidCharacterMove = game.map?.IsReachEdge(game.map.character!.x, game.map.character!.y);
    if (isValidCharacterMove) {
        switch (moveDirection) {
            case '1':
                console.log('角色向上移動');
                game.map?.character?.Move(Direction.Up);
                break;
            case '2':
                console.log('角色向下移動');
                game.map?.character?.Move(Direction.Down);
                break;
            case '3':
                console.log('角色向左移動');
                game.map?.character?.Move(Direction.Left);
                break;
            case '4':
                console.log('角色向右移動');
                game.map?.character?.Move(Direction.Right);
                break;
            default:
                break;
        }
    }else {
        console.log('無效移動，請重新選擇移動方向');

    }

    // 怪物隨機移動
    game.map?.Monster.forEach(monster => {
        const direction = Math.floor(Math.random() * 4) + 1; // 1~4
        const isValidMonsterMove = game.map?.IsReachEdge(monster.x, monster.y);
        if (isValidMonsterMove) {
            switch (direction) {
                case Direction.Up:
                    monster.Move(Direction.Up);
                    break;
                case Direction.Down:
                    monster.Move(Direction.Down);
                    break;
                case Direction.Left:
                    monster.Move(Direction.Left);
                    break;
                case Direction.Right:
                    monster.Move(Direction.Right);
                    break;
                default:
                    break;
            }
        }
    });

    game.map?.UpdateMapInfo(game.map.size);
}


main();