import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Point, splitNumber, shortUnitList, allRanks } from '@circuit/math';
import { ParamsDialog } from './render';
import { ElectronicPrototype } from '@circuit/electronics';
import { transformTime } from './styles';

export interface ParamsOption {
  id: string;
  prototype: ElectronicPrototype;
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
  }, transformTime);
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
    position: opt.position,
    params: opt.prototype.params.map((param, i) => {
      const value = splitNumber(opt.params[i]);

      return {
        label: param.label,
        value: value.number,
        rank: value.rank,
        unit: param.unit,
        units: shortUnitList(param.ranks ?? allRanks, param.unit, false),
      };
    }),
    onCancel() {
      unMountComponent();
    },
  });

  mountComponent(component);
}
