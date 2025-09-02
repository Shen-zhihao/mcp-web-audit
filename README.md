# mcp-web-audit

一个基于 Node.js 的前端工程安全审计工具，支持对本地项目和远程仓库进行全面的依赖安全审计。

## 🔍 功能特性

- 🛡️ **全面审计**: 审计前端工程的所有直接和间接依赖
- 🌐 **多源支持**: 支持本地工程和远程仓库（GitHub 等）的审计
- 📊 **详细报告**: 生成标准格式的 Markdown 审计报告
- 🔌 **MCP 集成**: 作为 MCP (Model Context Protocol) 服务器提供审计服务
- ⚡ **自动化**: 全自动化的审计流程，无需手动干预
- 🚀 **CLI 支持**: 支持通过 npx 直接调用，无需安装

## 📋 审计内容

- **漏洞检测**: 识别依赖包中的已知安全漏洞
- **版本分析**: 检查依赖包版本的安全性和兼容性
- **依赖链分析**: 深入分析间接依赖关系
- **风险评估**: 按严重程度分类漏洞（Critical、High、Moderate、Low）
- **修复建议**: 提供具体的修复方案和建议

## 🚀 快速开始

### 使用 npx (推荐)

无需安装，直接使用：

```bash
# 审计本地项目
npx mcp-web-audit /path/to/your/project

# 审计远程仓库
npx mcp-web-audit https://github.com/user/repo

# 指定输出文件
npx mcp-web-audit /path/to/project -o ./my-audit.md

# 查看帮助
npx mcp-web-audit --help

# 查看版本
npx mcp-web-audit --version
```

### 全局安装

```bash
# 全局安装
npm install -g mcp-web-audit

# 使用命令
mcp-web-audit /path/to/your/project
```

### 本地安装开发版本

```bash
# 克隆仓库
git clone https://github.com/shenzhihao/mcp-web-audit.git
cd mcp-web-audit

# 安装依赖
npm install

# 本地测试
node bin/cli.js /path/to/test/project
```

## 🚀 CLI 使用说明

### 基本用法

```bash
npx mcp-web-audit [options] <项目路径>
```

### 参数说明

- `<项目路径>`: 要审计的项目路径（本地绝对路径或远程仓库 URL）

### 选项

- `-o, --output <文件>`: 指定输出报告的文件路径 (默认: `./audit-report.md`)
- `-h, --help`: 显示帮助信息
- `-v, --version`: 显示版本信息

### 使用示例

```bash
# 审计当前目录
npx mcp-web-audit .

# 审计指定本地项目
npx mcp-web-audit /Users/username/my-project

# 审计GitHub仓库
npx mcp-web-audit https://github.com/facebook/react

# 指定输出文件名
npx mcp-web-audit ./my-project -o security-report.md

# 查看帮助信息
npx mcp-web-audit --help
```

### 作为 MCP 服务器运行

#### 作为 MCP 服务器运行

```bash
node src/mcpServer.js
```

### 编程式调用

```javascript
import { auditPackage } from "mcp-web-audit";

// 审计本地项目
await auditPackage("/path/to/your/project", "./audit-report.md");

// 审计远程仓库
await auditPackage("https://github.com/user/repo", "./audit-report.md");
```

## 📊 审计报告示例

生成的审计报告包含以下信息：

- **项目概述**: 项目名称、版本等基本信息
- **漏洞汇总**: 按严重程度统计的漏洞数量
- **详细漏洞列表**: 每个漏洞的详细信息，包括：
  - 漏洞描述
  - 影响的包和版本
  - 严重程度评级
  - 修复建议
  - 相关链接

## 📝 要求

- **Node.js**: >= 14.0.0
- **网络**: 审计远程仓库时需要网络连接
- **磁盘空间**: 至少 100MB 空闲空间（用于临时文件）

## 📁 项目结构

```
src/
├── audit/              # 审计核心模块
│   ├── currentAudit.js  # 当前项目审计
│   ├── getDepChain.js   # 依赖链分析
│   ├── index.js         # 审计主入口
│   ├── normalizeAuditResult.js  # 结果标准化
│   ├── npmAudit.js      # NPM 审计
│   └── remoteAudit.js   # 远程审计
├── common/             # 通用工具
│   └── utils.js        # 工具函数
├── entry/              # 程序入口
│   └── index.js        # 主要 API 入口
├── generateLock/       # Lock 文件生成
│   ├── generateLock.js # Lock 文件生成逻辑
│   └── index.js        # 模块入口
├── main/               # 主程序
│   └── index.js        # 主程序入口
├── parseProject/       # 项目解析
│   ├── index.js        # 解析入口
│   ├── parseLocalProject.js   # 本地项目解析
│   └── parseRemoteProject.js  # 远程项目解析
├── render/             # 报告渲染
│   ├── index.js        # 渲染入口
│   ├── markdown.js     # Markdown 渲染
│   └── test/           # 测试文件
├── workDir/            # 工作目录管理
│   └── index.js        # 工作目录操作
└── mcpServer.js        # MCP 服务器
```

## 🔧 API 参考

### auditPackage(projectRoot, savePath)

审计指定项目的所有依赖包。

**参数:**

- `projectRoot` (string): 项目根目录的绝对路径或远程仓库 URL
- `savePath` (string): 审计报告保存路径

**示例:**

```javascript
// 本地项目
await auditPackage("/Users/username/my-project", "./audit.md");

// 远程仓库
await auditPackage("https://github.com/facebook/react", "./react-audit.md");
```

## 📊 审计报告

生成的审计报告包含以下信息：

- **项目概述**: 项目名称、版本等基本信息
- **漏洞汇总**: 按严重程度统计的漏洞数量
- **详细漏洞列表**: 每个漏洞的详细信息，包括：
  - 漏洞描述
  - 影响的包和版本
  - 严重程度评级
  - 修复建议
  - 相关链接

## 📦 发布到 npm

如果你是项目维护者，可以按以下步骤发布到 npm：

```bash
# 1. 登录 npm （如果还没有登录）
npm login

# 2. 检查版本号（确保版本号是新的）
npm version patch  # 或者 minor/major

# 3. 发布到 npm
npm publish

# 4. 验证发布是否成功
npx mcp-web-audit --version
```

### 发布注意事项

- 确保 `package.json` 中的 `name` 字段在 npm 上是唯一的
- 检查 `files` 字段，确保包含所有必要的文件
- 测试版本可以使用 `npm publish --tag beta`

## 🛠️ 技术栈

- **运行环境**: Node.js (ES Modules)
- **核心依赖**:
  - `@modelcontextprotocol/sdk`: MCP 协议支持
  - `ejs`: 模板引擎
  - `zod`: 数据验证

## 🔒 安全审计流程

1. **项目解析**: 解析项目的 `package.json` 文件
2. **依赖分析**: 分析所有直接和间接依赖
3. **Lock 文件生成**: 生成依赖锁定文件
4. **安全扫描**: 使用 npm audit 进行安全扫描
5. **结果标准化**: 将审计结果标准化处理
6. **报告生成**: 生成 Markdown 格式的审计报告

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 📄 许可证

ISC License

## 📞 支持

如果您在使用过程中遇到问题，请提交 Issue 或联系维护者。
