const devEnv = require('./dev.env');
const { merge, data } = require('./common');

module.exports = merge(
    devEnv, data,
    { $ENV: { NODE_ENV: 'testing' }}
);
