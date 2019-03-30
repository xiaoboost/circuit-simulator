import { LineData, LineType } from 'src/components/electronic-line';
import { PartData, PartType } from 'src/components/electronic-part';
import { Observer } from 'src/lib/solver';

/** 时间配置接口 */
export interface TimeConfig {
    end: string;
    step: string;
}

/** 储存用的器件数据接口 */
export interface PartStorageData {
    type: PartType;
    id: string;
    position: number[];
    rotate?: number[][];
    text?: 'left' | 'top' | 'bottom' | 'right';
    params?: string[];
}

/** 储存用的器件数据接口 */
export interface LineStorageData {
    type: LineType;
    way: number[][];
}

/** 器件数据 */
export type ElectronicsData = Array<PartStorageData | LineStorageData>;

/** 电路数据 */
export interface CircuitStorage {
    time?: TimeConfig;
    oscilloscopes?: string[][];
    data: ElectronicsData;
}

/** 侧边栏状态 */
export const enum Sidebar {
    Space,
    Parts,
    Config,
    Graph,
}

/** Mutation 键名 */
export const enum MutationName {
    /** 关闭侧边栏 */
    CLOSE_SLIDER = 'CLOSE_SLIDER',
    /** 打开添加器件侧边栏 */
    OPEN_ADD_PARTS = 'OPEN_ADD_PARTS',
    /** 打开总设置侧边栏 */
    OPEN_MAIN_CONFIG = 'OPEN_MAIN_CONFIG',
    /** 打开波形界面 */
    OPEN_GRAPH_VIEW = 'OPEN_GRAPH_VIEW',
    /** 设置时间 */
    SET_TIME_CONFIG = 'SET_TIME_CONFIG',
    /** 新器件压栈 */
    PUSH_PART = 'PUSH_PART',
    /** 更新器件数据 */
    UPDATE_PART = 'UPDATE_PART',
    /** 复制器件 */
    COPY_PART = 'COPY_PART',
    /** 新导线压栈 */
    PUSH_LINE = 'PUSH_LINE',
    /** 更新导线数据 */
    UPDATE_LINE = 'UPDATE_LINE',
    /** 复制器件 */
    COPY_LINE = 'COPY_LINE',
    /** 删除器件与导线 */
    DELETE_ELEC = 'DELETE_ELEC',
    /** 导线放置到底层 */
    LINE_TO_BOTTOM = 'LINE_TO_BOTTOM',
    /** 记录当前数据 */
    RECORD_MAP = 'RECORD_MAP',
    /** 图纸数据回滚 */
    HISTORY_BACK = 'HISTORY_BACK',
    /** 示波器设置 */
    SET_OSCILLOSCOPES = 'SET_OSCILLOSCOPES',
    /** 图纸数据回滚 */
    SET_SOLVER_RESULT = 'SET_SOLVER_RESULT',
}

/** Action 键名 */
export const enum ActionName {
    /** 外部数据导入 */
    IMPORT_DATA = 'IMPORT_DATA',
}

/** vuex 状态接口 */
export interface State {
    /** 侧边栏状态 */
    sidebar: Sidebar;
    /** 全局时间设置 */
    time: TimeConfig;
    /** 全局器件堆栈 */
    parts: PartData[];
    /** 全局导线堆栈 */
    lines: LineData[];
    /** 历史数据 */
    historyData: Array<Array<PartData | LineData>>;
    /** 全局示波器设置 */
    oscilloscopes: string[][];
    /** 仿真结果数据暂存 */
    solverResult: {
        times: number[];
        meters: Omit<Observer, 'matrix'>[];
    };
}

/** Getter 原型定义 */
export interface Getter {
    isSpace: boolean;
    showPartsPanel: boolean;
    showConfigPanel: boolean;
    showGraphViewer: boolean;
}

/** Mutation 原型定义 */
export interface Mutation {
    /** 关闭侧边栏 */
    [MutationName.CLOSE_SLIDER](): void;
    /** 打开添加器件侧边栏 */
    [MutationName.OPEN_ADD_PARTS](): void;
    /** 打开总设置侧边栏 */
    [MutationName.OPEN_MAIN_CONFIG](): void;
    /** 打开波形界面 */
    [MutationName.OPEN_GRAPH_VIEW](): void;

    /** 设置时间 */
    [MutationName.SET_TIME_CONFIG](time: TimeConfig): void;

    /** 新器件压栈 */
    [MutationName.PUSH_PART](data: PartData | PartData[]): void;
    /** 更新器件数据 */
    [MutationName.UPDATE_PART](data: PartData): void;
    /** 复制器件 */
    [MutationName.COPY_PART](IDs: string[]): void;

    /** 新导线压栈 */
    [MutationName.PUSH_LINE](data: LineData | LineData[]): void;
    /** 更新导线数据 */
    [MutationName.UPDATE_LINE](data: LineData): void;
    /** 复制导线 */
    [MutationName.COPY_LINE](IDs: string[]): void;

    /** 删除器件与导线 */
    [MutationName.DELETE_ELEC](eles: string | string[]): void;

    /** 导线放置到底层 */
    [MutationName.LINE_TO_BOTTOM](id: string): void;

    /** 记录当前数据 */
    [MutationName.RECORD_MAP](): void;
    /** 图纸数据回滚 */
    [MutationName.HISTORY_BACK](): void;
    /** 设置求解器的求解结果 */
    [MutationName.SET_OSCILLOSCOPES](data: State['oscilloscopes']): void;
    /** 设置求解器的求解结果 */
    [MutationName.SET_SOLVER_RESULT](data: State['solverResult']): void;
}

/** Action 原型定义 */
export interface Action {
    /** 外部数据导入 */
    [ActionName.IMPORT_DATA](data: CircuitStorage): Promise<void>;
}
