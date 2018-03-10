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
    <span :class="['input-bar error-bar', { 'error': isError }]"></span>
    <template v-if="message">
        <span v-show="isError" class="input-error-message" v-text="message"></span>
    </template>
</span>
</template>

<script lang="ts">
import * as assert from 'src/lib/assertion';

import { ComponentInterface } from './types';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class InputVerifiable extends Vue implements ComponentInterface {
    @Prop({ type: String, default: '' })
    readonly value: string;

    @Prop({ type: String, default: '请输入内容' })
    readonly placeholder: string;

    @Prop({ type: Number, default: Infinity })
    private readonly maxlength: number;

    @Prop({ type: Boolean, default: false })
    private readonly required: boolean;

    @Prop({ type: RegExp, default: () => /[\d\D]*/ })
    private readonly pattern: RegExp;

    @Prop({ type: Function, default: () => true })
    private readonly func: (value: string) => boolean;

    @Prop({ type: String, default: '' })
    private readonly message: string;

    $refs: {
        input: HTMLInputElement;
    }

    /** 组件内部值字符串 */
    private txt = this.value;

    /** 当前是否报错 */
    isError = false;

    @Watch('value')
    private changeValue(nv: string) {
        this.txt = nv;
    }

    private update(value: string): void {
        this.check(value);
        this.$emit('input', value);
    }
    check(value: string = this.txt): boolean {
        this.isError = false;

        if (this.required && !value) {
            this.isError = true;
            return (false);
        }
        if (this.pattern && !this.pattern.test(value)) {
            this.isError = true;
            return (false);
        }
        if (this.func && !this.func(value)) {
            this.isError = true;
            return (false);
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
        this.isError = false;
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
