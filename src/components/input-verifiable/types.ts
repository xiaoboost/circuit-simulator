/** 组件对外接口 */
export interface ComponentInterface {
    value: string;

    $refs: {
        input: HTMLInputElement;
    };

    focus(): void;
    clear(): void;
    clearError(): void;
    check(value?: string): boolean;
}
