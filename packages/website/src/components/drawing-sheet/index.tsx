import React from 'react';

import { useRef, useMemo } from 'react';
import { useWatcher } from '@xiao-ai/utils/use';
import { styles } from './styles';

import * as store from 'src/store';
import * as utils from './utils';

import { useMap, useDebugger, mapState } from './map';
import { useMouseBusInit } from 'src/lib/mouse';

export function DrawingSheet() {
  const SheetRef = useRef<HTMLElement>(null);
  const SVGRef = useRef<SVGSVGElement>(null);
  const [lines] = useWatcher(store.lines);
  const [parts] = useWatcher(store.parts);
  const [map] = useWatcher(mapState);
  const mapEvent = useMap();
  const LinesList = useMemo(
    () => lines.map(({ Render, id }) => <Render key={id} />),
    [lines],
  );
  const PartsList = useMemo(
    () => parts.map(({ Render, id }) => <Render key={id} />),
    [parts],
  );

  useMouseBusInit(SheetRef);
  useDebugger(SVGRef);

  return (
    <section
      ref={SheetRef}
      className={styles.sheet}
      style={utils.getBackgroundStyle(map.zoom, map.position)}
      onMouseDown={mapEvent.moveStartEvent}
      onWheel={mapEvent.sizeChangeEvent}
    >
      <svg ref={SVGRef} height='100%' width='100%'>
        <g transform={`translate(${map.position.join(',')}) scale(${map.zoom})`}>
          {LinesList}
          {PartsList}
        </g>
      </svg>
    </section>
  );
}
