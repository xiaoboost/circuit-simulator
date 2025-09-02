import { type Rect, Point } from '@circuit/algorithm';
import { LOGGER_SERVICE, STATE_CORE_SERVICE } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import {
  VIEWPORT_SERVICE,
  IViewportService,
  IViewport,
  MAP_COORDINATE_SERVICE,
  COLLISION_SERVICE,
} from '../../../types';

const LoggerName = '视图服务';

definePlugin(({ registerService, getService }) => {
  let animationId: number | null = null;
  let previousViewState: IViewport | null = null;

  function easeTnOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function calculateRectFocus(
    rect: Rect,
    padding: number,
    scaleService = getService(MAP_COORDINATE_SERVICE),
  ) {
    const { width: viewportWidth, height: viewportHeight } = scaleService.getCurrentViewportRect();
    const scaleX = (viewportWidth - padding * 2) / rect.width;
    const scaleY = (viewportHeight - padding * 2) / rect.height;
    const finalScale = scaleService.clampScale(Math.min(scaleX, scaleY));
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const viewCenterX = viewportWidth / 2;
    const viewCenterY = viewportHeight / 2;
    const position = Point.from([
      viewCenterX - centerX * finalScale,
      viewCenterY - centerY * finalScale,
    ]);

    return { position, scale: finalScale };
  }

  function animateToPosition(
    targetPosition: Point,
    targetScale: number,
    duration: number,
    scaleService = getService(MAP_COORDINATE_SERVICE),
  ) {
    if (duration <= 0) {
      scaleService.setScale(targetScale);
      scaleService.setPosition(targetPosition);
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const startTime = performance.now();
      const startPosition = Point.from(scaleService.position.data);
      const startScale = scaleService.scale.data;

      service.isAnimating.setData(true);

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeTnOutCubic(progress);
        const currentPosition = startPosition.add(
          targetPosition.add(startPosition, -1).mul(easeProgress),
        );
        const currentScale = startScale + (targetScale - startScale) * easeProgress;

        scaleService.setScale(currentScale);
        scaleService.setPosition(currentPosition);

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        }
        else {
          animationId = null;
          service.isAnimating.setData(false);
          resolve();
        }
      };

      animationId = requestAnimationFrame(animate);
    });
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    service.isAnimating.setData(false);
  }

  function captureCurrentViewState(scaleService = getService(MAP_COORDINATE_SERVICE)) {
    previousViewState = {
      position: Point.from(scaleService.position.data),
      scale: scaleService.scale.data,
    };
  }

  const service: IViewportService = {
    isAnimating: new Watcher(false),
    async focusOnElectronic(id, padding = 40, duration = 300) {
      stopAnimation();

      const logger = getService(LOGGER_SERVICE);
      const collisionService = getService(COLLISION_SERVICE);
      const rect = collisionService.getEntityBoundingBox(id);

      logger.info(LoggerName, `试图聚焦到元件: ${id}`);

      if (!rect) {
        logger.error(LoggerName, '元件边框计算错误');
        return false;
      }

      return service.focusOnRect(rect, padding, duration);
    },
    async focusOnPosition(position, type, scale, duration = 300) {
      stopAnimation();

      const logger = getService(LOGGER_SERVICE);
      const mapCoordinateService = getService(MAP_COORDINATE_SERVICE);
      const inputScale = scale ?? mapCoordinateService.scale.data ?? 1;
      const targetScale = mapCoordinateService.clampScale(inputScale);

      logger.info(LoggerName, `试图聚焦到位置: ${position[0]}, ${position[1]}, 类型: ${type}, 缩放: ${scale}`);

      let targetPosition: Point;

      // center 模式：将指定位置移动到视口中心
      if (type === 'center') {
        const viewportSize = mapCoordinateService.getCurrentViewportRect();
        targetPosition = position.mul(-targetScale).add([
          viewportSize.width / 2,
          viewportSize.height / 2,
        ]);
      }
      // leftTop 模式：将指定位置移动到视口左上角
      else if (type === 'leftTop') {
        targetPosition = position.mul(-targetScale);
      }
      // rightTop 模式：将指定位置移动到视口右上角
      else {
        const viewportSize = mapCoordinateService.getCurrentViewportRect();
        targetPosition = Point.from([
          viewportSize.width - position[0] * targetScale,
          -position[1] * targetScale,
        ]);
      }

      await animateToPosition(targetPosition, targetScale, duration, mapCoordinateService);

      return true;
    },
    async focusOnRect(rect, padding = 40, duration = 300) {
      stopAnimation();

      const logger = getService(LOGGER_SERVICE);
      const mapCoordinateService = getService(MAP_COORDINATE_SERVICE);
      const { position, scale } = calculateRectFocus(rect, padding, mapCoordinateService);

      logger.info(LoggerName, `试图聚焦到矩形: ${rect.x}, ${rect.y}, ${rect.width}, ${rect.height}`);

      captureCurrentViewState(mapCoordinateService);
      await animateToPosition(position, scale, duration, mapCoordinateService);

      return true;
    },
    async fitPainter(padding, duration = 300) {
      stopAnimation();

      const logger = getService(LOGGER_SERVICE);
      const collision = getService(COLLISION_SERVICE);
      const { state: { data: { parts, lines } } } = getService(STATE_CORE_SERVICE);

      if (parts.length === 0 && lines.length === 0) {
        logger.warn(LoggerName, '没有实体，无法执行适应画布操作');
        return false;
      }

      const rect = collision.getEntityBoundingBox(
        ...parts.map((part) => part.id),
        ...lines.map((line) => line.id),
      );

      if (!rect) {
        logger.error(LoggerName, '实体边框计算错误');
        return false;
      }

      return service.focusOnRect(rect, padding, duration);
    },
    async goBack(duration = 300) {
      if (!previousViewState) {
        return false;
      }

      stopAnimation();
      await animateToPosition(previousViewState.position, previousViewState.scale, duration);
      previousViewState = null;
      return true;
    },
    isInViewport() {
      // TODO:
      return false;
    },
  };

  // 注册选择器服务
  registerService(VIEWPORT_SERVICE, service);

  return () => {
    service.isAnimating.destroy();
  };
});
