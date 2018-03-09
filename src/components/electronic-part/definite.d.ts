declare module '*/electronic-part/index.vue' {
    import { VueConstructor } from 'vue';
    import { ComponentInterface } from 'src/components/electronic-part/types';

    type ElectronicPart = ComponentInterface;
    const ElectronicPart: VueConstructor<ElectronicPart>;

    export default ElectronicPart;
}
