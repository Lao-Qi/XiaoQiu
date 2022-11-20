import type { SendContent, CommandFn } from '../interface'

const sendContent: SendContent = {
    name: '小秋你好',
    reg: /^reg$/,
    role: 'member',
    member: () => [],
    admin: () => [],
    owner: () => [],
    deverDefined: () => [[], []],
    equal: () => [],
    level: () => []
}
const fn: CommandFn = originData => console.log('新指令被触发了...')
const commandFileName = { fn, sendContent }

export { commandFileName }
