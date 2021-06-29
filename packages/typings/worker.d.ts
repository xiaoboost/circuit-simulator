declare module '*.worker.ts' {
  const WorkerConstructor: () => Worker;
  export default WorkerConstructor;
}
