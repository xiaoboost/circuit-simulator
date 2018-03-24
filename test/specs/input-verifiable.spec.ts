import '../extend';

import Vue from 'vue';
import { shallow, Wrapper } from '@vue/test-utils';
import InputVerifiable from 'src/components/input-verifiable';

describe('input-verifiable.vue', () => {
    test('init without any props', () => {
        const wrapper = shallow<InputVerifiable>(InputVerifiable);
        const props = wrapper.props()!;

        expect(props.value).toBe('');
        expect(props.placeholder).toBe('请输入内容');
        expect(props.maxlength).toBe(Infinity);
        expect(props.required).toBe(false);
        expect(props.message).toBe('');
        expect(props.func()).toBe(true);
        expect(props.pattern).toEqual(/[\d\D]*/);
    });
    test('update and clear the value', () => {
        const wrapper = shallow<InputVerifiable>(InputVerifiable);
        const input = wrapper.find('input') as Wrapper<Vue> & { element: InputVerifiable['$refs']['input'] };

        // change props
        wrapper.setProps({ value: 'props' });
        expect(input.element.value).toBe('props');

        // change input
        input.element.value = 'input';
        input.trigger('input');

        // clear the value
        wrapper.vm.clear();

        const events = wrapper.emitted().input;
        expect(events[0][0]).toBe('input');
        expect(events[1][0]).toBe('');
    });
    test('call focus(), element of input should get focus', () => {
        const wrapper = shallow<InputVerifiable>(InputVerifiable);

        wrapper.vm.focus();

        expect(document.activeElement).toBe(wrapper.vm.$refs.input);
    });
    test('check(), validate the value', () => {
        const wrapper = shallow<InputVerifiable>(InputVerifiable);

        // isError is false
        expect(wrapper.vm.isError).toBeFalse();

        // required
        wrapper.setProps({ required: true });
        expect(wrapper.vm.check()).toBeFalse();
        expect(wrapper.vm.isError).toBeTrue();

        wrapper.vm.clearError();

        // pattern
        wrapper.setProps({ required: false, pattern: /test/, value: 'input' });
        expect(wrapper.vm.check()).toBeFalse();
        expect(wrapper.vm.isError).toBeTrue();

        wrapper.vm.clearError();

        // function
        wrapper.setProps({ pattern: undefined, func: () => false });
        expect(wrapper.vm.check()).toBeFalse();
        expect(wrapper.vm.isError).toBeTrue();

        wrapper.vm.clearError();
    });
});
