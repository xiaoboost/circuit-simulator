import hotkeys from 'hotkeys-js';
import { useEffect, useRef } from 'react';
import { usePainterHook } from '../../../context';
import { HOT_KEY_HOOK } from '../../../types';

/** 事件监听器 */
export function useKeyboardListener() {
  const painterRef = useRef<HTMLDivElement>(null);
  const hotkey = usePainterHook(HOT_KEY_HOOK);

  useEffect(() => {
    if (!painterRef.current) {
      return;
    }

    hotkey.forEach((hotkey) => {
      hotkeys(
        Array.isArray(hotkey.key) ? hotkey.key.join(', ') : hotkey.key,
        { element: painterRef.current },
        hotkey.action,
      );
    });

    return () => {
      if (!painterRef.current) {
        return;
      }

      hotkey.forEach((hotkey) => {
        hotkeys.unbind(
          Array.isArray(hotkey.key) ? hotkey.key.join(', ') : hotkey.key,
          hotkey.action,
        );
      });
    };
  }, [painterRef.current]);

  return painterRef;
}
