import Vue from 'vue';
import Vuex, { GetterTree, MutationTree } from 'vuex';

import { $M } from 'src/lib/matrix';
import { $P, Point } from 'src/lib/point';
import { clone, randomString } from 'src/lib/utils';
import Electronics from 'src/components/electronic-part/parts';

import { PartData } from 'src/components/electronic-part/types';
import { LineData } from 'src/components/electronic-line/types';

Vue.use(Vuex);

/** 每类器件的最大数量 */
const maxNumber = 50;

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
    isSpace: (context) => !context.page,
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
    NEW_PART: ({ Parts }, type: string) => {
        const origin = Electronics[type];
        const id = createId(origin.pre);
        const hash = randomString();

        Parts.push({
            id, type, hash,
            rotate: $M(2, 'E'),
            position: $P(1e6, 1e6),
            params: origin.params.map((n) => n.default),
            connect: Array(origin.points.length).fill(''),
        });
    },
    /** 更新器件数据 */
    UPDATE_PART: ({ Parts }, data: PartData) => {
        const index = Parts.findIndex((part) => part.hash === data.hash);

        if (index < 0) {
            throw new Error(`(vuex) Part not found. id: ${data.id}`);
        }

        const isIdRepeat = Parts.some((part) => part.id === data.id);

        if (isIdRepeat) {
            throw new Error(`(vuex) Part ID is duplicated. id: ${data.id}`);
        }

        Parts.splice(index, 1, clone(data));
    },
    /** 复制器件 */
    COPY_PART({ Parts }, IDs: string[]) {
        IDs.forEach((id) => {
            const part = Parts.find((elec) => elec.id === id);

            if (!part) {
                throw new Error(`(vuex) Part not found. id: ${id}`);
            }

            Parts.push({
                ...clone(part),
                id: createId(part.id),
                hash: randomString(),
            });
        });
    },

    /** 新导线压栈 */
    NEW_LINE: ({ Lines }, start: Point) => {
        const id = createId('line');
        const hash = randomString();

        Lines.unshift({
            id, hash,
            type: 'line',
            connect: ['', ''],
            way: [$P(start)],
        });
    },
    /** 更新器件数据 */
    UPDATE_LINE: ({ Lines }, data: LineData) => {
        const index = Lines.findIndex((line) => line.hash === data.hash);

        if (index < 0) {
            throw new Error(`(vuex) Line not found. id: ${data.id}`);
        }

        const isIdRepeat = Lines.some((line) => line.id === data.id);

        if (isIdRepeat) {
            throw new Error(`(vuex) Line ID is duplicated. id: ${data.id}`);
        }

        Lines.splice(index, 1, clone(data));
    },
    /** 复制器件 */
    COPY_LINE({ Lines }, IDs: string[]) {
        IDs.forEach((id) => {
            const line = Lines.find((elec) => elec.id === id);

            if (!line) {
                throw new Error(`(vuex) Line not found. id: ${id}`);
            }

            Lines.push({
                ...clone(line),
                id: createId('line'),
                hash: randomString(),
            });
        });
    },

    /** 删除器件 */
    DELETE_PART: ({ Parts }, part: string) => Parts.delete((item) => item.id === part),
    /** 删除导线 */
    DELETE_LINE: ({ Lines }, line: string) => Lines.delete((item) => item.id === line),

    /** 导线放置到底层 */
};

/**
 * 生成器件或者导线的新 ID
 * @param {string} id
 * @returns {string}
 */
function createId(id: string): string {
    const electrons = [...state.Parts, ...state.Lines];
    const pre = id.match(/^([^_]+)(_[^_]+)?$/)!;

    const max = (pre[1] === 'line') ? Infinity : maxNumber;

    for (let i = 1; i <= max; i++) {
        const ans = `${pre[1]}_${i}`;
        if (electrons.findIndex((elec) => elec.id === ans) === -1) {
            return (ans);
        }
    }

    throw new Error(`(vuex) The maximum number of Devices is ${maxNumber}.`);
}

export default new Vuex.Store<StateType>({
    strict: $ENV.NODE_ENV === 'development',
    state,
    getters,
    mutations,
});
