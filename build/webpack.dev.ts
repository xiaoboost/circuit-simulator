import Koa from 'koa';
import Webpack from 'webpack';
import MemoryFS from 'memory-fs';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import baseConfig from './webpack.base';

import { output } from './config';
import { ramMiddleware } from './utils';

import * as fsOri from 'fs';
import * as fs from 'fs-extra';

const host = 'localhost';
const port = 8080;
const app = new Koa();

// 删除输出文件夹
if (fs.pathExistsSync(output)) {
    fs.removeSync(output);
}

// 每个模块用 eval() 执行, SourceMap 作为 DataUrl 添加到文件末尾
baseConfig.devtool = 'eval-source-map';
// 调试用的插件
baseConfig.plugins!.push(
    new Webpack.NamedModulesPlugin(),
    new Webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: [`Your application is already set at http://${host}:${port}/.\n`],
            notes: [],
        },
    }),
);

const compiler = Webpack(baseConfig);

let fileSystem;

if (process.env.SERVER_TYPE === 'memory') {
    compiler.outputFileSystem = fileSystem = new MemoryFS();
}
else {
    fileSystem = fsOri;
}

compiler.watch(
    { ignored: /node_modules/ },
    (err?: Error) => (
        (err && console.error(err.stack || err)) ||
        (err && (err as any).details && console.error((err as any).details))
    ),
);

app
    .use(ramMiddleware(fileSystem, output))
    .listen(port);
