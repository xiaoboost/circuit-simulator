const devEnv = require('./dev.env');
const common = require('./common');
const merge = require('./merge');

module.exports = merge(
    {}, devEnv, common,
    { $ENV: { NODE_ENV: 'testing' }}
);
