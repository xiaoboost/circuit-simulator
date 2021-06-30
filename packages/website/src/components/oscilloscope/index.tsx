import React from 'react';

import { panel } from './styles';
import { Button } from 'antd';
import { SolverData } from 'src/store';
import { Oscilloscope } from './chart';

export interface Props extends SolverData {
  onClose(): any;
  oscilloscopes: string[][];
}

export function GraphViewer(props: Props) {
  return <section className={panel.main}>
    <header className={panel.header}>
      <Button type='link' onClick={props.onClose}>关闭面板</Button>|
      <Button type='link'>输出数据</Button>|
      <Button type='link'>输出绘制图像</Button>
    </header>
    <article className={panel.body}>
      {props.oscilloscopes.map((item, i) => (
        <Oscilloscope
          key={i}
          {...props}
          oscilloscopes={item}
        />
      ))}
    </article>
  </section>;
}
