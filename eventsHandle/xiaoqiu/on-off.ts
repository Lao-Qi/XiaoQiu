/**
 * [开机/关机]指令：
 * 使小秋处于开启或关闭状态
 */
import { AuthId } from '../../lib/user'
import { xiaoqiu } from '../../recordStatus/xiaoqiu'

import type { SendContent, CommandFn, GroupchatsId } from '../../lib/interface'

// 切换开关机状态
const switchOnOffStatus = (id: GroupchatsId, items: number) => {
    xiaoqiu.onOffStatus.set(id, !xiaoqiu.onOffStatus.get(id))
    return items
}

const sendContent: SendContent = {
    name: '开关机',
    reg: [
        /^开机$/,
        /^关机$/
    ],
    role: [AuthId.FuncJin],
    member: ({ user: { name, sex }, operations: { at } }) => [
        `${at('user')} ${sex ? '老弟' : '老妹'}你今天休想使用这个指令`,
        `${at('user')} 小秋发现您的权限不足`,
        `${name}，请默写出Vue3后再来试试吧~`,
    ],
    admin: ({ user: { name, sex }, operations: { at } }) => [
        `天啦噜~ 管理员也不可以任意使用该指令哦`,
        `${at('user')} 小秋发现您的管理权限不足`,
        `${name}，尊敬的管理${sex ? '哥哥' : '姐姐'} 您暂时无法使用该指令`,
    ],
    owner: ({ user: { name, sex }, operations: { at } }) => [
        `天啦噜~ 群主也不可以使用该指令哦`,
        `${at('user')} 颜值过高无法使用该指令`,
        `${name}，尊贵的群主${sex ? '哥哥' : '姐姐'} 您暂时无法使用该指令`,
    ],
    deverDefined: ({ user: { name }, operations: { at, face } }) => [
        [
            `${at('user')} 已经处于开机状态了哦~`,
            `${at('user')} 开机状态下无需重复开机`,
            `${name}，小秋已经处于运行状态 因此无需按下开机键`,
        ],
        [
            `小秋终于睡醒啦，快来和小秋玩耍吧~`,
            `${at('user')} 你已成功启动小秋`,
            `${name}，小秋赶到公司啦 开始上班！`
        ],
        [
            `小秋已下班${face(178)}`,
            `${at('user')} 你已关闭小秋`,
            `${name}，小秋已被关闭`
        ],
        [
            `${at('user')} 已经处于关闭状态了哦~`,
            `${at('user')} 无法再次关闭小秋`
        ]
    ],
}
// 关机后，小秋会停止监听所有事件（例如消息事件、入群事件、...）
const fn: CommandFn = originData => {
    const { group: { id }, reg } = originData
    const { onOffStatus } = xiaoqiu
    // 检测本次操作是开机还是关机
    const isOn = reg.test('开机')
    // 开机指令下检测是否已经处于开机状态
    if (isOn) return { items: onOffStatus.get(id) ? 1 : switchOnOffStatus(id, 2) }
    // 关机指令下检测是否已经处于关机状态
    return { items: onOffStatus.get(id) ? switchOnOffStatus(id, 3) : 4 }
}
const onOff = { fn, sendContent }

export { onOff }
