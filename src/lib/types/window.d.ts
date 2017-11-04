interface Environment {
    readonly NODE_ENV: 'development' | 'production' | 'testing';
}

interface Extend {
    target: HTMLElement;
    currentTarget: HTMLElement;
}

declare const $ENV: Environment;
declare type EventExtend = Extend;
