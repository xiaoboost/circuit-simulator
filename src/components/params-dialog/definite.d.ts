declare module '*/params-dialog/index.vue' {
    import { VueConstructor } from 'vue';
    import { ComponentInterface } from 'src/components/params-dialog/types';

    type ParamsDialog = ComponentInterface;
    const ParamsDialog: VueConstructor<ParamsDialog>;

    export default ParamsDialog;
}
