import Vue from 'vue';
import Point from 'src/lib/point';
import ParamsDialog from 'src/components/params-dialog';

import { createSelectList, splitNumber } from 'src/lib/number';
import { default as Electronics, UnitType } from './parts';

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

/** 单位对应的扩展映射 */
const rankMap = {
    [UnitType.Farad]: ['', 'm', 'u', 'p'],
    [UnitType.Henry]: ['', 'm', 'u', 'p'],
    [UnitType.Ohm]: ['M', 'k', '', 'm'],
    [UnitType.Volt]: ['', 'm'],
    [UnitType.Ampere]: ['', 'm', 'u'],
    [UnitType.Hertz]: ['M', 'k', ''],
};

/**
 * 打开器件的参数设置对话框
 *  - 返回等待点击确定按钮的 Promise
 * @param {string} id
 * @param {string[]} params
 * @param {Point} position
 * @param {(keyof Electronics)} type
 * @returns {(Promise<Params>)}
 */
export default function setPartParams(
    type: keyof Electronics,
    id: string,
    position: Point,
    params: string[],
    afterClose?: () => void,
) {
    const ids = id.split('_');
    const origin = Electronics[type];

    // 参数对话框初始化赋值
    dialog.preId = ids[0];
    dialog.subId = ids[1];
    dialog.title = `${origin.introduction} - ${id}`;
    dialog.position = Point.from(position);
    dialog.params = origin.params.map((param, i) => {
        const value = splitNumber(params[i]);

        return {
            label: param.label,
            value: value.number,
            rank: value.rank,
            unit: param.unit,
            units: createSelectList(rankMap[param.unit] || [], param.unit, false),
        };
    });

    // 显示对话框
    dialog.show = true;

    // 关闭对话框函数
    const close = () => {
        dialog.show = false;
        dialog.clear();

        if (afterClose) {
            Vue.nextTick(afterClose);
        }
    };

    return new Promise<Params>((resolve) => {
        dialog.cancel = close;
        dialog.confirm = () => {
            close();
            resolve({
                id: dialog.id,
                params: dialog.params.map(({ value, rank }) => value + rank),
            });
        };
    });
}
