import { WrapperElement } from '../types';
import { shallowMount } from '@vue/test-utils';
import InputVerifiable from 'src/components/input-verifiable/component';

describe('input-verifiable.vue', () => {
    test('init without any props', () => {
        const wrapper = shallowMount(InputVerifiable);
        const props = wrapper.props()!;

        expect(props.value).toBe('');
        expect(props.maxlength).toBe(Infinity);
        expect(props.placeholder).toBe('请输入内容');
        expect(props.rules).toEqual([]);
    });
    test('update and clear the value', () => {
        const wrapper = shallowMount(InputVerifiable);
        const input = wrapper.find('input') as WrapperElement<InputVerifiable['$refs']['input']>;

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
        const wrapper = shallowMount(InputVerifiable);

        wrapper.vm.focus();

        expect(document.activeElement).toBe(wrapper.vm.$refs.input);
    });
    test('check(), validate the value', () => {
        const wrapper = shallowMount(InputVerifiable);

        expect(wrapper.vm.validate()).toBeTrue();

        // set single Rule
        wrapper.setProps({ rules: { required: true }});
        // required false
        expect(wrapper.vm.validate()).toBeFalse();

        wrapper.vm.clearError();

        // set array Rules
        wrapper.setProps({ rules: [
            {
                required: true,
                message: '这是必填项',
            },
            {
                pattern: /^https?:\/\//,
                message: '必须以 http 开头',
            },
            {
                validator: (value: string) => ['https://www.baidu.com', 'https://www.google.com'].includes(value),
                message: '方法验证未通过',
            },
        ]});

        // value is space string
        wrapper.vm.txt = '';
        expect(wrapper.vm.validate()).toBeFalse();

        // value not match pattern
        wrapper.vm.txt = 'www';
        expect(wrapper.vm.validate()).toBeFalse();

        // value not pass validator
        wrapper.vm.txt = 'https://www';
        expect(wrapper.vm.validate()).toBeFalse();

        // value pass rules
        wrapper.vm.txt = 'https://www.baidu.com';
        expect(wrapper.vm.validate()).toBeTrue();
    });
});
