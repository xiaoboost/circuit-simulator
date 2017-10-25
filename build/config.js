const path = require('path');

module.exports = {
    output: path.join(__dirname, '../dist/'),
    bundleAnalyzer: true,
    port: 8080,
};
