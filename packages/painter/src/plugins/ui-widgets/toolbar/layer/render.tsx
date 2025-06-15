import React from 'react';
import { useHook } from '../../../../context';
import { PAINTER_TOOLBAR_ACTION_HOOK } from '../../../../types';
import * as Styles from './styles.less';

export function Render() {
  const actions = useHook(PAINTER_TOOLBAR_ACTION_HOOK, 'asc');

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
