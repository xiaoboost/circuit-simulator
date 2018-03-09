import Vue from 'vue';

/** 组件对外接口 */
export interface ComponentInterface extends Vue {
    value: string;

    $refs: {
        input: HTMLInputElement;
    };

    focus(): void;
    clear(): void;
    clearError(): void;
    check(value?: string): boolean;
}
