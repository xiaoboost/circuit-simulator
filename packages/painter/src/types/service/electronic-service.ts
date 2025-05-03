import { PartStructuredData, LineStructuredData } from '@circuit/electronics';
import { Watcher } from '@xiao-ai/utils';
import { createServiceKey } from '../../context';

/**
 * 元件服务键
 *
 * @description 该服务提供了元件的各种服务
 * @example
 * ```ts
 * const electronicService = usePainterService(ELECTRONIC_SERVICE_KEY);
 * ```
 */
export const ELECTRONIC_SERVICE_KEY =
  createServiceKey<IElectronicService>('ElectronicService');

export interface IElectronicService {
  /** 所有器件 */
  parts: Watcher<PartStructuredData[]>;
  /** 所有导线 */
  lines: Watcher<LineStructuredData[]>;
}
