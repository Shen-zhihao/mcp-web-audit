import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { auditPackage } from './entry/index.js';

const server = new McpServer({
  name: 'audit-server',
  title: '前端工程安全审计服务',
  version: '0.1.0',
});

server.registerTool(
  'auditPackage',
  {
    title: '审计前端工程',
    description:
      '审计前端工程的所有直接和间接依赖，得到安全审计结果。支持本地工程的审计，也支持远程仓库的审计。审计结果为标准格式的markdown字符串，不用修改，直接用于展示即可。',
    inputSchema: {
      projectRoot: z
        .string()
        .describe('本地工程的根路径，或者远程仓库的URL地址'),
      savePath: z
        .string()
        .describe(
          '保存审计结果的路径，传递当前工程的根路径下的工程明audit.md，如果没有当前工程，则传递桌面路径下的audit.md（注意，桌面路径必须传入绝对路径）'
        ),
    },
  },
  async ({ projectRoot, savePath }) => {
    await auditPackage(projectRoot, savePath);
    return {
      content: [
        {
          type: 'text',
          text: `审计完成，结果已保存到: ${savePath}`,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
