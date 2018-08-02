import Vue from 'vue';
import Point, { $P } from 'src/lib/point';

import ParamsDialog from 'src/components/params-dialog/component';
import Electronics from 'src/components/electronic-part/parts';

// 生成全局参数设置对话框组件
const Comp = Vue.extend(ParamsDialog);
const DOM = document.createElement('div');
const dialog = new Comp<ParamsDialog>().$mount(DOM);

// 将组件插入 body 末尾
document.body.appendChild(dialog.$el);

/**
 * 打开器件的参数设置对话框
 *  - 返回等待点击确定按钮的 Promise
 * @param {string} id
 * @param {string[]} params
 * @param {Point} position
 * @param {(keyof Electronics)} type
 * @returns {(Promise<{ id: string; params: string[] }>)}
 */
export default function setPartParams(
    type: keyof Electronics,
    id: string,
    position: Point,
    params: string[],
): Promise<{ id: string; params: string[] }> {
    // 参数对话框初始化赋值
    dialog.id = id;
    dialog.position = $P(position);
    dialog.params = Electronics[type].params.map((param, i) => ({
        unit: param.unit,
        label: param.label + '：',
        value: params[i],
    }));

    // 参数对话框显示
    dialog.vision = true;

    return new Promise((resolve) => {
        dialog.cancel = () => dialog.vision = false;
        dialog.confirm = () => {
            dialog.vision = false;
            resolve({
                id: dialog.id,
                params: dialog.params.map((param) => param.value),
            });
        };
    });
}
