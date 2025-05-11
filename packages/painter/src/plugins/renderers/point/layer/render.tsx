import { Point, getPathCoverPoints } from '@circuit/algorithm';
import React, { useMemo } from 'react';
import { usePainterHook, usePainterService } from '../../../../context';
import {
  IDrawLayerProps,
  PointKind,
  PointData,
  IElectronicService,
  POINT_RENDERER,
  ELECTRONIC_SERVICE_KEY,
} from '../../../../types';
import { createSorter } from '../../../../utils';

function getAllPoints({ parts, lines }: IDrawLayerProps, service: IElectronicService): PointData[] {
  const pointMap = new Map<string, PointData>();

  // // 器件节点
  // for (const part of parts) {
  //   const partPrototype = service.getPartPrototype(part.kind);

  //   for (let i = 0; i < partPrototype.points.length; i++) {
  //     const pin = partPrototype.points[i];
  //     const position = Point.from(pin.position).rotate(part.rotate).add(part.position);
  //     const data = {
  //       kind: PointKind.PartPin,
  //       position: position.toData(),
  //       id: `${part.id}-${i}`,
  //     };

  //     pointMap.set(data.position.join(','), data);
  //   }
  // }

  // // 导线节点
  // for (const line of lines) {
  //   // 这里保证所有导线的起点和终点是不同的
  //   for (let i = 0; i < 2; i++) {
  //     const point = [line.path[0], line.path[line.path.length - 1]][i];
  //     const data = {
  //       kind: PointKind.LinePoint,
  //       position: point.slice() as [number, number],
  //       id: `${line.id}-${i}`,
  //     };
  //     const oldPoint = pointMap.get(point.join(','));

  //     if (oldPoint) {
  //       if (oldPoint.kind === PointKind.PartPin) {
  //         oldPoint.kind = PointKind.PartPinLine;
  //       }
  //       else if (oldPoint.kind === PointKind.LinePoint) {
  //         oldPoint.kind = PointKind.LineCross;
  //       }

  //       // 合并节点编号
  //       oldPoint.id = `${oldPoint.id}:${data.id}`;
  //     }
  //     else {
  //       pointMap.set(data.position.join(','), data);
  //     }
  //   }
  // }

  // 导线交叠节点
  for (const line1 of lines) {
    for (const line2 of lines) {
      if (line1 === line2) {
        continue;
      }

      const coverPoints = getPathCoverPoints(line1.path, line2.path);

      for (const point of coverPoints) {
        pointMap.set(point.join(','), {
          kind: PointKind.LineCover,
          position: point.slice() as [number, number],
          id: `${line1.id}:${line2.id}`,
        });
      }
    }
  }

  return Array.from(pointMap.values());
}

export function Render(props: IDrawLayerProps) {
  const pointRenderers = usePainterHook(POINT_RENDERER).sort(createSorter('asc'));
  const electronicService = usePainterService(ELECTRONIC_SERVICE_KEY);
  const points = useMemo(() => getAllPoints(props, electronicService), [props.parts, props.lines]);

  if (pointRenderers.length === 0) {
    return null;
  }

  return (
    <g>
      {points.map((point, index) => (
        <g key={point.id ?? index} transform={`translate(${point.position.join(',')})`}>
          {pointRenderers.map(({ name, Render }) => (
            <Render key={name} data={point} />
          ))}
        </g>
      ))}
    </g>
  );
}
