import type { DeepEqualAssertion } from 'ava';

import { Line, Part } from '../src';
import { Point, Direction, Directions } from '@circuit/math';

import * as fs from 'fs';
import * as path from 'path';

function resolve(...paths: string[]) {
  return path.join(__dirname, '..', ...paths);
}

function resolveSnapshot(name: string) {
  return resolve('tests/snapshots', `${name}.json`);
}

export function loadPart(id: string, position: [number, number]) {
  const part = new Part({
    id,
    kind: 'Resistance',
    position,
  });

  part.setMark();

  return part;
}

export function loadLine(id: string, position: [number, number][]) {
  const line = new Line(position);

  line.id = id;
  line.setConnectByWay();
  line.setMark();

  return line;
}

export function loadStartLine(id: string, start: [number, number]) {
  const line = new Line([start]);

  line.id = id;

  return line;
}

export function loadBase(position: [number, number]) {
  const start = Point.from([position[0] + 40, position[1]]);
  const line = new Line([start]);
  const part = loadPart('R_1', position);

  part.connections[1] = {
    id: line.id,
    mark: 1,
  };

  line.connections[0] = {
    id: part.id,
    mark: 0,
  };

  return [part, line, start, Directions[Direction.Right]] as const;
}

export function snapshot(name: string, actual: any, deep: DeepEqualAssertion) {
  const content = fs.readFileSync(resolveSnapshot(name), 'utf-8');
  const data = JSON.parse(content);
  deep(actual, data);
}

export function writeSnapshot(name: string, actual: any, deep: DeepEqualAssertion) {
  const fsPath = resolveSnapshot(name);
  fs.writeFileSync(fsPath, JSON.stringify(actual, null, 2) + '\n');
  deep(1, 1);
}
