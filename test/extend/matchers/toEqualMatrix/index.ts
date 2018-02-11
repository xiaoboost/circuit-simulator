import chalk from 'chalk';

import predicate from './predicate';
import { Matrix } from 'src/lib/matrix';

function toString(ma: Matrix) {
    const maxColumnLen: number[] = [];
    for (let i = 0; i < ma.column; i++) {
        maxColumnLen.push(
            ma
                .getColumn(i).map(String)
                .reduce((len, item) => item.length > len ? item.length : len, 0),
        );
    }

    let str = '';
    for (let i = 0; i < ma.row; i++) {
        str += '| ' + (
            ma
                .getRow(i)
                .map((n) => String(n).padStart(maxColumnLen[i], ' '))
                .join(', ') + ' |\n '
        );
    }
    return (str);
}

export default function toEqualMatrix(received: Matrix, argument: Matrix) {
    if (predicate(received, argument)) {
        return {
            message: () => `${chalk.yellow(toString(received))}] is equal to ${chalk.green(toString(argument))}`,
            pass: true,
        };
    }
    else {
        return {
            message: () => `Expected matrix to equal:\n ${chalk.green(toString(argument))}\nReceived:\n ${chalk.red(toString(received))}\n`,
            pass: false,
        };
    }
}
