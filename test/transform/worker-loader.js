const tsLoader = require('ts-jest');

function createContext(content) {
    return (`
        exports.__esModule = true;

        var blob = new Blob(['${content}'], { type: 'text/javascript' });
        var objectURL = window.URL.createObjectURL(blob);

        function workerCreator() {
            return new Worker(objectURL);
        }

        exports.default = workerCreator;
    `).trim();
}

module.exports = {
    process(src, filename, config) {
        const compiled = (
            tsLoader
                .process(src, filename, config)
                .replace(/(^[^\n]+\n|\n[^\n]+$)/g, '')
                .replace(/\n/g, '\\n')
                .replace(/'/g, '\\\'')
        );

        return createContext(compiled);
    },
};
