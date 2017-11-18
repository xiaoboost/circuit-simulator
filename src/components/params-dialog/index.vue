<template>
<transition name="params-dialog__transition">
    <section class="params-dialog__wrapper" v-show="vision">
        <div class="params-dialog">
            <header>参数设置</header>
            <article>
                <section v-for="(parms, i) in params" :key="i">
                    <label v-text="param.label"></label>
                    <span v-text="param.value"></span>
                    <span class="unit" v-text="param.unit"></span>
                </section>
            </article>
            <footer>
                <button @click="beforeCancel">取消</button>
                <button @click="beforeComfirm">确定</button>
            </footer>
            <i class="triangle-down"></i>
        </div>
    </section>
</transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { $P } from 'src/lib/point';
import { Params } from './index';

type Location = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

@Component
export default class ParamsDialog extends Vue {
    /** 参数列表 */
    params: Params[] = [];
    /** 是否显示 */
    vision = false;
    /** 指向的器件坐标 */
    position = $P();
    /** 最长参数名称的长度 */
    get maxLabelLength(): number {
        return Math.max(
            ...this.params.map((param) => param.label.length)
        );
    }
    /** 最长参数单位的长度 */
    get maxUnitLength(): number {
        return Math.max(
            ...this.params.map((param) => param.unit.length)
        );
    }
    // get location(): Location {
    //     const height = document.body.scrollHeight;
    //     const width = document.body.scrollWidth;


    // }

    cancel: () => void;
    comfirm: () => void;

    beforeCancel() {
        this.cancel();
    }
    beforeComfirm() {
        // TODO: 格式检查
        this.comfirm();
    }
}
</script>

<style lang="stylus" scoped>
.params-dialog__wrapper
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
    background #fff
    border-radius 4px
    box-shadow 0 1px 3px rgba(0, 0, 0, .4)
</style>
