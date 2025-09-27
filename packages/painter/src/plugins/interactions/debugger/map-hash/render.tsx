import { Direction, DirectionVectorSet } from '@circuit/algorithm';
import { isDef } from '@xiao-ai/utils';
import React from 'react';
import { useService, useWatcher } from '../../../../context';
import {
  IPainterConfigurationService,
  IMapHashService,
  IMapCoordinateService,
  MarkKind,
  ConnectionData,
} from '../../../../types';

const nodeColor: Record<MarkKind, string> = {
  [MarkKind.Part]: 'black',
  [MarkKind.PartPin]: 'red',
  [MarkKind.Line]: 'green',
  [MarkKind.LinePoint]: 'orange',
  [MarkKind.LineCross]: 'blue',
  [MarkKind.LineCover]: 'yellow',
  [MarkKind.PartPinLine]: 'purple',
};

export function MapHashDebugger() {
  const configuration = useService(IPainterConfigurationService);
  const [openMapMarkDebugger] = useWatcher(configuration.openMapMarkDebugger);
  const mapHashService = useService(IMapHashService);
  const mapService = useService(IMapCoordinateService);
  const [scale] = useWatcher(mapService.scale);

  if (!openMapMarkDebugger) {
    return null;
  }

  const marks = mapHashService.getAllMarks();

  if (marks.length === 0) {
    return null;
  }

  return (
    <g>
      {/* 节点 */}
      {marks.map((mark) => (
        <circle
          key={`circle-${mark.kind}-${mark.position.join(',')}`}
          strokeWidth={3 / scale}
          stroke={nodeColor[mark.kind]}
          fill="transparent"
          r={4}
          cx={mark.position[0]}
          cy={mark.position[1]}
        />
      ))}
      {/* 连接关系 */}
      {marks.map((mark) => {
        const connectEnds = ([
          'Left', 'Right', 'Top', 'Bottom',
        ] as const)
          .filter((side) => {
            if ('connection' in mark) {
              return mark.connection[side.toLowerCase() as keyof ConnectionData];
            }
            else if ('connections' in mark) {
              return Object.values(mark.connections)
                .some((connection) => connection[side.toLowerCase() as keyof ConnectionData]);
            }
            else {
              return false;
            }
          })
          .map((side) => {
            return mark.position.add(DirectionVectorSet[Direction[side]].mul(20));
          });

        if (connectEnds.length === 0) {
          return null;
        }

        const [x, y] = mark.position;
        const paths = connectEnds
          .map(([tx, ty]) => {
            if (x - tx < 0) {
              return [[x, y - 3], [tx, ty - 3]] as [[number, number], [number, number]];
            }
            else if (x - tx > 0) {
              return [[x, y + 3], [tx, ty + 3]] as [[number, number], [number, number]];
            }
            else if (y - ty < 0) {
              return [[x - 3, y], [tx - 3, ty]] as [[number, number], [number, number]];
            }
            else if (y - ty > 0) {
              return [[x + 3, y], [tx + 3, ty]] as [[number, number], [number, number]];
            }
          })
          .filter(isDef);

        return (
          <>
            {paths.map(([start, end], i) => (
              <path
                key={`path-${mark.kind}-${start.join(',')}-${end.join(',')}-${i}`}
                strokeWidth={3 / scale}
                stroke={nodeColor[mark.kind]}
                fill="transparent"
                d={`M ${end.join(',')} L ${start.join(',')}`}
              />
            ))}
          </>
        );
      })}
    </g>
  );
}
