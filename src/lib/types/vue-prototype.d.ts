import Vue from 'vue';
import { Store } from 'vuex';
import { StateType } from 'src/vuex';
import { Point } from 'src/lib/point';
import { ParamsInput } from 'src/mixins/params';

type Callback = (e?: Event) => void | boolean;
interface AnyObject { [x: string]: any; }

declare module 'vue/types/vue' {
    interface VueConstructor {
        prototype: { [x: string]: any };
    }

    interface Vue {
        /** vuex 属性 */
        $store: Store<StateType>;

        /**
         * 打开器件的参数设置对话框
         *  - 返回`Promise<void>`表示点击了取消按钮
         *  - 返回`Promise<{ id: string; params: string[] }>`表示点击了确定按钮，其中数据即为最后对话框中输入的数据
         *
         * @param {ParamsInput} { id, type, params, position }
         * @returns {(Promise<{ id: string; params: string[] } | void>)}
         */
        setPartParams({ id, params, position }: ParamsInput): Promise<{ id: string; params: string[] } | void>

        /**
         * 给`el`元素绑定事件
         * @param {el} HTMLElement
         * @param {string} type
         * @param {Callback} fn
         */
        $$on(el: HTMLElement, type: string, fn: Callback): void;

        /**
         * 给`el`元素委托事件
         * @param {HTMLElement} el
         * @param {string} type
         * @param {(string | AnyObject | undefined)} selectorOrData
         * @param {Callback} fn
         */
        $$on(el: HTMLElement, type: string, selectorOrData: string | AnyObject | undefined, fn: Callback): void;
        
        /**
         * 给`el`元素委托事件，并引入数据
         * @param {HTMLElement} el
         * @param {string} type
         * @param {(string | undefined)} selector
         * @param {{ [x: string]: any; }} data
         * @param {Callback} fn
         */
        $$on(el: HTMLElement, type: string, selector: string | undefined, data: { [x: string]: any; } | undefined, fn: Callback): void;

        /**
         * 移除`el`元素上的所有委托事件
         * @param {el} HTMLElement
         */
        $$off(el: HTMLElement): void;

        /**
         * 移除`el`元素上的所有`type`类型的委托事件
         * @param {el} HTMLElement
         * @param {string} type
         */
        $$off(el: HTMLElement, type: string): void;

        /**
         * 移除当前组件`$el`元素上所有类型为`type`，回调函数为`fn`的委托事件
         * @param {string} type
         * @param {Callback} fn
         */
        $$off(type: string, fn: Callback): void;
        
        /**
         * 移除当前组件`$el`元素上的所有类型为`type`，选择器为`selector`的委托事件
         * @param {string} type
         * @param {string} selector
         */
        $$off(type: string, selector: string): void;

        /**
         * 移除`el`元素上的所有类型为`type`，选择器为`selector`，回调函数为`fn`的委托事件
         * @param {el} HTMLElement
         * @param {string} type
         * @param {string} selector
         * @param {Callback} fn
         */
        $$off(el: HTMLElement, type: string, selector: string | undefined, fn: Callback): void;
    }
}
