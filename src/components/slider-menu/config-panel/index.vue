<script lang="ts" src="./index.ts"></script>

<template>
<section id="config-panel">
    <header class="sidebar-title">
        <h1>模拟设置</h1>
        <h2>Simulation Settings</h2>
    </header>
    <a-form :form="form" class="sidebar-body" :hideRequiredMark="true">
        <!-- 时间设置 -->
        <section class="form-section">
            <h1 class="form-title">
                <span class="form-label">T</span>
                <span class="form-subtitle">时间设置</span>
            </h1>
            <!-- 总时长 -->
            <a-form-item
                class="form-field"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="模拟时长">
                <a-input
                    v-decorator="formDecorator.end"
                    placeholder="请输入模拟时长">
                    <a-select slot="addonAfter" v-decorator="formDecorator.endUnit">
                        <a-select-option value="">秒</a-select-option>
                        <a-select-option value="m">毫秒</a-select-option>
                        <a-select-option value="u">微秒</a-select-option>
                    </a-select>
                </a-input>
            </a-form-item>
            <!-- 模拟步长 -->
            <a-form-item
                class="form-field"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="步长时间">
                <a-input
                    v-decorator="formDecorator.step"
                    placeholder="请输入步长时间">
                    <a-select slot="addonAfter" v-decorator="formDecorator.stepUnit">
                        <a-select-option value="m">毫秒</a-select-option>
                        <a-select-option value="u">微秒</a-select-option>
                        <a-select-option value="p">皮秒</a-select-option>
                    </a-select>
                </a-input>
            </a-form-item>
        </section>
        <!-- 示波器设置 -->
        <section class="form-section">
            <h1 class="form-title">
                <span class="form-label">M</span>
                <span class="form-subtitle">示波器设置</span>
            </h1>
        </section>
    </a-form>
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
    .form-field
        width 100%
        padding-left SpaceLeft
        /deep/ .ant-form-item-label {
            text-align left
        }
</style>
