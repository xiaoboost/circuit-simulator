
import React from 'react';
import {
  IRendererHOC,
  IRendererData,
  PropsWithHocParams,
} from '../types';

export function shallowCompare(a: object, b: object) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => (a as any)[key] === (b as any)[key]);
}


export function isPropsEqual(prevChild: React.ReactNode, nextChild: React.ReactNode) {
  if (prevChild === nextChild) return true;

  if (
    React.isValidElement(prevChild) &&
    React.isValidElement(nextChild)
  ) {
    return shallowCompare(prevChild.props as object, nextChild.props as object);
  }

  return false;
}

/** 组合高阶渲染器 */
export function composeHOC<T extends object>(
  props: T,
  core: IRendererData<T>,
  hooks: IRendererHOC[],
) {
  // TODO: 这里要缓存，不能每次都重新创建
  let children = <core.Render {...props} />;
  let hocProps: PropsWithHocParams<T> = {
    ...props,
    $$key: core.getKey(props),
    children,
  };

  for (const hook of hooks) {
    if (hook.use && !hook.use(core)) {
      continue;
    }

    children = <hook.Render key={`${hook.name}-${hocProps.$$key}`} {...hocProps} />;
    hocProps = {
      ...hocProps,
      children,
    };
  }

  return children;
}
