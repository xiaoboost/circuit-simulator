import React from 'react';
import { usePainterService, usePainterHook, useWatcher } from '../../context';
import { MAP_COORDINATE_SERVICE, DRAW_LAYER_HOOK, ELECTRONIC_SERVICE_KEY } from '../../types';
import { createSorter } from '../../utils';
import * as Styles from './styles.css';
import { getBackgroundStyle } from './utils';

export function Drawer() {
  const mapService = usePainterService(MAP_COORDINATE_SERVICE);
  const [{ scale, position }] = useWatcher(mapService.value);
  const layers = usePainterHook(DRAW_LAYER_HOOK).sort(createSorter('asc'));
  const electronicService = usePainterService(ELECTRONIC_SERVICE_KEY);
  const [parts] = useWatcher(electronicService.parts);
  const [lines] = useWatcher(electronicService.lines);

  return (
    <svg
      height='100%'
      width='100%'
      className={Styles.drawerWrapper}
      style={getBackgroundStyle(scale, position)}
    >
      <g transform={`translate(${position.join(',')}) scale(${scale})`}>
        {layers.map(({ name, Render }) => <Render key={name} parts={parts} lines={lines} />)}
      </g>
    </svg>
  );
}
