import * as fs from 'fs-extra';

import { resolve } from './utils';
import { getOptions } from 'loader-utils';
import { extname, join } from 'path';

interface IconData {
    type: string;
    theme: string;
}

/** 生成组件标签正则 */
const createMatcher = (key: string) => {
    return new RegExp(`a-${key}[\\d\\D]+?(\\/>|<\\/a-${key}>)`, 'ig');
};

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
async function readFiles(input: string) {
    const ans: string[] = [];
    const dirs = await fs.readdir(input);

    for (let i = 0; i < dirs.length; i++) {
        const folder = join(input, dirs[i]);
        const stat = await fs.lstat(folder);

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
function camelize(input: string) {
    input = input.charAt(0).toUpperCase() + input.slice(1);
    return input.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '');
}

/** 生成标准图标数据格式 */
function createIconData(icon: string | PartPartial<IconData, 'theme'>) {
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
function constantIcon(content: string) {
    /** 匹配所有的图标 */
    const IconMatcher = createMatcher('icon');
    /** 匹配图标类型 */
    const typeMatcher = /type="([^"]+?)"/;
    /** 匹配图标主题 */
    const themeMatcher = /theme="([^"]+?)"/;

    const result: IconData[] = [];
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
            theme: (themeMatch && themeMatch[1]) || '',
        }));
    }

    return result;
}

/** button 组件中的图标 */
function iconInButton(content: string) {
    /** 匹配所有的图标 */
    const IconMatcher = createMatcher('button');
    /** 匹配图标类型 */
    const typeMatcher = /icon="([^"]+?)"/;

    const result: IconData[] = [];
    const contentMatch = content.match(IconMatcher);

    if (!contentMatch) {
        return result;
    }

    for (const iconSource of contentMatch) {
        const typeMatch = typeMatcher.exec(iconSource);

        // 按钮中有图标
        if (typeMatch) {
            result.push(createIconData(typeMatch[1].trim()));
        }
    }

    return result;
}

/** ant 组件内部使用的图标 */
function iconInComponent(content: string) {
    /** 图标数据 */
    const result = [];
    /** 是否已经构建 */
    const hasBuildIn = (name: string) => Boolean(iconInComponentMap[name]);

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
function uniqueIcon(icons: IconData[]) {
    const labelMap = {};
    const label = ({ type, theme }: IconData) => `${type}-${theme}`;

    return icons
        .map((value) => ({ value, key: label(value) }))
        .filter(({ key }) => (labelMap[key] ? false : (labelMap[key] = true)))
        .map(({ value }) => value);
}

// 专门用于解析 ant-icons 图标的加载器
export default async function(this: any) {
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

        const content = (await fs.readFile(file)).toString();

        icons.push(...constantIcon(content));
        icons.push(...iconInButton(content));
        icons.push(...iconInComponent(content));
    }

    // 去除重复图标
    const result = uniqueIcon(icons);

    // 按照 es 的标准格式导出
    return result.map(({ type, theme }) => {
        const iconType = `${camelize(type)}${camelize(theme)}`;
        return `export { default as ${iconType} } from './${theme}/${iconType}';`;
    }).join('\n');
}
