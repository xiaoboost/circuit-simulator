/* tslint:disable:prefer-for-of  */

import chalk from 'chalk';
import predicate from './predicate';

function toString(arr: any[] | ArrayLike<any>) {
    let ans = '';

    for (let i = 0; i < arr.length; i++) {
        ans += arr[i] + ', ';
    }

    return `[${ans.slice(0, ans.length - 2)}]`;
}

export default function toEqualArray(received: any[] | ArrayLike<any>, argument: any[] | ArrayLike<any>) {
    if (predicate(received, argument)) {
        return {
            message: () => `${chalk.yellow(toString(received))}] is equal to ${chalk.green(toString(argument))}`,
            pass: true,
        };
    }
    else {
        return {
            message: () => `Expected value to equal:\n ${chalk.green(toString(argument))}\nReceived:\n ${chalk.red(toString(received))}\n`,
            pass: false,
        };
    }
}
