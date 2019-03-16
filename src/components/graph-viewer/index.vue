<script lang="ts" src="./index.ts"></script>

<template>
<unfold :duration="500" :start="{ right: '66px', bottom: '64px' }">
    <section id="graph-viewer" v-if="visible">
        波形展示
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
    background-color #66CCCC
    font-family font-default
}
</style>
