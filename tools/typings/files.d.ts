declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.less' {
  const classNames: Record<string, string>;
  export = classNames;
}
