import { IHotKeyHook, HotKeyOptions } from '@circuit/shared';
import hotkeys from 'hotkeys-js';
import { useEffect, RefObject } from 'react';
import { useHook } from '../../../context';

/**
 * 事件监听器会绑定在画布元素上
 *
 * @description 画布的事件
 */
export function useHotkeyDriver(painterRef: RefObject<HTMLDivElement | null>) {
  const hotkeyHooks = useHook(IHotKeyHook);

  useEffect(() => {
    if (!painterRef.current) {
      return;
    }

    hotkeyHooks.forEach((hook) => {
      const keys = Array.isArray(hook) ? hook : [hook];
      keys.forEach(({ key, options, action }) => {
        const opt: HotKeyOptions = {
          keyup: false,
          keydown: true,
          capture: false,
          ...options,
          element: painterRef.current,
        };

        hotkeys(key, opt, action);
      });
    });

    return () => {
      hotkeyHooks.forEach((hook) => {
        const keys = Array.isArray(hook) ? hook : [hook];
        keys.forEach(({ key, action }) => {
          hotkeys.unbind(key, action);
        });
      });
    };
  }, [painterRef.current]);
}
