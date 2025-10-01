import {
  getPartPin,
  createLineByPath,
  createPartReferenceTag,
} from '@circuit/electronics';
import {
  ILoggerService,
  IStateCoreService,
} from '@circuit/shared';
import { LineStructuredData } from '@circuit/types';
import { definePlugin } from '../../../../context';
import {
  DragSceneHookPayload,
  IEventListenerHook,
  IHoverService,
  IDragSceneHook,
  ISelectService,
  IDragSceneService,
  IMapHashService,
  EntityKind,
  IConnectionService,
  ICursorService,
  ICursorKind,
  ICollisionService,
  IVariableObserverService,
} from '../../../../types';
import {
  type PathSearcher,
  type PartWithPin,
  findPartPin,
  findLinePinAndIndex,
  removeRepeat,
} from '../algorithm';
import { PIN_DRAW_FIXED_STYLE } from '../constant';
import { painterStateGetter, createSearchHook, setSearchResult } from '../utils';
import { CreateLineSceneName, LoggerName } from './constant';
import { createDrawLineSearcher as createSearcher } from './search';

interface StartPayloadType extends DragSceneHookPayload {
  /** 新导线 */
  line: LineStructuredData;
  /** 创建状态 */
  start: PartWithPin;
  /** 搜索器 */
  search: PathSearcher;
}

definePlugin(({ registerHook, getService }) => {
  // 注册创建导线场景触发器
  registerHook(IEventListenerHook, {
    order: 5,
    onMouseDown(event) {
      const dragSceneService = getService(IDragSceneService);
      const hover = getService(IHoverService);
      const hoverData = hover.status.data;

      if (
        !dragSceneService.isLeftMouseDownNoMovingNoScene(event)
        || (
          !hoverData
          || hoverData.kind !== EntityKind.PartPin
        )
      ) {
        return;
      }

      const state = getService(IStateCoreService);
      const connection = getService(IConnectionService);
      const map = getService(IMapHashService);
      const part = state.getPart(hoverData.id);
      const pin = getPartPin(part, hoverData.pin);
      const line = createLineByPath([pin.position]);
      const search = createSearcher({
        lineId: line.id,
        start: pin.position,
        direction: pin.direction,
        painter: painterStateGetter(hover, state, connection, map),
        hook: createSearchHook(getService(IVariableObserverService)),
      });

      // 创建导线草稿
      state.draft(({ lines }) => {
        lines.push(line);
      });

      // 触发创建导线事件
      dragSceneService.trigger(CreateLineSceneName, {
        line,
        search,
        event,
        start: {
          id: hoverData.id,
          pin: hoverData.pin,
          tag: createPartReferenceTag(part),
        },
      });
    },
    onMouseUp(event) {
      const dragSceneService = getService(IDragSceneService);
      if (dragSceneService.isLeftMouseUpNoMovingHasScene(event, CreateLineSceneName)) {
        dragSceneService.triggerEnd(CreateLineSceneName, { event });
      }
    },
  });

  // 创建的拖动场景
  registerHook(IDragSceneHook, {
    name: CreateLineSceneName,
    afterStart({ line, start, search, event }: StartPayloadType) {
      const logger = getService(ILoggerService);

      if (!event) {
        const msg = '创建导线事件触发时，必须传入鼠标事件';
        logger.error(LoggerName, msg);
        throw new Error(msg);
      }

      const varService = getService(IVariableObserverService);

      // 打印日志
      logger.info(
        LoggerName,
        '开始创建导线',
        `从器件 ${start.tag} 第 ${start.pin} 引脚开始`,
        `新导线编号 ${line.id}`,
      );
      // 选中导线
      getService(ISelectService).set(line.id);
      // 设置鼠标样式
      getService(ICursorService).set(ICursorKind.DrawLine);
      // 初始化导线路径和初始化样式
      setSearchResult(varService, [
        ...search(event.positionInDrawer),
        // 作为起点的器件引脚固定缩小
        {
          id: start.id,
          pin: start.pin,
          style: PIN_DRAW_FIXED_STYLE,
        },
        // 导线起点固定缩小
        {
          id: line.id,
          pin: 0,
          style: PIN_DRAW_FIXED_STYLE,
        },
      ]);
    },
    onDragMove({ positionInDrawer, movement }, { search }: StartPayloadType) {
      setSearchResult(getService(IVariableObserverService), search(positionInDrawer, movement));
    },
    beforeEnd({ line, search, start }: StartPayloadType) {
      const mapHash = getService(IMapHashService);
      const collision = getService(ICollisionService);
      const logger = getService(ILoggerService);
      const state = getService(IStateCoreService);
      const connection = getService(IConnectionService);
      const cursor = getService(ICursorService);
      const varService = getService(IVariableObserverService);
      const select = getService(ISelectService);

      /** 导线路径 */
      const linePath = search.getSearchPath().map((point) => point.round(20));
      /** 导线终点 */
      const endPoint = linePath[linePath.length - 1];

      // 导线路径不可能小于等于1
      if (linePath.length <= 1) {
        logger.error(LoggerName, '导线路径计算错误：', linePath.join(' -> '));
        state.dropDraft();
        return;
      }

      const { commitState: { data: { parts, lines } }, commit } = state;
      const endInPartPin = findPartPin(endPoint, parts);
      const endInLinePinAndIndex = findLinePinAndIndex(endPoint, lines);
      // 不沿用旧导线编号，是为了规避旧编号各种临时状态带来的干扰
      const newLineData: LineStructuredData = createLineByPath(linePath);

      // 终点在器件引脚上
      if (endInPartPin) {
        const connections = connection.getConnections(endInPartPin.id, endInPartPin.pin);

        if (connections.length > 0) {
          logger.error(LoggerName, '导线终点在器件引脚上，但引脚已连接', endInPartPin.tag, endInPartPin.pin);
          state.dropDraft();
          return;
        }

        // 设置连接关系
        connection.createConnection(start.id, start.pin, newLineData.id, 0);
        connection.createConnection(newLineData.id, 1, endInPartPin.id, endInPartPin.pin);
        // 设置导线图纸数据
        mapHash.setMark(newLineData);
        // 设置碰撞数据
        collision.setEntity(newLineData);
        // 提交新导线
        commit({
          name: `创建导线 ${line.id}`,
          description: `创建导线 ${line.id}，终点在器件引脚上`,
          patch({ lines }) {
            lines.push(newLineData);
          },
        });
      }
      // 终点在导线上
      else if (endInLinePinAndIndex) {
        if (Array.isArray(endInLinePinAndIndex)) {
          // 在空导线引脚上，合并导线
          if (endInLinePinAndIndex.length === 1) {
            const { id: mergedLineId, pin: mergedLinePin } = endInLinePinAndIndex[0];
            const mergedLine = lines.find((item) => item.id === mergedLineId);

            if (!mergedLine) {
              throw new Error(`合并的导线 ${mergedLineId} 不存在`);
            }

            const mergedLineConnection = connection.getConnections(mergedLineId, 1 - mergedLinePin);

            // 因为要顺序连接，所以这里需要反转
            if (mergedLinePin === 1) {
              mergedLine.path.reverse();
            }

            // 合并，并去除重复节点
            newLineData.path = removeRepeat([
              ...newLineData.path,
              ...mergedLine.path,
            ]);

            // 移除旧导线相关数据
            connection.removeDevice(mergedLineId);
            collision.removeEntity(mergedLineId);
            mapHash.removeMark(mergedLine);
            // 设置新导线相关数据
            connection.createConnection(newLineData.id, 0, start.id, start.pin);
            connection.createConnections(newLineData.id, 1, mergedLineConnection);
            collision.setEntity(newLineData);
            mapHash.setMark(newLineData);

            // 提交新导线，且删除旧导线
            commit({
              name: `创建导线 ${line.id}`,
              description: `创建导线 ${line.id}，并合并导线 ${mergedLineId}`,
              patch({ lines }) {
                lines.push(newLineData);
                lines.splice(lines.findIndex((item) => item.id === mergedLineId), 1);
              },
            });
          }
          // 在导线交错节点上，连接导线
          else {
            // 设置导线相关数据
            connection.createConnection(newLineData.id, 0, start.id, start.pin);
            connection.createConnections(newLineData.id, 1, endInLinePinAndIndex);
            collision.setEntity(newLineData);
            mapHash.setMark(newLineData);

            // 提交新导线，且删除旧导线
            commit({
              name: `创建导线 ${line.id}`,
              description: `创建导线 ${line.id}`,
              patch({ lines }) {
                lines.push(newLineData);
              },
            });
          }
        }
        // 在导线线段上，分割导线
        else {
          const { id: splitLineId, index: splitIndex } = endInLinePinAndIndex;
          const splitLine = lines.find((item) => item.id === splitLineId);

          if (!splitLine) {
            throw new Error(`拆分的导线 ${splitLine} 不存在`);
          }

          const splitLine1Path = splitLine.path.slice(0, splitIndex + 1);
          const splitLine2Path = splitLine.path.slice(splitIndex + 1);

          splitLine1Path.push(endPoint);
          splitLine2Path.unshift(endPoint);

          const splitLine1 = createLineByPath(splitLine1Path);
          const splitLine2 = createLineByPath(splitLine2Path);
          const crossConnections = [
            {
              id: splitLineId,
              pin: 1,
            },
            {
              id: splitLineId,
              pin: 0,
            },
            {
              id: newLineData.id,
              pin: 1,
            },
          ];

          splitLine1.path = removeRepeat(splitLine1.path);
          splitLine2.path = removeRepeat(splitLine2.path);

          // 新导线起点的连接是旧导线的起点连接
          connection.createConnections(splitLine1.id, 0, connection.getConnections(splitLineId, 0));
          // 新导线终点的连接是旧导线的终点连接
          connection.createConnections(splitLine2.id, 1, connection.getConnections(splitLineId, 1));
          // 设置三个导线的连接
          connection.createConnections(splitLine1.id, 1, crossConnections);
          connection.createConnections(splitLine2.id, 0, crossConnections);
          connection.createConnections(newLineData.id, 1, crossConnections);
          connection.createConnection(newLineData.id, 0, start.id, start.pin);

          // 移除旧导线相关信息
          connection.removeDevice(splitLineId);
          collision.removeEntity(splitLineId);
          mapHash.removeMark(splitLine);
          // 设置新导线相关信息
          collision.setEntity(splitLine1);
          mapHash.setMark(splitLine1);
          collision.setEntity(splitLine2);
          mapHash.setMark(splitLine2);
          collision.setEntity(newLineData);
          mapHash.setMark(newLineData);

          // 提交新导线，且删除旧导线
          commit({
            name: `创建导线 ${line.id}`,
            description: `创建导线 ${line.id}，并拆分旧导线 ${splitLine.id}，拆分出来的导线为 ${splitLine1.id} 和 ${splitLine2.id}`,
            patch({ lines }) {
              lines.push(newLineData);
              lines.push(splitLine1);
              lines.push(splitLine2);
              lines.splice(lines.findIndex((item) => item.id === splitLineId), 1);
            },
          });
        }
      }
      // 终点在空位置
      else {
        // 空位置需要设置起点的连接关系
        connection.createConnection(newLineData.id, 0, start.id, start.pin);
        // 设置导线图纸数据
        mapHash.setMark(newLineData);
        // 设置碰撞数据
        collision.setEntity(newLineData);
        // 提交新导线
        commit({
          name: `创建导线 ${line.id}`,
          description: `创建导线 ${line.id}，终点在器件引脚上`,
          patch({ lines }) {
            lines.push(newLineData);
          },
        });
      }

      // 清除鼠标样式
      cursor.clear();
      // 清除临时变量
      varService.clearVariable();
      // 设置选中
      select.set(newLineData.id);
      // 打印结束日志
      logger.info(LoggerName, '结束创建导线', newLineData.id);
    },
  });
});
