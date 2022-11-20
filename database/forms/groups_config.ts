import { operationSql } from '../tools'

import type { GroupsConfig, DataBaseDataType } from './interface'
import type { GroupchatsId } from '../../lib/interface'

type GroupsConfigRecord = Promise<DataBaseDataType['groups_config']['recordRow']>
type GroupsConfigUpdate = Promise<DataBaseDataType['groups_config']['updateData']>
type GroupsConfigRetrieve = Promise<DataBaseDataType['groups_config']['retrieveData']>

const groupsConfigTemp: GroupsConfig = {
    draw: {
        discount: 5,
        timestamp: 0
    },
    setCard: {
        isAuto: true,
        content: '又有大佬来了，群地位-1'
    },
    events: {
        message: true,
        increase: true,
        ban: true,
        decrease: true,
        poke: true
    },
    score: {
        dailyLimit: 4
    },
    punishment: {
        /**
         * alertCounts数组中有几项成员，就代表违规第几次所对应的惩罚，比如违规了2次，则执行数组中第二个成员(下标为1)所对应的惩罚；
         * 若违规次数大于数组成员数量(违规了6次，但数组中只有5个成员)，则按照数组最后一位成员所规定的措施进行惩罚
         */
        alertCounts: [
            { delMsg: 30, banMins: 0 },
            { delMsg: 30, banMins: 10 },
            { delMsg: 30, banMins: 60 * 1 },
            { delMsg: 30, banMins: 60 * 24 * 7 },
            { delMsg: 30, banMins: 60 * 24 * 14, isKick: true },
        ]
    }
}

const create = {
    recordRow: async (id: GroupchatsId): GroupsConfigRecord =>
        await operationSql(`insert into groups_config(group_id,config) values('${id}','${JSON.stringify(groupsConfigTemp)}')`)
}
const update = {
    updateData: async (id: GroupchatsId, config: GroupsConfig): GroupsConfigUpdate =>
        await operationSql(`update groups_config set config='${JSON.stringify(config)}' where group_id='${id}'`)
}
const retrieve = {
    retrieveData: async (id: GroupchatsId): GroupsConfigRetrieve =>
        await operationSql(`select config from groups_config where group_id=${id}`)
}
const groups_config = { ...create, ...update, ...retrieve }

export { groups_config }
