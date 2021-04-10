import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Point } from 'src/math';
import { ParamsDialog } from './render';
import { ElectronicKind } from '../electronics';
import { delayTime } from './styles';

export interface ParamsOption {
  id: string;
  kind: ElectronicKind;
  params: string[];
  position: Point;
}

export interface ParamsResult {
  // ..
}

/** 对话框容器 */
let currentContainer: HTMLElement;

/** 加载组件 */
function mountComponent(comp: React.FunctionComponentElement<any>) {
  currentContainer && render(comp, currentContainer);
}

/** 卸载组件 */
function unMountComponent() {
  setTimeout(() => {
    currentContainer && unmountComponentAtNode(currentContainer);
  }, delayTime);
}

/** 编辑器件参数 */
export async function editPartParams(opt: ParamsOption) {
  if (!currentContainer) {
    const root = document.body;
    currentContainer = document.createElement('div');
    root.appendChild(currentContainer);
  }


  const component = createElement(ParamsDialog, {
    visible: true,
    id: opt.id,
    params: [],
    position: opt.position,
    onCancel() {
      unMountComponent();
    },
  });

  mountComponent(component);
}
