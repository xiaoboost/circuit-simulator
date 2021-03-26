/**
 * 数字标记
 *  - 高 16 位为标志位
 *  - 中 12 位为有效数字
 *  - 低 4 位为有效数字
 *  - 最大可标记值为`4095`
 */
const SignTransfer   = 0xFBFA0000;
const SignAtHigh     = 0xFFFF0000;
const SignIdTransfer   = 0x0000FFF0;
const SignMarkTransfer = 0x0000000F;

/** 生成标记数字 */
export function getMark(origin: number, mark = 0) {
  // 超过标记范围
  if (origin > 4095 || mark > 15) {
    throw new Error('(Solver) 数字标记超过了最大范围');
  }

  return SignTransfer | (origin << 4) | mark;
}

/** 检查格式是否正确 */
export function checkMark(mark: number) {
  return !(SignTransfer ^ (mark & SignAtHigh));
}

/** 从标记数字中得到原来的数字 */
export function getOrigin(mark: number) {
  return {
    id: (mark & SignIdTransfer) >> 4,
    mark: mark & SignMarkTransfer,
  };
}
