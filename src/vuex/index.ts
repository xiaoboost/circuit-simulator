import Vue from 'vue';
import Vuex, { GetterTree, MutationTree } from 'vuex';

import { $P } from 'src/lib/point';
import { $M } from 'src/lib/matrix';
import { clone } from 'src/lib/utils';
import * as assert from 'src/lib/assertion';
import Electronics from 'src/components/electronic-part/shape';

import { PartData } from 'src/components/electronic-part';
import { LineData } from 'src/components/electronic-line';

Vue.use(Vuex);

/** 每类器件的最大数量 */
const maxNumber = 100;

export interface StateType {
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
    Parts: [],
    Lines: [],
};

const getters: GetterTree<StateType, StateType> = {
    isEmpty: (context) => !context.page,
    isAddParts: (context) => context.page === 'add-parts',
    isMainConfig: (context) => context.page === 'main-config',
    isGraphView: (context) => context.page === 'graph-view',
};

const mutations: MutationTree<StateType> = {
    /** 关闭侧边栏 */
    CLOSE_SLIDER: (context) => context.page = '',
    /** 打开添加器件侧边栏 */
    OPEN_ADD_PARTS: (context) => context.page = 'add-parts',
    /** 打开总设置侧边栏 */
    OPEN_MAIN_CONFIG: (context) => context.page = 'main-config',
    /** 打开波形界面 */
    OPEN_GRAPH_VIEW: (context) => context.page = 'graph-view',

    /** 设置终止时间 */
    SET_END_TIME: (context, time: string) => context.END_TIME = time,
    /** 设置步进时间 */
    SET_STEP_TIME: (context, time: string) => context.STEP_TIME = time,

    /** 生成新器件 */
    NEW_PART: (context, type: string) => context.Parts.push(...copyPart(type)),
    /** 更新器件数据 */
    UPDATE_PART: (context, data: PartData) => {
        Object.assign(context.Parts.find((n) => n.hash === data.hash), clone(data));
    },
    /** 新导线压栈 */
    // PUSH_LINE: (context, line: LineData) => context.Lines.push(line),
    /** 删除器件 */
    DELETE_PART: (context, part: PartData | string) => {
        assert.isString(part)
            ? context.Parts.delete((item) => item.id === part)
            : context.Parts.delete((item) => item.id === part.id);
    },
    /** 删除导线 */
    DELETE_LINE: (context, line: LineData | string) => {
        assert.isString(line)
            ? context.Lines.delete((item) => item.id === line)
            : context.Lines.delete((item) => item.id === line.id);
    },

    /** 导线放置到底层 */
};

/**
 * 生成器件或者导线的新 ID
 * @param {string} id
 * @returns {string}
 */
function createId(id: string): string {
    const electrons = [...state.Parts, ...state.Lines];
    const pre = id.match(/^([^_]+)(_[^_]+)?$/);

    if (!pre || !pre[1]) {
        throw new Error('Device ID format is wrong');
    }

    let ans = '';
    const max = (pre[1] === 'line') ? Infinity : maxNumber;

    for (let i = 1; i <= max; i++) {
        ans = `${pre[1]}_${i}`;
        if (electrons.findIndex((elec) => elec.id === ans) === -1) {
            return (ans);
        }
    }

    throw new Error(`The maximum number of Devices is ${maxNumber}`);
}

/**
 * 生成随机 15 位 hash 编码
 * @returns {string}
 */
function createHash() {
    const start = 48, end = 126;
    const exclude = '\\/[]?{};,<>:|`';

    let codes = '';
    while (codes.length < 15) {
        const code = String.fromCharCode(Math.random() * (end - start) + start);

        if (!exclude.includes(code)) {
            codes += code;
        }
    }

    return codes;
}

/**
 * 创建新器件或复制器件
 * @param {(string | PartData | PartData[])} type
 * @return {PartData[]}
 */
function copyPart(data: string | PartData | PartData[]): PartData[] {
    if (assert.isArray(data)) {
        return data.map((n) => copyPart(n)[0]);
    }

    const type = (assert.isString(data)) ? data : data.type;
    const origin = Electronics[type];
    const id = createId(origin.pre);
    const hash = createHash();

    let part: PartData;
    if (assert.isString(data)) {
        part = {
            id, type, hash,
            rotate: $M(2, 'E'),
            position: $P(1e6, 1e6),
            params: origin.params.map((n) => n.default),
            connect: Array(origin.points.length).fill(''),
        };
    }
    else {
        part = {
            ...clone(data),
            id, hash,
        };
    }

    return [part];
}

export default new Vuex.Store<StateType>({
    state,
    getters,
    mutations,
});
