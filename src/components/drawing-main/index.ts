import main from './index.vue';
import { Point } from 'src/lib/point';

import Events from './events';
import ElectronicPart from 'src/components/electronic-part';
import ElectronicLine from 'src/components/electronic-line';

export default main;
export * from './events';

export interface MapStatus {
    readonly zoom: number;
    readonly position: Point;
    partsNow: string[];
    linesNow: string[];
    exclusion: boolean;
}

export type FindPart = (value: string | HTMLElement) => ElectronicPart;
export type FindLine = (value: string | HTMLElement) => ElectronicLine;
export type SetDrawEvent = Events['setDrawEvent'];
