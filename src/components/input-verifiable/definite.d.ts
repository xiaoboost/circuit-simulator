declare module '*/input-verifiable/index.vue' {
    import Vue from 'vue';
    import { Omit } from 'type-zoo';
    import { ComponentInterface } from 'src/components/input-verifiable/types';

    interface InputVerifiable extends Omit<Vue, '$refs'>, ComponentInterface {}

    const InputVerifiable: {
        prototype: InputVerifiable;
        new(): InputVerifiable;
    };

    export default InputVerifiable;
}
