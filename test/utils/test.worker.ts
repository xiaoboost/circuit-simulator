const ctx: Worker = self as any;

ctx.addEventListener('message', ({ data: time }: MessageEvent) => {
    setTimeout(() => ctx.postMessage('finish'), time);
});
