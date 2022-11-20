/**
 * 机器人开机时的临时任务，大多用于开发环境中，例如统计数据等
 */
import fs from 'fs'

import { getDataBaseData, formSet } from '../database'

const t = async () => {
    // fs.writeFile('../temporary/data.txt', JSON.stringify(xxx), err => console.log('t: ', err))
}

export { t }
