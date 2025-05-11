import { Colors } from '@circuit/shared';
import React from 'react';
import { IPointRendererProps, PointKind } from '../../../../types';

export function Render({ data }: IPointRendererProps) {
  if (data.kind === PointKind.LineCover) {
    return (
      <circle cx='0' cy='0' r='3' fill={Colors.White.toString()} />
    );
  }
  else if (data.kind === PointKind.LineCross) {
    return (
      <circle cx='0' cy='0' r='3' fill={Colors.White.toString()} />
    );
  }
  else if (data.kind === PointKind.PartPin) {
    return (
      <circle cx='0' cy='0' r='3' fill={Colors.White.toString()} />
    );
  }
  else if (data.kind === PointKind.LinePoint) {
    return (
      <circle cx='0' cy='0' r='3' fill={Colors.White.toString()} />
    );
  }
  else if (data.kind === PointKind.PartPinLine) {
    return (
      <circle cx='0' cy='0' r='3' fill={Colors.White.toString()} />
    );
  }

  return (
    <>
      <circle
        cx='0'
        cy='0'
        r='5'
      >
        {/* <animate
          ref={animate}
          fill='freeze'
          attributeType='XML'
          attributeName='r'
          begin='indefinite'
          calcMode='spline'
          keyTimes='0; 1'
          keySplines='.2 1 1 1'
          dur='200ms'
          values={`${animateFrom}; ${animateTo}`}>
        </animate> */}
      </circle>
    </>
  );
}
