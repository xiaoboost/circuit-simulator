import { LineData } from 'src/components/electronic-line/component';
import { PartData } from 'src/components/electronic-part/component';
import { PartType } from 'src/components/electronic-part/parts';
import { LineType } from 'src/components/electronic-line/helper';

/** 时间配置接口 */
export interface TimeConfig {
    end: string;
    step: string;
}

/** vuex 状态接口 */
export interface StateType {
    /**
     * 侧边栏状态
     */
    sidebar: Sidebar;
    /**
     * 全局时间设置
     */
    time: TimeConfig;
    /**
     * 全局器件堆栈
     */
    parts: PartData[];
    /**
     * 全局导线堆栈
     */
    lines: LineData[];
    /**
     * 历史数据
     */
    historyData: Array<Array<PartData | LineData>>;
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

/** 当前时间配置项 */
/* tslint:disable-next-line:no-empty-interface  */
export interface SimulateConfig extends TimeConfig {
    // TODO: 波形输出标志
}

export interface CircuitStorage {
    config?: SimulateConfig;
    data: ElectronicsData;
}

/** Mutation 键名 */
export const enum Mutation {
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
}

/** Action 键名 */
export const enum Action {
    /** 外部数据导入 */
    IMPORT_DATA = 'IMPORT_DATA',
    /** 求解电路 */
    SOLVE_CIRCUIT = 'SOLVE_CIRCUIT',
}

/** 侧边栏状态 */
export const enum Sidebar {
    Space,
    Parts,
    Config,
    Graph,
}
