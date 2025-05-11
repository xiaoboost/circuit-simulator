import { Point, Direction, NumberRank, RotateMatrix } from '@circuit/algorithm';
import type { ConnectionData } from '../base';
import type { ElectronicKind, BasePinStatus } from '../types';

/** 器件原始数据 */
export interface PartData {
  id: string;
  kind: keyof typeof ElectronicKind;
  position: number[];
  rotate?: RotateMatrix;
  text?: keyof typeof Direction;
  params?: string[];
}

/**
 * 边距
 *
 * @description 上右下左
 */
export type Margin = readonly [number, number, number, number];
/**
 * 边距顶点
 *
 * @description 左上角开始，顺时针
 */
export type MarginVertex = readonly [Point, Point, Point, Point];

/** 器件结构化数据 */
export interface PartStructuredData {
  /** 器件编号 */
  id: string;
  /** 器件类别 */
  kind: ElectronicKind;
  /** 器件连接关系 */
  connections: (ConnectionData | undefined)[];
  /** 器件中心坐标 */
  position: [number, number];
  /**
   * 文本方向
   *
   * @description 这个方向是器件本身的视角
   */
  textDirection: Direction;
  /** 器件旋转矩阵 */
  rotate: RotateMatrix;
  /** 器件参数 */
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
  /** 该参数的文字标题 */
  readonly label: string;
  /** 该参数的文字描述 */
  readonly description?: string;
  /** 该参数的物理单位 */
  readonly unit: UnitType;
  /** 该参数是否对外显示 */
  readonly visible: boolean;
  /** 该参数的初始默认值 */
  readonly default: string;
  /** 当前参数的快捷数量级选项 */
  readonly ranks?: NumberRank[];
}

/** 器件每个引脚的描述 */
export interface PinDescription {
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
  /** 不可旋转元素 */
  readonly nonRotate?: true;
}

/** 文本偏移量 */
export interface TextBias {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  center?: number;
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
  readonly textBias?: TextBias;
  /** 器件内边框范围（上、右、下、左） */
  readonly padding: Margin;
  /** 器件外边框范围（上、右、下、左） */
  readonly margin: Margin;
  /** 每项参数的描述 */
  readonly params: ParamsDescription[];
  /** 器件每个节点的描述 */
  readonly pins: PinDescription[];
  /** 器件外形元素的描述 */
  readonly shape: ShapeDescription[];
  /** 器件聚焦区域的描述 */
  readonly focus: ShapeDescription[];
}
