import Vue from 'vue';
import Vuex, { GetterTree, MutationTree } from 'vuex';

import { $P, Point } from 'src/lib/point';
import { $M } from 'src/lib/matrix';
import { clone } from 'src/lib/utils';
import * as assert from 'src/lib/assertion';
import Electronics from 'src/components/electronic-part/shape';

import { PartData } from 'src/components/electronic-part/types';
import { LineData } from 'src/components/electronic-line/types';

Vue.use(Vuex);

/** 每类器件的最大数量 */
const maxNumber = 100;

/** 时间配置接口 */
export interface TimeConfig {
    end: string;
    step: string;
}

export interface StateType {
    /**
     * 页面状态
     * @type {string}
     */
    page: string;
    /**
     * 全局时间设置
     * @type {TimeConfig}
     */
    time: TimeConfig;
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
    time: {
        end: '10m',
        step: '10u',
    },
    page: '',
    Parts: [],
    Lines: [],
};

const getters: GetterTree<StateType, StateType> = {
    isEmpty: (context) => !context.page,
    showAddParts: (context) => context.page === 'add-parts',
    showMainConfig: (context) => context.page === 'main-config',
    showGraphView: (context) => context.page === 'graph-view',
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

    /** 设置时间 */
    SET_TIME_CONFIG: (context, time: TimeConfig) => context.time = time,

    /** 生成新器件 */
    NEW_PART: ({ Parts }, type: string) => Parts.push(...copyPart(type)),
    /** 更新器件数据 */
    UPDATE_PART: ({ Parts }, data: PartData) => {
        const part = Parts.findIndex((n) => n.hash === data.hash);

        if (part < 0) {
            throw new Error('(vuex) Part not found.');
        }

        Parts.splice(part, 1, clone(data));
    },

    /** 新导线压栈 */
    NEW_LINE: ({ Lines }, start: Point) => Lines.push(...copyLine(start)),
    /** 更新器件数据 */
    UPDATE_LINE: ({ Lines }, data: LineData) => {
        const line = Lines.findIndex((n) => n.hash === data.hash);

        if (line < 0) {
            throw new Error('(vuex) Part not found.');
        }

        Lines.splice(line, 1, clone(data));
    },

    /** 删除器件 */
    DELETE_PART: ({ Parts }, part: PartData | string) => {
        assert.isString(part)
            ? Parts.delete((item) => item.id === part)
            : Parts.delete((item) => item.id === part.id);
    },
    /** 删除导线 */
    DELETE_LINE: ({ Lines }, line: LineData | string) => {
        assert.isString(line)
            ? Lines.delete((item) => item.id === line)
            : Lines.delete((item) => item.id === line.id);
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
 * @param {(string | PartData | PartData[])} data
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

/**
 * 创建新导线或复制导线
 * @param {(string | LineData | LineData[])} data
 * @return {LineData[]}
 */
function copyLine(data: Point | LineData | LineData[]): LineData[] {
    if (assert.isArray(data)) {
        return data.map((n) => copyLine(n)[0]);
    }

    const id = createId('line');
    const hash = createHash();

    let line: LineData;
    if (Point.isPoint(data)) {
        line = {
            type: 'line',
            id, hash,
            connect: ['', ''],
            way: [data],
        };
    }
    else {
        line = {
            ...clone(data),
            type: 'line',
            id, hash,
        };
    }

    return [line];
}

export default new Vuex.Store<StateType>({
    strict: $ENV.NODE_ENV === 'development',
    state,
    getters,
    mutations,
});
