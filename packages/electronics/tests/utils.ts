import { MarkMap } from '@circuit/map';
import { Line, Part, LineData, PartData, Context } from '../src';

type InputData = (Partial<PartData> | Partial<LineData>)[];

/** 创建上下文 */
export function createContext(): Context {
  return {
    map: new MarkMap(),
    parts: [],
    lines: [],
  };
}

/** 放置悬空元件 */
export function loadSpace(context: Context, data: InputData) {
  const parts: Part[] = [];
  const lines: Line[] = [];

  data
    .filter((item) => item.kind !== 'Line')
    .forEach((item) => {
      const part = new Part(item as any, context);
      parts.push(part);
    });

  // data
  //   .filter((item) => item.kind === 'Line')
  //   .forEach((item) => {
  //     const line = new Line((item as LineData).path, context);
  //     lines.push(line);
  //   });

  return {
    parts,
    lines,
  };
}

/** 放置元件 */
export function loadData(context: Context, data: InputData) {
  const result = loadSpace(context, data);

  result.parts.forEach((part) => part.setMark());
  // result.lines.forEach((line) => {
  //   line.setMark();
  //   line.setConnectionByPath(false);
  // });

  return result;
}
