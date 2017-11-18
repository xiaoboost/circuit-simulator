import { $P, Point } from 'src/lib/point';
import Comp, { ParamsDialog, Params } from 'src/components/params-dialog';

// 生成全局参数设置组件
const dialog = new Comp<ParamsDialog>().$mount(document.createElement('div'));
// 将组件插入 body 末尾
document.body.appendChild(dialog.$el);

/**
 * 打开器件的参数设置对话框
 *  - 返回`Promise<void>`表示点击了取消按钮
 *  - 返回`Promise<{ id: string; params: Params[] }>`表示点击了确定按钮，其中数据即为最后对话框中输入的数据
 *
 * @param {string} id
 * @param {Params[]} params
 * @param {Point} position
 * @returns {(Promise<{ id: string; params: Params[] } | void>)}
 */
export function setPartParams(id: string, params: Params[], position: Point): Promise<{ id: string; params: string[] } | void> {
    dialog.id = id;
    dialog.params = params;
    dialog.position = position;
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
}
