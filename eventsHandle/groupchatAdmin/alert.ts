/**
 * [警告]指令：
 * 撤回指定成员的全部消息，并禁言15分钟
 */
import path from 'path'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '警告',
    reg: [
        /^警告\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
        /^严重警告\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
        /^记过\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
        /^留群察看\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
    ],
    role: 'admin',
    member: ({ user: { name }, other: { role }, operations: { at, promiseImage } }) => [
        `${at('user')} 等你成为管理就可以警告别人了`,
        `${at('user')} 这指令只有管理or群主才可以触发哦~`,
        `${at('user')} 想弄${role === 'admin' ? '管理' : '群主'}搞事情？`,
        `${at('other')} ${name}想要警告你${promiseImage(path.resolve('./assets/images/emoji/麻了1.jpg'))}`
    ],
    admin: ({ user: { name }, operations: { at } }) => [
        `${at('other')} 小秋发现管理员${name}对您发出了[警告]指令，因此小秋已撤回您1小时内所有消息，并禁言以作警告`,
        `${at('other')} 呜呜呜 小秋被臭管理逮到了，${name}对您发出了[警告]指令，因此小秋已撤回您1小时内所有消息，并禁言以作警告`,
        `${at('other')} 请务必文明发言。[本次已撤回您1小时内所有消息，并禁言以作警告]`
    ],
    owner: ({ user: { name }, operations: { at } }) => [
        `${at('other')} 小秋发现群主大人${name}对您发出了[警告]指令，因此小秋已撤回您1小时内所有消息，并禁言以作警告`,
        `${at('other')} 呜呜呜 小秋被臭群主逮到了，${name}对您发出了[警告]指令，因此小秋已撤回您1小时内所有消息，并禁言以作警告`,
        `${at('other')} 请务必文明发言。[本次已撤回您1小时内所有消息，并禁言以作警告]`
    ],
    deverDefined: ({ other: { name, sex }, defined: { counts }, operations: { at } }) => [
        [
            `${at('other')} 您在本群已累计违规${counts}次，小秋已做出相应处罚，悉知`,
            `${at('other')} 您在本群已违规${counts}次，请务必积极讨论技术！`,
            `OMG！${name}在本群已违规${counts}次，孰可忍是不可忍！小秋必须对${sex ? '他' : '她'}进行一些惩罚`,
        ]
    ],
    equal: ({ user: { name: username }, other: { name: othername }, operations: { at, face } }) => [
        `${at('user')} 嗯？？大家都是同道中人，干嘛要禁言${othername}呢`,
        `${at('user')} 糟了 小秋无法帮您进行警告`,
        `${at('other')} ${username}要警告你！${face(278)}`
    ],
    level: ({ operations: { at } }) => [
        `${at('user')} 抱歉 小秋权限不足 暂时不能帮您执行警告操作哦~`,
        `${at('user')} 小秋暂无此权限`
    ]
}
const fn: CommandFn = async originData => {
    const { bot, group, other, raw_message, operations, database } = originData
    const { getDataBaseData, formSet: { user_info, groups_config } } = database
    // 读取当前用户所对应的信息
    const value = await getDataBaseData(user_info.name, user_info.retrieveData)(group.id)
    if (!value[other.id]) value[other.id] = { alertCounts: 0 }
    // 根据不同的警告等级增加不同的违规次数
    const whiceCounts = [
        [/警告/g, 1],
        [/严重警告/g, 2],
        [/记过/g, 3],
        [/留群察看/g, 4],
    ] as const
    const resultCount = whiceCounts.find(reg => reg[0].test(raw_message))![1]
    value[other.id].alertCounts += resultCount
    const counts = value[other.id].alertCounts
    // 读取该群所对应的群配置
    const groupConfig = await getDataBaseData(groups_config.name, groups_config.retrieveData)(group.id)
    const punishments = groupConfig.punishment.alertCounts
    const curPunishments = punishments[counts - 1] || punishments[punishments.length - 1]
    // 执行对应的惩罚
    const { delMsg, banMins, isKick } = curPunishments
    operations.delMsg(group.id, other.id, delMsg)
    operations.banMember(group.id, other.id, '分钟', banMins)
    isKick ? bot.setGroupKick(group.id, other.id) : null
    // 修改当前用户的违规次数
    await getDataBaseData(user_info.name, user_info.updateData)(group.id, value)
    return { items: 1, args: { counts } }
}
const alert = { fn, sendContent }

export { alert }
