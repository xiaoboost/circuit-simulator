<template>
<span class="input-verifiable">
    <input type="text" :placeholder="placeholder" :value="value" @input="update($event.target.value)">
    <span class="input-bar correct-bar"></span>
    <span :class="['input-bar error-bar', { 'error': isError }]"></span>
    
    <template v-if="message">
        <span v-show="isError" class="input-error-message">{{message}}</span>
    </template>
</span>
</template>

<script>
export default {
    name: 'InputVerifiable',
    props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入内容'
        },
        maxlength: {
            type: Number,
            default: Infinity
        },
        required: {
            type: Boolean,
            default: false
        },
        pattern: {
            type: RegExp,
            default: () => /[\d\D]*/
        },
        func: {
            type: Function,
            default: () => true
        },
        message: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isError: false
        };
    },
    methods: {
        update(value) {
            this.check(value);

            if (value.length <= this.maxlength) {
                this.$emit('input', value);
            }
        },
        check(value) {
            value = value || this.value;
            this.isError = false;
            if (this.required && !value) {
                this.$emit('error', 'required');
                this.isError = true;
                return (false);
            }
            if (!this.pattern.test(value)) {
                this.$emit('error', 'pattern');
                this.isError = true;
                return (false);
            }
            if (!this.func(value)) {
                this.$emit('error', 'function');
                this.isError = true;
                return (false);
            }
            return (true);
        }
    }
};
</script>

<style lang="stylus">
@import '../css/Variable'

.input-verifiable
    position relative
    
    input
        width 100%
        font-size 1.1em
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
        bottom 0
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
</style>
