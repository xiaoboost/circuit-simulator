const fs = require('fs');
const { resolve } = require('./utils');
const { getOptions } = require('loader-utils');
const { extname, join } = require('path');

/** fs 方法的 Promise 包装器 */
const fsPromisify = (key) => {
    return (...args) => new Promise((resolve, reject) =>
        fs[key](...args, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        }),
    )
};

/** 生成组件标签正则 */
const createMatcher = (key) =>{
    return new RegExp(`a-${key}[\\d\\D]+?(\\/>|<\\/a-${key}>)`, 'ig');
};

const lstat = fsPromisify('lstat');
const readdir = fsPromisify('readdir');
const readFile = fsPromisify('readFile');

/** antd 组件 hash */
const iconInComponentMap = {};
/** antd 组件内部使用的图标列表 */
const componentIcon = [
    {
        name: 'select',
        test: createMatcher('select'),
        icons: ['loading', 'down', 'close', 'check'],
    },
];

/** 列举出文件夹内的所有文件 */
async function readFiles(input) {
    const ans = [];
    const dirs = await readdir(input);

    for (let i = 0; i < dirs.length; i++) {
        const folder = join(input, dirs[i]);
        const stat = await lstat(folder);

        if (stat.isDirectory()) {
            ans.push(...(await readFiles(folder)));
        }
        else {
            ans.push(folder);
        }
    }

    return ans;
}

/** 转为驼峰形式 */
function camelize(input) {
    input = input.charAt(0).toUpperCase() + input.slice(1)
    return input.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '');
}

/** 生成标准图标数据格式 */
function createIconData(icon) {
    let data;

    if (typeof icon === 'string') {
        data = {
            type: icon,
            theme: 'outline',
        };
    }
    else {
        let theme;
        const { type, theme: themeOri } = icon;

        if (themeOri) {
            if (themeOri === 'filled') {
                theme = 'fill';
            }
            else if (themeOri === 'outlined') {
                theme = 'outline';
            }
            else {
                theme = themeOri;
            }
        }
        else {
            theme = 'outline';
        }

        data = { type, theme };
    }

    return data;
}

/** 源码中搜索图标 */
function constantIcon(content) {
    /** 匹配所有的图标 */
    const IconMatcher = createMatcher('icon');
    /** 匹配图标类型 */
    const typeMatcher = /type="([^"]+?)"/;
    /** 匹配图标主题 */
    const themeMatcher = /theme="([^"]+?)"/;

    const result = [];
    const contentMatch = content.match(IconMatcher);

    if (!contentMatch) {
        return result;
    }

    for (const iconSource of contentMatch) {
        const typeMatch = typeMatcher.exec(iconSource);
        const themeMatch = themeMatcher.exec(iconSource);

        if (!typeMatch) {
            throw new Error('Icon must have Type');
        }

        result.push(createIconData({
            type: typeMatch[1].trim(),
            theme: themeMatch && themeMatch[1],
        }));
    }

    return result;
}

/** ant 组件内部使用的图标 */
function iconInComponent(content) {
    /** 图标数据 */
    const result = [];
    /** 是否已经构建 */
    const hasBuildIn = (name) => Boolean(iconInComponentMap[name]);

    for (const comp of componentIcon) {
        // 跳过已经构建的图标
        if (hasBuildIn(comp.name)) {
            continue;
        }

        // 匹配当前组件
        const matchs = comp.test.test(content);

        if (!matchs) {
            continue;
        }

        iconInComponentMap[comp.name] = true;
        result.push(...comp.icons.map(createIconData));
    }

    return result;
}

/** 去除重复的图标 */
function uniqueIcon(icons) {
    const labelMap = {};
    const label = (icon) => `${icon.type}-${icon.theme}`;
    
    return icons
        .map((value, index) => ({ value, key: label(value, index) }))
        .filter(({ key }) => (labelMap[key] ? false : (labelMap[key] = true)))
        .map(({ value }) => value);
}

// 专门用于解析 ant-icons 图标的加载器
module.exports = async function() {
    const options = getOptions(this) || {};
    const icons = (options.inclues || []).map(createIconData);

    // 源码中的所有文件
    const files = await readFiles(resolve('src'));

    // 枚举所有文件
    for (const file of files) {
        // 跳过非 vue 文件
        if (extname(file) !== '.vue') {
            continue;
        }

        const content = (await readFile(file)).toString();

        icons.push(...constantIcon(content));
        icons.push(...iconInComponent(content));
    }

    // 去除重复图标
    const result = uniqueIcon(icons);

    // 按照 es 的标准格式导出
    return result.map(({ type, theme }) => {
        const iconType = `${camelize(type)}${camelize(theme)}`;
        return `export { default as ${iconType} } from './${theme}/${iconType}';`
    }).join('\n');
};
