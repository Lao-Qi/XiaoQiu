import type { GroupchatsId } from "../lib/interface"

// 在本地存储一些一次性状态（服务器开启/重启后，该状态会恢复相应的默认值）
const xiaoqiu = {
    onOffStatus: new Map<GroupchatsId, boolean>([])
}

export { xiaoqiu }