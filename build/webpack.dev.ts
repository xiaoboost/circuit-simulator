import Koa from 'koa';
import Webpack from 'webpack';
import MemoryFS from 'memory-fs';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import baseConfig from './webpack.base';

import { join } from 'path';
import { getType } from 'mime';
import { output } from './config';

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

let fileSystem: MemoryFS | typeof fs;

if (process.env.SERVER_TYPE === 'memory') {
    fileSystem = compiler.outputFileSystem = new MemoryFS();
}
else {
    fileSystem = fs;
}

compiler.watch(
    { ignored: /node_modules/ },
    (err?: Error) => (
        (err && console.error(err.stack || err)) ||
        (err && (err as any).details && console.error((err as any).details))
    ),
);

app.listen(port);

app.use((ctx, next) => {
    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
        ctx.status = 405;
        ctx.length = 0;
        ctx.set('Allow', 'GET, HEAD');
        next();
        return (false);
    }

    const filePath = ctx.path[ctx.path.length - 1] === '/'
        ? join(output, ctx.path, 'index.html')
        : join(output, ctx.path);

    if (!fileSystem.existsSync(filePath)) {
        ctx.status = 404;
        ctx.length = 0;
        next();
        return (false);
    }

    const fileStat = fileSystem.statSync(filePath);

    ctx.type = getType(filePath)!;
    ctx.lastModified = new Date();

    ctx.set('Accept-Ranges', 'bytes');
    ctx.set('Cache-Control', 'max-age=0');

    // node-fs
    if (fileStat instanceof fs.Stats) {
        ctx.length = fileStat.size;
    }
    // memory-fs
    else {
        ctx.length = Buffer.from(fileSystem.readFileSync(filePath)).length;
    }

    ctx.body = fileSystem.createReadStream(filePath);
    next();
});
