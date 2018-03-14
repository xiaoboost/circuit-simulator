declare module '*/electronic-line/index.vue' {
    import { VueConstructor } from 'vue';
    import { ComponentInterface } from 'src/components/electronic-line/types';

    type ElectronicLine = ComponentInterface;
    const ElectronicLine: VueConstructor<ElectronicLine>;

    export default ElectronicLine;
}
