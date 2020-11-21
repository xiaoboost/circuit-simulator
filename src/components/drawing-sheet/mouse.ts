import { RefObject, useEffect } from 'react';
import { useForceUpdate } from 'src/use';
import { Point } from 'src/lib/point';

type Callback = (event: DrawEvent) => any | Promise<any>;
type StopEventInput = StopEventOption | ((event?: DrawEvent) => Promise<void>);
type HandlerEventOption = DrawEventOption | Callback | Array<DrawEventOption | Callback>;

/** 绘图事件选项 */
interface DrawEventOption {
    capture?: boolean;
    passive?: boolean;
    callback: Array<(e?: Event) => void>;
}

/** 绘图事件数据 */
interface DrawEventData {
    move: Callback[];
    cursor?: string | ((e?: DrawEvent) => string);
    stop: StopEventInput;
}

/** 鼠标结束事件配置 */
export interface StopEventOption {
    el?: HTMLElement;
    type: 'click' | 'dblclick' | 'mousedown' | 'mouseup';
    which: 'left' | 'middle' | 'right';
}

/** 绘图事件 */
export interface DrawEvent extends MouseEvent {
    movement: Point;
    position: Point;
    target: HTMLElement;
    currentTarget: HTMLElement;
}

/** 全局事件储存 */
const events: DrawEventData[] = [];

/** 事件控制器 */
export class EventController {
    /** 控制器核心元素 */
    // private el: HTMLElement;

}

export function useMouseBus(ref: RefObject<SVGSVGElement>) {
    if (process.env.NODE_ENV === 'development') {
        if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
          console.error('useMouseBus expects a single ref argument.');
        }
    }

    const update = useForceUpdate();

    useEffect(() => {
        const mouseHandler = (e: MouseEvent) => {

        };

        ref.current?.addEventListener('mousemove', mouseHandler);
    
        return () => {
            ref.current?.removeEventListener('mousemove', mouseHandler);
        };
    }, [ref.current]);

    return () => new EventController();
}
