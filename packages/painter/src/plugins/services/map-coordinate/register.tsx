import { Point } from '@circuit/algorithm';
import { LIFE_CYCLE_HOOK } from '@circuit/shared';
import React, { RefObject } from 'react';
import { definePlugin, Watcher } from '../../../context';
import {
  IMapCoordinateService,
  CURSOR_SERVICE,
  DRAG_SCENE_SERVICE,
  MAP_COORDINATE_SERVICE,
  EVENT_LISTENER_HOOK,
  DRAG_SCENE_HOOK,
  VIEW_LAYER_HOOK,
  PAINTER_CONFIGURATION_SERVICE,
} from '../../../types';

definePlugin(({ getService, registerHook, registerService, getTestConfig }) => {
  let painterPosition = getTestConfig<Point>('painterPosition') ?? new Point(0, 0);
  let resizeObserver: ResizeObserver | null = null;
  let mutationObserver: MutationObserver | null = null;

  /** 拖动背景场景名称 */
  const DragSceneName = 'DragBackground';
  /** 缩放步长 */
  const SCALE_STEP = 1.05;
  /** 最大缩放比例 */
  const SCALE_MAX = 2;
  /** 最小缩放比例 */
  const SCALE_MIN = 0.4;
  /** 缩放交互引用元素 */
  const scaleRef: RefObject<HTMLCanvasElement | null> = { current: null };
  /** 图纸坐标服务 */
  const service: IMapCoordinateService = {
    ScaleMin: SCALE_MIN,
    ScaleMax: SCALE_MAX,
    ScaleStep: SCALE_STEP,
    scale: new Watcher(1),
    position: new Watcher(new Point(0, 0)),
    zoomIn() {
      this.setScale(this.scale.data * SCALE_STEP);
    },
    zoomOut() {
      this.setScale(this.scale.data / SCALE_STEP);
    },
    setScale(scale) {
      this.scale.setData(this.clampScale(scale));
    },
    clampScale(scale) {
      if (scale < SCALE_MIN) {
        return SCALE_MIN;
      }

      if (scale > SCALE_MAX) {
        return SCALE_MAX;
      }

      // 缩放到 1 附近时进行纠正操作
      if (Math.abs(scale - 1) < 1e-5) {
        return 1;
      }

      return scale;
    },
    setPosition(position) {
      if (!this.position.data.isEqual(position)) {
        this.position.setData(position);
      }
    },
    screenToViewPosition(position) {
      return position.add(painterPosition, -1);
    },
    screenToMapPosition(position) {
      return this.viewToMapPosition(this.screenToViewPosition(position));
    },
    viewToMapPosition(input) {
      const { scale: { data: scale }, position: { data: position } } = this;
      return input.add(position, -1).mul(scale, -1);
    },
    mapToViewPosition(mapCoordinate) {
      const { scale: { data: scale }, position: { data: position } } = this;
      return mapCoordinate.mul(scale).add(position);
    },
    mapToScreenPosition(position) {
      return this.viewToScreenPosition(this.mapToViewPosition(position));
    },
    viewToScreenPosition(position) {
      return position.add(painterPosition);
    },
    screenToViewRect(rect) {
      const position = this.screenToViewPosition(Point.from([rect.x, rect.y]));
      return {
        x: position[0],
        y: position[1],
        width: rect.width,
        height: rect.height,
      };
    },
    screenToMapRect(rect) {
      return this.viewToMapRect(this.screenToViewRect(rect));
    },
    viewToMapRect(rect) {
      const position = this.viewToMapPosition(Point.from([rect.x, rect.y]));
      const scale = this.scale.data;
      return {
        x: position[0],
        y: position[1],
        width: rect.width / scale,
        height: rect.height / scale,
      };
    },
    mapToViewRect(rect) {
      const position = this.mapToViewPosition(Point.from([rect.x, rect.y]));
      const scale = this.scale.data;
      return {
        x: position[0],
        y: position[1],
        width: rect.width * scale,
        height: rect.height * scale,
      };
    },
    mapToScreenRect(rect) {
      return this.viewToScreenRect(this.mapToViewRect(rect));
    },
    viewToScreenRect(rect) {
      const position = this.viewToScreenPosition(Point.from([rect.x, rect.y]));
      return {
        x: position[0],
        y: position[1],
        width: rect.width,
        height: rect.height,
      };
    },
    getCurrentViewportRect() {
      return {
        x: 0,
        y: 0,
        ...this.getCurrentViewportSize(),
      };
    },
    getCurrentViewportSize() {
      return {
        width: scaleRef.current?.clientWidth ?? 0,
        height: scaleRef.current?.clientHeight ?? 0,
      };
    },
  };

  // 注册鼠标拖动启动事件
  registerHook(EVENT_LISTENER_HOOK, {
    order: 0,
    onMouseDown(event) {
      // 非左键或者鼠标按下事件不处理
      if (event.button !== 0 || event.type !== 'mousedown') {
        return;
      }

      const dragSceneService = getService(DRAG_SCENE_SERVICE);
      const configurationService = getService(PAINTER_CONFIGURATION_SERVICE);

      // 当前场景不为空或者不是移动模式时不处理
      if (dragSceneService.size !== 0 || !configurationService.movePainterMode.data) {
        return;
      }

      dragSceneService.trigger(DragSceneName, { event });
    },
  });

  // 注册滚轮缩放事件
  registerHook(EVENT_LISTENER_HOOK, {
    order: 1,
    capture: true,
    passive: true,
    onWheel(event) {
      const dragSceneService = getService(DRAG_SCENE_SERVICE);

      // 当前场景不为空时不处理
      if (dragSceneService.isDragging.data) {
        return;
      }

      const mousePosition = service.screenToViewPosition(new Point(event.pageX, event.pageY));
      const { scale, position } = service;
      const oldScale = scale.data;
      const oldPosition = position.data;

      // 是否为触摸板双指移动（通常 deltaMode 为 0 且 deltaX/deltaY 较小）
      const isTouchpadPan = event.deltaMode === 0 &&
        Math.abs(event.deltaX) < 50 &&
        Math.abs(event.deltaY) < 50 &&
        !event.ctrlKey;

      // 是否为触摸板双指缩放（通常 deltaMode 为 0 且 deltaY 较大）
      const isTouchpadZoom = event.deltaMode === 0 &&
        Math.abs(event.deltaY) >= 50 &&
        !event.ctrlKey;

      // 检测是否为鼠标滚轮缩放（通常 deltaMode 为 1 或 2）
      const isMouseWheel = event.deltaMode === 1 || event.deltaMode === 2;

      // 触摸板双指移动 - 平移画布
      if (isTouchpadPan) {
        service.setPosition(oldPosition.add([event.deltaX, event.deltaY], -1));
        return;
      }

      // 触摸板双指缩放或鼠标滚轮缩放
      if (isTouchpadZoom || isMouseWheel || event.ctrlKey) {
        if (event.deltaY > 0) {
          service.zoomOut();
        }
        else if (event.deltaY < 0) {
          service.zoomIn();
        }

        service.position.setData(
          oldPosition
            .add(mousePosition, -1)
            .mul(scale.data / oldScale)
            .add(mousePosition)
            .round(1),
        );
      }
    },
  });

  // 注册鼠标拖动背景事件
  registerHook(DRAG_SCENE_HOOK, {
    name: DragSceneName,
    isEnd(event) {
      const configuration = getService(PAINTER_CONFIGURATION_SERVICE);
      const dragSceneService = getService(DRAG_SCENE_SERVICE);

      // 不是移动模式时直接停止
      if (!configuration.movePainterMode.data) {
        return true;
      }

      return dragSceneService.isLeftMouseUpNoMovingHasScene(event, DragSceneName);
    },
    onDragMove(event) {
      service.setPosition(service.position.data.add(event.movement));
    },
    afterStart() {
      const cursorService = getService(CURSOR_SERVICE);
      cursorService.set(cursorService.kind.Dragging);
    },
    afterEnd() {
      const cursorService = getService(CURSOR_SERVICE);
      const configurationService = getService(PAINTER_CONFIGURATION_SERVICE);

      if (configurationService.movePainterMode.data) {
        cursorService.set(cursorService.kind.Drag);
      }
      else {
        cursorService.clear();
      }
    },
  });

  // 注册画布监听元素
  registerHook(VIEW_LAYER_HOOK, {
    name: 'PainterScaleDom',
    order: 0,
    Render() {
      return (
        <canvas
          ref={scaleRef}
          style={{
            pointerEvents: 'none',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000,
          }}
        />
      );
    },
  });

  function updateElementPosition(element: HTMLCanvasElement | null) {
    if (!element) {
      throw new Error('画布监听元素不存在');
    }

    const rect = element.getBoundingClientRect();

    let offsetTop = rect.top;
    let offsetLeft = rect.left;
    let current: HTMLElement | null = element;

    // 向上遍历直到文档根
    while (current && current !== document.documentElement) {
      // 获取当前元素的偏移父元素
      const parent = current.offsetParent as HTMLElement;

      if (!parent) {
        break;
      }

      // 加上父元素的边框和滚动偏移（如果有）
      const parentStyle = window.getComputedStyle(parent);
      offsetTop += parent.scrollTop - parseInt(parentStyle.borderTopWidth, 10);
      offsetLeft += parent.scrollLeft - parseInt(parentStyle.borderLeftWidth, 10);
      current = parent;
    }

    // 最后加上窗口滚动偏移
    offsetTop += window.pageYOffset;
    offsetLeft += window.pageXOffset;

    // 计算相对于页面左上角绝对坐标
    painterPosition = new Point(offsetLeft, offsetTop);
  }

  function startObserving() {
    if (!scaleRef.current) {
      return;
    }

    // 监听画布元素变化
    resizeObserver = new ResizeObserver(() => {
      updateElementPosition(scaleRef.current);
    });

    // 监听 DOM 变化
    mutationObserver = new MutationObserver(() => {
      updateElementPosition(scaleRef.current);
    });

    // 监听滚动事件
    window.addEventListener(
      'scroll',
      () => updateElementPosition(scaleRef.current),
      { passive: true },
    );

    // 监听窗口大小变化
    window.addEventListener(
      'resize',
      () => updateElementPosition(scaleRef.current),
      { passive: true },
    );

    // 开始观察画布元素
    resizeObserver.observe(scaleRef.current);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  function stopObserving() {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
  }

  // 注册生命周期
  registerHook(LIFE_CYCLE_HOOK, {
    afterPainterMounted() {
      startObserving();
    },
  });

  // 注册图纸坐标服务
  registerService(MAP_COORDINATE_SERVICE, service);

  // 卸载器
  return () => {
    service.scale.destroy();
    service.position.destroy();
    stopObserving();
  };
});
