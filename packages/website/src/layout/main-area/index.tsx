import React from 'react';
import { useHook } from '../../context';
import { MAIN_AREA_RENDER } from '../../types/hook/main-area';
import * as Styles from './styles.less';

export const MainArea = React.memo(function MainArea() {
  const mainAreaRenders = useHook(MAIN_AREA_RENDER, 'asc');

  return (
    <div className={Styles.mainArea}>
      {mainAreaRenders.map(({ Render, name }) => <Render key={name} />)}
    </div>
  );
});
