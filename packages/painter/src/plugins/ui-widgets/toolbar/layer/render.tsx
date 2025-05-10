import React from 'react';
import { usePainterHook } from '../../../../context';
import { PAINTER_TOOLBAR_ACTION_HOOK } from '../../../../types';
import { createSorter } from '../../../../utils';
import * as Styles from './styles.css';

export function Render() {
  const actions = usePainterHook(PAINTER_TOOLBAR_ACTION_HOOK).sort(createSorter('asc'));

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
