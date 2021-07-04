import React from 'react';

import { useRef, useMemo } from 'react';
import { useWatcher } from '@xiao-ai/utils/use';
import { MouseButtons } from '@xiao-ai/utils/web';
import { isNumber } from '@xiao-ai/utils';
import { Point } from '@circuit/math';
import { styles } from './styles';

import * as store from 'src/store';
import * as utils from './utils';

import { useMap, useDebugger, mapState } from './map';
import { useMouseBusInit } from '@circuit/event';
import { SelectionBox, Ref as SelectionBoxRef } from './selection-box';

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
  const DebugRef = useRef<SVGGElement>(null);
  const BoxRef = useRef<SelectionBoxRef>(null);
  const [lines] = useWatcher(store.lines);
  const [parts] = useWatcher(store.parts);
  const [map] = useWatcher(mapState);
  const mapEvent = useMap();
  const LinesList = useMemo(() => renderComponent(lines), [lines]);
  const PartsList = useMemo(() => renderComponent(parts), [parts]);
  const onMouseDown = (ev: React.MouseEvent<Element, MouseEvent>) => {
    if (ev.target === ev.currentTarget) {
      if (ev.button === MouseButtons.Right) {
        mapEvent.moveStartEvent(ev);
      }
      else if (ev.button === MouseButtons.Left) {
        BoxRef.current?.start();
      }
    }
  };
  const onSelect = (start: Point, end: Point) => {
    debugger;
  };

  useDebugger(DebugRef);
  useMouseBusInit(SheetRef, () => mapState.data);

  return (
    <section
      ref={SheetRef}
      className={styles.sheet}
      style={utils.getBackgroundStyle(map.zoom, map.position)}
    >
      <svg
        height='100%'
        width='100%'
        onMouseDown={onMouseDown}
        onWheel={mapEvent.sizeChangeEvent}
      >
        <g ref={DebugRef} transform={`translate(${map.position.join(',')}) scale(${map.zoom})`}>
          {LinesList}
          {PartsList}
          <SelectionBox
            ref={BoxRef}
            onSelect={onSelect}
            {...map}
          />
        </g>
      </svg>
    </section>
  );
}
