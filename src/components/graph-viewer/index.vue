<script lang="ts" src="./index.ts"></script>

<template>
<unfold start="66px" :duration="500">
    <section id="graph-viewer" v-if="visible">
        <line-drawer
            v-for="(meters, i) in oscilloscopes"
            :key="i"
            :id="`line-viewer-${i}`"
            :meters="meters"
            class="chart-container"
        />
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
    position absolute
    overflow hidden
    background-color #fffdf6
    font-family font-default
    overflow hidden auto
    padding 14px 16px
    box-shadow -4px 0 8px #eee

    .chart-container {
        width 100%
        height 100%
        padding 0
        margin 0
        overflow hidden
    }
}
</style>
