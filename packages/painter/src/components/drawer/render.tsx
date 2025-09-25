import { IStateCoreService } from '@circuit/shared';
import React, { useRef } from 'react';
import {
  useService,
  useHook,
  useWatcher,
} from '../../context';
import {
  IDrawLayerHook,
} from '../../types';
import {
  useMouseListener,
  usePosition,
  useBackgroundStyle,
  useCursorStyle,
} from './driver';
import * as Styles from './styles.less';

export function Drawer() {
  const domRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGGElement>(null);
  const layers = useHook(IDrawLayerHook, 'asc');
  const { state } = useService(IStateCoreService);
  const [{ parts, lines }] = useWatcher(state);
  const backgroundStyle = useBackgroundStyle();
  const cursorStyle = useCursorStyle();

  useMouseListener(domRef);
  usePosition(svgRef);

  return (
    <div
      ref={domRef}
      className={Styles.drawerWrapper}
      style={{
        ...backgroundStyle,
        ...cursorStyle,
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
