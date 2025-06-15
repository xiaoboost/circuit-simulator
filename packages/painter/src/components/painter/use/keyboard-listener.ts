import hotkeys from 'hotkeys-js';
import { useEffect, RefObject } from 'react';
import { useHook } from '../../../context';
import { HOT_KEY_HOOK, HotKeyOptions } from '../../../types';

/** 事件监听器 */
export function useKeyboardListener(painterRef: RefObject<HTMLDivElement | null>) {
  const hotkeyHooks = useHook(HOT_KEY_HOOK);
  const getKey = (key: string | string[]) => Array.isArray(key) ? key.join(', ') : key;

  useEffect(() => {
    if (!painterRef.current) {
      return;
    }

    hotkeyHooks.forEach(({ key, options, action }) => {
      const opt: HotKeyOptions = {
        keyup: false,
        keydown: true,
        capture: false,
        ...options,
        element: painterRef.current,
      };

      hotkeys(getKey(key), opt, action);
    });

    return () => {
      hotkeyHooks.forEach(({ key, action }) => {
        hotkeys.unbind(getKey(key), action);
      });
    };
  }, [painterRef.current]);
}
