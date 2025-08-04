import { Point } from '@circuit/algorithm';
import { createPartByKind, createLineByPath } from '@circuit/electronics';
import { ElectronicKind } from '@circuit/types';
import { describe, it, expect } from 'vitest';
import { CONNECTION_SERVICE } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('连接服务', () => {
  registerPlugin('services/connection/register.ts');

  it('空器件', async () => {
    const connection = await getPlugin(CONNECTION_SERVICE);
    const part = createPartByKind(ElectronicKind.Resistance, []);

    connection.createConnectionFromData({
      parts: [part],
      lines: [],
    });

    expect(connection.getConnections(part.id)).toEqual([]);
  });

  it('基本连接', async () => {
    const connection = await getPlugin(CONNECTION_SERVICE);
    const part = createPartByKind(ElectronicKind.Resistance, []);
    const line = createLineByPath([
      Point.from([40, 0]),
      Point.from([80, 0]),
    ]);

    connection.createConnectionFromData({
      parts: [part],
      lines: [line],
    });

    expect(connection.getConnections(part.id, 0)).toEqual([]);
    expect(connection.getConnections(part.id, 1)).toEqual([
      {
        id: line.id,
        pin: 0,
        originPin: 1,
      },
    ]);
    expect(connection.getConnections(line.id)).toEqual([
      {
        id: part.id,
        pin: 1,
        originPin: 0,
      },
    ]);
  });

  it('移除导线', async () => {
    const connection = await getPlugin(CONNECTION_SERVICE);
    const part = createPartByKind(ElectronicKind.Resistance, []);
    const line = createLineByPath([
      Point.from([40, 0]),
      Point.from([80, 0]),
    ]);

    connection.createConnectionFromData({
      parts: [part],
      lines: [line],
    });

    expect(connection.getConnections(part.id)).toEqual([
      {
        id: line.id,
        pin: 0,
        originPin: 1,
      },
    ]);

    // 移除导线
    connection.removeDevice(line.id);
    expect(connection.getConnections(part.id)).toEqual([]);
  });

  it('器件+导线，变更器件编号', async () => {
    const connection = await getPlugin(CONNECTION_SERVICE);
    const part = createPartByKind(ElectronicKind.Resistance, []);
    const line = createLineByPath([
      Point.from([40, 0]),
      Point.from([80, 0]),
    ]);

    connection.createConnectionFromData({
      parts: [part],
      lines: [line],
    });

    expect(connection.getConnections(line.id)).toEqual([
      {
        id: part.id,
        pin: 1,
        originPin: 0,
      },
    ]);

    const newPartId = 'R_2';
    connection.changeDeviceId(part.id, newPartId);
    expect(connection.getConnections(line.id)).toEqual([
      {
        id: newPartId,
        pin: 1,
        originPin: 0,
      },
    ]);
  });
});
