import type { Matrix } from '@circuit/math';
import type { Part, Line } from '@circuit/electronics';

/** 观测器 */
export interface Observer {
  /** 观测器编号 */
  id: string;
  /** 观测矩阵 */
  matrix: Matrix;
  /** 输出数据 */
  data: number[];
}

/** 模拟时间参数 */
export interface SimulationConfig {
  end: string;
  step: string;
}

/** 求解输入 */
export interface SolveOption {
  /** 所有器件和导线 */
  electronics: (Part | Line)[];
  /** 时域模拟设置 */
  simulation: SimulationConfig;
  /**
   * 提示进度回调函数
   *  - 参数`progress`是`0`到`1`之间的数字
   */
  onProgress(progress: number): any;
}
