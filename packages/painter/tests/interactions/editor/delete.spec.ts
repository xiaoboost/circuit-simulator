import { Point } from '@circuit/algorithm';
import { createPartByKind, createPartsByKind, createLineByPath } from '@circuit/electronics';
import { ElectronicKind } from '@circuit/types';
import {
  it,
  expect,
  describe,
} from 'vitest';
import {
  planDeleteAndMerge,
  type DeletePlan,
} from '../../../src/plugins/ui-widgets/contextmenu/delete/action';

function expectDeletePlan(plan: DeletePlan, expected: DeletePlan) {
  // 比较新增导线
  expect(plan.addedLines.length).toBe(expected.addedLines.length);
  for (let i = 0; i < plan.addedLines.length; i++) {
    expect(plan.addedLines[i].path).toStrictEqual(expected.addedLines[i].path);
  }

  expect(plan.removedIds).toStrictEqual(expected.removedIds);
  expect(plan.mergedRemovedLineIds).toStrictEqual(expected.mergedRemovedLineIds);

  // 比较新增导线两端的连接
  expect(plan.addLineConnections.length).toBe(expected.addLineConnections.length);
  for (let i = 0; i < plan.addLineConnections.length; i++) {
    // 新增导线的 id 应该与新增导线接口的 id 一致
    expect(expected.addedLines[i].id).toBe(expected.addLineConnections[i].id);
    expect(plan.addLineConnections[i].pin0).toStrictEqual(expected.addLineConnections[i].pin0);
    expect(plan.addLineConnections[i].pin1).toStrictEqual(expected.addLineConnections[i].pin1);
  }
}

describe('删除导线测试', () => {
  it('选中为空时，不进行删除', () => {
    const data = {
      parts: [],
      lines: [],
    };
    const plan = planDeleteAndMerge(data, new Set());
    expect(plan).toEqual({
      addedLines: [],
      mergedRemovedLineIds: [],
      removedIds: [],
      addLineConnections: [],
    });
  });

  describe('删除器件', () => {
    it('删除单个无连接器件，直接删除', () => {
      const part = createPartByKind(ElectronicKind.Resistance);
      const data = {
        parts: [part],
        lines: [],
      };
      const selected = new Set([part.id]);
      const plan = planDeleteAndMerge(data, selected);
      expect(plan).toEqual({
        addedLines: [],
        mergedRemovedLineIds: [],
        removedIds: [part.id],
        addLineConnections: [],
      });
    });

    it('删除单个有连接器件，直接删除', () => {
      const part = createPartByKind(ElectronicKind.Resistance);
      const data = {
        parts: [part],
        lines: [createLineByPath([Point.from([40, 0]), Point.from([100, 0])])],
      };
      const selected = new Set([part.id]);
      const plan = planDeleteAndMerge(data, selected);
      expect(plan).toEqual({
        addedLines: [],
        mergedRemovedLineIds: [],
        removedIds: [part.id],
        addLineConnections: [],
      });
    });
  });

  describe('删除导线', () => {
    it('删除单个连接了器件的导线，直接删除', () => {
      const part = createPartByKind(ElectronicKind.Resistance);
      const line = createLineByPath([Point.from([40, 0]), Point.from([100, 0])]);
      const data = {
        parts: [part],
        lines: [line],
      };
      const selected = new Set([line.id]);
      const plan = planDeleteAndMerge(data, selected);
      expect(plan).toEqual({
        addedLines: [],
        mergedRemovedLineIds: [],
        removedIds: [line.id],
        addLineConnections: [],
      });
    });

    it('删除单个连接了导线的导线，不需要合并导线，“十”型', () => {
      const parts = createPartsByKind([
        ElectronicKind.Resistance,
        ElectronicKind.Resistance,
        ElectronicKind.Diode,
        ElectronicKind.Diode,
      ]);
      const lines = [
        createLineByPath([Point.from([-60, 0]), Point.from([0, 0])]),
        createLineByPath([Point.from([60, 0]), Point.from([0, 0])]),
        createLineByPath([Point.from([0, -60]), Point.from([0, 0])]),
        createLineByPath([Point.from([0, 60]), Point.from([0, 0])]),
      ];
      const data = {
        parts: parts,
        lines: lines,
      };
      const selected = new Set([lines[0].id]);

      parts[0].position = Point.from([-100, 0]);
      parts[1].position = Point.from([100, 0]);
      parts[2].position = Point.from([0, -100]);
      parts[3].position = Point.from([0, 100]);

      const plan = planDeleteAndMerge(data, selected);

      expectDeletePlan(plan, {
        addedLines: [],
        mergedRemovedLineIds: [],
        removedIds: [lines[0].id],
        addLineConnections: [],
      });
    });

    it('删除单个连接了导线的导线，合并剩余导线，T 型', () => {
      const parts = createPartsByKind([
        ElectronicKind.Resistance,
        ElectronicKind.Resistance,
      ]);
      const lines = [
        createLineByPath([Point.from([40, 0]), Point.from([100, 0])]),
        createLineByPath([Point.from([100, 0]), Point.from([160, 0])]),
        createLineByPath([Point.from([100, 0]), Point.from([100, 100])]),
      ];
      const data = {
        parts: parts,
        lines: lines,
      };
      const selected = new Set([lines[2].id]);

      parts[0].position = Point.from([0, 0]);
      parts[1].position = Point.from([200, 0]);

      const plan = planDeleteAndMerge(data, selected);
      const newLine = createLineByPath([Point.from([40, 0]), Point.from([160, 0])]);

      expectDeletePlan(plan, {
        addedLines: [newLine],
        mergedRemovedLineIds: [lines[0].id, lines[1].id],
        removedIds: [lines[2].id],
        addLineConnections: [
          {
            id: newLine.id,
            pin0: [
              {
                id: parts[0].id,
                pin: 1,
              },
            ],
            pin1: [
              {
                id: parts[1].id,
                pin: 0,
              },
            ],
          },
        ],
      });
    });

    it('删除单个连接了导线的导线，合并剩余导线，T 型，合并导线的其中一端是交错节点', () => {
      const parts = createPartsByKind([ElectronicKind.Resistance]);
      const lines = [
        createLineByPath([Point.from([0, -100]), Point.from([0, 0])]),
        createLineByPath([Point.from([0, 100]), Point.from([0, 0])]),
        createLineByPath([Point.from([0, 0]), Point.from([100, 0])]),
        createLineByPath([Point.from([100, 0]), Point.from([160, 0])]),
        createLineByPath([Point.from([100, 0]), Point.from([100, 100])]),
      ];
      const data = {
        parts: parts,
        lines: lines,
      };
      const selected = new Set([lines[4].id]);

      parts[0].position = Point.from([200, 0]);

      const plan = planDeleteAndMerge(data, selected);
      const newLine = createLineByPath([Point.from([0, 0]), Point.from([160, 0])]);

      expectDeletePlan(plan, {
        addedLines: [newLine],
        mergedRemovedLineIds: [lines[2].id, lines[3].id],
        removedIds: [lines[4].id],
        addLineConnections: [
          {
            id: newLine.id,
            pin0: [
              {
                id: lines[0].id,
                pin: 1,
              },
              {
                id: lines[1].id,
                pin: 1,
              },
            ],
            pin1: [
              {
                id: parts[0].id,
                pin: 0,
              },
            ],
          },
        ],
      });
    });

    it('删除两个连接了导线的导线，合并两次剩余导线，H 型', () => {
      const parts = createPartsByKind([
        ElectronicKind.Diode,
        ElectronicKind.Diode,
        ElectronicKind.Diode,
        ElectronicKind.Diode,
        ElectronicKind.Resistance,
      ]);
      const lines = [
        createLineByPath([Point.from([0, 40]), Point.from([0, 100])]),
        createLineByPath([Point.from([0, 100]), Point.from([0, 160])]),
        createLineByPath([Point.from([200, 40]), Point.from([200, 100])]),
        createLineByPath([Point.from([200, 100]), Point.from([200, 160])]),
        createLineByPath([Point.from([0, 100]), Point.from([60, 100])]),
        createLineByPath([Point.from([140, 100]), Point.from([200, 100])]),
      ];
      const data = {
        parts: parts,
        lines: lines,
      };
      const selected = new Set([lines[4].id, lines[5].id]);

      parts[0].position = Point.from([0, 0]);
      parts[1].position = Point.from([200, 0]);
      parts[2].position = Point.from([0, 200]);
      parts[3].position = Point.from([200, 200]);
      parts[4].position = Point.from([100, 100]);

      const plan = planDeleteAndMerge(data, selected);
      const newLine1 = createLineByPath([Point.from([0, 40]), Point.from([0, 160])]);
      const newLine2 = createLineByPath([Point.from([200, 40]), Point.from([200, 160])]);

      expectDeletePlan(plan, {
        addedLines: [newLine1, newLine2],
        mergedRemovedLineIds: lines.slice(0, 4).map(({ id }) => id),
        removedIds: [lines[4].id, lines[5].id],
        addLineConnections: [
          {
            id: newLine1.id,
            pin0: [
              {
                id: parts[0].id,
                pin: 1,
              },
            ],
            pin1: [
              {
                id: parts[2].id,
                pin: 0,
              },
            ],
          },
          {
            id: newLine2.id,
            pin0: [
              {
                id: parts[1].id,
                pin: 1,
              },
            ],
            pin1: [
              {
                id: parts[3].id,
                pin: 0,
              },
            ],
          },
        ],
      });
    });

    it('删除两个连接了导线的导线，合并三个导线线段', () => {
      const parts = createPartsByKind([
        ElectronicKind.Resistance,
        ElectronicKind.Resistance,
        ElectronicKind.Diode,
        ElectronicKind.Diode,
      ]);
      const lines = [
        createLineByPath([Point.from([40, 0]), Point.from([100, 0])]),
        createLineByPath([Point.from([100, 0]), Point.from([200, 0])]),
        createLineByPath([Point.from([200, 0]), Point.from([260, 0])]),
        createLineByPath([Point.from([100, 0]), Point.from([100, -60])]),
        createLineByPath([Point.from([200, 0]), Point.from([200, 60])]),
      ];
      const data = {
        parts: parts,
        lines: lines,
      };
      const removedLineIds = [lines[3].id, lines[4].id];
      const selected = new Set(removedLineIds);

      parts[0].position = Point.from([0, 0]);
      parts[1].position = Point.from([300, 0]);
      parts[2].position = Point.from([100, -100]);
      parts[3].position = Point.from([200, 100]);

      const plan = planDeleteAndMerge(data, selected);
      const newLine = createLineByPath([Point.from([260, 0]), Point.from([40, 0])]);

      expectDeletePlan(plan, {
        addedLines: [newLine],
        mergedRemovedLineIds: lines.slice(0, 3).map(({ id }) => id),
        removedIds: removedLineIds,
        addLineConnections: [
          {
            id: newLine.id,
            pin0: [
              {
                id: parts[1].id,
                pin: 0,
              },
            ],
            pin1: [
              {
                id: parts[0].id,
                pin: 1,
              },
            ],
          },
        ],
      });
    });
  });
});
