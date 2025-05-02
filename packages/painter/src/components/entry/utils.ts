import { Point } from '@circuit/math';

export function getBackgroundStyle(scale: number, position: Point): React.CSSProperties {
  const size = scale * 20;
  const biasX = position[0] % size;
  const biasY = position[1] % size;

  return {
    backgroundSize: `${size}px`,
    backgroundPosition: `${biasX}px ${biasY}px`,
  };
}
