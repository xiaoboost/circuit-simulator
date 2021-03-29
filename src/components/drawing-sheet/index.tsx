import React from 'react';
import styles from './index.styl';

import { useRef } from 'react';
import { Point } from 'src/math';
import { stringifyClass } from '@utils/string';
import { useWatcher, useWatcherList } from 'src/use';

import { ElectronicLine } from '../electronic-line';
import { ElectronicPart } from '../electronic-part';

import * as store from 'src/electronics';
import * as utils from './utils';

import { useMap, mapState } from './map';
import { useMouseBusInit } from './mouse';

export function DrawingSheet() {
  const SheetRef = useRef<HTMLElement>(null);
  const [lines] = useWatcherList(store.lines);
  const [parts] = useWatcherList(store.parts);
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
          {lines.map((line) => <ElectronicLine key={line.id} data={line} />)}
          {parts.map((part) => <ElectronicPart key={part.id} data={part} />)}
        </g>
      </svg>
    </section>
  );
}
