import { NumberRank } from '@circuit/algorithm';

/** 器件参数单位枚举 */
export enum UnitType {
  /**
   * 法拉
   *
   * @description 电容量
   */
  Farad = 'F',
  /**
   * 亨利
   *
   * @description 电感量
   */
  Henry = 'H',
  /**
   * 安培
   *
   * @description 电流量
   */
  Ampere = 'A',
  /**
   * 伏特
   *
   * @description 电压值
   */
  Volt = 'V',
  /**
   * 欧姆
   *
   * @description 电阻值
   */
  Ohm = 'Ω',
  /**
   * 赫兹
   *
   * @description 频率
   */
  Hertz = 'Hz',
  /**
   * 分贝
   *
   * @description 比例对数值
   */
  Decibel = 'dB',
  /**
   * 相位角
   *
   * @description 相位角
   */
  Degree = '°',
  /**
   * 空
   *
   * @description 没有单位
   */
  Space = '',
}

/** 参数种类 */
export enum PropertyKind {
  /** 数值 */
  Number,
  /** 枚举 */
  Enum,
  /** 多选选择器 */
  MultiSelect,
}

/** 数值 */
export interface NumberValue {
  /** 数值 */
  value: number;
  /** 数量级 */
  rank?: NumberRank;
}

/** 枚举值 */
export interface EnumValue {
  value: string | number;
}

/** 选择器 */
export interface MultiSelectValue {
  value: string[];
}

/** 值类型 */
export type PropertyValue = NumberValue | EnumValue | MultiSelectValue;

/** 数值条件上下文 */
export type NumberWhenContext = Record<string, PropertyValue>;
/** 动态选项值上下文 */
export type DynamicOptionContext = Record<string, PropertyValue>;

/** 枚举或者选择器选项 */
export interface EnumOrMultiSelectOption {
  /** 选项值 */
  value: string | number;
  /** 选项名称 */
  name: string;
}

/** 参数描述 */
export interface BasePropertyDescription {
  /** 参数名称 */
  name: string;
  /** 参数类型 */
  kind: PropertyKind;
  /** 参数说明 */
  description?: string;
  /** 是否显示在画布 */
  visibleInPainter: boolean;
  /**
   * 是否有效
   *
   * @description 返回`false`时，此参数不会出现在属性面板，在最后的模拟中也不会生效。
   */
  when?(context: NumberWhenContext): boolean;
}

/** 数值参数描述 */
export interface NumberPropertyDescription extends BasePropertyDescription {
  /** 数值类型 */
  kind: PropertyKind.Number;
  /** 默认值 */
  default: NumberValue;
  /** 单位 */
  unit?: UnitType;
  /**
   * 数量级
   *
   * @description 不填此项表示所有数量级均可用，
   * 空数组时表示没有数量级，
   * 只有一个时表示只可用此数量级，
   * 多个时表示可选数量级
   */
  ranks?: NumberRank[];
}

/** 枚举参数描述 */
export interface EnumPropertyDescription extends BasePropertyDescription {
  /** 枚举类型 */
  kind: PropertyKind.Enum;
  /** 默认值 */
  default: EnumValue;
  /** 枚举值 */
  enums: EnumOrMultiSelectOption[];
}

/** 多选选择器参数描述 */
export interface MultiSelectPropertyDescription extends BasePropertyDescription {
  /** 多选选择器类型 */
  kind: PropertyKind.MultiSelect;
  /** 默认值 */
  default: MultiSelectValue;
  /**
   * 多选选择器选项
   *
   * @description 可以是一个数组，也可以是一个函数，
   * 函数返回值为数组，
   * 函数在每次渲染时都会重新执行，
   * 可以用于动态生成选项。
   */
  options:
    | EnumOrMultiSelectOption[]
    | ((context: DynamicOptionContext) => EnumOrMultiSelectOption[]);
}

/** 参数描述 */
export type PropertyDescription =
  | NumberPropertyDescription
  | EnumPropertyDescription
  | MultiSelectPropertyDescription;
