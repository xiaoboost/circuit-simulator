import React from 'react';
import classnames from 'classnames';
import styles from './index.styl';

import { useRef } from 'react';
import { Point } from 'src/lib/point';
import { useWatcher, useWatcherList } from 'src/use';

import { Line, LineRef } from '../electronic-line';
import { Part, PartRef } from '../electronic-part';

import * as state from 'src/store';
import * as utils from './utils';

import { useMap } from './map';
import { useMouseBus } from './mouse';

export function DrawingSheet() {
    const [lines] = useWatcherList(state.lines);
    const [parts] = useWatcherList(state.parts);
    const SheetRef = useRef<HTMLElement>(null);
    const lineRefs = useRef<LineRef[]>([]);
    const partRefs = useRef<PartRef[]>([]);
    const eventBus = useMouseBus(SheetRef);
    const map = useMap(SheetRef);

    return (
        <section
            ref={SheetRef}
            className={classnames(styles.drawingSheet)}
            style={utils.getBackgroundStyle(map.zoom, map.position)}>
            <svg height='100%' width='100%'>
                <g transform={`translate(${map.position.join(',')}) scale(${map.zoom})`}>
                    {lines.map((data) => <Line key={data.id} ref={lineRefs} {...data} />)}
                    {parts.map((data) => <Part key={data.id} ref={partRefs} {...data} />)}
                </g>
            </svg>
        </section>
    );
}
