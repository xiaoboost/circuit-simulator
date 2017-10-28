import Vue from 'vue';

type Callback = (e?: Event) => void | boolean;

declare module 'vue/types/vue' {
    interface VueConstructor {
        prototype: { [x: string]: any };
    }

    interface Vue {
        /**
         * 给当前组件的`$el`元素绑定事件
         * @param {string} type
         * @param {Callback} fn
         */
        $$on(type: string, fn: Callback): void;

        /**
         * 给当前组件的`$el`元素委托事件
         * @param {string} type
         * @param {Callback} fn
         */
        $$on(type: string, selector: string, fn: Callback): void;

        /**
         * 给当前组件的`$el`元素绑定事件，并引入数据
         * @param {string} type
         * @param {Callback} fn
         */
        $$on(type: string, data: { [x: string]: any; }, fn: Callback): void;
        
        /**
         * 给当前组件的`$el`元素委托事件，并引入数据
         * @param {string} type
         * @param {Callback} fn
         */
        $$on(type: string, selector: string, data: { [x: string]: any; }, fn: Callback): void;

        /**
         * 移除当前组件`$el`元素上的所有委托事件
         */
        $$off(): void;

        /**
         * 移除当前组件`$el`元素上的所有`type`类型的委托事件
         * @param {string} type
         */
        $$off(type: string): void;

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
         * 移除当前组件`$el`元素上的所有类型为`type`，选择器为`selector`，回调函数为`fn`的委托事件
         * @param {string} type
         * @param {string} selector
         * @param {Callback} fn
         */
        $$off(type: string, selector: string, fn: Callback): void;
    }
}
