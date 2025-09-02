import { getDepChains } from './getDepChain.js';

function _normalizeVulnerabilities(auditResult) {
  const result = {
    critical: [],
    high: [],
    moderate: [],
    low: [],
  };
  for (const key in auditResult.vulnerabilities) {
    const packageInfo = auditResult.vulnerabilities[key];
    const normalizedPackage = _normalizePackage(packageInfo);
    if (normalizedPackage) {
      result[normalizedPackage.severity].push(normalizedPackage);
    }
  }
  return result;

  function _normalizePackage(packageInfo) {
    const { via = [] } = packageInfo;
    const validVia = via.filter((it) => typeof it === 'object');
    if (validVia.length === 0) {
      return null;
    }
    const info = {
      name: packageInfo.name,
      severity: packageInfo.severity,
      problems: validVia,
      nodes: packageInfo.nodes || [],
    };
    info.depChains = getDepChains(packageInfo, auditResult.vulnerabilities);
    // info.depChains = info.depChains.filter(
    //   (chain) => !isInvalidChain(chain, packageInfo.name)
    // );
    return info;
  }
}

function isInvalidChain(chain, packageName) {
  return chain.length === 0 || (chain.length === 1 && chain[0] === packageName);
}

export function normalizeAuditResult(auditResult) {
  return {
    vulnerabilities: _normalizeVulnerabilities(auditResult),
  };
}
