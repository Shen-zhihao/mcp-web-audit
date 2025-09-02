#!/usr/bin/env node

import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";
import { auditPackage } from "../src/entry/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
mcp-web-audit - 前端工程安全审计工具

用法:
  npx mcp-web-audit [options] <项目路径>

参数:
  <项目路径>           要审计的项目路径（本地绝对路径或远程仓库URL）

选项:
  -o, --output <文件>  指定输出报告的文件路径 (默认: ./audit-report.md)
  -h, --help          显示帮助信息
  -v, --version       显示版本信息

示例:
  # 审计本地项目
  npx mcp-web-audit /path/to/your/project

  # 审计远程仓库
  npx mcp-web-audit https://github.com/user/repo

  # 指定输出文件
  npx mcp-web-audit /path/to/project -o ./my-audit.md

  # 显示帮助
  npx mcp-web-audit --help
`);
}

/**
 * 显示版本信息
 */
async function showVersion() {
  try {
    const packageJsonPath = join(__dirname, "../package.json");
    const { readFile } = await import("fs/promises");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
    console.log(`mcp-web-audit v${packageJson.version}`);
  } catch (error) {
    console.log("mcp-web-audit");
  }
}

/**
 * 解析命令行参数
 */
function parseArgs(args) {
  const result = {
    projectPath: "",
    outputPath: "./audit-report.md",
    showHelp: false,
    showVersion: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "-h" || arg === "--help") {
      result.showHelp = true;
    } else if (arg === "-v" || arg === "--version") {
      result.showVersion = true;
    } else if (arg === "-o" || arg === "--output") {
      if (i + 1 < args.length) {
        result.outputPath = args[i + 1];
        i++; // 跳过下一个参数
      } else {
        throw new Error("选项 -o/--output 需要指定文件路径");
      }
    } else if (!arg.startsWith("-")) {
      if (!result.projectPath) {
        result.projectPath = arg;
      }
    } else {
      throw new Error(`未知选项: ${arg}`);
    }
  }

  return result;
}

/**
 * 验证项目路径
 */
function validateProjectPath(projectPath) {
  if (!projectPath) {
    throw new Error("请指定要审计的项目路径");
  }

  // 检查是否为远程URL
  if (projectPath.startsWith("http://") || projectPath.startsWith("https://")) {
    return true;
  }

  // 检查是否为绝对路径
  if (!resolve(projectPath) === projectPath) {
    console.warn("建议使用绝对路径，当前使用相对路径:", projectPath);
  }

  return true;
}

/**
 * 主函数
 */
async function main() {
  try {
    const args = process.argv.slice(2);

    if (args.length === 0) {
      showHelp();
      process.exit(0);
    }

    const options = parseArgs(args);

    if (options.showHelp) {
      showHelp();
      process.exit(0);
    }

    if (options.showVersion) {
      await showVersion();
      process.exit(0);
    }

    validateProjectPath(options.projectPath);

    console.log("🔍 开始审计项目...");
    console.log(`📁 项目路径: ${options.projectPath}`);
    console.log(`📄 输出文件: ${options.outputPath}`);
    console.log("");

    // 显示进度提示
    const progressSteps = [
      "📦 解析项目结构...",
      "🔐 生成依赖锁定文件...",
      "🔍 执行安全扫描...",
      "📊 生成审计报告...",
    ];

    let currentStep = 0;
    const showProgress = () => {
      if (currentStep < progressSteps.length) {
        console.log(progressSteps[currentStep]);
        currentStep++;
      }
    };

    // 每隔2秒显示下一个进度步骤
    const progressInterval = setInterval(showProgress, 2000);
    showProgress(); // 立即显示第一步

    const startTime = Date.now();

    try {
      await auditPackage(options.projectPath, options.outputPath);
    } finally {
      clearInterval(progressInterval);
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("");
    console.log("✅ 审计完成!");
    console.log(`📊 报告已保存到: ${options.outputPath}`);
    console.log(`⏱️  耗时: ${duration}秒`);
    console.log("");
    console.log("💡 提示: 请查看生成的报告文件了解详细的安全审计结果");
  } catch (error) {
    console.error("");
    console.error("❌ 审计失败:", error.message);
    console.error("");

    // 根据不同的错误类型提供具体的解决建议
    if (error.message.includes("ENOENT") || error.message.includes("找不到")) {
      console.error("💡 可能的解决方案:");
      console.error("  - 检查项目路径是否正确");
      console.error("  - 确保路径存在且可访问");
      console.error("  - 使用绝对路径而非相对路径");
    } else if (
      error.message.includes("网络") ||
      error.message.includes("timeout") ||
      error.message.includes("ENOTFOUND")
    ) {
      console.error("💡 可能的解决方案:");
      console.error("  - 检查网络连接是否正常");
      console.error("  - 确认远程仓库URL是否正确");
      console.error("  - 尝试使用VPN或代理");
    } else if (
      error.message.includes("权限") ||
      error.message.includes("EACCES")
    ) {
      console.error("💡 可能的解决方案:");
      console.error("  - 检查文件夹读写权限");
      console.error("  - 尝试以管理员身份运行");
      console.error("  - 更改输出文件路径到有权限的目录");
    } else if (
      error.message.includes("空间") ||
      error.message.includes("ENOSPC")
    ) {
      console.error("💡 可能的解决方案:");
      console.error("  - 清理磁盘空间");
      console.error("  - 选择其他磁盘分区");
    } else {
      console.error("💡 通用解决方案:");
      console.error("  - 确保使用 Node.js 14+ 版本");
      console.error("  - 检查项目的 package.json 文件是否存在且格式正确");
      console.error("  - 尝试在项目根目录运行命令");
    }

    console.error("");
    console.error("📚 更多帮助:");
    console.error("  - 使用 --help 查看使用说明");
    console.error("  - 访问项目主页获取更多信息");

    process.exit(1);
  }
}

// 运行主函数
main();
