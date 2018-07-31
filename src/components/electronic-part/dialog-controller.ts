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
 *  - 返回`Promise<void>`表示点击了取消按钮
 *  - 返回`Promise<{ id: string; params: string[] }>`表示点击了确定按钮，其中数据即为最后对话框中输入的数据
 *
 * @param {string} id
 * @param {string[]} params
 * @param {Point} position
 * @param {(keyof Electronics)} type
 * @returns {(Promise<{ id: string; params: string[] } | void>)}
 */
export default function setPartParams(
    type: keyof Electronics,
    id: string,
    position: Point,
    params: string[],
): Promise<{ id: string; params: string[] } | void> {
    // 参数对话框初始化赋值
    dialog.id = id;
    dialog.position = $P(position);
    dialog.params = Electronics[type].params.map((param, i) => ({ ...param, value: params[i] }));

    // 参数对话框显示
    dialog.vision = true;

    return new Promise((resolve) => {
        dialog.cancel = () => {
            dialog.vision = false;
            resolve();
        };
        dialog.confirm = () => {
            dialog.vision = false;
            resolve({
                id: dialog.id,
                params: dialog.params.map((param) => param.value),
            });
        };
    });
}
