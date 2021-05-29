import React from 'react';

import { PropsWithChildren } from 'react';
import { panelStyle } from './styles';

interface Props {
  title: string;
  subtitle: string;
}

export function Panel(props: PropsWithChildren<Props>) {
  return (
    <section className={panelStyle.box}>
      <header className={panelStyle.header}>
        <h1>{props.title}</h1>
        <h2>{props.subtitle}</h2>
      </header>
      <article className={panelStyle.body}>
        {props.children}
      </article>
    </section>
  );
}
