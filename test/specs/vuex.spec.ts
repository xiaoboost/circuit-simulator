import 'src/lib/native';

import vuex from 'src/vuex';
import { $P } from 'src/lib/point';
import { clone } from 'src/lib/utils';

type PartType = typeof vuex.state.Parts[0];
type WriteablePart = Writeable<PartType, keyof PartType>;

type LineType = typeof vuex.state.Lines[0];
type WriteableLine = Writeable<LineType, keyof LineType>;

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
        expect(vuex.state.time.end).toBe('10m');
        expect(vuex.state.time.step).toBe('10u');

        // set
        vuex.commit('SET_TIME_CONFIG', { step: '200u', end: '500' });
        expect(vuex.state.time.end).toBe('500');
        expect(vuex.state.time.step).toBe('200u');
    });
    test('part store', () => {
        // create part
        vuex.commit('NEW_PART', 'resistance');
        expect(vuex.state.Parts.length).toBe(1);
        expect(vuex.state.Parts[0].id).toBe('R_1');

        vuex.commit('NEW_PART', 'resistance');
        expect(vuex.state.Parts.length).toBe(2);
        expect(vuex.state.Parts[1].id).toBe('R_2');

        // update part
        const part = clone<WriteablePart>(vuex.state.Parts[0]);

        // update: id duplicate error
        part.id = 'R_2';
        expect(() => vuex.commit('UPDATE_PART', part)).not.toThrowError();
        expect(() => vuex.commit('UPDATE_PART', part)).toThrowError(`(vuex) Part ID is duplicated. id: ${part.id}`);

        // update: not found hash error
        part.hash = '123';
        expect(() => vuex.commit('UPDATE_PART', part)).toThrowError(`(vuex) Part not found. id: ${part.id}`);

        // update: normal
        part.id = 'R_3';
        part.hash = vuex.state.Parts[0].hash;
        part.connect = ['line_1', 'line_2'];

        vuex.commit('UPDATE_PART', part);
        expect(vuex.state.Parts[0]).not.toBe(part);
        expect(vuex.state.Parts[0]).toEqual(part);

        // copy part
        vuex.commit('COPY_PART', [part.id]);
        expect(vuex.state.Parts.length).toBe(3);
        expect(vuex.state.Parts[0]).not.toBe(vuex.state.Parts[2]);

        const part1 = clone<WriteablePart>(vuex.state.Parts[0]);
        const part2 = clone<WriteablePart>(vuex.state.Parts[2]);

        expect(part1.id).not.toBe(part2.id);
        expect(part1.hash).not.toBe(part2.hash);

        delete part1.id;
        delete part1.hash;

        delete part2.id;
        delete part2.hash;

        expect(part1).toEqual(part2);

        // copy error: not found part id
        expect(() => vuex.commit('COPY_PART', ['123'])).toThrowError('(vuex) Part not found. id: 123');

        // out of max number
        const ids = [vuex.state.Parts[0].id];
        for (let i = 0; i < 47; i++) {
            vuex.commit('COPY_PART', ids);
        }

        expect(vuex.state.Parts.length).toBe(50);
        expect(() => vuex.commit('COPY_PART', ids)).toThrowError('(vuex) The maximum number of Devices is 50.');

        // delete part
        const id = vuex.state.Parts[0].id;
        const hash = vuex.state.Parts[0].hash;

        vuex.commit('DELETE_PART', id);
        expect(vuex.state.Parts.every((n) => n.id !== id)).toBeTrue();
        expect(vuex.state.Parts.every((n) => n.hash !== hash)).toBeTrue();
    });
    test('line store', () => {
        // create line
        vuex.commit('NEW_LINE', $P());
        expect(vuex.state.Lines.length).toBe(1);
        expect(vuex.state.Lines[0].id).toBe('line_1');

        vuex.commit('NEW_LINE', $P());
        expect(vuex.state.Lines.length).toBe(2);
        expect(vuex.state.Lines[0].id).toBe('line_2');

        // update line
        const line = clone<WriteableLine>(vuex.state.Lines[1]);

        // update: id duplicate error
        line.id = 'line_2';
        expect(() => vuex.commit('UPDATE_LINE', line)).not.toThrowError();
        expect(() => vuex.commit('UPDATE_LINE', line)).toThrowError(`(vuex) Line ID is duplicated. id: ${line.id}`);

        // update: not found hash error
        line.hash = '123';
        expect(() => vuex.commit('UPDATE_LINE', line)).toThrowError(`(vuex) Line not found. id: ${line.id}`);

        // update: normal
        line.id = 'line_12';
        line.hash = vuex.state.Lines[0].hash;
        line.connect = ['line_1', 'line_2'];
        line.way.push($P(20, 40));

        vuex.commit('UPDATE_LINE', line);
        expect(vuex.state.Lines[0]).not.toBe(line);
        expect(vuex.state.Lines[0]).toEqual(line);

        // copy line
        vuex.commit('COPY_LINE', [line.id]);
        expect(vuex.state.Lines.length).toBe(3);
        expect(vuex.state.Lines[0]).not.toBe(vuex.state.Lines[2]);

        const line1 = clone<WriteableLine>(vuex.state.Lines[0]);
        const line2 = clone<WriteableLine>(vuex.state.Lines[2]);

        expect(line1.id).not.toBe(line2.id);
        expect(line1.hash).not.toBe(line2.hash);

        delete line1.id;
        delete line1.hash;

        delete line2.id;
        delete line2.hash;

        expect(line1).toEqual(line2);

        // copy error: not found part id
        expect(() => vuex.commit('COPY_LINE', ['123'])).toThrowError('(vuex) Line not found. id: 123');

        // delete line
        const id = vuex.state.Lines[0].id;
        const hash = vuex.state.Lines[0].hash;

        vuex.commit('DELETE_LINE', id);
        expect(vuex.state.Lines.every((n) => n.id !== id)).toBeTrue();
        expect(vuex.state.Lines.every((n) => n.hash !== hash)).toBeTrue();
    });
});
