import React from 'react';

import Logo from './assets/logo.png';

import * as Styles from './styles.less';

export const Header = React.memo(function Header() {
  return (
    <div className={Styles.header}>
      <span className={Styles.title}>
        <img src={Logo} alt="pcb" />
        <span className={Styles.titleText}>电路图绘制·仿真</span>
      </span>
    </div>
  );
});
