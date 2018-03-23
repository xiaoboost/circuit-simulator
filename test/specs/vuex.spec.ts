import '../extend';

import vuex from 'src/vuex';
import { $P } from 'src/lib/point';
import { w } from 'type-zoo';
import { clone } from 'src/lib/utils';

describe('vuex: store of vue.', () => {
    test('config sidebar switch', () => {
        // space page
        expect(vuex.getters.isSpace).toBeTrue();
        expect(vuex.getters.showAddParts).toBeFalse();
        expect(vuex.getters.showMainConfig).toBeFalse();
        expect(vuex.getters.showGraphView).toBeFalse();

        // open add parts panel
        vuex.commit('OPEN_ADD_PARTS');
        expect(vuex.getters.isSpace).toBeFalse();
        expect(vuex.getters.showAddParts).toBeTrue();
        expect(vuex.getters.showMainConfig).toBeFalse();
        expect(vuex.getters.showGraphView).toBeFalse();

        // open time config panel
        vuex.commit('OPEN_MAIN_CONFIG');
        expect(vuex.getters.isSpace).toBeFalse();
        expect(vuex.getters.showAddParts).toBeFalse();
        expect(vuex.getters.showMainConfig).toBeTrue();
        expect(vuex.getters.showGraphView).toBeFalse();

        // open graph view panel
        vuex.commit('OPEN_GRAPH_VIEW');
        expect(vuex.getters.isSpace).toBeFalse();
        expect(vuex.getters.showAddParts).toBeFalse();
        expect(vuex.getters.showMainConfig).toBeFalse();
        expect(vuex.getters.showGraphView).toBeTrue();

        // close slider
        vuex.commit('CLOSE_SLIDER');
        expect(vuex.getters.isSpace).toBeTrue();
        expect(vuex.getters.showAddParts).toBeFalse();
        expect(vuex.getters.showMainConfig).toBeFalse();
        expect(vuex.getters.showGraphView).toBeFalse();
    });
    test('set time config', () => {
        // init
        expect(vuex.state.time.end).toEqual('10m');
        expect(vuex.state.time.step).toEqual('10u');

        // set
        vuex.commit('SET_TIME_CONFIG', { step: '200u', end: '500' });
        expect(vuex.state.time.end).toEqual('500');
        expect(vuex.state.time.step).toEqual('200u');
    });
    test('part store', () => {
        vuex.commit('NEW_PART', 'resistance');
        expect(vuex.state.Parts.length).toEqual(1);

        const part = clone({ ...vuex.state.Parts[0] });

        part.

    });
});
