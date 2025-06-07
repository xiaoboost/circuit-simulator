import { useEffect } from 'react';
import { usePainterService, usePainterHook } from '../../../context';
import {
  PAINTER_SERVICE,
  MAP_HASH_SERVICE,
  LOGGER_SERVICE,
  COLLISION_SERVICE,
  CONNECTION_SERVICE,
  EVENT_BUS_SERVICE,
  CACHE_SERVICE,
  LIFE_CYCLE_HOOK,
} from '../../../types';
import { type PainterProps } from '../../wrapper';

const painterMethods = [
  {
    serviceName: 'commit',
    propName: 'onCommit',
  },
  {
    serviceName: 'undo',
    propName: 'onUndo',
  },
  {
    serviceName: 'redo',
    propName: 'onRedo',
  },
  {
    serviceName: 'draft',
    propName: 'onDraft',
  },
  {
    serviceName: 'dropDraft',
    propName: 'onDropDraft',
  },
] as const;
const cacheMethods = [
  {
    serviceName: 'get',
    propName: 'onReadCache',
  },
  {
    serviceName: 'set',
    propName: 'onSaveCache',
  },
] as const;
const propKeys = [
  {
    key: 'parts' as const,
    default: [],
  },
  {
    key: 'lines' as const,
    default: [],
  },
  {
    key: 'canUndo' as const,
    default: false,
  },
  {
    key: 'canRedo' as const,
    default: false,
  },
];

/** 画布参数桥接 */
export function usePainterAdapter(props: PainterProps) {
  const painterService = usePainterService(PAINTER_SERVICE);
  const mapService = usePainterService(MAP_HASH_SERVICE);
  const collisionService = usePainterService(COLLISION_SERVICE);
  const logger = usePainterService(LOGGER_SERVICE);
  const connectionService = usePainterService(CONNECTION_SERVICE);
  const eventBus = usePainterService(EVENT_BUS_SERVICE);
  const cacheService = usePainterService(CACHE_SERVICE);
  const lifeCycleHooks = usePainterHook(LIFE_CYCLE_HOOK);

  for (const { propName, serviceName } of painterMethods) {
    useEffect(() => {
      if (painterService) {
        painterService[serviceName] = props?.[propName] ?? (painterService[serviceName] as any);
      }
    }, [props?.[propName], painterService]);
  }

  for (const { propName, serviceName } of cacheMethods) {
    useEffect(() => {
      if (cacheService) {
        cacheService[serviceName] = props?.[propName] ?? (cacheService[serviceName] as any);
      }
    }, [props?.[propName], cacheService]);
  }

  for (const { key, default: defaultVal } of propKeys) {
    useEffect(() => {
      if (painterService) {
        painterService[key].setData(props[key] as any ?? defaultVal);
      }
    }, [props[key], painterService]);
  }

  // 首次进来需要初始化
  useEffect(() => {
    const { parts, lines } = props;
    const { setPartMark, setLineMark } = mapService;

    for (const part of parts ?? []) {
      setPartMark(part);
      collisionService.setEntity(part);
    }

    for (const line of lines ?? []) {
      setLineMark(line);
      collisionService.setEntity(line);
    }

    // 初始化连接关系
    connectionService.createConnectionFromData(props);

    // 运行初始化钩子
    Promise.all(lifeCycleHooks.map((item) => {
      return item.beforeMounted?.();
    }))
      .then(() => {
        // 初始化完毕
        props.onReady?.();
        // 启动画布
        painterService.isReady.setData(true);
        // 记录日志
        logger.info('画布', '图纸加载完成');
      });
  }, []);

  // 订阅选中事件
  useEffect(() => {
    return eventBus.observe('SelectElectronics', (data) => props?.onSelect?.(data));
  }, [props.onSelect]);
}
