import { IHotKey, HotKeyOptions } from '@circuit/contracts/global';
import { IPainterHTMLElement } from '@circuit/contracts/painter';
import {
  IRendererHOC,
  IRendererData,
  PropsWithHocParams,
} from '@circuit/inject';
import Hotkey from 'hotkeys-js';
import { FC, useEffect } from 'react';
import { useService } from './index';

/** 组合高阶渲染器 */
export function composeHOC<T extends object>(core: IRendererData<T>, hooks: IRendererHOC<T>[]) {
  const filteredHooks = hooks.filter((hook) => !hook.use || hook.use(core));

  let Component = core.Render as FC<PropsWithHocParams<T>>;

  for (const hook of filteredHooks) {
    Component = hook.RenderHOC(Component);
  }

  return {
    Component,
    getKey: core.getKey,
  };
}

export function useHotKey(key: IHotKey) {
  const painterEl = useService(IPainterHTMLElement);

  useEffect(() => {
    if (!painterEl.current) {
      return;
    }

    const opt: HotKeyOptions = {
      keyup: false,
      keydown: true,
      capture: false,
      ...key.options,
      element: painterEl.current,
    };

    Hotkey(key.key, opt, key.action);

    return () => {
      Hotkey.unbind(key.key, key.action);
    };
  }, [painterEl.current]);
}
