import assert from './assertion';

/**
 * Put all properties of classConstructor to target
 *
 * @export
 * @param {() => void} classConstructor
 * @returns {(target: () => void) => void}
 */
export function extendsClass(classConstructor: () => void) {
    return <T extends { prototype: object }>(target: T): T => {
        Object.getOwnPropertyNames(classConstructor.prototype).forEach((key: string) => {
            if (key === 'constructor') {
                return;
            }
            Object.defineProperty(target.prototype, key, {
                enumerable: false,
                value(this: { _data: object }, ...args: string[]) {
                    return this._data[key](...args);
                },
            });
        });
        return target;
    };
}

/**
 * Trigger an UIEvent on elm
 *
 * @export
 * @param {HTMLElement} elm
 * @param {string} name
 * @param {UIEventInit} [opts={}]
 * @returns {HTMLElement}
 */
export function triggerEvent(elm: HTMLElement, name: 'click' | 'dblclick' | 'mouseup' | 'mousedown', opts: MouseEventInit): HTMLElement;
export function triggerEvent(elm: HTMLElement, name: 'focus' | 'blur' | 'focusin' | 'focusout', opts: FocusEventInit): HTMLElement;
export function triggerEvent(elm: HTMLElement, name: 'keydown' | 'keypress' | 'keyup', opts: KeyboardEventInit): HTMLElement;
export function triggerEvent(elm: HTMLElement, name: string, opts: UIEventInit): HTMLElement {
    // all events of triggering are allowed to be canceled and bubbled
    if (assert.isNull(opts.bubbles)) {
        opts.bubbles = true;
    }
    if (assert.isNull(opts.cancelable)) {
        opts.cancelable = true;
    }

    let evt;
    if (/^mouse|click/.test(name)) {
        evt = new MouseEvent(name, opts);
    } else if (/^key/.test(name)) {
        evt = new KeyboardEvent(name, opts);
    } else {
        evt = new Event(name, opts);
    }

    elm.dispatchEvent(evt);
    return elm;
}
