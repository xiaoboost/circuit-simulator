import '../extend';

import { shallow } from '@vue/test-utils';
import InputVerifiable from 'src/components/input-verifiable';

describe('input-verifiable.vue', () => {
    it('create and update', () => {
        const wrapper = shallow(InputVerifiable, {
            listeners: {
                input(value: string) {
                    console.log(value);
                },
            },
        });
        const props = wrapper.props()!;

        expect(props.value).toEqual('');
        expect(props.placeholder).toEqual('请输入内容');
        expect(props.maxlength).toEqual(Infinity);
        expect(props.required).toEqual(false);
        expect(props.pattern).toEqual(/[\d\D]*/);
        expect(props.message).toEqual('');
        expect(props.func()).toEqual(true);
    });
});
