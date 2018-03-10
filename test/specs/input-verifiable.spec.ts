import '../extend';

import Vue from 'vue';
import { shallow, Wrapper } from '@vue/test-utils';
import InputVerifiable from 'src/components/input-verifiable';

describe('input-verifiable.vue', () => {
    test('init without any props', () => {
        const wrapper = shallow<InputVerifiable>(InputVerifiable);
        const props = wrapper.props()!;

        expect(props.value).toEqual('');
        expect(props.placeholder).toEqual('请输入内容');
        expect(props.maxlength).toEqual(Infinity);
        expect(props.required).toEqual(false);
        expect(props.pattern).toEqual(/[\d\D]*/);
        expect(props.message).toEqual('');
        expect(props.func()).toEqual(true);
    });
    test('update and clear the value', () => {
        const wrapper = shallow<InputVerifiable>(InputVerifiable);
        const input = wrapper.find('input') as Wrapper<Vue> & { element: InputVerifiable['$refs']['input'] };

        // change props
        wrapper.setProps({ value: 'props' });
        expect(input.element.value).toEqual('props');

        // change input
        input.element.value = 'input';
        input.trigger('input');

        // clear the value
        wrapper.vm.clear();

        const events = wrapper.emitted().input;
        expect(events[0][0]).toEqual('input');
        expect(events[1][0]).toEqual('');
    });
    test('call focus(), element of input should get focus', () => {
        const wrapper = shallow<InputVerifiable>(InputVerifiable);

        wrapper.vm.focus();

        expect(document.activeElement).toEqual(wrapper.vm.$refs.input);
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
