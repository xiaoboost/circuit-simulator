import Vue from 'vue';

import Vuex, {
    GetterTree,
    MutationTree,
    ActionTree,
} from 'vuex';

import { $M } from 'src/lib/matrix';
import { $P } from 'src/lib/point';
import { clone, delay } from 'src/lib/utils';

import Electronics from 'src/components/electronic-part/parts';
import { PartCore } from 'src/components/electronic-part';
import { LineCore, LineWay } from 'src/components/electronic-line';

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

const state: StateType = {
    time: {
        end: '10m',
        step: '10u',
    },

    page: '',
    Parts: [],
    Lines: [],
    historyData: [],
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
    NEW_PART: ({ Parts }, data: PartCore) => Parts.push(clone(data)),
    /** 更新器件数据 */
    UPDATE_PART: ({ Parts }, data: PartCore) => {
        const index = Parts.findIndex((part) => part.hash === data.hash);

        if (index < 0) {
            throw new Error(`(vuex) Part not found. id: ${data.id}`);
        }

        const idNumber = Parts.reduce((ans, part) => (part.id === data.id) ? (ans + 1) : ans, 0);

        if (idNumber >= 2) {
            throw new Error(`(vuex) Part ID is duplicated. id: ${data.id}`);
        }

        Parts.splice(index, 1, clone(data));
    },
    /** 复制器件 */
    // COPY_PART({ Parts }, IDs: string[]) {
    //     IDs.forEach((id) => {
    //         const part = Parts.find((elec) => elec.id === id);

    //         if (!part) {
    //             throw new Error(`(vuex) Part not found. id: ${id}`);
    //         }

    //         Parts.push({
    //             ...clone(part),
    //             id: createId(part.id),
    //             hash: randomString(),
    //         });
    //     });
    // },

    /** 新导线压栈 */
    NEW_LINE: ({ Lines }, data: LineCore) => Lines.unshift(clone(data)),
    /** 更新器件数据 */
    UPDATE_LINE: ({ Lines }, data: LineCore) => {
        const index = Lines.findIndex((line) => line.hash === data.hash);

        if (index < 0) {
            throw new Error(`(vuex) Line not found. id: ${data.id}`);
        }

        const idNumber = Lines.reduce((ans, line) => (line.id === data.id) ? (ans + 1) : ans, 0);

        if (idNumber >= 2) {
            throw new Error(`(vuex) Line ID is duplicated. id: ${data.id}`);
        }

        Lines.splice(index, 1, clone(data));
    },
    /** 复制器件 */
    // COPY_LINE({ Lines }, IDs: string[]) {
    //     IDs.forEach((id) => {
    //         const line = Lines.find((elec) => elec.id === id);

    //         if (!line) {
    //             throw new Error(`(vuex) Line not found. id: ${id}`);
    //         }

    //         Lines.push({
    //             ...clone(line),
    //             id: createId('line'),
    //             hash: randomString(),
    //         });
    //     });
    // },

    /** 删除器件 */
    DELETE_PART: ({ Parts }, part: string) => Parts.delete((item) => item.id === part),
    /** 删除导线 */
    DELETE_LINE: ({ Lines }, line: string) => Lines.delete((item) => item.id === line),

    /** 导线放置到底层 */

    /** 记录当前数据 */
    RECORD_MAP({ historyData, Parts, Lines }) {
        const stack: Array<PartCore | LineCore> = [];
        historyData.push(stack.concat(Parts).concat(Lines));

        while (historyData.length > historyLimit) {
            historyData.splice(0, 1);
        }
    },
    /** 图纸数据回滚 */
    HISTORY_BACK({ historyData, Parts, Lines }) {
        const current = historyData.pop();

        if (!current) {
            return;
        }

        Parts.$replace(current.filter((part): part is PartCore => part.type !== 'line'));
        Lines.$replace(current.filter((line): line is LineCore => line.type === 'line'));
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
        parts.forEach((storage) => {
            const part = PartCore.noVueInstance(storage.type);

            commit('NEW_PART', part);

            storage.params && (part.params = storage.params);
            storage.rotate && (part.rotate = $M(storage.rotate));
            storage.position && (part.position = $P(storage.position));

            part.status = 'import';
            part.markSign();
            part.dispatch();
        });

        // wait parts loaded
        await delay(10);

        // loaded lines
        const lines = data.data.filter((line): line is LineStorageData => line.type === 'line');
        lines.forEach((storage) => {
            const line = LineCore.noVueInstance();

            commit('NEW_LINE', line);

            line.way = LineWay.from(storage.way);
            line.status = 'import';
            line.setConnectByWay();
            line.markSign();
            line.dispatch();
        });

        // wait lines loaded
        await delay(10);
    },
};

export default new Vuex.Store<StateType>({
    strict: $ENV.NODE_ENV === 'development',
    state,
    getters,
    mutations,
    actions,
});
