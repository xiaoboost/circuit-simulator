import React, { WheelEvent } from 'react';
import { usePainterService, usePainterHook, useWatcher } from '../../context';
import { MAP_COORDINATE_SERVICE, EVENT_LISTENER_HOOK } from '../../types';
import { Drawer } from '../drawer';
import { Viewer } from '../viewer';
import * as Styles from './styles.css';
import { getBackgroundStyle } from './utils';

export function Entry() {
  const mapService = usePainterService(MAP_COORDINATE_SERVICE);
  const [{ scale, position }] = useWatcher(mapService.value);
  const events = usePainterHook(EVENT_LISTENER_HOOK);
  const onWheelMouse = (event: WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
    events
      .map((event) => event.onMouseWheel)
      .forEach((cb) => {
        if (cb) {
          cb(event);
        }
      });
  };

  return (
    <div
      className={Styles.entry} style={getBackgroundStyle(scale, position)}
      onWheel={onWheelMouse}
    >
      <Drawer />
      <Viewer />
    </div>
  );
}
