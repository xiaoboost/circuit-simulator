import Vue from 'vue';
import main from './index.vue';

export default main;

/** 验证输入组件对外接口 */
export interface InputVerifiable extends Vue {
    /** 当前是否发生错误 */
    isError: boolean;
    /** 主动验证 */
    check(): boolean;
    /** 清空当前输入 */
    clear(): void;
    /** 手动 focus 元素 */
    focus(): void;
    /** 手动清除错误提示 */
    clearError(): void;
}
