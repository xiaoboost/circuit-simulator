<script lang="ts" src="./index.ts"></script>

<template>
<a-popover :title="title" v-model="show">
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
                输入
            </section>
            <!-- 单位 -->
            <section class="params__unit">
                <span>&nbsp;</span>
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

.params-dialog__article {
    padding 0
    line-height 24px
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

        label::after {
            content ": "
        }
    }

    .params__input {
    
    }

    .params__unit {
    
    }
}

.params-dialog__footer {
    text-align right
    margin-top 6px

    .ant-btn {
        margin-left 6px
    }
}
</style>
