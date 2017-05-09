import StartLoading from '@/components/start-loading';
import { createTest, destroyVM } from '../util';

describe('start-loading.vue', () => {
    let vm;
    afterEach(() => destroyVM(vm));

    it('loading page, it should be showed', () => {
        vm = createTest(StartLoading, { show: true });

        const text = vm.$el.querySelectorAll('h3');
        expect(text.length).to.be.equal(2);
        expect(text[0].textContent).to.be.equal('加载中……');
        expect(text[1].textContent).to.be.equal('绘制草图·模拟');
    });
    it('page loading finished, it should be closed', (done) => {
        vm = createTest(StartLoading, { show: false }, true);
        // 等待页面渲染
        vm.$nextTick(() => {
            expect(vm.$el.childNodes.length).to.be.equal(0);
            done();
        });
    });
});
