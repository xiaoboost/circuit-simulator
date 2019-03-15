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
            <header class="form-title">时间设置</header>
            <article class="form-body">
                <a-row class="form-item" :gutter="10" type="flex" align="middle">
                    <a-col :span="6" class="form-item__label">模拟时长</a-col>
                    <a-col :span="18" class="form-item__content">
                        <a-input-number :min="0" v-model="data.end" />
                        <a-select v-model="data.endUnit">
                            <a-select-option
                                v-for="(unit, i) in endTimeUnits"
                                :key="i"
                                :value="unit.value">
                                {{ unit.label }}
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
                                v-for="(unit, i) in stepTimeUnits"
                                :key="i"
                                :value="unit.value">
                                {{ unit.label }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
            </article>
        </section>
        <!-- 示波器设置 -->
        <section class="form-section">
            <header class="form-title">示波器设置</header>
            <article class="form-body">
                <div
                    class="form-item"
                    v-for="(chart, i) in data.charts"
                    :key="i">
                    <a-select
                        mode="multiple"
                        :value="chart"
                        placeholder="请选择要显示的仪表"
                        style="width: 100%;"
                        @change="(ev) => data.charts.splice(i, 1, ev)">
                        <!-- 电流表 -->
                        <a-select-opt-group label="电流表" v-if="currentMeters.length > 0">
                            <a-select-option
                                v-for="meter in currentMeters"
                                :key="meter.id"
                                :value="meter.id">
                                {{ meter.id }}
                            </a-select-option>
                        </a-select-opt-group>
                        <!-- 电压表 -->
                        <a-select-opt-group label="电压表" v-if="voltageMeters.length > 0">
                            <a-select-option
                                v-for="meter in voltageMeters"
                                :key="meter.id"
                                :value="meter.id">
                                {{ meter.id }}
                            </a-select-option>
                        </a-select-opt-group>
                    </a-select>
                    <a-button
                        type="danger"
                        shape="circle"
                        icon="delete"
                        class="delete-btn"
                        @click="data.charts.splice(i, 1)"
                    />
                </div>
                <div class="form-item" style="margin-top: 4px;">
                    <a-button type="dashed" @click="addMeter">添加示波器</a-button>
                </div>
            </article>
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
        margin-bottom 8px
        color Black
    .form-body
        margin 0 14px
    .form-item
        width 100%
        margin-bottom 6px
        position relative
        .form-item__label
            font-size 14px
            color rgba(0, 0, 0, 0.85)
        .form-item__content
            .ant-input-number
                width 100px
            .ant-select
                width 72px

    .delete-btn
        position absolute
        top 0px
        right -16px
        opacity 0
        transform scale(.6)
        transition all .25s ease
    
    .form-item:hover .delete-btn
        opacity 1
        transform scale(.8)
</style>
