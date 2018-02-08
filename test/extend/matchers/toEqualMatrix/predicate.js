'use strict';

exports.__esModule = true;
function predicate(received, argument) {
    if (
        received.row !== argument.row ||
        received.column !== argument.column
    ) {
        return (false);
    }

    for (let i = 0; i < received._view.length; i++) {
        if (received._view[i] !== argument._view[i]) {
            return (false);
        }
    }

    return true;
}
exports['default'] = predicate;
