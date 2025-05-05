import React from 'react';
import { IPointRendererProps } from '../../../../types';

export function Render({ data }: IPointRendererProps) {
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
