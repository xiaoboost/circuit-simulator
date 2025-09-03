import type { PathWithPoint } from '@circuit/algorithm';
import React, { useEffect, useRef } from 'react';
import { useService, useWatcher } from '../../../../context';
import {
  IPainterConfigurationService,
  IVariableObserverService,
} from '../../../../types';
import {
  PATH_SEARCH_POINTS_STATE,
  PathSearchPointData,
  SearchPointColor,
} from './constant';

function draw(data: PathSearchPointData, dom: SVGGElement) {
  let content = '';

  const appendCircle = (cx: number, cy: number, fill: string) => {
    content += `<circle cx="${cx}" cy="${cy}" fill="${fill}" r="4" />`;
  };

  const appendPath = (data: PathWithPoint, color: string) => {
    // eslint-disable-next-line
    content += `<path d="M${data.map((n) => n.join(',')).join('L')}" stroke="${color}" fill="transparent" />`;
  };

  const appendText = (x: number, y: number, fill: string, text: string) => {
    // eslint-disable-next-line
    content += `<text x="${x}" y="${y}" fill="${fill}" font-size="10" stroke-width="0.5">${text}</text>`;
  };

  if (data.current) {
    appendCircle(data.current[0], data.current[1], SearchPointColor.current);
  }

  if (data.start) {
    appendCircle(data.start[0], data.start[1], SearchPointColor.start);
  }

  if (data.end) {
    appendCircle(data.end[0], data.end[1], SearchPointColor.end);
  }

  if (data.expand && data.expand.length > 0) {
    data.expand.forEach(({ point, value }) => {
      appendCircle(point[0], point[1], SearchPointColor.expand);
      appendText(point[0] - 8, point[1] + 20, SearchPointColor.expand, String(value));
    });
  }

  if (data.result) {
    appendPath(data.result, SearchPointColor.result);
  }

  dom.innerHTML = content;
}

export function PathSearchDebugger() {
  const configuration = useService(IPainterConfigurationService);
  const [openLineSearchDebugger] = useWatcher(configuration.openLineSearchDebugger);
  const { observe } = useService(IVariableObserverService);
  const drawRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!openLineSearchDebugger || !drawRef.current) {
      return;
    }

    return observe<PathSearchPointData>(PATH_SEARCH_POINTS_STATE, (data) => {
      draw(data, drawRef.current!);
    });
  }, [openLineSearchDebugger, drawRef.current]);

  if (!openLineSearchDebugger) {
    return null;
  }

  return <g ref={drawRef}></g>;
}
