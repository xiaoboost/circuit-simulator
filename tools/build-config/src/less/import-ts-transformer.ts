import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import type { Transformer } from './types';

function getImports(code: string) {
  // 匹配 @import 'xxxx.ts' 语句
  const importRegex = /@import\s+['"](\S+\.ts)['"];?/g;
  const imports: [string, string][] = [];

  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(code))) {
    imports.push([match[0], match[1]]);
  }

  return imports;
}

export function convertToLessVariables(content: string): string {
  // 匹配注释和变量定义的正则表达式
  const regex = /\/\*\*\s*([^*]+)\s*\*\/\s*export\s+const\s+(\w+)\s*=\s*([^;]+);/g;

  let result = '';
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [
      , comment, variableName, value,
    ] = match;
    // 清理注释中的多余空格
    const cleanComment = comment.trim();
    // 处理值：如果是字符串（带引号），则去掉引号
    const processedValue = value.trim().replace(/^['"](.*)['"]$/, '$1');

    // 构建 Less 变量
    result += `// ${cleanComment}\n@${variableName}: ${processedValue};\n\n`;
  }

  return result;
}

export const importTsTransform: Transformer = async (code, _, resourcePath) => {
  const imports = getImports(code);

  if (imports.length === 0) {
    return code;
  }

  let content = code;

  for (const [importStatement, importPath] of imports) {
    const importCode = await readFile(join(dirname(resourcePath), importPath), 'utf-8');
    const lessVariables = convertToLessVariables(importCode);

    content = content.replace(importStatement, lessVariables);
  }

  return content;
};
