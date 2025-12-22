/**
 * eecircuit-engine 库的类型声明
 *
 * @description 此库是 Ngspice 的 WebAssembly 封装，用于在浏览器中运行电路仿真。
 * 核心类是 `Simulation`。
 */

declare module 'eecircuit-engine' {
  // ==========================================
  // 数据结构定义 (保持公开，用于解析结果)
  // ==========================================

  /** 仿真结果数据类型标识 */
  export type SimulationDataType = 'complex' | 'real';

  /** 复数结构 */
  export interface ComplexValue {
    real: number;
    img: number;
  }

  /** 基础变量元数据 */
  export interface VariableInfo {
    name: string;
    /**
     * 变量类型
     *
     * @description 比如 'voltage', 'current'
     */
    type: string;
  }

  /** 复数变量数据 (如 AC 分析结果) */
  export interface ComplexVariable {
    name: string;
    type: string;
    /**
     * 变量值
     *
     * @description 这是一个二维数组，通常对应 [时间点/频率点][值]
     */
    values: ComplexValue[][];
  }

  /** 实数变量数据 (如 Transient 分析结果) */
  export interface RealVariable {
    name: string;
    type: string;
    /**
     * 变量值
     *
     * @description 这是一个二维数组，通常对应 [索引][值]
     */
    values: number[][];
  }

  /** AC 分析 (复数) 结果集 */
  export interface ComplexSimulationResults {
    header: string;
    numVariables: number;
    variableNames: string[];
    numPoints: number;
    dataType: 'complex';
    data: ComplexVariable[];
  }

  /** Transient/DC 分析 (实数) 结果集 */
  export interface RealSimulationResults {
    header: string;
    numVariables: number;
    variableNames: string[];
    numPoints: number;
    dataType: 'real';
    data: RealVariable[];
  }

  /** 统一的仿真结果类型 */
  export type SimulationResults = ComplexSimulationResults | RealSimulationResults;

  /** 输出日志回调 */
  export type OutputEventCallback = (output: string) => void;

  // ==========================================
  // 核心类定义
  // ==========================================

  /**
   * 仿真器类
   *
   * 使用流程：
   * 1. `const sim = new Simulation();`
   * 2. `await sim.start();` (初始化引擎)
   * 3. `sim.setNetList(spiceString);` (设置电路)
   * 4. `const res = await sim.runSim();` (运行并获取结果)
   */
  export class Simulation {
    // =================================================================
    // 以下为核心 API (Core API)，电路仿真的最关键的 API
    // =================================================================

    /**
     * 启动仿真引擎
     *
     * @description 必须在任何其他操作前调用一次。此方法会加载 Wasm 文件，
     * 初始化 Emscripten 环境，并将引擎置于就绪状态。
     * 建议在应用启动时调用，并复用`Simulation`实例。
     */
    start(): Promise<void>;

    /**
     * 设置电路网表
     *
     * @description 在调用`runSim`之前必须调用此方法。
     * 它会将字符串写入 Wasm 内存中的虚拟文件系统。
     *
     * @param netList - 符合 SPICE 语法的网表字符串
     */
    setNetList(netList: string): void;

    /**
     * 运行仿真
     *
     * @description 触发仿真计算。此方法是异步的，会等待仿真完成并解析 Raw 文件数据返回。
     * 注意：同一时间只能运行一个仿真（非线程安全）。
     *
     * @returns `Promise`，解析为结构化的仿真结果对象
     */
    runSim(): Promise<SimulationResults>;

    // =================================================================
    // 以下为辅助 API (Auxiliary API)，用于获取仿真结果和调试
    // =================================================================

    /**
     * 设置日志输出回调
     *
     * @description 用于监听 Ngspice 的 stdout 输出（如错误信息、警告、计算步长日志）。
     * 如果你按照之前的建议修改了源码（Vendor），这里也能接收到实时进度信息。
     *
     * @param callback - 接收日志字符串的回调函数
     */
    setOutputEvent(callback: OutputEventCallback): void;

    /**
     * 获取上一次仿真的错误日志
     *
     * @description 如果 runSim 抛出异常或返回结果为空，可检查此数组获取详细原因。
     */
    getError(): string[];

    /**
     * 检查初始化状态
     */
    isInitialized(): boolean;

    /**
     * 获取所有历史日志
     *
     * @description 返回引擎启动以来所有的 stdout 累积字符串。
     * 通常仅用于调试，不建议用于生产环境逻辑，因为字符串会无限增长。
     */
    getInfo(): string;

    /**
     * 获取初始化阶段的日志
     */
    getInitInfo(): string;

    // =================================================================
    // 以下为内部 API (Internal)，用户不需要也不应该调用
    // =================================================================

    /**
     * @private [内部使用] Asyncify 机制挂起锁
     * 引擎内部使用此方法暂停 JS 执行，等待 Wasm 响应。
     * 外部调用会导致死锁。
     */
    private waitForNextRun(): Promise<void>;

    /**
     * @private [内部使用] Asyncify 机制唤醒器
     * runSim 内部会调用它来恢复 Wasm 执行。
     */
    private continueRun(): void;

    /**
     * @private [内部使用] 内部事件句柄
     * 这是 setOutputEvent 设置的回调在内部的存储属性或触发器。
     */
    private outputEvent(output: string): void;

    /**
     * @private [内部使用] 调试日志打印
     */
    private log_debug(message: string, ...args: any[]): void;
  }
}
