import { Point } from '@circuit/algorithm';
import { ILifeCycleHook } from '@circuit/shared';
import React, { RefObject } from 'react';
import { definePlugin, Watcher } from '../../../context';
import {
  IMapCoordinateService,
  ICursorService,
  IDragSceneService,
  IEventListenerHook,
  IDragSceneHook,
  IViewLayerHook,
  IPainterConfigurationService,
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
  registerHook(IEventListenerHook, {
    order: 0,
    onMouseDown(event) {
      // 非左键或者鼠标按下事件不处理
      if (event.button !== 0 || event.type !== 'mousedown') {
        return;
      }

      const dragSceneService = getService(IDragSceneService);
      const configurationService = getService(IPainterConfigurationService);

      // 当前场景不为空或者不是移动模式时不处理
      if (dragSceneService.isDragging() || !configurationService.movePainterMode.data) {
        return;
      }

      dragSceneService.trigger(DragSceneName, { event });
    },
    onMouseUp(event) {
      const configuration = getService(IPainterConfigurationService);
      const dragSceneService = getService(IDragSceneService);

      if (
        // 不是移动模式时直接停止
        !configuration.movePainterMode.data
        // 鼠标抬起时场景存在
        || dragSceneService.isLeftMouseUpNoMovingHasScene(event, DragSceneName)
      ) {
        dragSceneService.triggerEnd(DragSceneName, { event });
      }
    },
  });

  // 注册滚轮缩放事件
  registerHook(IEventListenerHook, {
    order: 1,
    capture: true,
    passive: true,
    onWheel(event) {
      const dragSceneService = getService(IDragSceneService);

      // 当前场景不为空时不处理
      if (dragSceneService.isDragging()) {
        return;
      }

      const mousePosition = service.screenToViewPosition(new Point(event.pageX, event.pageY));
      const { scale, position } = service;
      const oldScale = scale.data;
      const oldPosition = position.data;

      /**
       * 双指缩放
       */
      const isTouchpadZoom = event.ctrlKey;

      /**
       * 鼠标滚轮
       *
       * @description 鼠标滚轮的判断基于以下特征：
       * 1. deltaMode 为 1 或 2（行或页单位）
       * 2. 或者 deltaMode 为 0 但只有 deltaY 有较大值
       * 3. 且不是 Ctrl 键（Ctrl+滚轮通常是缩放）
       */
      const isMouseWheel = (
        !event.ctrlKey
        && (
          event.deltaMode === 1
          || event.deltaMode === 2
          || (
            event.deltaMode === 0
            && event.deltaX === 0
            && Math.abs(event.deltaY) > 80
          )
        )
      );

      /**
       * 触摸板双指移动
       *
       * @description 触摸板平移的特征：
       * 1. deltaMode 为 0（像素单位）
       * 2. 有 deltaX 或 deltaY 值
       * 3. 不是 Ctrl 键
       * 4. 不是鼠标滚轮
       */
      const isTouchpadPan = !event.ctrlKey
        && event.deltaMode === 0
        && (event.deltaX !== 0 || event.deltaY !== 0)
        && !isMouseWheel;

      // 触摸板双指移动 - 平移画布
      if (isTouchpadPan) {
        service.setPosition(oldPosition.add([event.deltaX, event.deltaY], -1));
        return;
      }

      // 触摸板双指缩放或鼠标滚轮缩放
      if (isTouchpadZoom || isMouseWheel) {
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
  registerHook(IDragSceneHook, {
    name: DragSceneName,
    onDragMove(event) {
      service.setPosition(service.position.data.add(event.movement));
    },
    afterStart() {
      const cursorService = getService(ICursorService);
      cursorService.set(cursorService.kind.Dragging);
    },
    afterEnd() {
      const cursorService = getService(ICursorService);
      const configurationService = getService(IPainterConfigurationService);

      if (configurationService.movePainterMode.data) {
        cursorService.set(cursorService.kind.Drag);
      }
      else {
        cursorService.clear();
      }
    },
  });

  // 注册画布监听元素
  registerHook(IViewLayerHook, {
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

  function getElementPosition(element: HTMLCanvasElement | null) {
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

    // 返回最新画布视口坐标
    return new Point(offsetLeft, offsetTop);
  }

  function updateAndSerPainterPosition(element: HTMLCanvasElement | null) {
    const oldPosition = Point.from(painterPosition);
    const newPosition = getElementPosition(element);
    const diffPosition = newPosition.add(oldPosition, -1);

    // 用画布视口坐标的差值反向移动画布，保持画布在页面中的位置不变
    if (!diffPosition.isZero()) {
      painterPosition = newPosition;
      service.setPosition(service.position.data.add(diffPosition, -1));
    }
  }

  function startObserving() {
    if (!scaleRef.current) {
      return;
    }

    // 监听画布元素变化
    resizeObserver = new ResizeObserver(() => {
      updateAndSerPainterPosition(scaleRef.current);
    });

    // 监听 DOM 变化
    mutationObserver = new MutationObserver(() => {
      updateAndSerPainterPosition(scaleRef.current);
    });

    // 监听滚动事件
    window.addEventListener(
      'scroll',
      () => updateAndSerPainterPosition(scaleRef.current),
      { passive: true },
    );

    // 监听窗口大小变化
    window.addEventListener(
      'resize',
      () => updateAndSerPainterPosition(scaleRef.current),
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

    // 初始化画布位置
    painterPosition = getElementPosition(scaleRef.current);
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
  registerHook(ILifeCycleHook, {
    onCreated() {
      startObserving();
    },
  });

  // 注册图纸坐标服务
  registerService(IMapCoordinateService, service);

  // 卸载器
  return () => {
    service.scale.destroy();
    service.position.destroy();
    stopObserving();
  };
});
