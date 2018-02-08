export default function predicate(received: any[] | ArrayLike<any>, argument: any[] | ArrayLike<any>) {
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
