import React from 'react';

import { useRef, useState } from 'react';
import { useWatcherList, useWatcher } from '@xiao-ai/utils/use';
import { MouseButtons } from '@xiao-ai/utils/web';
import { Point } from '@circuit/math';
import { styles } from './styles';
import { Sheet, Selection } from 'src/store';

import { getBackgroundStyle } from './utils';
import { useMap, useDebugger, mapState } from './map';
import { useMouseBusInit } from '@circuit/event';
import { Part } from '../electronics';
import { SelectionBox, Ref as SelectionBoxRef } from './selection-box';

export function DrawingSheet() {
  const SheetRef = useRef<HTMLElement>(null);
  const DebugRef = useRef<SVGGElement>(null);
  const BoxRef = useRef<SelectionBoxRef>(null);
  const [lines, setLines] = useWatcherList(Sheet.lines);
  const [parts, setParts] = useWatcherList(Sheet.parts);
  const [map] = useWatcher(mapState);
  const mapEvent = useMap();
  const [selected, setSelected] = useState<string[]>([]);
  const onSheetMouseDown = (ev: React.MouseEvent<Element, MouseEvent>) => {
    if (ev.target === ev.currentTarget) {
      if (ev.button === MouseButtons.Right) {
        mapEvent.moveStartEvent(ev);
      }
      else if (ev.button === MouseButtons.Left) {
        setSelected([]);
        BoxRef.current?.start();
      }
    }
  };
  const onSelectByBox = (start: Point, end: Point) => {
    // const minX = Math.min(start[0], end[0]);
    // const maxX = Math.max(start[0], end[0]);
    // const minY = Math.min(start[1], end[1]);
    // const maxY = Math.max(start[1], end[1]);

    // Selection.set(
    //   parts
    //     .filter(({ position: [x, y] }) => (
    //       minX <= x && maxX >= x && minY <= y && maxY >= y
    //     ))
    //     .map(({ id }) => id),
    // )
  };
  const onSelectByMouseDown = (ids: string[]) => {
    setSelected(ids);
  };
  const onPartDeleted = (id: string) => {
    setParts.remove(parts.findIndex((part) => part.id === id));
  };

  useDebugger(DebugRef);
  useMouseBusInit(SheetRef, () => mapState.data);

  return (
    <section
      ref={SheetRef}
      className={styles.sheet}
      style={getBackgroundStyle(map.zoom, map.position)}
    >
      <svg
        height='100%'
        width='100%'
        onMouseDown={onSheetMouseDown}
        onWheel={mapEvent.sizeChangeEvent}
      >
        <g ref={DebugRef} transform={`translate(${map.position.join(',')}) scale(${map.zoom})`}>
          {parts.map((part) => (
            <Part
              key={part.id}
              instance={part}
              selected={selected.includes(part.id)}
              onBeforeCreate={(id: string) => setSelected([id])}
              onDeleted={onPartDeleted}
              onTextMouseDown={() => onSelectByMouseDown([part.id])}
            />
          ))}
          {/* {LinesList}
          {PartsList} */}
          <SelectionBox
            ref={BoxRef}
            onSelect={onSelectByBox}
            {...map}
          />
        </g>
      </svg>
    </section>
  );
}
