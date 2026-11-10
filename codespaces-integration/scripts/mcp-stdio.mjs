#!/usr/bin/env node
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod';
import {makeCodespaces} from './codespaces-core.mjs';
if(!process.env.HC_CODESPACE_AUDIT_PATH){
 console.error('HC_CODESPACE_AUDIT_PATH required for private audit logging');process.exit(1);
}
const api=makeCodespaces();
const server=new McpServer({name:'hobby-corner-codespaces',version:'0.1.0'});
function register(name,description,inputSchema,fn,readOnlyHint=false){
 server.registerTool(name,{description,inputSchema,annotations:{readOnlyHint,destructiveHint:false,openWorldHint:true}},async args=>{
  try{return {content:[{type:'text',text:JSON.stringify(await fn(args))}]};}
  catch(e){return {isError:true,content:[{type:'text',text:e.message}]};}
 });
}
register('list_codespaces','List matching development Codespaces',{},()=>api.list(),true);
register('create_codespace','Create or reuse allowlisted PR #50 test Codespace; explicit approval required',
 {approval:z.literal('CREATE DEVELOPMENT CODESPACE')},a=>api.create(a.approval));
register('start_codespace','Start a development Codespace; explicit approval required',
 {name:z.string(),approval:z.literal('START DEVELOPMENT CODESPACE')},a=>api.start(a.name,a.approval));
register('node_version','Run only node --version in a running approved Codespace',
 {name:z.string()},a=>api.test(a.name));
register('stop_codespace','Stop a development Codespace; explicit approval required',
 {name:z.string(),approval:z.literal('STOP DEVELOPMENT CODESPACE')},a=>api.stop(a.name,a.approval));
register('smoke_codespace','Start an existing Codespace, run node --version and stop only if tool started it',
 {name:z.string(),approval:z.literal('RUN DEVELOPMENT SMOKE TEST')},a=>api.smoke(a.name,a.approval));
register('run_test_profile','Run one reviewed fixed Node or disposable PostgreSQL test command in the approved dev Codespace',
 {name:z.string(),profile:z.enum(['owner-source','owner-postgres']),approval:z.literal('RUN DEVELOPMENT TEST PROFILE')},
 a=>api.runProfile(a.name,a.profile,a.approval));
await server.connect(new StdioServerTransport());
