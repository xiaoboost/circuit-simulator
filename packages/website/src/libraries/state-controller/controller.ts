import { ChannelSubscriber } from '@xiao-ai/utils';
import {
  produceWithPatches,
  enablePatches,
  applyPatches,
  type Objectish as ImmerObject,
} from 'immer';
import {
  UNDO_STACK_LIMIT,
} from './constant';
import {
  SubscribeEventName,
  type EditProducer,
  type CommitPatch,
} from './types';

// 启动补丁功能
enablePatches();

/** 状态控制器 */
export class StateController<T extends ImmerObject> extends ChannelSubscriber {
  /** 事件名称 */
  static SubscribeEventName = SubscribeEventName;

  /** 当前状态 */
  private state: T;
  /** 修改栈 */
  private editStack: CommitPatch[] = [];
  /** 栈指针 */
  private stackPointer = -1;

  constructor(initialState: T) {
    super();
    this.state = initialState;
  }

  /** 是否可以撤销 */
  get canUndo(): boolean {
    return this.editStack.length > 0 && this.stackPointer > 0;
  }

  /** 是否可以重做 */
  get canRedo(): boolean {
    return this.editStack.length > 0 && this.stackPointer < this.editStack.length - 1;
  }

  /** 编辑 */
  commit(name: string, description: string, producer: EditProducer<T>): void {
    const { state, editStack, stackPointer } = this;

    // 指针不是最新，需要抛弃掉指针后面的修改
    editStack.length = stackPointer + 1;

    // 生成补丁
    const [newState, patches, inversePatches] = produceWithPatches(state, producer);

    // 修改操作补丁储存
    editStack.push({ name, description, patches, inversePatches });
    // 新状态
    this.state = newState;
    // 编辑的时候，双指针都指向最新
    this.stackPointer = editStack.length - 1;

    // 如果修改栈超过上限，则删除最早的修改
    if (editStack.length > UNDO_STACK_LIMIT) {
      editStack.shift();
    }

    // 通知变更
    this.notify(SubscribeEventName.Change, newState);
  }

  /** 撤销 */
  undo(): void {
    if (!this.canUndo) {
      return;
    }

    const currentEditPatch = this.editStack[this.stackPointer];

    // 应用逆向补丁
    this.state = applyPatches<T>(this.state, currentEditPatch.inversePatches);
    // 指针回退
    this.stackPointer--;
    // 通知变更
    this.notify(SubscribeEventName.Change, this.state);
    // 通知操作栈变更
    this.notify(SubscribeEventName.Undo, currentEditPatch.name);
  }

  /** 重做 */
  redo(): void {
    if (!this.canRedo) {
      return;
    }

    const currentEditPatch = this.editStack[this.stackPointer + 1];

    // 应用补丁
    this.state = applyPatches<T>(this.state, currentEditPatch.patches);
    // 指针前进
    this.stackPointer++;
    // 通知变更
    this.notify(SubscribeEventName.Change, this.state);
    // 通知操作栈变更
    this.notify(SubscribeEventName.Redo, currentEditPatch.name);
  }

  /** 获取当前状态 */
  getState(): T {
    return this.state;
  }
}
