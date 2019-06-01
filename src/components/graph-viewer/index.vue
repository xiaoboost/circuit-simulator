<script lang="ts" src="./index.ts"></script>

<template>
<unfold :duration="500" :start="{
    right: '66px',
    bottom: '66px',
}">
    <section id="graph-viewer" v-if="visible">
        <!-- 波形 -->
        <line-drawer
            ref="lineDrawers"
            v-for="(meters, i) in oscilloscopes"
            :key="i"
            :id="`line-viewer-${i}`"
            :meters="meters"
            :half-height="halfHeight"
            class="chart-container"
        />
        <!-- 功能按键 -->
        <aside class="graph-toolbar">
            <a class="text-link" href="#" @click.passive="closeViewer">关闭面板</a>|
            <a class="text-link" href="#" @click.passive="saveAsData">输出数据</a>|
            <a class="text-link" href="#" @click.passive="saveAsImage">输出绘制图像</a>
        </aside>
    </section>
</unfold>
</template>

<style lang="stylus" scoped>
@import '../../css/variable'

#graph-viewer {
    height 100vh
    max-width 100vw
    min-width 160vh
    right 0
    padding 0
    margin 0
    position absolute
    overflow hidden
    background-color #FFFADC
    font-family font-default
    overflow hidden auto
    box-shadow -4px 0 8px #eee

    .chart-container {
        width 100%
        padding 0
        margin 0
        overflow hidden

        /deep/ div {
            display flex
        }
    }

    .graph-toolbar {
        position absolute
        font-size 14px
        display flex
        align-items center
        margin-left 10px
        top 0

        .text-link {
            position relative
            margin 6px 8px
            cursor pointer
            text-decoration underline
        }
    }
}
</style>
