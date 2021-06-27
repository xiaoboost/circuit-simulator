import type { Matrix } from '@circuit/math';

/**
 * 数字标记
 *  - 高 16 位为标志位
 *  - 中 16 位为有效数字
 */

const MarkTransfer = 0xFBFA0000;
const SignOrigin = 0x0000FFFF;

/** 全局标记 */
let i = 0;

/** 生成标记数字 */
export function getMark() {
  return MarkTransfer | i++;
}

/** 从标记数字中得到原来的数字 */
export function getOrigin(mark: number) {
  return SignOrigin & mark;
}

/** 获取矩阵的设置函数包装 */
export function getSetMethod(ma: Matrix, mark: number) {
  const positions = ma.filterPosition(mark);

  return function set(val: number) {
    positions.forEach(([i, j]) => ma.set(i, j, val));
  };
}
