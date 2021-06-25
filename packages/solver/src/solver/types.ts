import type { Matrix } from '@circuit/math';
import type { Part, Line } from '@circuit/electronics';
import type { CircuitSolverMatrix, IterativeEquation } from '../parts';

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
  parts: Part[];
  /** 所有导线 */
  lines: Line[];
  /** 终止时间 */
  end: string;
  /** 步进时间 */
  step: string;
  /** 进度回调 */
  onProgress?: ProgressEvent;
}

/** 器件更新包装函数 */
export type UpdateWrapper = (solver: CircuitSolverMatrix) => IterativeEquation;

/**
 * 进度回调函数
 *  - 参数`progress`是`0`到`100`之间的数字
 */
export type ProgressEvent = (progress: number) => Promise<any>;

/** 解算结果 */
export interface SolverResult {
  times: number[];
  meters: {
    id: string;
    data: number[];
  }[];
}
