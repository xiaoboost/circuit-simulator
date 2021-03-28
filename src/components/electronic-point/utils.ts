import React from 'react';
import styles from './index.styl';

export enum PointKind {
  Part,
  Line,
  LineCross,
}

export enum PointStatus {
  Open,
  Close,
}

export function getStyle(kind: PointKind, status: PointStatus, isSelected = false) {
  const data: React.SVGProps<SVGCircleElement> = {};
  const classNameNormal = isSelected ? 'selected' : 'normal';

  let hollow: 'Hollow' | 'Solid' = 'Solid';

  if (kind === PointKind.Part) {
    hollow = 'Solid';
  }
  else if (kind === PointKind.Line) {
    hollow = 'Hollow';

    if (status === PointStatus.Open) {
      data.strokeDasharray = '1.5 4';
    }
  }
  else if (kind === PointKind.LineCross) {
    hollow = 'Solid';
  }

  data.className = styles[`${classNameNormal}${hollow}`];

  return data;
}

export function getSize(kind: PointKind, status: PointStatus, hover: boolean) {
  if (kind === PointKind.LineCross) {
    return hover ? 6 : 2;
  }
  else if (kind === PointKind.Part) {
    return status === PointStatus.Open
      ? hover ? 5 : 0
      : 2;
  }
  else if (kind === PointKind.Line) {
    return status === PointStatus.Close
      ? hover ? 8 : 4
      : 2;
  }

  return 0;
}
