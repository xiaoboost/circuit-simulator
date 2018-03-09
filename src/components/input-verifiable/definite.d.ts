declare module '*/input-verifiable/index.vue' {
    import { VueConstructor } from 'vue';
    import { ComponentInterface } from 'src/components/input-verifiable/types';

    type InputVerifiable = ComponentInterface;
    const InputVerifiable: VueConstructor<InputVerifiable>;

    export default InputVerifiable;
}
