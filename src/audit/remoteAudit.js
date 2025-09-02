const URL = 'https://registry.npmjs.org/-/npm/v1/security/audits';

export async function remoteAudit(packageName, pacakgeVersion) {
  const body = {
    name: 'example-audit', // 项目名字随便写
    version: '1.0.0', // 项目的版本，随便写
    requires: {
      [packageName]: pacakgeVersion,
    },
    dependencies: {
      [packageName]: {
        version: pacakgeVersion,
      },
    },
  };
  const resp = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await resp.json();
}
