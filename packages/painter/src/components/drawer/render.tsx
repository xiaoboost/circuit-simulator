import { STATE_CORE_SERVICE } from '@circuit/shared';
import React, { useRef } from 'react';
import {
  useService,
  useHook,
  useWatcher,
} from '../../context';
import {
  MAP_COORDINATE_SERVICE,
  DRAW_LAYER_HOOK,
  CURSOR_SERVICE,
} from '../../types';
import * as Styles from './styles.less';
import { useMouseListener } from './use';
import { getBackgroundStyle, getCursorStyle } from './utils';

export function Drawer() {
  const mapService = useService(MAP_COORDINATE_SERVICE);
  const [scale] = useWatcher(mapService.scale);
  const [position] = useWatcher(mapService.position);
  const domRef = useRef<HTMLDivElement>(null);
  const layers = useHook(DRAW_LAYER_HOOK, 'asc');
  const { state } = useService(STATE_CORE_SERVICE);
  const cursorService = useService(CURSOR_SERVICE);
  const [{ parts, lines }] = useWatcher(state);
  const [cursor] = useWatcher(cursorService.value);

  useMouseListener(domRef);

  return (
    <div
      ref={domRef}
      className={Styles.drawerWrapper}
      style={{
        ...getBackgroundStyle(scale, position),
        ...getCursorStyle(cursor),
      }}
    >
      <svg height='100%' width='100%'>
        <g transform={`translate(${position.join(',')}) scale(${scale})`}>
          {layers.map(({ name, Render }) => <Render key={name} parts={parts} lines={lines} />)}
        </g>
      </svg>
    </div>
  );
}
