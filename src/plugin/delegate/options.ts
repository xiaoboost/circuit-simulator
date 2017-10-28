export { VueConstructor } from 'vue/types/vue';
export { VNodeDirective } from 'vue/types/vnode';

export interface Modifiers {
    self?: boolean;
    left?: boolean;
    right?: boolean;
    stop?: boolean;
    prevent?: boolean;
    // TODO:
    once?: boolean;
}

export interface CustomEvent {
    currentTarget: HTMLElement;
    target: HTMLElement;
    button: number;
    delegateTarget: HTMLElement;
    stopPropagation(): void;
    preventDefault(): void;
}

export interface SelectorParsed {
    tag: string;
    id: string;
    class: string[];
}

export interface AnyObject { [x: string]: any; }
export type Callback = (e?: CustomEvent) => void | boolean;
export type BindFunction = (type: string, selector: string | AnyObject | Callback, data?: AnyObject | Callback, fn?: Callback) => [string, string, AnyObject, Callback];
export type UnBindFunction = (type?: string, selector?: string | Callback, fn?: Callback) => [string, string | undefined, Callback | undefined];

export interface ElementData {
    events: EventsObj;
    handle(): any;
}

export interface HandlerQueueObj {
    elem: HTMLElement;
    handler: HandleObj;
}

export interface HandleObj {
    type: string;
    data: AnyObject;
    callback: Callback;
    selector: string;
    characteristic: SelectorParsed[];
    matches: Element[];
}

export interface EventsObj {
    [x: string]: HandleObj[];
}
