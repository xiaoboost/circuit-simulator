import { globalStyle } from '@vanilla-extract/css';

globalStyle('*', {
  margin: 0,
  padding: 0,
  border: 0,
  cursor: 'inherit',
  userSelect: 'inherit',
});

globalStyle('html, body, #root', {
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
  userSelect: 'none',
  cursor: 'default',
});

globalStyle('input, textarea', {
  cursor: 'text',
});

Array(6).fill(0).forEach((_, i) => {
  globalStyle(`h${i + 1}`, {
    fontSize: 20 - i * 2,
    marginBottom: 15,
  });
});
