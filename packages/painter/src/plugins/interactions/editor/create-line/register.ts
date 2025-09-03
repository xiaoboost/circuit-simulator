import { Point, type PathWithPoint } from '@circuit/algorithm';
import { createLine, getPartPin, createPartReferenceTag } from '@circuit/electronics';
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
  IMapHashMarkService,
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
  // 注册创建导线场景
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
      const map = getService(IMapHashMarkService);
      const part = state.getPart(hoverData.id);
      const pin = getPartPin(part, hoverData.pin);
      const line = createLine(pin.position);
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
    isEnd(event) {
      return getService(IDragSceneService)
        .isLeftMouseUpNoMovingHasScene(event, CreateLineSceneName);
    },
    afterEnd({ line, search, start }: StartPayloadType) {
      const mapHash = getService(IMapHashMarkService);
      const collision = getService(ICollisionService);
      const logger = getService(ILoggerService);
      const state = getService(IStateCoreService);
      const connection = getService(IConnectionService);
      const cursor = getService(ICursorService);
      const varService = getService(IVariableObserverService);

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
      const newLineData: LineStructuredData = {
        id: line.id,
        path: linePath,
      };

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
      }
      // 终点在导线上
      // 终点在空位置
      else {
        // 空位置需要设置起点的连接关系
        connection.createConnection(start.id, start.pin, newLineData.id, 0);
      }

      // TODO: 放下的时候，导线节点会闪一下半径 7，感觉可能是时序问题，需要检查一下

      // 清除鼠标样式
      cursor.clear();
      // 清除临时变量
      varService.clearVariable();
      // 设置导线图纸数据
      mapHash.setLineMark(newLineData);
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
      // 打印结束日志
      logger.info(LoggerName, '结束创建导线', newLineData.id);
    },
  });
});
