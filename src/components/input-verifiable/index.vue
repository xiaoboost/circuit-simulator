<template>
<span class="input-verifiable">
    <input
        ref="input"
        type="text"
        v-model="txt"
        :maxlength="maxlength"
        :placeholder="placeholder"
        @input.passive="update($event.target.value)">
    <span class="input-bar correct-bar"></span>
    <span :class="['input-bar error-bar', { 'error': !!errorMessage }]"></span>
    <span v-if="!!errorMessage" class="input-error-message" v-text="errorMessage"></span>
</span>
</template>

<script lang="ts">
import * as assert from 'src/lib/assertion';

import { ComponentInterface, ValidateRule } from './types';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class InputVerifiable extends Vue implements ComponentInterface {
    @Prop({ type: String, default: '' })
    readonly value: string;

    @Prop({ type: String, default: '请输入内容' })
    readonly placeholder: string;

    @Prop({ type: Number, default: Infinity })
    private readonly maxlength: number;

    @Prop({ type: [Object, Array], default: () => [] })
    readonly rules: ValidateRule | Array<ValidateRule>;

    $refs: {
        input: HTMLInputElement;
    }

    /** 组件内部值字符串 */
    txt = this.value;
    /** 当前错误文本 */
    errorMessage = '';

    @Watch('value')
    private changeValue(nv: string) {
        this.txt = nv;
    }

    private update(value: string): void {
        this.validate(value);
        this.$emit('input', value);
    }

    validate(value: string = this.txt): boolean {
        this.errorMessage = '';

        const rules = this.rules instanceof Array ? this.rules : [this.rules];

        for (const rule of rules) {
            if (rule.required && !value) {
                this.errorMessage = rule.message;
                return (false);
            }

            if (rule.pattern && !rule.pattern.test(value)) {
                this.errorMessage = rule.message;
                return (false);
            }

            if (rule.validator && !rule.validator(value)) {
                this.errorMessage = rule.message;
                return (false);
            }
        }

        return (true);
    }
    focus() {
        this.$refs.input.focus();
    }
    clear() {
        this.txt = '';
        this.clearError();
        this.update('');
    }
    clearError() {
        this.errorMessage = '';
    }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variable'

.input-verifiable
    position relative

input
    width 100%
    font-size inherit
    outline 0
    border-bottom 1px solid Gray
    background-color White
    color Dark-Blue
    padding 0 5px
    box-sizing border-box
    &:focus
        outline 0

.input-bar:before
    content ''
    height 2px
    width 0
    bottom 4px
    left 0
    position absolute
    background Dark-Blue
    transition width 300ms

input:focus ~ .correct-bar:before
    width 100%

.error-bar
    &:before
        background Red
    &.error:before
        width 100%

.input-error-message
    position absolute
    padding 0 5px

input::-webkit-input-placeholder
    color: Shadow
    font-size: 85%

input::-ms-input-placeholder
    color: Shadow
    font-size: 85%

input::-moz-placeholder
    color: Shadow
    font-size: 85%
</style>
