import Vue from 'vue';
import Point from 'src/lib/point';
import Electronics from './parts';
import ParamsDialog from 'src/components/params-dialog';

import { createSelectList, splitNumber } from 'src/lib/native';

// 生成全局参数设置对话框组件
const Comp = Vue.extend(ParamsDialog);
const DOM = document.createElement('div');
const dialog = new Comp<ParamsDialog>().$mount(DOM);

// 将组件插入 body 末尾
document.body.appendChild(dialog.$el);

interface Params {
    id: string;
    params: string[];
}

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
) {
    // 参数对话框初始化赋值
    dialog.id = id;
    dialog.title = Electronics[type].introduction;
    dialog.position = Point.from(position);
    dialog.params = Electronics[type].params.map((param, i) => {
        const value = splitNumber(params[i]);

        return {
            label: param.label,
            units: createSelectList(param.unit, false),
            value: value.number,
            unit: value.unit,
        };
    });

    // 显示对话框
    dialog.show = true;

    // 关闭对话框函数
    const close = () => dialog.show = false;

    return new Promise<Params>((resolve) => {
        dialog.cancel = close;
        dialog.confirm = () => {
            close();
            resolve({
                id: dialog.id,
                params: dialog.params.map(({ value, unit }) => value + unit),
            });
        };
    });
}
