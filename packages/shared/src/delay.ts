export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function nextTick() {
  return new Promise((resolve) => {
    Promise.resolve().then(resolve);
  });
}

export function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}
