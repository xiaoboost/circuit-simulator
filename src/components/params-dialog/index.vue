<template>
<transition name="fade">
    <section class="wrapper" v-show="vision">
        <div class="params-dialog">
            <header>参数设置</header>
            <article>
                <section>
                    <label>编号：</label>
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
                    <label v-text="`${param.label}：`"></label>
                    <v-input
                        ref="id"
                        v-model="param.value"
                        :pattern="paramsCheck"
                        :required="true"
                        class="params-input"
                        placeholder="请输入参数">
                    </v-input>
                    <span class="unit" v-text="param.unit"></span>
                </section>
            </article>
            <footer>
                <button class="cancel" @click="beforeCancel">取消</button>
                <button class="comfirm" @click="beforeComfirm">确定</button>
            </footer>
            <i class="triangle-down"></i>
        </div>
    </section>
</transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Input from 'src/components/input-verifiable';

import { $P } from 'src/lib/point';
import { Params } from './index';

type Location = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

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
    /** 指向的器件坐标 */
    position = $P();

    /** 编号的验证正则 */
    readonly idCheck = /[a-zA-Z]+_[a-zA-Z0-9]+/;
    /** 参数的验证正则 */
    readonly paramsCheck = Number.SCIMatch;

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
@import '../../css/variable'

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
    border-radius 4px
    box-shadow 0 1px 3px rgba(0, 0, 0, .4)
    user-select none
    display inline-block

header
    font-size 20px
    height auto
    color White
    text-align center
    line-height 35px
    background-color Blue
    font-family font-serif

article
    padding 0 10px

    section
        font-family: font-default
        position: relative
        margin: 5px 0

    .params-input
        width: 100px
        font-size: 16px;
        display: inline-block

        /deep/ .input-bar:before
            bottom 0;
    
    .unit
        font-size: 18px
        margin-left: 6px
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

        &:focus
            border: none
            outline: none
        &.comfirm
            color: Blue
        &.cancel
            color: Yellow
</style>
