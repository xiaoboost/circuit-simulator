import Vue from 'vue';
import { Store } from 'vuex';
import { StateType } from 'src/vuex';
import { ParamsInput } from 'src/mixins/params';

declare module 'vue/types/vue' {
    interface VueConstructor {
        prototype: { [x: string]: any };
    }

    interface Vue {
        /** vuex 属性 */
        $store: Store<StateType>;

        /**
         * 打开器件的参数设置对话框
         *  - `position`是器件中心相对于屏幕左上角的坐标
         *  - 返回`Promise<void>`表示点击了取消按钮
         *  - 返回`Promise<{ id: string; params: string[] }>`表示点击了确定按钮，其中数据即为最后对话框中输入的数据
         *
         * @param {ParamsInput} { id, type, params, position }
         * @returns {(Promise<{ id: string; params: string[] } | void>)}
         */
        setPartParams({ id, type, params, position }: ParamsInput): Promise<{ id: string; params: string[] } | void>;
    }
}
