import Vue from 'vue';
import Vuex from 'vuex';

import assert from 'src/lib/assertion';
import { $P, Point } from 'src/lib/point';

import { PartData } from 'src/components/electronic-part/type';
import { LineData } from 'src/components/electronic-line/type';

Vue.use(Vuex);

/** 每类器件的最大数量 */
const maxNumber = 100;

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

const getters: { [x: string]: (context: StateType) => void } = {
    isEmpty: (context) => !context.page,
    isAddParts: (context) => context.page === 'add-parts',
    isMainConfig: (context) => context.page === 'main-config',
    isGraphView: (context) => context.page === 'graph-view',
};

const mutations: { [x: string]: (context: StateType, params: any) => void } = {
    /** 关闭侧边栏 */
    CLOSE_SLIDER: (context) => context.page = '',
    /** 打开添加器件侧边栏 */
    OPEN_ADD_PARTS: (context, page: string) => context.page = 'add-parts',
    /** 打开总设置侧边栏 */
    OPEN_MAIN_CONFIG: (context, page: string) => context.page = 'main-config',
    /** 打开波形界面 */
    OPEN_GRAPH_VIEW: (context, page: string) => context.page = 'graph-view',

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

Object.defineProperties(state.Parts, {
    createPartId: {
        writable: false,
        enumerable: false,
        configurable: false,
        value(this: PartData[], id: string): string {
            const pre = id.match(/^([^_]+)(_[^_]+)?$/);

            if (!pre || !pre[1]) {
                throw new Error('Device ID format is wrong');
            }

            let ans = '';
            for (let i = 1; i <= maxNumber; i++) {
                ans = `${pre[1]}_${i}`;
                if (this.findIndex((part) => part.id === ans) === -1) {
                    return (ans);
                }
            }

            return '';
        },
    },
});

export default new Vuex.Store({
    state,
    getters,
    mutations,
});
