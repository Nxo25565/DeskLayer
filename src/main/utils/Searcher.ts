import { Shortcut } from "../../shared/Types/Shortcut";
import { match } from 'pinyin-pro'
import { SettingsManager } from './Settings/SettingsManager'


const searchConfig = {
    precision: 'any', //'first' | 'start' | 'every' | 'any';
    continuous: false, //boolean;
    space: 'ignore', //ignore' | 'preserve';
    lastPrecision: 'any', //'first' | 'start' | 'every' | 'any';
    v: true, //boolean; // v3.25.0+
} as const

// interface SearchIndex {
//     shortcut: Shortcut,
//     priority: number
// }


export class Searcher {
    private static _searcherInstance: Searcher;

    static getInstance(){
        if(!this._searcherInstance){
            this._searcherInstance = new Searcher();
        }
        return this._searcherInstance;
    }

    /**
     * GenByAI: 根据拼音搜索匹配的快捷键
     * @param searchTerm 搜索关键词（拼音）
     * @param array 快捷键数组
     *
     * 优化说明：合并 filter + map 为单次遍历，对每个 shortcut 只调用一次 match，
     * 避免原实现中 filter 和 map 各调用一次 match 造成的重复计算
     */
    searchShortcut(searchTerm: string, array: Shortcut[]): {
                    shortcut: Shortcut,
                    priority: number,
                }[] {
        // 单次遍历完成匹配计算 + 过滤，缓存 match 结果避免重复调用
        const result = array
            .map((s) => {
                // 缓存 match 结果，防止后续重复计算
                const matchResult = match(s.name, searchTerm, searchConfig);
                const matchLength = matchResult?.length ?? 0;
                // priority = 匹配命中的字数 / 名称总长度，比值越大匹配度越高
                const p = matchLength > 0 ? matchLength / s.name.length : 0;
                // console.log(`match=${matchLength} / ${s.name}=${s.name.length} = ${p}`);
                return {
                    shortcut: s,
                    priority: p,
                    hasMatch: matchLength > 0,
                };
            })
            // 过滤掉无匹配的项
            .filter((item) => item.hasMatch)
            // 移除内部使用的临时字段
            .map(({ shortcut, priority }) => ({ shortcut, priority }));

        // console.log(result);
        return result;
    }

    sortResult(result: {shortcut: Shortcut,priority: number,}[]): Shortcut[]{
        return result.sort((a, b) => b.priority - a.priority).map(item => item.shortcut)
    }

    search(searchTerm: string, array: Shortcut[]): Shortcut[]{
        if (searchTerm.length === 0) { return array } 
        const result = this.searchShortcut(searchTerm, array)
        return this.sortResult(result)
    }

    
}

const dm = SettingsManager.getInstance()
const shortcuts = dm.shortcutSettings.shortcuts
console.log(Searcher.getInstance().searchShortcut('a', shortcuts))