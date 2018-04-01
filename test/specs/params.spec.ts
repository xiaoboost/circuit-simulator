import '../extend';

import 'src/lib/init';
import 'src/lib/native';

import Vue from 'vue';
import modal from 'src/mixins/params';
import { $P } from 'src/lib/point';

/** 点击对话框取消按钮 */
function clickCancel() {
    const cancel = document.querySelector('button.cancel');
    cancel && cancel.dispatchEvent(new MouseEvent('click'));
}

/** 点击对话框确定按钮 */
function clickComfirm() {
    const confirm = document.querySelector('button.confirm');
    confirm && confirm.dispatchEvent(new MouseEvent('click'));
}

test('params.ts: mixin in global vue.', async () => {
    Vue.use(modal);

    type Unpromise<T> = T extends Promise<infer U> ? U : never;

    let result: Unpromise<ReturnType<Vue['setPartParams']>>;
    const setPartParams = Vue.prototype.setPartParams as Vue['setPartParams'];

    // 100 毫秒之后点击取消
    setTimeout(clickCancel, 100);

    result = await setPartParams({
        id: 'R_1',
        type: 'resistance',
        position: $P(),
        params: ['10k'],
    });

    expect(result).toBeUndefined();

    // 100 毫秒之后点确定
    setTimeout(clickComfirm, 100);

    result = await setPartParams({
        id: 'R_1',
        type: 'resistance',
        position: $P(),
        params: ['10k'],
    });

    expect(result).toEqual({
        id: 'R_1',
        params: ['10k'],
    });
});
