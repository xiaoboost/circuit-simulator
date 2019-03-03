<script lang="ts" src="./index.ts"></script>

<template>
<section id="config-panel">
    <header class="sidebar-title">
        <h1>模拟设置</h1>
        <h2>Simulation Settings</h2>
    </header>
    <article class="sidebar-body">
        <!-- 时间设置 -->
        <section class="form-section">
            <h1 class="form-title">
                <span class="form-label">T</span>
                <span class="form-subtitle">时间设置</span>
            </h1>
            <a-row class="form-item" :gutter="10" type="flex" align="middle">
                <a-col :span="6" class="form-item__label">模拟时长</a-col>
                <a-col :span="18" class="form-item__content">
                    <a-input-number :min="0" v-model="data.end" />
                    <a-select v-model="data.endUnit">
                        <a-select-option
                            v-for="i in 3"
                            :key="i"
                            :value="timeUnits[i-1].value">
                            {{ timeUnits[i-1].label }}
                        </a-select-option>
                    </a-select>
                </a-col>
            </a-row>
            <a-row class="form-item" :gutter="10" type="flex" align="middle">
                <a-col :span="6" class="form-item__label">步长时间</a-col>
                <a-col :span="18" class="form-item__content">
                    <a-input-number :min="0" v-model="data.step" />
                    <a-select v-model="data.stepUnit">
                        <a-select-option
                            v-for="i in 3"
                            :key="i"
                            :value="timeUnits[i].value">
                            {{ timeUnits[i].label }}
                        </a-select-option>
                    </a-select>
                </a-col>
            </a-row>
        </section>
        <!-- 示波器设置 -->
        <section class="form-section">
            <h1 class="form-title">
                <span class="form-label">M</span>
                <span class="form-subtitle">示波器设置</span>
            </h1>
            <a-input-group
                compact
                v-for="(chart, i) in data.charts"
                :key="i"
                class="form-item">
                <a-select v-model="chart.type">
                    <a-select-option
                        v-for="type in chartTypes"
                        :key="type.value"
                        :value="type.value">
                        {{ type.label }}
                    </a-select-option>
                </a-select>
                <a-select mode="multiple" v-model="chart.meters">
                    <a-select-option value="Option2-1">Option2-1</a-select-option>
                    <a-select-option value="Option2-2">Option2-2</a-select-option>
                </a-select>
            </a-input-group>
            <div class="form-item">
                <a-button type="dashed" @click="addMeter">添加示波器</a-button>
            </div>
        </section>
    </article>
</section>
</template>

<style lang="stylus" scoped>
@import '../../../css/variable'

SpaceLeft = 30px

#config-panel .sidebar-body
    .form-section
        margin 0 0 20px 0
    .form-title
        font-size 20px
        line-height 1.5
        font-weight normal
        .form-label
            font-family font-serif
            position absolute
            color Silver
        .form-subtitle
            margin-left SpaceLeft
            color Black
    .form-item
        width 100%
        padding-left SpaceLeft
        margin-bottom 6px
        .form-item__label
            font-size 14px
            color rgba(0, 0, 0, 0.85)
        .form-item__content
            .ant-input-number
                width 100px
            .ant-select
                width 72px
</style>
