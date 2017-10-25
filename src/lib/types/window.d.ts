interface Environment {
    readonly NODE_ENV: 'development' | 'production' | 'testing';
}

declare const $ENV: Environment;
