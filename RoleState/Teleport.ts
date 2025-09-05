import { State } from "../class/State";
import { Role } from "../interface/Role";

export class Teleport extends State {
    duration: number = 1;

    override  OnEntry() {
        console.log("🌀 獲得瞬身狀態！1回合後將被隨機傳送（1回合）");
    }

    override OnTurnEnd(role: Role) {
        if (this.duration === 0) {
            this.performTeleport(role);
        }
    }

    private performTeleport(role: Role) {
        // 這個方法需要地圖實例來找到空地
        // 實際實現時會在 Map 類別中處理
        console.log("🌀 瞬身效果發動，角色將被隨機傳送！");
    }

    override  OnExit() {
        console.log("🌀 瞬身狀態結束");
    }

    // 判斷是否需要執行瞬身
    shouldTeleport(): boolean {
        return this.duration === 0;
    }
}
