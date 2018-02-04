
function arrayJoin(arr: any[] | ArrayLike<any>) {
    let ans = '';

    for (let i = 0; i < arr.length; i++) {
        ans += arr[i] + ', ';
    }

    return ans.trimRight();
}

export default function toEqualArray(received: any[] | ArrayLike<any>, argument: any[] | ArrayLike<any>) {
    let pass = true;

    if (received.length !== argument.length) {
        pass = false;
    }

    for (let i = 0; i < received.length; i++) {
        if (received[i] !== argument[i]) {
            pass = false;
            break;
        }
    }

    if (pass) {
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
