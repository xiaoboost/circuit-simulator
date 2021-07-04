import React from 'react';

import { DrawEventController } from '@circuit/event';
import { useState, useRef } from 'react';
import { Point } from '@circuit/math';
import { MapState } from './map';
import { styles } from './styles';
import { useImperativeHandle, forwardRef } from 'react';

export interface Props extends MapState {
  onSelect(start: Point, end: Point): any;
}

export interface Ref {
  start(): any;
}

interface State {
  start?: Point;
  end?: Point;
  visible?: boolean;
}

function toPath(start: Point, end: Point) {
  const top = start[1];
  const bottom = end[1];
  const left = start[0];
  const right = end[0];

  return `M${left},${top}L${right},${top}L${right},${bottom}L${left},${bottom}Z`;
}

export const SelectionBox = forwardRef<Ref, Props>(function SelectionBox(props, ref) {
  const [points, setPoints] = useState('');
  const state = useRef<State>({});
  const startSelect = () => {
    new DrawEventController()
      .setStopEvent({ type: 'mouseup', which: 'Left' })
      .setMoveEvent((ev) => {
        if (!state.current.start) {
          state.current.start = Point.from(ev.position);
        }

        if (!state.current.visible) {
          state.current.visible = state.current.start.distance(ev.position) > 5;
        }

        state.current.end = ev.position;

        if (state.current.visible) {
          setPoints(toPath(state.current.start, state.current.end));
        }
      })
      .start()
      .then(() => {
        const { start, end, visible } = state.current;

        setPoints('');
        state.current.start = undefined;
        state.current.end = undefined;
        state.current.visible = false;

        if (visible) {
          props.onSelect(start!, end!);
        }
      });
  };

  useImperativeHandle(ref, () => ({
    start: startSelect,
  }));

  if (!state.current.visible) {
    return <></>;
  }

  const width = 2 / props.zoom;
  return <path className={styles.selectionBox} strokeWidth={width} d={points} />;
});
