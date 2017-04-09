<template>
<span class="input-verifiable">
    <input :placeholder="placeholder" :value="value" @input="update($event.target.value)">
    <span class="input-bar"></span>
    
    <template v-if="message">
        <span v-show="isError" class="input-message">{{message}}</span>
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
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        pattern: {
            type: String,
            default: ''
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
            this.isError = false;

            if (this.check(value)) {
                this.$emit('input', value);
            } else {
                this.isError = true;
            }
        },
        check(value) {
            if (this.required && !value) {
                this.$emit('error', 'required');
                return (false);
            }
            if (this.pattern && !this.pattern.test(value)) {
                this.$emit('error', 'pattern');
                return (false);
            }
            if (!this.func(value)) {
                this.$emit('error', 'function');
                return (false);
            }
            return (true);
        }
    }
};
</script>

<style lang="stylus">
@import '../css/Variable'

.input-verifiable {
    position: relative;
    
    input {
        width: 100%;
        font-size: 1.1em;
        outline: 0;
        border-bottom: 1px solid #ccc
        background-color: color-white;
        color: color-input;
        padding: 0 5px;
        box-sizing: border-box;
    }
    .input-bar:before {
        content: '';
        height: 2px;
        width: 0;
        bottom: 0;
        position: absolute;
        background: color-input;
        transition: width 300ms 
    }
    input:focus ~ .input-bar:before {
        width: 100%;
    }
}
</style>
