interface Environment {
    readonly NODE_ENV: 'development' | 'production' | 'testing';
}

interface Extend {
    target: HTMLElement & EventTarget;
    currentTarget: HTMLElement & EventTarget;
}

declare const $ENV: Environment;
declare type EventExtend = Extend;
