<template>
<span class="input-verifiable">
    <input
        ref="input"
        type="text"
        :value="value"
        :placeholder="placeholder"
        @input="update($event.target.value)">
    <span class="input-bar correct-bar"></span>
    <span :class="['input-bar error-bar', { 'error': isError }]"></span>
    <template v-if="message">
        <span v-show="isError" class="input-error-message" v-text="message"></span>
    </template>
</span>
</template>

<script lang="ts">
import * as assert from 'src/lib/assertion';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class InputVerifiable extends Vue {
    @Prop({ type: String, default: '' })
    readonly value: string;

    @Prop({ type: String, default: '请输入内容' })
    readonly placeholder: string;

    @Prop({ type: Number, default: Infinity })
    readonly maxlength: number;

    @Prop({ type: Boolean, default: false })
    readonly required: boolean;

    @Prop({ type: RegExp, default: /[\d\D]*/ })
    readonly pattern: RegExp;

    @Prop({ type: Function, default: () => true })
    readonly func: (value: string) => boolean;

    @Prop({ type: String, default: '' })
    readonly message: string;

    $refs: {
        input: HTMLElement;
    }

    isError = false;

    update(value: string): void {
        this.check(value);

        if (value.length <= this.maxlength) {
            this.$emit('input', value);
        }
    }
    check(value?: string): boolean {
        const input = assert.isString(value) ? value : this.value;

        this.isError = false;

        if (this.required && !input) {
            this.$emit('error', 'required');
            this.isError = true;
            return (false);
        }
        if (!this.pattern.test(input)) {
            this.$emit('error', 'pattern');
            this.isError = true;
            return (false);
        }
        if (!this.func(input)) {
            this.$emit('error', 'function');
            this.isError = true;
            return (false);
        }
        return (true);
    }
    focus() {
        this.$refs.input.focus();
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

input::-moz-placeholder
    color: Shadow
    font-size: 85%
</style>
