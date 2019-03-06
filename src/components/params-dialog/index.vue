<script lang="ts" src="./index.ts"></script>

<template>
<a-popover :title="title" :visible="show">
    <template slot="content">
        <article class="params-dialog__article">
            <!-- 说明 -->
            <section class="params__label">
                <label>编号</label>
                <label
                    v-for="param in params"
                    :key="param.label"
                    v-text="param.label"
                />
            </section>
            <!-- 输入 -->
            <section class="params__input">
                <a-input v-model="id" />
                <a-input
                    v-for="(param, i) in params"
                    v-model="param.value"
                    :key="i">
                    <a-select slot="addonAfter" v-model="param.unit">
                        <a-select-option
                            v-for="unit in param.units"
                            :value="unit.value"
                            :key="unit.value">
                            {{ unit.label }}
                        </a-select-option>
                    </a-select>
                </a-input>
            </section>
        </article>
        <footer class="params-dialog__footer">
            <a-button size="small" @click="beforeCancel">
                取消
            </a-button>
            <a-button size="small" type="primary" @click="beforeConfirm">
                确定
            </a-button>
        </footer>
    </template>
    <!-- 对话框定位点 -->
    <div
        class="popover-trigger"
        :style="{
            left: `${position[0]}px`,
            top: `${position[1]}px`,
        }"
    />
</a-popover>
</template>

<style lang="stylus" scoped>
@import '../../css/variable.styl'

.popover-trigger {
    position absolute
    display block
    height 1px
    width 1px
    background-color transparent
}

BackLen = -4px

.params-dialog__article {
    padding 0
    line-height 32px
    margin 0 BackLen
    display flex

    > section {
        flex-grow 0
        flex-shrink 0
        display inline-flex
        flex-direction column
    }

    .params__label {
        font-size 14px
        font-family font-default
        align-items flex-start
        margin-right 6px

        label::after {
            content ":"
        }
    }

    .params__input {
        > * {
            width 140px
        }
    }

    .params__label,
    .params__input {
        > * {
            margin-bottom 8px
        }
    }
}

.params-dialog__footer {
    text-align right
    margin 2px BackLen 0 BackLen

    .ant-btn {
        margin-left 4px
    }
}
</style>
