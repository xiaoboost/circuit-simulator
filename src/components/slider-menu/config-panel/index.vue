<script lang="ts" src="./index.ts"></script>

<template>
<section id="config-panel">
    <header class="sidebar-title">
        <h1>模拟设置</h1>
        <h2>Simulation Settings</h2>
    </header>
    <article class="sidebar-body">
        <!-- 时间设置 -->
        <section>
            <h1>
                <label>T</label>
                <span>时间设置</span>
            </h1>
            <div class="input-unit">
                <label>结束时间</label>
                <a-input defaultValue="mysite">
                    <template slot="addonAfter">秒</template>
                </a-input>
                <!-- <input-verifiable
                    ref="end"
                    v-model="end"
                    :rules="{ pattern }">
                </input-verifiable>
                <span class="unit">秒</span> -->
            </div>
            <div class="input-unit">
                <label>固定步长：</label>
                <input-verifiable
                    ref="step"
                    v-model="step"
                    :rules="{ pattern }">
                </input-verifiable>
                <span class="unit">秒</span>
            </div>
        </section>
        <!-- 示波器设置 -->
    </article>
</section>
</template>

<style lang="stylus" scoped>
#config-panel .sidebar-body
    section
        margin 0 0 20px 0
    h1
        font-size 20px
        line-height 1.5
        font-weight normal
        label
            font-family font-serif
            position absolute
            color Silver
        span
            margin-left 30px
            color Black
    .input-unit
        display flex
        margin 15px 30px
        justify-content flex-start
        align-items flex-end

        label
            white-space nowrap
        .q-input
            flex-grow 1
            margin-right 10px
</style>
