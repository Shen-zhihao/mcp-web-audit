import fs from 'fs';

import { join } from 'path';
import { uniqueId, getDirname } from '../common/utils.js';

const __dirname = getDirname(import.meta.url); // 获取当前文件的目录名

const basePath = join(__dirname, '../..'); // 获取上两级目录
const workBasePath = join(basePath, 'work'); // 定义工作目录路径
fs.mkdirSync(workBasePath, { recursive: true }); // 确保工作目录存在

export async function createWorkDir() {
  const workDir = join(workBasePath, uniqueId());
  await fs.promises.mkdir(workDir, { recursive: true }); // 创建工作目录
  return workDir;
}

// 删除工作目录
export async function deleteWorkDir(workDir) {
  await fs.promises.rm(workDir, { recursive: true }); // 删除工作目录
}
