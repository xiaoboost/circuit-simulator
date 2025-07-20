// import { MarkKind } from '@circuit/map';
import React from 'react';
import { useHook, useService } from '../../../../context';
import {
  IDrawLayerProps,
  POINT_RENDERER,
  MAP_HASH_SERVICE,
} from '../../../../types';

export function PointLayerRender(_: IDrawLayerProps) {
  return null;
  // const pointRenderers = useHook(POINT_RENDERER, 'asc');
  // const { markService: mapMark } = useService(MAP_HASH_SERVICE);
  // const points = Array.from(mapMark.values()).filter((mark) => mark.kind === MarkKind.LineCover);

  // if (pointRenderers.length === 0 || points.length === 0) {
  //   return null;
  // }

  // return (
  //   <>
  //     {points.map((point) => {
  //       const key = point.position.join(',');

  //       return (
  //         <g key={key} transform={`translate(${key})`}>
  //           {pointRenderers.map(({ name, Render }) => (
  //             <Render key={name} data={point} />
  //           ))}
  //         </g>
  //       );
  //     })}
  //   </>
  // );
}

// // 交叠节点只和导线有关，所以这里直接比较导线即可
// export const Render = React.memo(
//   PointLayerRender,
//   ({ lines: prev }, { lines: next }) => (
//     prev.length === next.length &&
//     prev.every((line, i) => line === next[i])
//   ),
// );
