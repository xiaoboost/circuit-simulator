import Vue from 'vue';
import { MapStatus } from 'src/components/drawing-main';

/** 组件对外接口 */
export interface ComponentInterface extends Vue {
    actual: number;
    className: string;
    mapStatus: MapStatus;

    $refs: {
        circle: HTMLElement;
        animate: SVGAnimationElement;
    };
}
