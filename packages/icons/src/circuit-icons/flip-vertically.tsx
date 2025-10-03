import React from 'react';

/** 垂直翻转 */
export function FlipVertically() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      width="1em"
      viewBox="0 0 48 48"
      fill="none"
    >
      <path d="M42 24L6 24" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M14 4L36 16H14V4Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" />
      <path d="M14 44V32H36L14 44Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" />
    </svg>
  );
}
