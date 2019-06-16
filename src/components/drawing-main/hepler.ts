import Point from 'src/lib/point';
import EventController from './event-controller';

import { PartData } from '../electronic-part';
import { LineData } from '../electronic-line';

/** 移动状态 */
export const enum MoveStatus {
    Move,
    Transform,
}

/** 当前器件的状态 */
export interface ElectronicStatus {
    elec: PartData | LineData;
    status: MoveStatus;
}

/** 组件上下文结构 */
export interface ContextData {
    /** 当前图纸信息 */
    mapStatus: {
        exclusion: boolean;
        readonly zoom: number;
        readonly position: Point;
    };

    /** 创建图纸事件 */
    createDrawEvent(exclusion?: boolean): EventController;
    /** 设置当前选中器件 */
    setSelectDevices(param: string[] | ((devices: string[]) => string[])): void;
}
