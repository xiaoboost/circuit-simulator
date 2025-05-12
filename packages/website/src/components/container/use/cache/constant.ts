import { createInstance } from 'localforage';

/** 数据库名称 */
const StorageName = 'circuit-data';
/** 数据表名称 */
const TableName = 'default-db';
/** 数据列 */
export const Columns = ['version', 'parts', 'lines'];
/** 数据库实例 */
export const storage = createInstance({
  name: StorageName,
  storeName: TableName,
});
