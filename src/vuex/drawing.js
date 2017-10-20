import { $P } from 'src/lib/point';

export default {
    state: {
        zoom: 1,
        position: $P(0, 0),
    },
    mutations: {
        SET_ZOOM: (state, zoom) => (state.zoom = zoom),
        SET_POSITION: (state, position) => (state.position = $P(position)),
    },
};
