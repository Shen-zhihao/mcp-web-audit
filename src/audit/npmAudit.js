import fs from 'fs';
import { join } from 'path';
import { runCommand } from '../common/utils.js';

export async function npmAudit(workDir) {
  const cmd = `npm audit --json`;
  const jsonResult = await runCommand(cmd, workDir); // 在工作目录中执行命令
  const auditData = JSON.parse(jsonResult);
  return auditData;
}
