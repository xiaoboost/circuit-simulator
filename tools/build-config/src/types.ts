export interface BuildConfig {
 /** 构建模式 */
 mode: 'dev' | 'prod';
 /** 分析模式 */
 analyze?: boolean;
 /** 项目根目录 */
 rootDir: string;
 /** 构建输出目录 */
 outputDir: string;
 /** 入口文件 */
 entry: string;
 /** ts 配置文件 */
 tsConfig: string;
 /** 版本号 */
 version: string;
 /** 模板文件 */
 template: string;
 /** 元数据 */
 meta: Record<string, any>;
}
