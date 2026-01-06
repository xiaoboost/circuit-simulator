import { IMainAreaRender } from '@circuit/contracts/global';
import React from 'react';
import { useHook } from '../../context';
import * as Styles from './styles.less';

export const MainArea = React.memo(function MainArea() {
  const mainAreaRenders = useHook(IMainAreaRender, 'asc');

  return (
    <div className={Styles.mainArea}>
      {mainAreaRenders.map(({ Render, name }) => <Render key={name} />)}
    </div>
  );
});
