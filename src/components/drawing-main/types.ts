import Events from './events';
import { Point } from 'src/lib/point';
import PartComponent from 'src/components/electronic-part';
import LineComponent from 'src/components/electronic-line';

export interface MapStatus {
    readonly zoom: number;
    readonly position: Point;
    partsNow: string[];
    linesNow: string[];
    exclusion: boolean;
}

export type FindPartComponent = (value: string | HTMLElement) => PartComponent;
export type FindLineComponent = (value: string | HTMLElement) => LineComponent;
export type SetDrawEvent = Events['setDrawEvent'];
