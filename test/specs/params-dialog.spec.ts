import '../extend';

import 'src/lib/init';
import 'src/lib/native';

import Vue from 'vue';
import { delay } from 'src/lib/utils';
import { mount } from '@vue/test-utils';
import ParamsDialog from 'src/components/params-dialog';
import InputVerifiable from 'src/components/input-verifiable';

describe('params-dialog.vue', () => {
    test('create a params dialog', async () => {
        const wrapper = mount<ParamsDialog>(ParamsDialog);

        expect(wrapper.isVisible()).toBeFalse();

        wrapper.vm.vision = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.isVisible()).toBeTrue();
    });
});
