import { Point } from '@circuit/algorithm';
import { createPartByKind, createLineByPath } from '@circuit/electronics';
import { ElectronicKind, PartStructuredData, LineStructuredData } from '@circuit/types';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CONNECTION_SERVICE, IConnectionService } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('连接服务', () => {
  registerPlugin('services/connection/register.ts');

  let connection: IConnectionService;
  let part: PartStructuredData;
  let line: LineStructuredData;

  beforeAll(async () => {
    connection = await getPlugin(CONNECTION_SERVICE);
  });

  beforeEach(() => {
    connection.clearAll();
    part = createPartByKind(ElectronicKind.Resistance);
    line = createLineByPath([
      Point.from([40, 0]),
      Point.from([80, 0]),
    ]);
  });

  describe('空器件处理', () => {
    it('空器件应该没有连接', async () => {
      connection.createFromData({
        parts: [part],
        lines: [],
      });

      expect(connection.getConnections(part.id)).toEqual([]);
    });
  });

  describe('基本连接', () => {
    beforeEach(() => {
      connection.createFromData({
        parts: [part],
        lines: [line],
      });
    });

    it('器件引脚0应该没有连接', () => {
      expect(connection.getConnections(part.id, 0)).toEqual([]);
    });

    it('器件引脚1应该连接到导线', () => {
      expect(connection.getConnections(part.id, 1)).toEqual([
        {
          id: line.id,
          pin: 0,
          originPin: 1,
        },
      ]);
    });

    it('导线应该连接到器件', () => {
      expect(connection.getConnections(line.id)).toEqual([
        {
          id: part.id,
          pin: 1,
          originPin: 0,
        },
      ]);
    });
  });

  describe('移除导线', () => {
    beforeEach(() => {
      connection.createFromData({
        parts: [part],
        lines: [line],
      });
    });

    it('移除导线前器件应该有连接', () => {
      expect(connection.getConnections(part.id)).toEqual([
        {
          id: line.id,
          pin: 0,
          originPin: 1,
        },
      ]);
    });

    it('移除导线后器件应该没有连接', () => {
      connection.removeDevice(line.id);
      expect(connection.getConnections(part.id)).toEqual([]);
    });
  });
});
