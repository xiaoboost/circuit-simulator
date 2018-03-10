import '../extend';

import Vue from 'vue';
import { shallow, Wrapper } from '@vue/test-utils';
import InputVerifiable from 'src/components/input-verifiable';

describe('input-verifiable.vue', () => {
    it('init without any props', () => {
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
    it('update that props change and input change', () => {
        const wrapper = shallow<InputVerifiable>(InputVerifiable);
        const input = wrapper.find('input') as Wrapper<Vue> & { element: InputVerifiable['$refs']['input'] };

        // change props
        wrapper.setProps({ value: 'props' });
        expect(input.element.value).toEqual('props');

        // change input
        input.element.value = 'input';
        input.trigger('input');
        expect(wrapper.emitted().input[0][0]).toEqual('input');
    });
    it('call focus(), element of input should get focus', () => {
        const wrapper = shallow<InputVerifiable>(InputVerifiable);

        wrapper.vm.focus();

        expect(document.activeElement).toEqual(wrapper.vm.$refs.input);
    });
});
