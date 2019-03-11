import * as fs from 'fs-extra';
import * as option from '../tsconfig.json';

import { assert } from './config';
import { join, basename } from 'path';
import { promiseSpawn, resolve } from './utils';

const tsc = resolve('node_modules/typescript/lib/tsc.js');

/** 样例文件夹名称 */
const example = 'examples';

// 文件夹路径
const exampleInput = resolve('src', example);
const exampleOutput = join(assert, example);
const compileOutput = option.compilerOptions.outDir;

export default function main() {
    promiseSpawn('node', tsc, '-p', exampleInput).then(() => {
        const filePath = resolve(compileOutput, example);
        const files = fs.readdirSync(filePath);

        if (fs.pathExistsSync(exampleOutput)) {
            fs.removeSync(exampleOutput);
        }

        fs.mkdirpSync(exampleOutput);

        for (const file of files) {
            const { data } = require(join(filePath, file));
            const base = basename(file, '.js');
            const dataString = JSON.stringify(data);

            fs.writeFileSync(join(exampleOutput, `${base}.json`), dataString);
        }

        fs.removeSync(resolve(compileOutput));
    });
}
