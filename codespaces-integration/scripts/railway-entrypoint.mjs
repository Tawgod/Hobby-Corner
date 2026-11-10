#!/usr/bin/env node
import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';

export function launchAssessment(env=process.env){
  const enabled=env.HC_BRIDGE_ENABLED==='true';
  if(!enabled)return {mode:'standby',missing:[]};
  const required=['CONTROL_PLANE_TUNNEL_ID','CONTROL_PLANE_API_KEY','GH_TOKEN','HC_CODESPACE_AUDIT_PATH'];
  const missing=required.filter(key=>!env[key]);
  if(missing.length)return {mode:'blocked',missing};
  if(!/^tunnel_[A-Za-z0-9_-]+$/.test(env.CONTROL_PLANE_TUNNEL_ID)){
    return {mode:'blocked',missing:['invalid CONTROL_PLANE_TUNNEL_ID']};
  }
  if(env.HC_CODESPACE_EXECUTION_ENABLED==='true' &&
     !env.HC_CODESPACE_AUDIT_PATH.startsWith('/data/')){
    return {mode:'blocked',missing:['durable /data/ audit path required for execution']};
  }
  return {mode:'tunnel',missing:[]};
}

export async function main(env=process.env){
  const result=launchAssessment(env);
  if(result.mode==='blocked'){
    console.error('Codespaces bridge blocked: '+result.missing.join(', '));
    process.exitCode=1;
    return;
  }
  if(result.mode==='standby'){
    console.info('Codespaces bridge STANDBY: no tunnel, GitHub access or commands enabled.');
    const keepalive=setInterval(()=>{},60000);
    process.once('SIGTERM',()=>{clearInterval(keepalive);process.exit(0)});
    process.once('SIGINT',()=>{clearInterval(keepalive);process.exit(0)});
    return;
  }
  console.info('Codespaces bridge starting private outbound tunnel (no inbound domain).');
  const child=spawn('tunnel-client-runtime',['run'],{
    env:{...env,MCP_COMMAND:'node /app/scripts/mcp-stdio.mjs'},
    stdio:['ignore','inherit','inherit'],
    shell:false
  });
  const stop=()=>child.kill('SIGTERM');
  process.once('SIGTERM',stop);
  process.once('SIGINT',stop);
  child.once('error',error=>{
    console.error('Tunnel process could not start: '+error.code);
    process.exitCode=1;
  });
  child.once('close',(code,signal)=>{
    console.info('Tunnel exited: '+(signal||code));
    process.exit(code===0?0:1);
  });
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  await main();
}
