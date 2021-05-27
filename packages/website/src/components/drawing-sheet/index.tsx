import React from 'react';

import { useRef, useMemo } from 'react';
import { useWatcher } from 'src/use';
import { styles } from './styles';

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
  const classNames = styles();
  const LinesList = useMemo(
    () => lines.map(({ Render, id }) => <Render key={id} />),
    [parts],
  );
  const PartsList = useMemo(
    () => parts.map(({ Render, id }) => <Render key={id} />),
    [parts],
  );

  useMouseBusInit(SheetRef);

  return (
    <section
      ref={SheetRef}
      className={classNames.sheet}
      style={utils.getBackgroundStyle(map.zoom, map.position)}
      onMouseDown={mapEvent.moveStartEvent}
      onWheel={mapEvent.sizeChangeEvent}
    >
      <svg height='100%' width='100%'>
        <g transform={`translate(${map.position.join(',')}) scale(${map.zoom})`}>
          {LinesList}
          {PartsList}
        </g>
      </svg>
    </section>
  );
}
