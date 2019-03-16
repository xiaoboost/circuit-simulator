import Vue from 'vue';
import Vuex from 'vuex';

import Point from 'src/lib/point';
import Matrix from 'src/lib/matrix';
import Solver from 'src/lib/solver';

import { isArray, clone } from 'src/lib/utils';

import { PartData } from 'src/components/electronic-part';
import { LineData, LineWay, LineType } from 'src/components/electronic-line';

import {
    markId,
    createId,
    findPartComponent,
    findLineComponent,
} from 'src/components/electronic-part/common';

import {
    GetterTree,
    MutationTree,
    ActionTree,
} from './type';

import {
    Sidebar,
    TimeConfig,
    CircuitStorage,
    PartStorageData,
    LineStorageData,

    State,
    Getter,
    Mutation,
    Action,
    MutationName,
    ActionName,
} from './constant';

export * from './constant';

Vue.use(Vuex);

/** 历史操作记录上限 */
const historyLimit = 10;

const local: State = {
    time: {
        end: '10m',
        step: '10u',
    },
    charts: [],
    parts: [],
    lines: [],
    metersData: [],
    historyData: [],
    sidebar: Sidebar.Space,
};

const getters: GetterTree<State, Getter> = {
    isSpace: ({ sidebar }) => sidebar === Sidebar.Space,
    showPartsPanel: ({ sidebar }) => sidebar === Sidebar.Parts,
    showConfigPanel: ({ sidebar }) => sidebar === Sidebar.Config,
    showGraphViewer: ({ sidebar }) => sidebar === Sidebar.Graph,
};

const mutations: MutationTree<State, Mutation> = {
    /** 关闭侧边栏 */
    [MutationName.CLOSE_SLIDER]: (context) => context.sidebar = Sidebar.Space,
    /** 打开添加器件侧边栏 */
    [MutationName.OPEN_ADD_PARTS]: (context) => context.sidebar = Sidebar.Parts,
    /** 打开总设置侧边栏 */
    [MutationName.OPEN_MAIN_CONFIG]: (context) => context.sidebar = Sidebar.Config,
    /** 打开波形界面 */
    [MutationName.OPEN_GRAPH_VIEW]: (context) => context.sidebar = Sidebar.Graph,

    /** 设置时间 */
    [MutationName.SET_TIME_CONFIG]: (context, time: TimeConfig) => context.time = time,

    /** 新器件压栈 */
    [MutationName.PUSH_PART]: ({ parts }, data: PartData | PartData[]) => {
        isArray(data)
            ? parts.push(...clone(data))
            : parts.push(clone(data));
    },
    /** 更新器件数据 */
    [MutationName.UPDATE_PART]: ({ parts }, data: PartData) => {
        const index = parts.findIndex((part) => part.id === data.id);

        if (index < 0) {
            throw new Error(`(vuex) Part not found. id: ${data.id}`);
        }

        const idNumber = parts.reduce((ans, part) => (part.id === data.id) ? (ans + 1) : ans, 0);

        if (idNumber >= 2) {
            throw new Error(`(vuex) Part ID is duplicated. id: ${data.id}`);
        }

        parts.splice(index, 1, clone(data));

        // TODO: 如果是 meter 的 id 改变了，那么还需要变更
    },
    /** 复制器件 */
    [MutationName.COPY_PART]({ parts }, IDs: string[]) {
        IDs.forEach((id) => {
            const part = parts.find((elec) => elec.id === id);

            if (!part) {
                throw new Error(`(vuex) Part not found. id: ${id}`);
            }

            parts.push({
                ...clone(part),
                id: createId(part.id),
            });
        });
    },

    /** 新导线压栈 */
    [MutationName.PUSH_LINE]: ({ lines }, data: LineData | LineData[]) => {
        isArray(data)
            ? lines.push(...clone(data))
            : lines.push(clone(data));
    },
    /** 更新导线数据 */
    [MutationName.UPDATE_LINE]: ({ lines }, data: LineData) => {
        const index = lines.findIndex((line) => line.id === data.id);

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
    [MutationName.COPY_LINE]({ lines }, IDs: string[]) {
        IDs.forEach((id) => {
            const line = lines.find((elec) => elec.id === id);

            if (!line) {
                throw new Error(`(vuex) Line not found. id: ${id}`);
            }

            lines.push({
                ...clone(line),
                id: createId('line'),
            });
        });
    },

    /** 删除器件与导线 */
    [MutationName.DELETE_ELEC]: ({ parts, lines }, eles: string | string[]) => {
        const data = isArray(eles) ? eles : [eles];

        for (const id of data) {
            /^line_/.test(id)
                ? lines.delete((item) => item.id === id)
                : parts.delete((item) => item.id === id);
        }
    },

    /** 导线放置到底层 */
    [MutationName.LINE_TO_BOTTOM]: ({ lines }, id: string) => {
        const index = lines.findIndex((item) => item.id === id);
        const line = lines[index];

        if (index < 0) {
            throw new Error(`(vuex) Line not found. id: ${id}`);
        }

        lines.splice(index, 1);
        lines.unshift(line);
    },

    /** 记录当前数据 */
    [MutationName.RECORD_MAP]({ historyData, parts, lines }) {
        const stack: Array<PartData | LineData> = [];
        historyData.push(clone(stack.concat(parts).concat(lines)));

        while (historyData.length > historyLimit) {
            historyData.shift();
        }
    },
    /** 图纸数据回滚 */
    [MutationName.HISTORY_BACK](context) {
        const current = context.historyData.pop();

        if (!current) {
            return;
        }

        context.parts = current.filter((part): part is PartData => part.type !== LineType.Line);
        context.lines = current.filter((line): line is LineData => line.type === LineType.Line);
    },
    /** 设置求解器的求解结果 */
    [MutationName.SET_METER_DATA](context, meters) {
        context.metersData = meters.map(({ id, data }) => ({ id, data }));
    },
};

const actions: ActionTree<State, Getter, Mutation, Action> = {
    /** 外部数据导入 */
    async [ActionName.IMPORT_DATA]({ commit }, data: CircuitStorage) {
        // load time config
        if (data.time) {
            commit(MutationName.SET_TIME_CONFIG, {
                end: data.time.end,
                step: data.time.step,
            });
        }

        // load parts
        const parts = data.data.filter((part): part is PartStorageData => part.type !== LineType.Line);
        await Promise.all(parts.map(async (storage) => {
            const partData: PartData = {
                type: storage.type,
                id: storage.id,
                params: storage.params || [],
                rotate: storage.rotate
                    ? Matrix.from(storage.rotate)
                    : new Matrix(2, 'E'),
                position: Point.from(storage.position),
                connect: [],
            };

            commit(MutationName.PUSH_PART, partData);

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
        const lines = data.data.filter((line): line is LineStorageData => line.type === LineType.Line);
        await Promise.all(lines.map(async (storage) => {
            const lineData: LineData = {
                type: LineType.Line,
                id: createId('line'),
                connect: ['', ''],
                way: LineWay.from(storage.way),
            };

            markId(lineData.id);
            commit(MutationName.PUSH_LINE, lineData);

            await Vue.nextTick();

            const line = findLineComponent(lineData.id);

            line.setConnectByWay();
            line.markSign();
            line.dispatch();
        }));
    },
    /** 求解电路 */
    async [ActionName.SOLVE_CIRCUIT]({ state }) {
        const solver = new Solver(state.parts, state.lines);
    },
};

export default new Vuex.Store<State>({
    strict: process.env.NODE_ENV === 'development',
    state: local,
    getters,
    mutations,
    actions: actions as any,
});
