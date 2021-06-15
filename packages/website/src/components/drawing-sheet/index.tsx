import React from 'react';

import { useRef, useMemo } from 'react';
import { useWatcher } from '@xiao-ai/utils/use';
import { isNumber } from '@xiao-ai/utils';
import { styles } from './styles';

import * as store from 'src/store';
import * as utils from './utils';

import { useMap, useDebugger, mapState } from './map';
import { useMouseBusInit } from '@circuit/event';

interface Component {
  id: string;
  sortIndex?: number;
  Render(): JSX.Element;
}

function renderComponent(list: readonly Component[]) {
  return list
    .slice()
    .sort((pre, next) => {
      if (isNumber(pre.sortIndex)) {
        if (isNumber(next.sortIndex)) {
          return pre.sortIndex < next.sortIndex ? -1 : 1;
        }
        else {
          return -1;
        }
      }
      else {
        if (isNumber(next.sortIndex)) {
          return 1;
        }
        else {
          return pre.id < next.id ? -1 : 1;
        }
      }
    })
    .map(({ Render, id }) => (
      <Render key={id} />
    ));
}


export function DrawingSheet() {
  const SheetRef = useRef<HTMLElement>(null);
  const SVGRef = useRef<SVGSVGElement>(null);
  const [lines] = useWatcher(store.lines);
  const [parts] = useWatcher(store.parts);
  const [map] = useWatcher(mapState);
  const mapEvent = useMap();
  const LinesList = useMemo(() => renderComponent(lines), [lines]);
  const PartsList = useMemo(() => renderComponent(parts), [parts]);

  useDebugger(SVGRef);
  useMouseBusInit(SheetRef, () => mapState.data);

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
