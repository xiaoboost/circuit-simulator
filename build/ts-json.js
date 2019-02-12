const fs = require('fs');
const { rm, mkdir } = require('shelljs');
const { join, basename } = require('path');
const { assert, example } = require('./config');
const { promiseSpawn, resolve } = require('./utils');

const tsc = resolve('node_modules/typescript/lib/tsc.js');
const compileOutput = require('../tsconfig.json').compilerOptions.outDir;
const exampleInput = resolve('src', example);
const exampleOutput = join(assert, example);

module.exports = function main() {
    rm('-rf', exampleOutput);

    promiseSpawn('node', tsc, '-p', exampleInput).then(() => {
        const filePath = resolve(compileOutput, example);
        const files = fs.readdirSync(filePath);

        mkdir(exampleOutput);

        for (const file of files) {
            const { data } = require(join(filePath, file));
            const base = basename(file, '.js');
            const dataString = JSON.stringify(data);

            fs.writeFileSync(join(exampleOutput, `${base}.json`), dataString);
        }

        rm('-rf', compileOutput);
    });
};
