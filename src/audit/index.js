import { npmAudit } from './npmAudit.js';
import { normalizeAuditResult } from './normalizeAuditResult.js';
import { currentAudit } from './currentAudit.js';

export async function audit(workDir, packageJson) {
  // 调用 npmAudit 获取审计结果
  const auditResult = await npmAudit(workDir);
  // 规范化审计结果
  const normalizedResult = normalizeAuditResult(auditResult);

  // 添加当前工程的审计结果
  const current = await currentAudit(packageJson.name, packageJson.version);
  if (current) {
    normalizedResult.vulnerabilities[current.severity].unshift(current);
  }
  // 添加汇总信息
  normalizedResult.summary = {
    total: Object.values(normalizedResult.vulnerabilities).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
    critical: normalizedResult.vulnerabilities.critical.length,
    high: normalizedResult.vulnerabilities.high.length,
    moderate: normalizedResult.vulnerabilities.moderate.length,
    low: normalizedResult.vulnerabilities.low.length,
  };
  return normalizedResult;
}
