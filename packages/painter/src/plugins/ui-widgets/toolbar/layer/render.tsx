import React from 'react';
import { useHook } from '../../../../context';
import { IPainterToolBarActionHook } from '../../../../types';
import * as Styles from './styles.less';

export function Render() {
  const actions = useHook(IPainterToolBarActionHook, 'asc');

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={Styles.toolbar}>
      {actions.map(({ name, Render }) => (
        <Render key={name} />
      ))}
    </div>
  );
}
