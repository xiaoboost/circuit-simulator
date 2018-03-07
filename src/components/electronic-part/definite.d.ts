declare module '*/electronic-part/index.vue' {
    import Vue from 'vue';
    import { Omit } from 'type-zoo';
    import { ComponentInterface } from 'src/components/electronic-part/types';

    interface ElectronicPart extends Omit<Vue, '$refs'>, ComponentInterface {}

    const ElectronicPart: {
        prototype: ElectronicPart;
        new(): ElectronicPart;
    };

    export default ElectronicPart;
}
