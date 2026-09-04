// GenByAI: 测试 Searcher 类

import { readFileSync } from 'fs'
import { Searcher } from '../main/utils/Searcher'
import type { Shortcut } from '../shared/Types/Shortcut'

// 从 debug_datas 读取实际数据
const dataPath = 'debug_datas/settings/shortcuts.json'
const rawData = JSON.parse(readFileSync(dataPath, 'utf-8'))
const shortcuts: Shortcut[] = rawData.shortcuts

const searcher = Searcher.getInstance()

console.log(`已加载 ${shortcuts.length} 个快捷方式\n`)
console.log('=== 拼音搜索测试 ===\n')

console.log('搜索 "git":')
console.log(searcher.searchShortcut('git', shortcuts))

console.log('\n搜索 "ce":')
console.log(searcher.searchShortcut('ce', shortcuts))

console.log('\n搜索 "vs":')
console.log(searcher.searchShortcut('vs', shortcuts))

console.log('\n搜索 "unity":')
console.log(searcher.searchShortcut('unity', shortcuts))

console.log('\n搜索 "sql":')
console.log(searcher.searchShortcut('sql', shortcuts))

console.log('\n搜索 "py":')
console.log(searcher.searchShortcut('py', shortcuts))

console.log('\n=== search 方法测试（排序后的结果）===\n')

console.log('搜索 "git":')
console.log(searcher.search('git', shortcuts))

console.log('\n搜索 "ce":')
console.log(searcher.search('ce', shortcuts))

console.log('\n搜索 "vs":')
console.log(searcher.search('vs', shortcuts))

console.log('\n搜索 "unity":')
console.log(searcher.search('unity', shortcuts))

console.log('\n搜索 "sql":')
console.log(searcher.search('sql', shortcuts))

console.log('\n搜索 "py":')
console.log(searcher.search('py', shortcuts))
