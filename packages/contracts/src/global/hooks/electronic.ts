import { createServiceKey } from '@circuit/inject';
import type { ElectronicPrototype } from '@circuit/types';

/**
 * 器件原型数据
 *
 * @description 该钩子将用于注册器件元数据
 * @example
 * ```ts
 * const partPrototypes = useHook(IPartPrototype);
 * ```
 */
export const IPartPrototype = createServiceKey<IPartPrototype>('IPartPrototype');

/** 器件原型数据 */
export type IPartPrototype = ElectronicPrototype;
