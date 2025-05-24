import React from 'react';
import {
  usePainterService,
  usePainterHook,
  useWatcher,
} from '../../context';
import {
  MAP_COORDINATE_SERVICE,
  DRAW_LAYER_HOOK,
  PAINTER_SERVICE_KEY,
  CURSOR_SERVICE,
} from '../../types';
import * as Styles from './styles.less';
import { useMouseListener } from './use';
import { getBackgroundStyle, getCursorStyle } from './utils';

export function Drawer() {
  const mapService = usePainterService(MAP_COORDINATE_SERVICE);
  const [{ scale, position }] = useWatcher(mapService.value);
  const mouseListener = useMouseListener();
  const layers = usePainterHook(DRAW_LAYER_HOOK, 'asc');
  const painterService = usePainterService(PAINTER_SERVICE_KEY);
  const cursorService = usePainterService(CURSOR_SERVICE);
  const [parts] = useWatcher(painterService.parts);
  const [lines] = useWatcher(painterService.lines);
  const [cursor] = useWatcher(cursorService.value);
  const [isReady] = useWatcher(painterService.isReady);

  // 未准备好时，不渲染
  if (!isReady) {
    return null;
  }

  return (
    <div
      className={Styles.drawerWrapper}
      style={{
        ...getBackgroundStyle(scale, position),
        ...getCursorStyle(cursor),
      }}
      {...mouseListener}
    >
      <svg height='100%' width='100%'>
        <g transform={`translate(${position.join(',')}) scale(${scale})`}>
          {layers.map(({ name, Render }) => <Render key={name} parts={parts} lines={lines} />)}
        </g>
      </svg>
    </div>
  );
}
