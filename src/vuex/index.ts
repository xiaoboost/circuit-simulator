import Vue from 'vue';
import Vuex, { GetterTree, MutationTree, ActionTree } from 'vuex';

// import { $M } from 'src/lib/matrix';
// import { $P, Point } from 'src/lib/point';
// import { clone, randomString, delay } from 'src/lib/utils';
// import Electronics from 'src/components/electronic-part/parts';

// import { PartData } from 'src/components/electronic-part/types';
// import { LineData } from 'src/components/electronic-line/types';
// import { CircuitStorageData, PartStorageData, LineStorageData } from 'src/examples/types';

Vue.use(Vuex);

/** 每类器件的最大数量 */
// const maxNumber = 50;
/** 历史操作记录上限 */
// const historyLimit = 10;

/** 时间配置接口 */
export interface TimeConfig {
    end: string;
    step: string;
}

export interface StateType {
    /**
     * 页面状态
     */
    page: string;
    /**
     * 全局时间设置
     */
    time: TimeConfig;
    /**
     * 全局器件堆栈
     */
    // Parts: PartData[];
    /**
     * 全局导线堆栈
     */
    // Lines: LineData[];
    /**
     * 历史数据
     */
    // historyData: Array<Array<PartData | LineData>>;
}

const state: StateType = {
    time: {
        end: '10m',
        step: '10u',
    },

    page: '',
    // Parts: [],
    // Lines: [],
    // historyData: [],
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

    // /** 生成新器件 */
    // NEW_PART: ({ Parts }, type: keyof Electronics) => {
    //     const origin = Electronics[type];
    //     const id = createId(origin.pre);
    //     const hash = randomString();

    //     Parts.push({
    //         id, type, hash,
    //         rotate: $M(2, 'E'),
    //         position: $P(1e6, 1e6),
    //         params: origin.params.map((n) => n.default),
    //         connect: Array(origin.points.length).fill(''),
    //     });
    // },
    // /** 更新器件数据 */
    // UPDATE_PART: ({ Parts }, data: PartData) => {
    //     const index = Parts.findIndex((part) => part.hash === data.hash);

    //     if (index < 0) {
    //         throw new Error(`(vuex) Part not found. id: ${data.id}`);
    //     }

    //     const idNumber = Parts.reduce((ans, part) => (part.id === data.id) ? (ans + 1) : ans, 0);

    //     if (idNumber >= 2) {
    //         throw new Error(`(vuex) Part ID is duplicated. id: ${data.id}`);
    //     }

    //     Parts.splice(index, 1, clone(data));
    // },
    // /** 复制器件 */
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

    // /** 新导线压栈 */
    // NEW_LINE: ({ Lines }, start: Point) => {
    //     const id = createId('line');
    //     const hash = randomString();

    //     Lines.unshift({
    //         id, hash,
    //         type: 'line',
    //         connect: ['', ''],
    //         way: [$P(start)],
    //     });
    // },
    // /** 更新器件数据 */
    // UPDATE_LINE: ({ Lines }, data: LineData) => {
    //     const index = Lines.findIndex((line) => line.hash === data.hash);

    //     if (index < 0) {
    //         throw new Error(`(vuex) Line not found. id: ${data.id}`);
    //     }

    //     const idNumber = Lines.reduce((ans, line) => (line.id === data.id) ? (ans + 1) : ans, 0);

    //     if (idNumber >= 2) {
    //         throw new Error(`(vuex) Line ID is duplicated. id: ${data.id}`);
    //     }

    //     Lines.splice(index, 1, clone(data));
    // },
    // /** 复制器件 */
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

    // /** 删除器件 */
    // DELETE_PART: ({ Parts }, part: string) => Parts.delete((item) => item.id === part),
    // /** 删除导线 */
    // DELETE_LINE: ({ Lines }, line: string) => Lines.delete((item) => item.id === line),

    // /** 导线放置到底层 */

    // /** 记录当前数据 */
    // RECORD_MAP({ historyData, Parts, Lines }) {
    //     const stack: Array<PartData | LineData> = [];
    //     historyData.push(stack.concat(Parts).concat(Lines));

    //     while (historyData.length > historyLimit) {
    //         historyData.splice(0, 1);
    //     }
    // },
    // /** 图纸数据回滚 */
    // HISTORY_BACK({ historyData, Parts, Lines }) {
    //     const current = historyData.pop();

    //     if (!current) {
    //         return;
    //     }

    //     Parts.splice(0, Parts.length, ...current.filter((part): part is PartData => part.type !== 'line'));
    //     Lines.splice(0, Parts.length, ...current.filter((line): line is LineData => line.type === 'line'));
    // },
    // /** 追加数据 */
    // APPEND_DATA({ Parts, Lines }, data: PartData | LineData) {
    //     if (data.type !== 'line') {
    //         Parts.push(data);
    //     }
    //     else {
    //         Lines.push(data);
    //     }
    // },
};

const actions: ActionTree<StateType, StateType> = {
    /** 外部数据导入 */
    // async IMPORT_DATA({ commit }, data: CircuitStorageData) {
    //     // load parts
    //     data
    //         .filter((part): part is PartStorageData => part.type !== 'line')
    //         .forEach((part) => commit('APPEND_DATA', {
    //             id: part.id,
    //             type: part.type,
    //             hash: randomString(),
    //             position: $P(part.position),
    //             connect: Array(Electronics[part.type].points.length).fill(''),
    //             rotate: part.rotate ? $M(part.rotate) : $M(2, 'E'),
    //             params: part.params
    //                 ? part.params.slice()
    //                 : Electronics[part.type].params.map((n) => n.default),
    //         })),

    //     // wait parts loaded
    //     await delay(10);

    //     // loaded lines
    //     data
    //         .filter((line): line is LineStorageData => line.type === 'line')
    //         .map((line) => commit('APPEND_DATA', {
    //             id: createId('line'),
    //             type: 'line' as 'line',
    //             hash: randomString(),
    //             connect: ['', ''],
    //             way: line.way.map((point, i) => $P(point)),
    //         }));

    //     // wait lines loaded
    //     await delay(10);
    // },
};

/**
 * 生成器件或者导线的新 ID
 * @param {string} id
 * @returns {string}
 */
// function createId(id: string): string {
//     const electrons = [...state.Parts, ...state.Lines];
//     const pre = id.match(/^([^_]+)(_[^_]+)?$/)!;

//     const max = (pre[1] === 'line') ? Infinity : maxNumber;

//     for (let i = 1; i <= max; i++) {
//         const ans = `${pre[1]}_${i}`;
//         if (electrons.findIndex((elec) => elec.id === ans) === -1) {
//             return (ans);
//         }
//     }

//     throw new Error(`(vuex) The maximum number of Devices is ${maxNumber}.`);
// }

export default new Vuex.Store<StateType>({
    strict: $ENV.NODE_ENV === 'development',
    state,
    getters,
    mutations,
    actions,
});
