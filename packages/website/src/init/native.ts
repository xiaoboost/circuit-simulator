// 全局禁止右键
document.body.oncontextmenu = null;
document.body.addEventListener('contextmenu', (event) => event.preventDefault(), true);
