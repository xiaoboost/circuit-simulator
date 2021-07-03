import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { ElectronicPrototype } from '@circuit/electronics';
import { Point, splitNumber, shortUnitList, allRanks } from '@circuit/math';
import { ParamsDialog } from './render';
import { transformTime } from './styles';
import { FormData } from './form';

export interface ParamsOption {
  id: string;
  prototype: ElectronicPrototype;
  params: string[];
  position: Point;
}

export interface ParamsResult {
  id: string;
  params: string[];
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
  }, transformTime + 50);
}

/** 编辑器件参数 */
export async function editPartParams(opt: ParamsOption) {
  if (!currentContainer) {
    const root = document.body;
    currentContainer = document.createElement('div');
    root.appendChild(currentContainer);
  }

  const baseProps = {
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
  };

  const closeModal = () => {
    mountComponent(createElement(ParamsDialog, {
      ...baseProps,
      visible: false,
    }));
    unMountComponent();
  };

  return new Promise<ParamsResult>((resolve) => {
    mountComponent(createElement(ParamsDialog, {
      ...baseProps,
      onCancel: closeModal,
      onConfirm(data: FormData) {
        closeModal();
        resolve({
          id: `${data.label}_${data.suffix}`,
          params: data.params.map((param) => `${param.value}${param.rank}`),
        });
      },
    }));
  });
}
