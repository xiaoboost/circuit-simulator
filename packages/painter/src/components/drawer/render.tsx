import { IStateCoreService } from '@circuit/shared';
import React, { useRef } from 'react';
import {
  useService,
  useHook,
  useWatcher,
} from '../../context';
import {
  IMapCoordinateService,
  IDrawLayerHook,
  ICursorService,
} from '../../types';
import * as Styles from './styles.less';
import { useMouseListener, usePosition } from './use';
import { getBackgroundStyle, getCursorStyle } from './utils';

export function Drawer() {
  const mapService = useService(IMapCoordinateService);
  const [scale] = useWatcher(mapService.scale);
  const [position] = useWatcher(mapService.position);
  const domRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGGElement>(null);
  const layers = useHook(IDrawLayerHook, 'asc');
  const { state } = useService(IStateCoreService);
  const cursorService = useService(ICursorService);
  const [{ parts, lines }] = useWatcher(state);
  const [cursor] = useWatcher(cursorService.value);

  useMouseListener(domRef);
  usePosition(svgRef);

  return (
    <div
      ref={domRef}
      className={Styles.drawerWrapper}
      style={{
        ...getBackgroundStyle(scale, position),
        ...getCursorStyle(cursor),
      }}
    >
      <svg height="100%" width="100%">
        <g ref={svgRef}>
          {layers.map(({ name, Render }) => <Render key={name} parts={parts} lines={lines} />)}
        </g>
      </svg>
    </div>
  );
}
