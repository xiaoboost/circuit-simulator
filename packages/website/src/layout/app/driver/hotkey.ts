import { IHotKeyHook, HotKeyOptions } from '@circuit/contracts/global';
import hotkeys from 'hotkeys-js';
import { useEffect } from 'react';
import { useHook } from '../../../context';

/**
 * 快捷键驱动
 */
export function useHotkeyDriver() {
  const hotkeyHooks = useHook(IHotKeyHook);
  const getKey = (key: string | string[]) => Array.isArray(key) ? key.join(', ') : key;

  useEffect(() => {
    hotkeyHooks.forEach((hook) => {
      const keys = Array.isArray(hook) ? hook : [hook];
      keys.forEach(({ key, options, action }) => {
        const opt: HotKeyOptions = {
          keyup: false,
          keydown: true,
          capture: false,
          ...options,
        };

        hotkeys(getKey(key), opt, action);
      });
    });

    return () => {
      hotkeyHooks.forEach((hook) => {
        const keys = Array.isArray(hook) ? hook : [hook];
        keys.forEach(({ key, action }) => {
          hotkeys.unbind(getKey(key), action);
        });
      });
    };
  }, []);
}
