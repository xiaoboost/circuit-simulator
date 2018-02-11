import chalk from 'chalk';
import predicate from './predicate';

function toString(input: any) {
    return (
        JSON
            .stringify(input, null, 4)
            .split('\n')
            .map((line) => ' ' + line)
            .join('\n')
    );
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
            message: () => `Expected object to equal:\n ${chalk.green(toString(argument))}\nReceived:\n ${chalk.red(toString(received))}\n`,
            pass: false,
        };
    }
}
