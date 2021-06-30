import type { ElectronicKind, BasePinStatus } from '../types';
import type { ConnectionData } from '../utils/connection';
import { Point, Direction, NumberRank } from '@circuit/math';

/** 器件原始数据 */
export interface PartData {
  id: string;
  kind: keyof typeof ElectronicKind;
  position: number[];
  rotate?: number[][];
  text?: keyof typeof Direction;
  params?: string[];
}

/** 器件结构化数据 */
export interface PartStructuredData {
  id: string;
  kind: ElectronicKind;
  connections: (ConnectionData | undefined)[];
  position: [number, number];
  rotate: number[][];
  params: string[];
}

/** 器件引脚状态 */
export interface PartPinStatus extends BasePinStatus {
  /** 原本节点相对器件原点位置 */
  origin: Point;
  /** 节点向外的延申方向 */
  direction: Point;
}

/** 器件参数单位枚举 */
export enum UnitType {
  /** 法拉 - 电容量 */
  Farad = 'F',
  /** 亨利 - 电感量 */
  Henry = 'H',
  /** 安培 - 电流量 */
  Ampere = 'A',
  /** 伏特 - 电压值 */
  Volt = 'V',
  /** 欧姆 - 电阻值 */
  Ohm = 'Ω',
  /** 赫兹 - 频率 */
  Hertz = 'Hz',
  /** 分贝 - 比例对数值 */
  Decibel = 'dB',
  /** 相位角 */
  Degree = '°',
  /** 无 - 没有单位 */
  Space = '',
}

/** 边距方向映射 */
export const MarginDirection = {
  [Direction.Top]: 0,
  [Direction.Right]: 1,
  [Direction.Bottom]: 2,
  [Direction.Left]: 3,
};

/** 器件每项参数的说明 */
export interface ParamsDescription {
  /** 该参数的文字描述 */
  readonly label: string;
  /** 该参数的物理单位 */
  readonly unit: UnitType;
  /** 该参数是否对外显示 */
  readonly vision: boolean;
  /** 该参数的初始默认值 */
  readonly default: string;
  /** 当前参数的快捷数量级选项 */
  readonly ranks?: NumberRank[];
}

/** 器件每个节点的描述 */
export interface PointDescription {
  /** 该节点距离器件中心点的相对位置 */
  readonly position: [number, number];
  /** 该节点对外延伸的方向 */
  readonly direction: Direction;
}

/** 外形元素描述 */
export interface ShapeDescription {
  /** DOM 元素名称 */
  readonly name: string;
  /** DOM 元素的所有属性 */
  readonly attribute: { [x: string]: string };
  /** 某些元素不可旋转 */
  readonly nonRotate?: true;
}

/** 器件原型数据类型 */
export interface ElectronicPrototype {
  /** 器件编号的默认前置标记 */
  readonly pre: string;
  /** 器件种类 */
  readonly kind: ElectronicKind;
  /** 器件简述 */
  readonly introduction: string;
  /** 周围文字距离器件中心点的偏移量 */
  readonly txtLBias: number;
  /** 器件内边框范围（上、右、下、左） */
  readonly padding: readonly [number, number, number, number];
  /** 器件外边框范围（上、右、下、左） */
  readonly margin: readonly [number, number, number, number];
  /** 每项参数的描述 */
  readonly params: ParamsDescription[];
  /** 器件每个节点的描述 */
  readonly points: PointDescription[];
  /** 器件外形元素的描述 */
  readonly shape: ShapeDescription[];
}
