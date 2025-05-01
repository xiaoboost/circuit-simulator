import { createServiceKey } from '../../context';
import type { ICursorService } from '../../types';

/**
 * 鼠标指针服务键
 *
 * @description 该服务用于获取鼠标指针变换功能
 * @example
 * ```ts
 * const cursorService = usePainterService(CURSOR_SERVICE);
 * ```
 */
export const CURSOR_SERVICE =
  createServiceKey<ICursorService>('CursorService');
