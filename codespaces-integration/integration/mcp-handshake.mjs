import assert from 'node:assert/strict';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';

const client=new Client({name:'hobby-corner-ci-smoke-client',version:'0.1.0'});
const transport=new StdioClientTransport({
 command:process.execPath,
 args:['scripts/mcp-stdio.mjs'],
 env:{...process.env,GH_TOKEN:'test-token-no-remote-usage',HC_CODESPACE_AUDIT_PATH:'/tmp/hc-codespace-ci-audit.jsonl'}
});
try{
 await client.connect(transport);
 const {tools}=await client.listTools();
 const names=tools.map(tool=>tool.name).sort();
 assert.deepEqual(names,[
  'create_codespace','list_codespaces','node_version','run_test_profile','smoke_codespace','start_codespace','stop_codespace'
 ]);
 console.log('MCP stdio handshake verified with seven registered tools; no GitHub actions invoked.');
} finally {
 await client.close();
}
