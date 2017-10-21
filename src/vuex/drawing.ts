import { $P, Point } from 'src/lib/point';

interface Canvas {
    zoom: number;
    position: Point;
}

const state: Canvas = {
    zoom: 1,
    position: $P(0, 0),
};

export default {
    state,
    mutations: {
        SET_ZOOM: (context: Canvas, zoom: number) => (context.zoom = zoom),
        SET_POSITION: (context: Canvas, position: Point) => (context.position = $P(position)),
    },
};
