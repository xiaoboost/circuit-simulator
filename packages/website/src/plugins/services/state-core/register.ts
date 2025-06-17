import { Electronics } from '@circuit/electronics';
import { STATE_CORE_SERVICE, IStateCoreService } from '@circuit/shared';
import { LineStructuredData, PartStructuredData, StructuredData as State } from '@circuit/types';
import { message } from 'antd';
import {
  produce,
  produceWithPatches,
  enablePatches,
  applyPatches,
} from 'immer';
import { definePlugin, Watcher } from '../../../context';
import { UNDO_STACK_LIMIT } from './constant';
import { type PatchWithComment } from './types';

// 启动补丁功能
enablePatches();

// 注册插件
definePlugin(({ registerService }) => {
  /** 当前状态 */
  let state: State = {
    parts: [] as PartStructuredData[],
    lines: [] as LineStructuredData[],
  };
  /** 当前草稿 */
  let draftState: State | undefined = undefined;
  /** 栈指针 */
  let stackPointer = -1;
  /** 修改栈 */
  const editStack: PatchWithComment[] = [];
  /** 更新状态 */
  const updateState = () => {
    service.state.setData(draftState ?? state);
    service.commitState.setData(state);
    service.canUndo.setData(
      draftState
        ? false
        : editStack.length > 0 && stackPointer > -1,
    );
    service.canRedo.setData(
      draftState
        ? false
        : editStack.length > 0 && stackPointer < editStack.length - 1,
    );
  };

  const service: IStateCoreService = {
    state: new Watcher({
      parts: [] as PartStructuredData[],
      lines: [] as LineStructuredData[],
    }),
    commitState: new Watcher({
      parts: [] as PartStructuredData[],
      lines: [] as LineStructuredData[],
    }),
    canUndo: new Watcher(false),
    canRedo: new Watcher(false),
    getPartPrototype(kind) {
      const result = Electronics[kind];

      if (!result) {
        throw new Error('未找到器件原型');
      }

      return result;
    },
    getPart(id) {
      const result = state.parts.find((item) => item.id === id);

      if (!result) {
        throw new Error(`无法获取器件: ${id}`);
      }

      return result;
    },
    getLine(id) {
      const result = state.lines.find((item) => item.id === id);

      if (!result) {
        throw new Error(`无法获取导线: ${id}`);
      }

      return result;
    },
    commit({ name, description, patch }) {
      // 指针不是最新，需要抛弃掉指针后面的修改
      editStack.length = stackPointer + 1;

      // 生成补丁
      const [newState, patches, inversePatches] = produceWithPatches(state, patch);

      // 修改操作补丁储存
      editStack.push({ name, description, patches, inversePatches });
      // 新状态
      state = newState;
      // 编辑的时候，双指针都指向最新
      stackPointer = editStack.length - 1;

      // 如果修改栈超过上限，则删除最早的修改
      if (editStack.length > UNDO_STACK_LIMIT) {
        editStack.shift();
      }

      // 清除草稿
      draftState = undefined;
      // 更新状态
      updateState();
    },
    draft(patch) {
      draftState = produce(state, patch);
      updateState();
    },
    dropDraft() {
      draftState = undefined;
      updateState();
    },
    undo() {
      if (!service.canUndo.data) {
        return;
      }

      const currentEditPatch = editStack[stackPointer];

      // 应用逆向补丁
      state = applyPatches(state, currentEditPatch.inversePatches);
      // 指针回退
      stackPointer--;
      // 更新状态
      updateState();
      // 提示
      message.info({
        type: 'success',
        content: `已撤销: ${currentEditPatch.name}`,
      });
    },
    redo() {
      if (!service.canRedo.data) {
        return;
      }

      const currentEditPatch = editStack[stackPointer + 1];

      // 应用补丁
      state = applyPatches(state, currentEditPatch.patches);
      // 指针前进
      stackPointer++;
      // 更新状态
      updateState();
      // 提示
      message.info({
        type: 'success',
        content: `已重做: ${currentEditPatch.name}`,
      });
    },
  };

  // 注册状态核心服务
  registerService(STATE_CORE_SERVICE, service);

  return () => {
    service.state.unObserve();
    service.commitState.unObserve();
    service.canUndo.unObserve();
    service.canRedo.unObserve();
  };
});
