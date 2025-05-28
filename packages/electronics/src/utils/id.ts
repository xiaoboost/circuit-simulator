/** 创建编号 */
export function createId(pre: string, ids: string[]): string {
  let index = 1;

  const idMap = new Map(ids.map((id) => [id, true]));

  while (idMap.has(`${pre}_${index}`)) {
    index++;
  }

  return `${pre}_${index}`;
}
