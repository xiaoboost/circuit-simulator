import InputVerifiable from '@/components/input-verifiable';
import { createVue, destroyVM } from '../util';

describe('input-verifiable.vue', () => {
    let vm;
    afterEach(() => destroyVM(vm));

    it('create without verification', () => {
        const input = '这是初始输入值',
            placeholder = '这是默认占位符';

        vm = createVue({
            template: `
                <v-input
                    value="${input}"
                    placeholder="${placeholder}">
                </v-input>
            `,
            components: {
                'v-input': InputVerifiable
            }
        });

        const inputElm = vm.$el.querySelector('input'),
            message = vm.$el.querySelector('.input-message');

        expect(!!message).to.be.false;
        expect(inputElm.value).to.equal(input);
        expect(inputElm.getAttribute('placeholder')).to.equal(placeholder);
    });
});
