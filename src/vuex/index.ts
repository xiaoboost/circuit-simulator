import Vue from 'vue';
import Vuex from 'vuex';

import assert from 'src/lib/assertion';
import { $P, Point } from 'src/lib/point';

import { PartData } from 'src/components/electronic-part/type';
import { LineData } from 'src/components/electronic-line/type';

Vue.use(Vuex);

interface StateType {
    /**
     * 页面状态
     * @type {string}
     */
    page: string;
    /**
     * 全局设置：仿真终止时间
     * @type {string}
     */
    END_TIME: string;
    /**
     * 全局设置：仿真步进时间
     * @type {string}
     */
    STEP_TIME: string;
    /**
     * 图纸设置：图纸放大倍率
     * @type {number}
     */
    zoom: number;
    /**
     * 图纸设置：图纸的总偏移量
     * @type {Point}
     */
    position: Point;
    /**
     * 全局器件堆栈
     * @type {PartData[]}
     */
    Parts: PartData[];
    /**
     * 全局导线堆栈
     * @type {LineData[]}
     */
    Lines: LineData[];
}

const state: StateType = {
    page: '',
    END_TIME: '10m',
    STEP_TIME: '10u',
    zoom: 1,
    position: $P(),
    Parts: [],
    Lines: [],
};

const mutations: { [x: string]: (context: StateType, params: any) => void } = {
    /** 添加器件侧边栏 */
    SET_AddParts: (context, page: string) => context.page = 'add-parts',
    /** 总设置侧边栏 */
    SET_MainConfig: (context, page: string) => context.page = 'main-config',
    /** 设置终止时间 */
    SET_END_TIME: (context, time: string) => context.END_TIME = time,
    /** 设置步进时间 */
    SET_STEP_TIME: (context, time: string) => context.STEP_TIME = time,
    /** 新器件压栈 */
    PUSH_PART: (context, part: PartData) => context.Parts.push(part),
    /** 新导线压栈 */
    PUSH_LINE: (context, line: LineData) => context.Lines.push(line),
    /** 删除器件 */
    DELETE_PART: (context, part: PartData | string) =>
        assert.isString(part)
            ? context.Parts.delete((item) => item.id === part)
            : context.Parts.delete((item) => item.id === part.id),
    /** 删除导线 */
    DELETE_LINE: (context, line: LineData | string) =>
        assert.isString(line)
            ? context.Lines.delete((item) => item.id === line)
            : context.Lines.delete((item) => item.id === line.id),

    /** 获取新ID怎么办 */
    /** 导线放置到底层 */
};

export default new Vuex.Store({
    state,
    mutations,
});

// 单个器件的最大数量
// const maxNumber = 100;

// Object.assign(Collection.prototype, {
//     constructor: Collection,
//     has(elec) {
//         const id = elec.id || elec;
//         return this.some((elec) => elec.id === id);
//     },
//     newId(input) {
//         const temp = input.match(/^[^_]+(_[^_]+)?/),
//             id = temp && temp[0];

//         if (!temp) {
//             throw new Error('器件ID格式错误');
//         }

//         let tempid = '', ans = void 0;
//         // 输入字符串没有下划线
//         if (id.indexOf('_') === -1) {
//             tempid = id + '_';
//         } else if (!this.has(input)) {
//             return (input);
//         } else {
//             tempid = id.split('_')[0] + '_';
//         }

//         for (let i = 1; i <= maxNumber; i++) {
//             ans = tempid + i;
//             if (!this.has(ans)) {
//                 return (ans);
//             }
//         }
//         throw new Error('器件数量超出最大限制');
//     },
// });
