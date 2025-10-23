import { Point } from '@circuit/algorithm';
import { ILoggerService } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import {
  IHoverService,
  IEventListenerHook,
  IMapCoordinateService,
  ICollisionService,
  EntityKind,
  Entity,
} from '../../../types';

const LoggerName = '悬停服务';

definePlugin(({ registerService, registerHook, getService }) => {
  let positionInDrawer = Point.Zero();

  /** Hover 中的实体排序 */
  const sortEntitiesByPriority = (entities: Entity[]): Entity[] => {
    if (entities.length <= 1) {
      return entities;
    }

    return entities.sort((pre, next) => {
      const prePriority = entityKindPriority[pre.kind];
      const nextPriority = entityKindPriority[next.kind];

      if (prePriority !== nextPriority) {
        return prePriority - nextPriority;
      }

      // 如果类别相同，按照 id 字符串比较
      return pre.id.localeCompare(next.id);
    });
  };

  /** 公共查询逻辑 */
  const queryEntitiesAt = (position: Point): Entity[] => {
    const collisionService = getService(ICollisionService);
    const collision = collisionService.pointInEntities(position);
    return sortEntitiesByPriority(collision);
  };

  const service: IHoverService = {
    current: new Watcher<Entity | undefined>(undefined),
    updateCurrent() {
      const entities = queryEntitiesAt(positionInDrawer);
      const logger = getService(ILoggerService);

      if (entities.length === 0) {
        service.current.setData(undefined);
        logger.debug(LoggerName, '没有悬停实体');
        return;
      }

      // 设置优先级最高的实体为当前悬停状态
      service.current.setData(entities[0]);
      logger.debug(LoggerName, '悬停实体', getEntityText(entities[0]));
    },
    getStackAt(position?: Point): Entity[] {
      return queryEntitiesAt(position ?? positionInDrawer);
    },
  };

  /** EntityKind 优先级 */
  const entityKindPriority = {
    [EntityKind.LinePin]: 0,
    [EntityKind.Line]: 1,
    [EntityKind.PartPin]: 2,
    [EntityKind.Part]: 3,
  };

  const getEntityText = (entity: Entity) => {
    if (entity.kind === EntityKind.Part) {
      return `元件 ${entity.id}`;
    }
    else if (entity.kind === EntityKind.Line) {
      return `导线 ${entity.id} 第 ${entity.index} 段`;
    }
    else if (entity.kind === EntityKind.PartPin) {
      return `元件 ${entity.id} 引脚 ${entity.pin}`;
    }
    else {
      return `导线 ${entity.id} ${entity.pin === 0 ? '起点' : '终点'}`;
    }
  };

  registerHook(IEventListenerHook, {
    order: 1,
    onMouseMove(event) {
      const mapService = getService(IMapCoordinateService);
      positionInDrawer = mapService.screenToMapPosition(new Point(event.pageX, event.pageY));
      service.updateCurrent();
    },
  });

  // 注册鼠标悬停服务
  registerService(IHoverService, service);

  return () => {
    service.current.destroy();
  };
});
