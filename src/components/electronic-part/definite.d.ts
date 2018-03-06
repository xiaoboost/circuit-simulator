declare module '*/electronic-part/index.vue' {
    import Vue from 'vue';
    import { ComponentInterface } from 'src/components/electronic-part/types';

    interface ElectronicPart extends Vue, ComponentInterface {}

    export default ElectronicPart;
}
