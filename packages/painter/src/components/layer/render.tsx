import React from 'react';

export interface LayerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Layer(props: LayerProps) {
  return <div>Painter</div>;
}
