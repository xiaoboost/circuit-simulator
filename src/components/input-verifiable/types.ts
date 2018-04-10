import Vue from 'vue';

/** 验证规则类 */
export interface ValidateRule {
    required?: boolean;
    pattern?: RegExp;
    message: string;
    validator?(value: string): boolean;
}

/** 组件对外接口 */
export interface ComponentInterface extends Vue {
    value: string;

    $refs: {
        input: HTMLInputElement;
    };

    focus(): void;
    clear(): void;
    clearError(): void;
    validate(value?: string): boolean;
}
