import React, { useState, useEffect } from 'react';
import { useService, useWatcher } from '../../../../context';
import {
  PAINTER_CONFIGURATION_SERVICE,
  VARIABLE_OBSERVER_SERVICE,
} from '../../../../types';
import {
  PATH_SEARCH_POINTS_STATE,
  PathSearchPointData,
  PointWithValue,
  SearchPointColor,
} from './constant';

export function PathSearchDebugger() {
  const configuration = useService(PAINTER_CONFIGURATION_SERVICE);
  const [openLineSearchDebugger] = useWatcher(configuration.openLineSearchDebugger);
  const { useVariable } = useService(VARIABLE_OBSERVER_SERVICE);
  const pathSearchPoints = useVariable<PathSearchPointData>(PATH_SEARCH_POINTS_STATE);
  const [expandPoints, setExpandPoints] = useState<PointWithValue[]>([]);

  useEffect(() => {
    if (!openLineSearchDebugger || !pathSearchPoints) {
      if (expandPoints.length !== 0) {
        setExpandPoints([]);
      }

      return;
    }

    const expand = pathSearchPoints.expand ?? [];
    const newPoints = expand
      .filter(({ point }) => !expandPoints.every(({ point: p }) => p.isEqual(point)));

    if (newPoints.length > 0) {
      setExpandPoints(expandPoints.concat(newPoints));
    }
  }, [pathSearchPoints, pathSearchPoints]);

  if (!openLineSearchDebugger || !pathSearchPoints) {
    return null;
  }

  const circles = [
    {
      cx: pathSearchPoints.current?.[0],
      cy: pathSearchPoints.current?.[1],
      fill: SearchPointColor.current,
    },
    {
      cx: pathSearchPoints.start?.[0],
      cy: pathSearchPoints.start?.[1],
      fill: SearchPointColor.start,
    },
    {
      cx: pathSearchPoints.end?.[0],
      cy: pathSearchPoints.end?.[1],
      fill: SearchPointColor.end,
    },
    ...(pathSearchPoints.expand?.map(({ point }) => ({
      cx: point[0],
      cy: point[1],
      fill: SearchPointColor.expand,
    })) ?? []),
  ];

  const resultPath = pathSearchPoints.result
    ? `M${pathSearchPoints.result.map((n) => n.join(',')).join('L')}`
    : undefined;

  return (
    <g>
      {circles.map((circle, i) => (
        <circle
          key={`circle-${i}`}
          {...circle}
          r={4}
        />
      ))}
      {resultPath && (
        <path
          d={resultPath}
          strokeWidth={2}
          stroke={SearchPointColor.result}
          fill='transparent'
        />
      )}
      {expandPoints.map(({ point, value }) => (
        <text
          key={`text-${point[0]}-${point[1]}`}
          x={point[0] - 8}
          y={point[1] + 8}
          fill={SearchPointColor.expand}
        >
          {value}
        </text>
      ))}
    </g>
  );
}
