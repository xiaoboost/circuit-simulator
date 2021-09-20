import React from 'react';

import { PropsWithChildren } from 'react';
import { panelStyle } from './styles';
import { CloseCircleOutlined } from '@ant-design/icons';

interface Props {
  title: string;
  subtitle: string;
  onClose(): void;
}

export function Panel(props: PropsWithChildren<Props>) {
  return (
    <section className={panelStyle.box}>
      <header className={panelStyle.header}>
        <h1>{props.title}</h1>
        <h2>{props.subtitle}</h2>
        <CloseCircleOutlined
          className={panelStyle.headerClose}
          onClick={props.onClose}
        />
      </header>
      <article className={panelStyle.body}>
        {props.children}
      </article>
    </section>
  );
}
