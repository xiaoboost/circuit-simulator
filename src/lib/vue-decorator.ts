import 'reflect-metadata';
import * as assert from 'src/lib/assertion';

import Vue from 'vue';
import { InjectOptions, PropOptions, WatchOptions } from 'vue/types/options';

import Component, { createDecorator } from 'vue-class-component';

export interface Constructor {
    new(...args: any[]): any;
}

export { Component, Vue };

/**
 * decorator of an inject
 * @param {(string | symbol)} [key]
 * @returns {VueDecorator}
 */
export function Inject(key?: string | symbol) {
    return createDecorator((componentOptions, k) => {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[k] = key || k;
        }
    });
}

/**
 * decorator of a provide
 * @param {(string | symbol)} [key]
 * @returns {VueDecorator}
 */
export function Provide(key?: string | symbol) {
    return createDecorator((componentOptions, k) => {
        let provide: any = componentOptions.provide;
        if (assert.isFunction(provide) || !provide.managed) {
            const original = componentOptions.provide;
            provide = componentOptions.provide = function(this: any) {
                const rv = Object.create(
                    (assert.isFunction(original)
                        ? original.call(this)
                        : original
                    )
                    || null,
                );
                for (const i in provide.managed) {
                    if (provide.managed.hasOwnProperty(i)) {
                        rv[provide.managed[i]] = this[i];
                    }
                }
                return rv;
            };
            provide.managed = {};
        }
        provide.managed[k] = key || k;
    });
}

/**
 * decorator of a prop
 * @param {((PropOptions | Constructor[] | Constructor))} [options={}]
 * @returns {PropertyDecorator}
 */
export function Prop(options: (PropOptions | Constructor[] | Constructor) = {}) {
    return (target: Vue, key: string) => {
        if (!Array.isArray(options) && typeof (options as PropOptions).type === 'undefined') {
            (options as PropOptions).type = Reflect.getMetadata('design:type', target, key);
        }
        createDecorator((componentOptions, k) => {
            (componentOptions.props || (componentOptions.props = {}) as any)[k] = options;
        })(target, key);
    };
}

/**
 * decorator of a watch function
 * @param {string} path
 * @param {WatchOptions} [options={}]
 * @returns {MethodDecorator}
 */
export function Watch(path: string, options: WatchOptions = {}) {
    const { deep = false, immediate = false } = options;

    return createDecorator((componentOptions, handler) => {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        (componentOptions.watch as any)[path] = { handler, deep, immediate };
    });
}
