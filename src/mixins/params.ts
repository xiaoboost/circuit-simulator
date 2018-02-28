import Vue from 'vue';
import { $P, Point } from 'src/lib/point';
import Electronics from 'src/components/electronic-part/parts';
import Dialog, { ParamsDialog } from 'src/components/params-dialog';

import { VueConstructor } from 'vue/types/vue';

export interface ParamsInput {
    id: string;
    type: string;
    params: string[];
    position: Point;
}

// 组件安装函数
function install(App: VueConstructor) {
    // 生成对话框组件实例
    const Comp = Vue.extend(Dialog);
    const DOM = document.createElement('div');

    // 生成全局参数设置组件
    const dialog = new Comp<ParamsDialog>().$mount(DOM);
    // 将组件插入 body 末尾
    document.body.appendChild(dialog.$el);

    /**
     * 打开器件的参数设置对话框
     *  - 返回`Promise<void>`表示点击了取消按钮
     *  - 返回`Promise<{ id: string; params: string[] }>`表示点击了确定按钮，其中数据即为最后对话框中输入的数据
     *
     * @param {ParamsInput} { id, type, params, position }
     * @returns {(Promise<{ id: string; params: string[] } | void>)}
     */
    App.prototype.setPartParams = ({ id, type, params, position }: ParamsInput): Promise<{ id: string; params: string[] } | void> => {
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
            dialog.comfirm = () => {
                dialog.vision = false;
                resolve({
                    id: dialog.id,
                    params: dialog.params.map((param) => param.value),
                });
            };
        });
    };
}

export default { install };
