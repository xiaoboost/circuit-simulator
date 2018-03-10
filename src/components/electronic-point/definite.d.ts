declare module '*/electronic-point/index.vue' {
    import { VueConstructor } from 'vue';
    import { ComponentInterface } from 'src/components/electronic-point/types';

    type ElectronicPoint = ComponentInterface;
    const ElectronicPoint: VueConstructor<ElectronicPoint>;

    export default ElectronicPoint;
}
