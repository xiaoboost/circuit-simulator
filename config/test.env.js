const merge = require('webpack-merge'),
    devEnv = require('./dev.env');

module.exports = merge(devEnv, {
    NODE_ENV: '"testing"',
});
