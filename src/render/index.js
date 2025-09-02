import { renderMarkdown } from './markdown.js';

const desc = {
  severityLevels: {
    low: '低危',
    moderate: '中危',
    high: '高危',
    critical: '严重',
  },
};

/**
 * 讲auditResult渲染为markdown格式的字符串
 * @param {object} auditResult 规范化的审计结果
 * @param {object} packageJson 包的package.json内容
 */
export async function render(auditResult, packageJson) {
  const data = {
    audit: auditResult,
    desc,
    packageJson,
  };
  return await renderMarkdown(data);
}
