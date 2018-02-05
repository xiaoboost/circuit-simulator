/* tslint:disable:prefer-for-of  */

function arrayJoin(arr: any[] | ArrayLike<any>) {
    let ans = '';

    for (let i = 0; i < arr.length; i++) {
        ans += arr[i] + ', ';
    }

    return ans.slice(0, ans.length - 2);
}

function predicate(received: any[] | ArrayLike<any>, argument: any[] | ArrayLike<any>) {
    if (received.length !== argument.length) {
        return (false);
    }

    for (let i = 0; i < received.length; i++) {
        if (received[i] !== argument[i]) {
            return (false);
        }
    }

    return (true);
}

export default function toEqualArray(received: any[] | ArrayLike<any>, argument: any[] | ArrayLike<any>) {
    if (predicate(received, argument)) {
        return {
            message: () => `expected [${arrayJoin(received)}] is equal to [${arrayJoin(argument)}]`,
            pass: true,
        };
    }
    else {
        return {
            message: () => `expected [${arrayJoin(received)}] is not equal to [${arrayJoin(argument)}]`,
            pass: false,
        };
    }
}
