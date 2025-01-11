import React from 'react';

import { useRef, useState } from 'react';
import { useWatcherList, useWatcher } from '@xiao-ai/utils/use';
import { MouseButtons } from '@xiao-ai/utils/web';
import { Point } from '@circuit/math';
import { styles } from './styles';
import { Sheet, Selection, Map } from 'src/store';
import { Part as PartInstance, Line as LineInstance } from '@circuit/electronics';

import { getBackgroundStyle } from './utils';
import { useMap, useDebugger } from './map';
import { useMouseBusInit } from '@circuit/event';
import { Part, Line } from '../electronics';
import { SelectionBox, Ref as SelectionBoxRef } from './selection-box';

export function DrawingSheet() {
  const SheetRef = useRef<HTMLElement>(null);
  const DebugRef = useRef<SVGGElement>(null);
  const BoxRef = useRef<SelectionBoxRef>(null);
  const [lines, setLines] = useWatcherList(Sheet.lines);
  const [parts, setParts] = useWatcherList(Sheet.parts);
  const [map] = useWatcher(Map.state);
  const mapEvent = useMap();
  const [selected, setSelected] = useState<string[]>([]);
  const onSheetMouseDown = (ev: React.MouseEvent<Element, MouseEvent>) => {
    if (ev.target === ev.currentTarget) {
      if (ev.button === MouseButtons.Middle) {
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
  const onPinMouseDown = (ev: React.MouseEvent, part: PartInstance, index: number) => {
    if (ev.button !== MouseButtons.Left) {
      return;
    }

    ev.stopPropagation();

    const startPoint = part.position.add(part.points[index].position);
    const connect = part.connections[index];

    // 引脚为空
    if (connect.isSpace) {
      const line = new LineInstance([startPoint]);
      part.setConnection(index, { id: line.id, mark: 0 });
      line.setConnection(0, { id: part.id, mark: index });
      setLines.push(line);
      setSelected([part.id, line.id]);
    }
    // 引脚有连接
    else {
      // TODO:
      // const { id: lineId, mark } = connect.value;

      // line = this.find<LineComponent>(lineId)!;

      // if (mark === 0) {
      //   line.reverse();
      // }

      // this.connections[i].clear();
      // line.connections[mark].clear();
      // this.setSelects([line.id]);
    }
  };

  useDebugger(DebugRef);
  useMouseBusInit(SheetRef, () => Map.state.data);

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
              onPinMouseDown={onPinMouseDown}
              onTextMouseDown={() => onSelectByMouseDown([part.id])}
            />
          ))}
          {lines.map((line) => (
            <Line
              key={line.id}
              instance={line}
              selected={selected.includes(line.id)}
            />
          ))}
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
