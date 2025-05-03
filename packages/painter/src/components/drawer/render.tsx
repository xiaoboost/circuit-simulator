import React from 'react';
import { usePainterService, usePainterHook, useWatcher } from '../../context';
import { MAP_COORDINATE_SERVICE, DRAW_LAYER_HOOK } from '../../types';
import { createSorter } from '../../utils';
import * as Styles from './styles.css';
import { getBackgroundStyle } from './utils';

export function Drawer() {
  const mapService = usePainterService(MAP_COORDINATE_SERVICE);
  const [{ scale, position }] = useWatcher(mapService.value);
  const viewers = usePainterHook(DRAW_LAYER_HOOK).sort(createSorter('asc'));

  return (
    <svg
      height='100%'
      width='100%'
      className={Styles.drawerWrapper}
      style={getBackgroundStyle(scale, position)}
    >
      <g transform={`translate(${position.join(',')}) scale(${scale})`}>
        {viewers.map((item) => item.Render())}
      </g>
    </svg>
  );
}
