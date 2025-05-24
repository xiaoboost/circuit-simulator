/**
 * 将 TypeScript 变量转换为 Less 变量格式
 * @param content TypeScript 代码内容
 * @returns 转换后的 Less 变量字符串
 */
export function convertToLessVariables(content: string): string {
  // 匹配注释和变量定义的正则表达式
  const regex = /\/\*\*\s*([^*]+)\s*\*\/\s*export\s+const\s+(\w+)\s*=\s*([^;]+);/g;

  let result = '';
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [_, comment, variableName, value] = match;

    // 清理注释中的多余空格
    const cleanComment = comment.trim();

    // 处理值：如果是字符串（带引号），则去掉引号
    const processedValue = value.trim().replace(/^['"](.*)['"]$/, '$1');

    // 构建 Less 变量
    result += `// ${cleanComment}\n@${variableName}: ${processedValue};\n\n`;
  }

  return result;
}
