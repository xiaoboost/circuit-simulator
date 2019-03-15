<script lang="ts" src="./index.ts"></script>

<template>
<div class="params-dialog-warpper" :style="show ? 'z-index: 10' : ''">
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
                    <!-- id -->
                    <div>
                        <a-input-group compact :class="['params__input_id', {
                            'is-error': Boolean(idErrMsg),
                        }]">
                            <!-- pre id -->
                            <a-tooltip placement="top" title="大写字母">
                                <a-input
                                    v-model="preId"
                                    @blur.native="validateId"
                                    style="width: calc(40% - 7px);"
                                />
                            </a-tooltip>
                            <!-- 下划线分割 -->
                            <a-input disabled default-value="_" style="width: 16px; padding: 4px;" />
                            <!-- id -->
                            <a-tooltip placement="top" title="小写字母与数字">
                                <a-input
                                    v-model="subId"
                                    @blur.native="validateId"
                                    style="width: calc(60% - 7px);"
                                />
                            </a-tooltip>
                        </a-input-group>
                        <collapse :duration="100">
                            <div v-if="idErrMsg" class="params__error">{{ idErrMsg }}</div>
                        </collapse>
                    </div>
                    <!-- 参数 -->
                    <div
                        v-for="(param, i) in params"
                        :key="i"
                        :class="['params__input_param', {
                            'is-error': Boolean(paramErrMsgs[i]),
                        }]">
                        <a-input v-model="param.value" @blur="validateParam(i)">
                            <a-select
                                v-if="param.units.length > 0"
                                slot="addonAfter"
                                v-model="param.rank"
                                :style="{ width: unitWidth(param.units) }">
                                <a-select-option
                                    v-for="unit in param.units"
                                    :value="unit.value"
                                    :key="unit.value">
                                    {{ unit.label }}
                                </a-select-option>
                            </a-select>
                            <template
                                v-else-if="param.unit"
                                slot="addonAfter">
                                {{ param.unit }}
                            </template>
                        </a-input>
                        <collapse :duration="100">
                            <div v-if="paramErrMsgs[i]" class="params__error">{{ paramErrMsgs[i] }}</div>
                        </collapse>
                    </div>
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
            ref="trigger"
            class="popover-trigger"
            :style="{
                left: `${position[0]}px`,
                top: `${position[1]}px`,
            }"
        />
    </a-popover>
</div>
</template>

<style lang="stylus" scoped>
@import '../../css/variable.styl'

.params-dialog-warpper {
    position fixed
    display block
    height 100vh
    width 100vw
    left 0
    top 0
    z-index -1
    transition  background-color .2s
    background-color transparent
}

.popover-trigger {
    position fixed
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
        text-align right

        label {
            width 100%
        }

        label::after {
            content ":"
        }
    }

    .params__input > * {
        width 140px
    }

    .params__label > *,
    .params__input > * {
        margin-bottom 14px
    }

    .params__input_param /deep/ .ant-select-selection-selected-value {
        text-overflow: initial;
    }

    .params__error {
        position: absolute;
        color: Red;
        font-size: 10px;
        line-height: 1;
        font-size: 10px;
        transform: translate(2px, 1px);
    }

    /deep/ .is-error {
        &.params__input_id {
            .ant-input:nth-child(1) {
                border-left-color: Red;
                border-top-color: Red;
                border-bottom-color: Red;
                box-shadow-color: Red;
            }

            .ant-input:nth-child(2) {
                border-top-color: Red;
                border-bottom-color: Red;
            }

            .ant-input:nth-child(3) {
                border-right-color: Red;
                border-top-color: Red;
                border-bottom-color: Red;
            }
        }

        &.params__input_param {
            .ant-input {
                border-color: Red;
            }
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
