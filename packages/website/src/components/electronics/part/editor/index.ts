import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ElectronicPrototype } from '@circuit/electronics';
import { Point, splitNumber, shortUnitList, allRanks } from '@circuit/math';
import { PartParamEditor, PartParamEditorProps } from './render';
import { FormData } from './form';
import { styles } from './styles';

export interface ParamsOption {
  id: string;
  params: string[];
  position: Point;
  prototype: ElectronicPrototype;
}

export interface ParamsResult {
  id: string;
  params: string[];
}

/** 编辑器件参数 */
export async function editPartParams(opt: ParamsOption) {
  const container = document.createElement('div');
  const reactRoot = createRoot(container);
  const baseProps: PartParamEditorProps = {
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
    // mountComponent(createElement(ParamsDialog, {
    //   ...baseProps,
    //   visible: false,
    // }));
    // unMountComponent();
    reactRoot.unmount();
    document.body.removeChild(container);
  };

  container.className = styles.paramEditorContainer;

  return new Promise<ParamsResult>((resolve) => {
    document.body.appendChild(container);
    reactRoot.render(createElement(PartParamEditor, {
      ...baseProps,
      onCancel: closeModal,
      onConfirm(data: FormData) {
        closeModal();
        resolve({
          id: `${data.label}_${data.suffix}`,
          params: data.params.map((param) => `${param.value}${param.rank ?? ''}`),
        });
      },
    }));
  });
}
