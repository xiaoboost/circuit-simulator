<script lang="ts" src="./index.ts"></script>

<template>
<unfold :duration="500" :start="{
    right: '66px',
    bottom: '66px',
}">
    <section id="graph-viewer" v-if="visible">
        <line-drawer
            v-for="(meters, i) in oscilloscopes"
            :key="i"
            :id="`line-viewer-${i}`"
            :meters="meters"
            :half-height="halfHeight"
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
            display: flex;
        }
    }
}
</style>
