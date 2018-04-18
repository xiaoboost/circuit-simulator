import './component.styl';

import { CreateElement } from 'vue';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

/** 验证规则接口 */
export interface ValidateRule {
    required?: boolean;
    pattern?: RegExp;
    message?: string;
    validator?(value: string): boolean;
}

@Component
export default class InputVerifiable extends Vue {
    @Prop({ type: String, default: '' })
    readonly value!: string;

    @Prop({ type: String, default: '请输入内容' })
    readonly placeholder!: string;

    @Prop({ type: Number, default: Infinity })
    readonly maxlength!: number;

    @Prop({ type: [Object, Array], default: () => [] })
    readonly rules!: ValidateRule | ValidateRule[];

    $refs!: {
        input: HTMLInputElement;
    };

    /** 组件内部值字符串 */
    txt = this.value;
    /** 当前错误文本 */
    errorMessage = '';

    validate(value: string = this.txt): boolean {
        this.errorMessage = '';

        const rules = this.rules instanceof Array ? this.rules : [this.rules];

        for (const rule of rules) {
            if (rule.required && !value) {
                this.errorMessage = rule.message || '';
                return (false);
            }

            if (rule.pattern && !rule.pattern.test(value)) {
                this.errorMessage = rule.message || '';
                return (false);
            }

            if (rule.validator && !rule.validator(value)) {
                this.errorMessage = rule.message || '';
                return (false);
            }
        }

        return (true);
    }
    focus() {
        this.$refs.input.focus();
    }
    clear() {
        this.update('');
        this.clearError();
    }
    clearError() {
        this.errorMessage = '';
    }

    @Watch('value')
    private changeValue(nv: string) {
        this.txt = nv;
    }

    private update(value: string): void {
        this.txt = value;
        this.validate(value);
        this.$emit('input', value);
    }

    private render(h: CreateElement) {
        return <div class='input-verifiable'>
            <input
                ref='input'
                type='text'
                value={this.txt}
                maxLength={this.maxlength}
                placeholder={this.placeholder}
                onInput={(e: Event) => {
                    const target: HTMLInputElement = e.target as any;
                    this.update(target.value);
                }}/>
            <span class='input-bar correct-bar'></span>
            <span class={['input-bar error-bar', { error: !!this.errorMessage }]}></span>
            {this.errorMessage ? <span class='input-error-message' v-text='errorMessage'></span> : ''}
        </div>;
    }
}
