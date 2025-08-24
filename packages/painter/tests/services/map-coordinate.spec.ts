import { Point } from '@circuit/algorithm';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { MAP_COORDINATE_SERVICE, IMapCoordinateService } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('图纸坐标服务', () => {
  registerPlugin('services/map-coordinate/register.tsx', {
    // 测试环境时注入视口差异模拟数据
    painterPosition: new Point(100, 100),
  });

  let mapCoordinate: IMapCoordinateService;

  beforeAll(async () => {
    mapCoordinate = await getPlugin(MAP_COORDINATE_SERVICE);
  });

  // 恢复初始状态
  beforeEach(() => {
    mapCoordinate.scale.setData(1);
    mapCoordinate.position.setData(new Point(0, 0));
  });

  describe('常量属性', () => {
    it('应该具有正确的缩放常量', () => {
      expect(mapCoordinate.ScaleMin).toBe(0.4);
      expect(mapCoordinate.ScaleMax).toBe(2);
      expect(mapCoordinate.ScaleStep).toBe(1.05);
    });

    it('应该具有正确的初始状态', () => {
      expect(mapCoordinate.scale.data).toBe(1);
      expect(mapCoordinate.position.data).toEqual(new Point(0, 0));
    });
  });

  describe('缩放控制', () => {
    it('放大应该增加缩放比例', () => {
      const originalScale = mapCoordinate.scale.data;
      mapCoordinate.zoomIn();
      expect(mapCoordinate.scale.data).toBe(originalScale * 1.05);
    });

    it('缩小应该减少缩放比例', () => {
      const originalScale = mapCoordinate.scale.data;
      mapCoordinate.zoomOut();
      expect(mapCoordinate.scale.data).toBe(originalScale / 1.05);
    });

    it('setScale 应该设置缩放比例', () => {
      mapCoordinate.setScale(1.5);
      expect(mapCoordinate.scale.data).toBe(1.5);
    });

    it('clampScale 应该限制缩放比例在允许范围内', () => {
      expect(mapCoordinate.clampScale(0.1)).toBe(0.4);
      expect(mapCoordinate.clampScale(3)).toBe(2);
      expect(mapCoordinate.clampScale(1.000001)).toBe(1);
      expect(mapCoordinate.clampScale(0.999999)).toBe(1);
      expect(mapCoordinate.clampScale(1.2)).toBe(1.2);
    });
  });

  describe('位置控制', () => {
    it('setPosition 应该设置位置', () => {
      const newPosition = new Point(100, 200);
      mapCoordinate.setPosition(newPosition);
      expect(mapCoordinate.position.data).toEqual(newPosition);
    });
  });

  describe('坐标转换', () => {
    beforeEach(() => {
      mapCoordinate.setScale(2);
      mapCoordinate.setPosition(new Point(50, 100));
    });

    it('screenToViewPosition 应该正确转换', () => {
      const screenPos = new Point(200, 300);
      const viewPos = mapCoordinate.screenToViewPosition(screenPos);
      expect(viewPos).toEqual(new Point(100, 200));
    });

    it('screenToMapPosition 应该正确转换', () => {
      const screenPos = new Point(200, 300);
      const mapPos = mapCoordinate.screenToMapPosition(screenPos);
      expect(mapPos).toEqual(new Point(25, 50));
    });

    it('viewToMapPosition 应该正确转换', () => {
      const viewPos = new Point(150, 200);
      const mapPos = mapCoordinate.viewToMapPosition(viewPos);
      expect(mapPos).toEqual(new Point(50, 50));
    });

    it('mapToViewPosition 应该正确转换', () => {
      const mapPos = new Point(50, 50);
      const viewPos = mapCoordinate.mapToViewPosition(mapPos);
      expect(viewPos).toEqual(new Point(150, 200));
    });

    it('mapToScreenPosition 应该正确转换', () => {
      const mapPos = new Point(50, 50);
      const screenPos = mapCoordinate.mapToScreenPosition(mapPos);
      expect(screenPos).toEqual(new Point(250, 300));
    });

    it('viewToScreenPosition 应该正确转换', () => {
      const viewPos = new Point(150, 200);
      const screenPos = mapCoordinate.viewToScreenPosition(viewPos);
      expect(screenPos).toEqual(new Point(250, 300));
    });
  });

  describe('矩形转换', () => {
    beforeEach(() => {
      mapCoordinate.setScale(2);
      mapCoordinate.setPosition(new Point(50, 100));
    });

    it('screenToViewRect 应该正确转换', () => {
      const testRect = { x: 100, y: 150, width: 200, height: 100 };
      const viewRect = mapCoordinate.screenToViewRect(testRect);
      expect(viewRect).toEqual({ x: 0, y: 50, width: 200, height: 100 });
    });

    it('screenToMapRect 应该正确转换', () => {
      const testRect = { x: 100, y: 150, width: 200, height: 100 };
      const mapRect = mapCoordinate.screenToMapRect(testRect);
      expect(mapRect).toEqual({ x: -25, y: -25, width: 100, height: 50 });
    });

    it('viewToMapRect 应该正确转换', () => {
      const viewRect = { x: 150, y: 200, width: 200, height: 100 };
      const mapRect = mapCoordinate.viewToMapRect(viewRect);
      expect(mapRect).toEqual({ x: 50, y: 50, width: 100, height: 50 });
    });

    it('mapToViewRect 应该正确转换', () => {
      const mapRect = { x: 50, y: 50, width: 100, height: 50 };
      const viewRect = mapCoordinate.mapToViewRect(mapRect);
      expect(viewRect).toEqual({ x: 150, y: 200, width: 200, height: 100 });
    });

    it('mapToScreenRect 应该正确转换', () => {
      const mapRect = { x: 50, y: 50, width: 100, height: 50 };
      const screenRect = mapCoordinate.mapToScreenRect(mapRect);
      expect(screenRect).toEqual({ x: 250, y: 300, width: 200, height: 100 });
    });

    it('viewToScreenRect 应该正确转换', () => {
      const viewRect = { x: 150, y: 200, width: 200, height: 100 };
      const screenRect = mapCoordinate.viewToScreenRect(viewRect);
      expect(screenRect).toEqual({ x: 250, y: 300, width: 200, height: 100 });
    });
  });

  describe.skip('视口方法', () => {
    it('getCurrentViewportRect 应该返回正确的视口矩形', () => {
      const viewportRect = mapCoordinate.getCurrentViewportRect();
      expect(viewportRect).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('getCurrentViewportSize 应该返回正确的视口尺寸', () => {
      const viewportSize = mapCoordinate.getCurrentViewportSize();
      expect(viewportSize).toEqual({
        width: 0,
        height: 0,
      });
    });
  });
});
