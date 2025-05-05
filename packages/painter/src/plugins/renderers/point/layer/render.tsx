import { Point } from '@circuit/math';
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
  const result: PointData[] = [];

  for (const part of parts) {
    const partPrototype = service.getPartPrototype(part.kind);

    for (let i = 0; i < partPrototype.points.length; i++) {
      const pin = partPrototype.points[i];
      const position = Point.from(pin.position).rotate2(part.rotate).add(part.position);
      result.push({
        kind: PointKind.PartPin,
        position: position.toData(),
        id: `${part.id}-${i}`,
      });
    }
  }

  return result;
}

export function Render(props: IDrawLayerProps) {
  const pointRenderers = usePainterHook(POINT_RENDERER).sort(createSorter('asc'));
  const electronicService = usePainterService(ELECTRONIC_SERVICE_KEY);
  const points = useMemo(() => getAllPoints(props, electronicService), [props.parts, props.lines]);

  if (pointRenderers.length === 0) {
    return null;
  }

  return (
    <>
      {points.map((point, index) => (
        <g key={point.id ?? index} transform={`translate(${point.position.join(',')})`}>
          {pointRenderers.map(({ name, Render }) => (
            <Render key={name} data={point} />
          ))}
        </g>
      ))}
    </>
  );
}
