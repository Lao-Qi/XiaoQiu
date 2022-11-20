import { timing } from './timing'
import { t } from './temporary'
import { xiaoqiu } from './recordStatus/xiaoqiu'
import { registerEvents } from './lib/oicq'
import { groupchatsId } from './lib/user'
import { toInitFormData } from './database/tools'

// 临时任务
t()
// 定时任务
timing()
// 初始化数据
groupchatsId.forEach(id => {
    // database
    toInitFormData(id)
    // recordStatus
    xiaoqiu.onOffStatus.set(id, true)
})
// 注册事件
registerEvents()
