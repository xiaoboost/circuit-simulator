import Vue from 'vue';

import Vuex, {
    GetterTree,
    MutationTree,
    ActionTree,
} from 'vuex';

import Point from 'src/lib/point';
import Matrix from 'src/lib/matrix';
import { isArray, clone, randomString } from 'src/lib/utils';

import { LineWay } from 'src/components/electronic-line/line-way';
import { PartData } from 'src/components/electronic-part/component';
import { LineData } from 'src/components/electronic-line/component';

import {
    markId,
    createId,
    findPartComponent,
    findLineComponent,
} from 'src/components/electronic-part/common';

import {
    StateType,
    TimeConfig,
    CircuitStorage,
    PartStorageData,
    LineStorageData,
} from './types';

export * from './types';

Vue.use(Vuex);

/** 历史操作记录上限 */
const historyLimit = 10;

const local: StateType = {
    time: {
        end: '10m',
        step: '10u',
    },

    page: '',
    parts: [],
    lines: [],
    historyData: [],
};

const getters: GetterTree<StateType, StateType> = {
    isSpace: (context) => !context.page,
    showPartsPanel: (context) => context.page === 'add-parts',
    showConfigPanel: (context) => context.page === 'main-config',
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

    /** 新器件压栈 */
    PUSH_PART: ({ parts }, data: PartData | PartData[]) => {
        isArray(data)
            ? parts.push(...clone(data))
            : parts.push(clone(data));
    },
    /** 更新器件数据 */
    UPDATE_PART: ({ parts }, data: PartData) => {
        const index = parts.findIndex((part) => part.hash === data.hash);

        if (index < 0) {
            throw new Error(`(vuex) Part not found. id: ${data.id}`);
        }

        const idNumber = parts.reduce((ans, part) => (part.id === data.id) ? (ans + 1) : ans, 0);

        if (idNumber >= 2) {
            throw new Error(`(vuex) Part ID is duplicated. id: ${data.id}`);
        }

        parts.splice(index, 1, clone(data));
    },
    /** 复制器件 */
    COPY_PART({ parts }, IDs: string[]) {
        IDs.forEach((id) => {
            const part = parts.find((elec) => elec.id === id);

            if (!part) {
                throw new Error(`(vuex) Part not found. id: ${id}`);
            }

            parts.push({
                ...clone(part),
                id: createId(part.id),
                hash: randomString(),
            });
        });
    },

    /** 新导线压栈 */
    PUSH_LINE: ({ lines }, data: LineData | LineData[]) => {
        isArray(data)
            ? lines.push(...clone(data))
            : lines.push(clone(data));
    },
    /** 更新导线数据 */
    UPDATE_LINE: ({ lines }, data: LineData) => {
        const index = lines.findIndex((line) => line.hash === data.hash);

        if (index < 0) {
            throw new Error(`(vuex) Line not found. id: ${data.id}`);
        }

        const idNumber = lines.reduce((ans, line) => (line.id === data.id) ? (ans + 1) : ans, 0);

        if (idNumber >= 2) {
            throw new Error(`(vuex) Line ID is duplicated. id: ${data.id}`);
        }

        lines.splice(index, 1, clone(data));
    },
    /** 复制器件 */
    COPY_LINE({ lines }, IDs: string[]) {
        IDs.forEach((id) => {
            const line = lines.find((elec) => elec.id === id);

            if (!line) {
                throw new Error(`(vuex) Line not found. id: ${id}`);
            }

            lines.push({
                ...clone(line),
                id: createId('line'),
                hash: randomString(),
            });
        });
    },

    /** 删除器件与导线 */
    DELETE_ELEC: ({ parts, lines }, eles: string | string[]) => {
        const data = isArray(eles) ? eles : [eles];

        for (const id of data) {
            /^line_/.test(id)
                ? lines.delete((item) => item.id === id)
                : parts.delete((item) => item.id === id);
        }
    },

    /** 导线放置到底层 */
    LINE_TO_BOTTOM: ({ lines }, id: string) => {
        const index = lines.findIndex((item) => item.id === id);
        const line = lines[index];

        if (index < 0) {
            throw new Error(`(vuex) Line not found. id: ${id}`);
        }

        lines.splice(index, 1);
        lines.unshift(line);
    },

    /** 记录当前数据 */
    RECORD_MAP({ historyData, parts, lines }) {
        const stack: Array<PartData | LineData> = [];
        historyData.push(clone(stack.concat(parts).concat(lines)));

        while (historyData.length > historyLimit) {
            historyData.shift();
        }
    },
    /** 图纸数据回滚 */
    HISTORY_BACK(state) {
        const current = state.historyData.pop();

        if (!current) {
            return;
        }

        state.parts = current.filter((part): part is PartData => part.type !== 'line');
        state.lines = current.filter((line): line is LineData => line.type === 'line');
    },
};

const actions: ActionTree<StateType, StateType> = {
    /** 外部数据导入 */
    async IMPORT_DATA({ commit }, data: CircuitStorage) {
        // load time config
        if (data.config) {
            commit('SET_TIME_CONFIG', {
                end: data.config.end,
                step: data.config.step,
            });
        }

        // load parts
        const parts = data.data.filter((part): part is PartStorageData => part.type !== 'line');
        await Promise.all(parts.map(async (storage) => {
            const partData: PartData = {
                type: storage.type,
                id: storage.id,
                hash: randomString(),
                params: storage.params || [],
                rotate: storage.rotate
                    ? Matrix.from(storage.rotate)
                    : new Matrix(2, 'E'),
                position: Point.from(storage.position),
                connect: [],
            };

            commit('PUSH_PART', partData);

            await Vue.nextTick();

            const part = findPartComponent(partData.id);

            if (storage.text) {
                if (storage.text === 'top') {
                    part.textPosition = new Point(0, -100);
                }
                else if (storage.text === 'right') {
                    part.textPosition = new Point(100, 0);
                }
                else if (storage.text === 'bottom') {
                    part.textPosition = new Point(0, 100);
                }
                else if (storage.text === 'left') {
                    part.textPosition = new Point(100, 0);
                }

                part.renderText();
            }

            part.markSign();
        }));

        // loaded lines
        const lines = data.data.filter((line): line is LineStorageData => line.type === 'line');
        lines.forEach(async (storage) => {
            const lineData: LineData = {
                type: storage.type,
                id: createId('line'),
                hash: randomString(),
                connect: ['', ''],
                way: LineWay.from(storage.way),
            };

            markId(lineData.id);
            commit('PUSH_LINE', lineData);

            await Vue.nextTick();

            const line = findLineComponent(lineData.id);

            line.setConnectByWay();
            line.markSign();
            line.dispatch();
        });
    },
    /** 求解电路 */
    // async SOLVE_CIRCUIT({ state }) {
    //     debugger;
    //     slover.compilePartsNet(state.Lines);
    // },
};

export default new Vuex.Store<StateType>({
    strict: process.env.NODE_ENV === 'development',
    state: local,
    getters,
    mutations,
    actions,
});
