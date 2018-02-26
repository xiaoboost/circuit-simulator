const tsLoader = require('ts-jest');
const Base64 = require('js-base64').Base64;

function createContext(content) {
    return (`
        exports.__esModule = true;

        var blob = new Blob([
'${content}'
        ], { type: 'text/javascript' });

        var objectURL = window.URL.createObjectURL(blob);

        function workerCreator() {
            return new Worker(objectURL);
        }

        exports.default = workerCreator;
    `).trim();
}

module.exports = {
    process(src, filename, config) {
        const compiled = tsLoader.process(src, filename, config);
        const firstLine = compiled.match(/^[^\n]+\n/)[0];
        const endLine = compiled.match(/\n[^\n]+$/)[0];

        const code = createContext(
            compiled
                .replace(/(^[^\n]+\n|\n[^\n]+$)/g, '')
                .replace(/\n/g, '\\n')
                .replace(/'/g, '\\\'')
        );

        // 反编译 base64
        const base64 = Base64.decode(/base64,([\d\D]+)$/.exec(endLine)[1]);
        const mapping = JSON.parse(base64);

        mapping.mappings = ';;;' + mapping.mappings;

        const sourceMapping = (
            '//# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
            Base64.encode(JSON.stringify(mapping))
        );

        return (firstLine + code + sourceMapping);
    },
};
