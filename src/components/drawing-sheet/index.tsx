import React from 'react';
import styles from './index.styl';

import { useRef } from 'react';
import { stringifyClass } from '@utils/string';
import { useWatcher } from 'src/use';

import * as store from '../electronics';
import * as utils from './utils';

import { useMap, mapState } from './map';
import { useMouseBusInit } from 'src/lib/mouse';

export function DrawingSheet() {
  const SheetRef = useRef<HTMLElement>(null);
  const [lines] = useWatcher(store.lines);
  const [parts] = useWatcher(store.parts);
  const [map] = useWatcher(mapState);
  const mapEvent = useMap();

  useMouseBusInit(SheetRef);

  return (
    <section
      ref={SheetRef}
      className={stringifyClass(styles.drawingSheet)}
      style={utils.getBackgroundStyle(map.zoom, map.position)}
      onMouseDown={mapEvent.moveStartEvent}
      onWheel={mapEvent.sizeChangeEvent}
    >
      <svg height='100%' width='100%'>
        <g transform={`translate(${map.position.join(',')}) scale(${map.zoom})`}>
          {lines.map(({ Render, id }) => <Render key={id} />)}
          {parts.map(({ Render, id }) => <Render key={id} />)}
        </g>
      </svg>
    </section>
  );
}
