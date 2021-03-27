import path from 'path';

/** 当前版本号 */
export  { version } from '../package.json';

/**
 * Generate tag of build
 * @returns {string}
 */
function buildTag() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const time = now.toTimeString().slice(0, 8);

  return `${year}.${month}.${date} - ${time}`;
}

/** 当前编译标签 */
export const build = buildTag();

/**
 * 定位到项目根目录
 * @param {string} dir 路径
 */
export const resolve = (...dir: string[]) => path.join(__dirname, '..', ...dir).replace(/[\\\/]/g, '/');

/** 运行脚本代码 */
export function runScript<T = any>(script: string): T {
  // 去除 pinyin 的依赖
  const code = script.replace('require("pinyin")', '{}');

  interface FakeModule {
    exports: {
      default: any;
    }
  }

  const fake: FakeModule = {
    exports: {},
  } as any;

  try {
    (new Function(`
      return function box(module, exports, require) {
        ${code}
      }
    `))()(fake, fake.exports, require);
  }
  catch (e) {
    throw new Error(e);
  }

  return (fake.exports.default ? fake.exports.default : fake.exports);
}
