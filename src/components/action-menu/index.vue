<template>
<transition name="fade">
    <footer class="action-menu" v-show="vision">
        <div v-if="isRun" class="fab-container">
            <div class="fab" id="fab-text"></div>
        </div>
        <div
            v-for="(icon, i) in icons"
            v-show="!isRun"
            class="fab-container"
            :tip="icon.tip" :key="i"
            @click="action(icon.name)">
            <div v-once class="fab">
                <svg :viewBox="`0 0 ${icon.long} ${icon.long}`">
                    <g :transform="`translate(${icon.translate}) scale(${zoom}, ${zoom})`">
                        <path :d="icon.d"></path>
                    </g>
                </svg>
            </div>
        </div>
    </footer>
</transition>
</template>

<script lang="ts">
import { action, Icon } from 'src/lib/icon';
import { Component, Vue } from 'vue-property-decorator';

const zoom = 0.6;

const icons = [
    { name: 'run', tip: '时域模拟' },
    { name: 'add', tip: '添加器件' },
    { name: 'config', tip: '运行设置' },
].map((data) => {
    const icon = action[data.name] as Icon;

    return {
        ...data,
        ...icon,
        translate: icon.transform.map((n) => n + (1 - zoom) / 2 * icon.long).join(','),
    };
});

@Component
export default class ActionMenu extends Vue {
    /** 图标缩放比例 */
    zoom = zoom;
    /** 当前是否正在运行 */
    isRun = false;
    /** 图标数据 */
    icons = icons;

    /** 是否显示菜单 */
    get vision(): boolean {
        return this.$store.getters.isSpace;
    }

    /** 按钮被点击 */
    action(name: string): void {
        const funcs = {
            run: () => this.isRun = true,
            add: () => this.$store.commit('OPEN_ADD_PARTS'),
            config: () => this.$store.commit('OPEN_MAIN_CONFIG'),
        };

        funcs[name]();
    }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variable'

.action-menu
    position fixed
    bottom 0px
    right 8px
    display flex
    flex-direction column-reverse
    align-items center
    padding 30px
    z-index 6

.action-menu .fab-container:nth-child(n+2) .fab,
.action-menu .fab-container:nth-child(n+2)
    height 2.8em
    width 2.8em
    opacity 0
    transition all 0.4s

.action-menu:hover .fab-container .fab,
.action-menu:hover .fab-container
    opacity 1

.action-menu .fab-container:nth-child(n+2)
    margin -0.5em 0em

.action-menu:hover
    .fab-container:nth-child(n+2)
        margin .35em 0em
    .fab-container:nth-child(2)
        transition-delay 0
    .fab-container:nth-child(3)
        transition-delay .03s
    .fab-container:nth-child(4)
        transition-delay .06s
    .fab-container:nth-child(5)
        transition-delay .09s
    .fab-container:nth-child(6)
        transition-delay .12s
    .fab-container:nth-child(7)
        transition-delay .125s

.fab-container
    position relative
    margin .35em 0em

.fab-container:first-of-type .fab
    background #66CCCC

.fab-container:nth-child(2) .fab
    background #2196F3

.fab-container:nth-child(3) .fab
    background #E53935

.fab-container:nth-child(4) .fab
    background #f8985c

.fab-container:nth-child(5) .fab
    background #43A047

.fab-container:nth-child(n+2)::after
    content attr(tip)
    position absolute
    top 50%
    left -0.7em
    padding .65em 1.25em .45em 1.25em
    border-radius 2px
    transform-origin right
    transform translate(-100%, -50%)
    transition opacity 0.4s
    white-space nowrap
    height auto
    width auto
    background #757575
    color #F5F5F5
    font-weight 300
    font-size .9em
    opacity 0
    z-index 2

.fab-container:hover::after
    opacity 1

.fab-container:hover .fab
    box-shadow 0px 3px 5px rgba(0, 0, 0, 0.5)

.fab
    height 3.5em
    width 3.5em
    border-radius 50%
    position relative
    overflow hidden
    box-shadow 0px 2px 3px rgba(0, 0, 0, 0.5)
    transition box-shadow 0.2s

.fab:hover
    cursor pointer

.fab-container .fab svg
    text-align center
    fill #FFFFFF
    stroke-width 0
</style>
