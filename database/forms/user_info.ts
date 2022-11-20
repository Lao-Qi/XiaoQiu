import { operationSql } from '../tools'

import type { GroupsUserInfo, DataBaseDataType } from './interface'
import type { GroupchatsId } from '../../lib/interface'

type UserInfoRecord = Promise<DataBaseDataType['user_info']['recordRow']>
type UserInfoUpdate = Promise<DataBaseDataType['user_info']['updateData']>
type UserInfoRetrieve = Promise<DataBaseDataType['user_info']['retrieveData']>

const create = {
    recordRow: async (id: GroupchatsId): UserInfoRecord =>
        await operationSql(`insert into user_info(group_id,whole_user_id) values('${id}','{}')`)
}
const update = {
    updateData: async (id: GroupchatsId, config: GroupsUserInfo): UserInfoUpdate =>
        await operationSql(`update user_info set whole_user_id='${JSON.stringify(config)}' where group_id='${id}'`)
}
const retrieve = {
    retrieveData: async (id: GroupchatsId): UserInfoRetrieve =>
        await operationSql(`select whole_user_id from user_info where group_id=${id}`)
}
const user_info = { ...create, ...update, ...retrieve }

export { user_info }
