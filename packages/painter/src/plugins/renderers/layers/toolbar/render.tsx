import React from 'react';
import { useHook } from '../../../../context';
import { IPainterToolBarActionHook } from '../../../../types';
import * as Styles from './styles.less';

export function Render() {
  const actions = useHook(IPainterToolBarActionHook, 'asc');

  if (actions.length === 0) {
    return null;
  }

  const renderedActions = actions.map(({ name, Render }) => <Render key={name} />);
  const hasVisibleActions = React.Children.toArray(renderedActions).some((child) => child !== null);

  if (!hasVisibleActions) {
    return null;
  }

  return <div className={Styles.toolbar}>{renderedActions}</div>;
}
