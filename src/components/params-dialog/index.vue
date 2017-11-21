<template>
<transition name="fade" @enter="enter" @leave="leave">
    <section class="wrapper" v-show="vision">
        <div
            ref="dialog"
            class="params-dialog"
            :style="{
                left: `${position[0]}px`,
                top: `${position[1]}px`,
                transform: `translate(${bias[0]}px, ${bias[1]}px) scale(${scale})`,
            }">
            <header>参数设置</header>
            <article>
                <section>
                    <label
                        v-text="idLabel"
                        :style="`width: ${maxLabelLength}px`">
                    </label>
                    <v-input
                        ref="id"
                        v-model="id"
                        :pattern="idCheck"
                        :required="true"
                        class="params-input"
                        placeholder="请输入编号">
                    </v-input>
                </section>
                <section v-for="(param, i) in params" :key="i">
                    <label
                        v-text="`${param.label}：`"
                        :style="`width: ${maxLabelLength}px`">
                    </label>
                    <v-input
                        ref="params"
                        v-model="param.value"
                        :pattern="paramsCheck"
                        :required="true"
                        class="params-input"
                        placeholder="请输入参数">
                    </v-input>
                    <span
                        class="unit" v-text="param.unit"
                        :style="`width: ${maxUnitLength}px`">
                    </span>
                </section>
            </article>
            <footer>
                <button class="cancel" @click="beforeCancel">取消</button>
                <button class="comfirm" @click="beforeComfirm">确定</button>
            </footer>
            <i class="triangle-icon" :style="triangleStyle"></i>
        </div>
    </section>
</transition>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Input, { InputVerifiable } from 'src/components/input-verifiable';

import vuex from 'src/vuex';
import { $P } from 'src/lib/point';
import { Params } from './index';
import * as util from 'src/lib/utils';
import * as assert from 'src/lib/assertion';
import { getScopedName } from 'src/lib/utils';

@Component({
    components: {
        'v-input': Input,
    },
})
export default class ParamsDialog extends Vue {
    /** 指向的器件编号 */
    id: string = '';
    /** 参数列表 */
    params: Params[] = [];
    /** 是否显示 */
    vision = false;
    /** ID 的说明文本 */
    idLabel = '编号：';
    /** 是否初始化完成标志 */
    isMounted = false;

    /** 指向的器件坐标 */
    position = $P();
    /** 对话框偏移量 */
    bias = $P();
    /** 对话框缩放比例 */
    scale = 1;

    /** 中心最小限制 */
    min = 10;

    /** 编号的验证正则 */
    readonly idCheck = /[a-zA-Z]+_[a-zA-Z0-9]+/;
    /** 参数的验证正则 */
    readonly paramsCheck = Number.SCIMatch;

    /** 子组件定义 */
    $refs: {
        dialog: HTMLElement;
        id: InputVerifiable;
        params: InputVerifiable[];
    };

    mounted() {
        // 初始化完成标记置高
        this.isMounted = true;
    }

    /** 最长参数名称的长度 */
    get maxLabelLength(): number {
        if (!this.isMounted) {
            return 0;
        }

        const labels = this.params.map((param) => param.label + '：').concat([this.idLabel]);
        const dom = document.createElement('label');

        dom.setAttribute(getScopedName(this.$el), '');

        return Math.max(...this.getDomWidth(dom, labels));
    }
    /** 最长参数单位的长度 */
    get maxUnitLength(): number {
        if (!this.isMounted) {
            return 0;
        }

        const labels = this.params.map((param) => param.unit);
        const dom = document.createElement('span');

        dom.setAttribute('class', 'unit');
        dom.setAttribute(getScopedName(this.$el), '');

        return Math.max(...this.getDomWidth(dom, labels));
    }
    /** 对话框方位 */
    get location(): string[] {
        const direction: string[] = [];
        const min = this.min;
        // 对话框当前大小
        const { height, width } = this.boxSize;
        // 屏幕当前大小
        const { scrollHeight: SHeight, scrollWidth: SWidth } = document.body;
        // 侧边栏宽度
        const aside = vuex.getters.isEmpty ? 0 : 380

        // Y 轴方位
        if (this.position[1] < (height + min)) {
            direction.push('bottom');
        }
        else if ((SHeight - this.position[1]) < (height + min)) {
            direction.push('top');
        }

        // X 轴方位
        if (this.position[0] < (width / 2 + min)) {
            direction.push('right');
        }
        else if ((SWidth - this.position[0] - aside) < (width / 2 + min)) {
            direction.push('left');
        }

        // 默认在上方
        if (direction.length === 0) {
            direction.push('top');
        }

        return direction;
    }
    /** 对话框宽高 */
    get boxSize(): { height: number; width: number; } {
        const sections = this.params.length;

        const height = (
            36 +    // header height
            5 +     // body top margin
            (sections + 1) * 24 + sections * 5 +  // body height
            24 +    // footer height
            13      // fotter margin
        );
        const width = (
            100 +   // width of input
            20 +    // padding of body
            6 +     // unit's left margin
            this.maxLabelLength +
            this.maxUnitLength
        );

        return { width, height };
    }
    /** 计算倒三角形状 */
    get triangleStyle(): { [x: string]: string } {
        const len = this.location.length;
        const deg = { bottom: 0, left: 90, top: 180, right: 270 };

        const base = {
            'border-bottom': `${10 * len}px solid ${this.location.includes('bottom') ? '#20A0FF' : '#FFFFFF'}`,
            'border-left': `${6 * len}px solid transparent`,
            'border-right': `${6 * len}px solid transparent`,
            'transform': '',
            'left': '',
            'top': '',
        };

        // 旋转角度
        const avg = this.location.reduce((add, di) => add + deg[di], 0) / len;
        base.transform = this.location.isEqual(['bottom', 'right'])
            ? 'rotate(315deg)'
            : `rotate(${avg}deg)`;

        // 坐标
        if (len === 1) {
            if (/(top|bottom)/.test(this.location[0])) {
                base.left = 'calc(50% - 6px)';
                base.top = (this.location[0] === 'top') ? 'calc(100% - 1px)' : '-10px';
            }
            else {
                base.left = (this.location[0] === 'left') ? 'calc(100% - 1px)' : '-10px';
                base.top = 'calc(50% - 6px)';
            }
        }
        else {
            base.top = (this.location[0] === 'top') ? 'calc(100% - 11px)' : '-9px';
            base.left = (this.location[1] === 'toleftp') ? 'calc(100% - 13px)' : '-10px';
        }

        return base;
    }

    /** 以输入的 dom 为容器，计算所有 labels 的长度 */
    getDomWidth(dom: HTMLElement, labels: string[]): number[] {
        const section = this.$el.querySelector('article section');

        if (!section) {
            return [0];
        }

        // 保存当前 style
        const elStyle = { ...this.$el.style };
        const dislogStyle = { ...this.$refs.dialog.style };

        this.$el.style.display = 'block';
        this.$refs.dialog.style.opacity = '0';
        this.$refs.dialog.style.transition = '';
        this.$refs.dialog.style.transform = 'scale(1)';

        section.appendChild(dom);

        const widths = labels.map((label) => {
            dom.textContent = label;
            return dom.getBoundingClientRect().width;
        });

        dom.remove();
        Object.assign(this.$el.style, elStyle);
        Object.assign(this.$refs.dialog.style, dislogStyle);

        return widths;
    }
    /** 根据对话框的缩放比例，设置对话框偏移量 */
    setBoxStyle(scale: number): void {
        const min = 20, { height, width } = this.boxSize;

        // 设置缩放比例
        this.scale = scale;

        // X 轴计算
        if (this.location.includes('left')) {
            this.bias[0] = - width * (1 + scale) / 2 - min;
        }
        else if (this.location.includes('right')) {
            this.bias[0] = - width * (1 - scale) / 2 + min;
        }
        else {
            this.bias[0] = - width / 2;
        }

        // Y 轴计算
        if (this.location.includes('top')) {
            this.bias[1] = - height * (1 + scale) / 2 - min;
        }
        else if (this.location.includes('bottom')) {
            this.bias[1] = - height * (1 - scale) / 2 + min;
        }
        else {
            this.bias[1] = - height / 2;
        }
    }

    async enter(el: HTMLElement, done: () => void) {
        this.setBoxStyle(0.2);
        await util.delay(0);

        this.setBoxStyle(1);
        await util.delay(300);

        done();
    }
    async leave(el: HTMLElement, done: () => void) {
        this.setBoxStyle(1);
        await util.delay(0);

        this.setBoxStyle(0.2);
        await util.delay(300);

        done();
    }

    cancel: () => void;
    comfirm: () => void;
    beforeCancel() {
        this.cancel();
    }
    beforeComfirm() {
        if (
            this.$refs.id.check() &&
            this.$refs.params.every((comp) => comp.check())
        ) {
            this.comfirm();
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variable'

radius = 4px;

.wrapper
    position fixed
    top 0
    left 0
    height 100%
    width 100%
    z-index 100
    overflow auto
    background-color rgba(0, 0, 0, .2)

.params-dialog
    position relative
    background White
    border-radius radius
    box-shadow 0 1px 3px rgba(0, 0, 0, .4)
    user-select none
    display inline-block
    transition transform .3s cubic-bezier(.3,.3,.1,1)

header
    font-size 20px
    height 36px
    color White
    text-align center
    line-height 36px
    background-color Blue
    font-family font-serif
    border-top-left-radius: radius
    border-top-right-radius: radius

article
    padding 0 10px

    section
        font-family: font-default
        font-size: 16px;
        position: relative
        margin: 5px 0
        display flex

    label
        display inline-block;
        font-size: 16px;
        height: 24px;
        line-height: 24px;

    .params-input
        width: 100px
        font-size: 1rem;
        display: inline-block
        position relative
        top: 4px
    
    .unit
        font-size: 18px;
        margin-left: 6px
        display: inline-block
        font-family: font-text
        position relative
        top: 2px

footer
    text-align: right;
    margin: 8px 5px 5px 5px;

    button
        font-size: 14px
        background-color transparent
        margin-left: 5px
        padding: 0 5px
        outline: none
        border none
        height: 24px;
        line-height: 24px;

        &:focus
            border: none
            outline: none
        &.comfirm
            color: Blue
        &.cancel
            color: Yellow

// TODO: 三角阴影
.triangle-icon
    display: inline;
    position: absolute;
    width: 0;
    height: 0;
</style>
