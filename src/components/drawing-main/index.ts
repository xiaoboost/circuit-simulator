import main from './index.vue';
import { Point } from 'src/lib/point';

import { DrawEventSetting } from './events';
import { PartComponent } from 'src/components/electronic-part';
import { LineComponent } from 'src/components/electronic-line';

export default main;
export * from './events';

export interface MapStatus {
    zoom: number;
    position: Point;
}

export type FindPart = (id: string | HTMLElement | { id: string }) => PartComponent;
export type FindLine = (id: string | HTMLElement | { id: string }) => LineComponent;
export type SetDrawEvent = (handlers: DrawEventSetting) => void;
