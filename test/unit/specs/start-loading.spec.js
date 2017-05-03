import StartLoading from '@/components/start-loading';
import { createTest, createVue, destroyVM } from '../util';

describe('start-loading.vue', () => {
    let vm;
    afterEach(() => destroyVM(vm));

    it('create and show', () => {
        vm = createTest(StartLoading, { show: true }, true);

        const text = vm.$el.querySelectorAll('h3');
        expect(text.length).to.be.equal(2);
        expect(text[0].textContent).to.be.equal('加载中……');
        expect(text[1].textContent).to.be.equal('绘制草图·模拟');
    });
});
