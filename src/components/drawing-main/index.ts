import main from './index.vue';
import { Point } from 'src/lib/point';

import { DrawEventSetting } from './events';
import ElectronicPart from 'src/components/electronic-part';
import ElectronicLine from 'src/components/electronic-line';

export default main;
export * from './events';

export interface MapStatus {
    readonly zoom: number;
    readonly position: Point;
    partsNow: string[];
    linesNow: string[];
}

export type FindPart = (id: string | HTMLElement | { id: string }) => ElectronicPart;
export type FindLine = (id: string | HTMLElement | { id: string }) => ElectronicLine;
export type SetDrawEvent = (handlers: DrawEventSetting) => void;
