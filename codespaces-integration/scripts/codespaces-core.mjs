import {spawn} from 'node:child_process';
import {appendFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
export const REPO='Tawgod/Lightspeed';
export const BRANCH='feature/first-owner-passkey-registration-integration-20261110';
const NAME=/^[a-zA-Z0-9-]{1,100}$/;
export function redact(s){return String(s).replace(/(gh[pousr]_[A-Za-z0-9_]{10,}|github_pat_[A-Za-z0-9_]{10,}|Bearer\s+\S+)/gi,'[REDACTED]');}
export function ghRunner(args,{timeoutMs=90000,env=process.env}={}){
 return new Promise((resolve,reject)=>{
  if(!env.GH_TOKEN)return reject(Error('GH_TOKEN required on authorized host'));
  const child=spawn('gh',args,{shell:false,env,stdio:['ignore','pipe','pipe']});
  let out='',err='',done=false;const timer=setTimeout(()=>child.kill('SIGKILL'),timeoutMs);
  child.stdout.on('data',d=>{out+=d.toString().slice(0,Math.max(0,16384-out.length));});
  child.stderr.on('data',d=>{err+=d.toString().slice(0,Math.max(0,16384-err.length));});
  child.once('error',e=>{if(!done){done=true;clearTimeout(timer);reject(e)}});
  child.once('close',(code,signal)=>{if(done)return;done=true;clearTimeout(timer);
   if(code!==0)reject(Error(`GitHub CLI failed (${signal||code}): ${redact(err).slice(0,500)}`));else resolve(out.trim());});
 });
}
export function makeCodespaces({run=ghRunner,auditPath=process.env.HC_CODESPACE_AUDIT_PATH||null,now=()=>new Date().toISOString(),pause=ms=>new Promise(r=>setTimeout(r,ms))}={}){
 async function audit(event,data={}){
  if(!auditPath)return;
  await mkdir(dirname(auditPath),{recursive:true,mode:0o700});
  await appendFile(auditPath,JSON.stringify({timestamp:now(),event,...data})+'\n',{mode:0o600,flag:'a'});
 }
 async function exec(args,operation,name){
  await audit('requested',{operation,codespace:name??null});
  try{const out=await run(args);await audit('succeeded',{operation,codespace:name??null});return out;}
  catch(e){await audit('failed',{operation,codespace:name??null,error:redact(e.message).slice(0,200)});throw e;}
 }
 async function list(){
  const rows=JSON.parse(await exec(['codespace','list','--repo',REPO,'--limit','100','--json','name,state,repository,gitStatus,displayName'],'list'));
  if(!Array.isArray(rows))throw Error('Unexpected Codespaces list');
  return rows.filter(row=>row.repository===REPO).map(row=>({name:row.name,state:row.state,repository:row.repository,branch:row.gitStatus?.ref??null,displayName:row.displayName??null}));
 }
 async function checked(name){
  if(!NAME.test(name||''))throw Error('Invalid Codespace name');
  if(!(await list()).some(row=>row.name===name))throw Error('Codespace not found in allowed repository');
  const v=JSON.parse(await exec(['codespace','view','--codespace',name,'--json','name,repository,gitStatus,state,idleTimeoutMinutes'],'view',name));
  if(v.name!==name||v.repository!==REPO||v.gitStatus?.ref!==BRANCH)throw Error('Codespace repository or branch outside allowlist');
  return v;
 }
 async function create(approval){
  if(approval!=='CREATE DEVELOPMENT CODESPACE')throw Error('Explicit creation approval required');
  const existing=(await list()).find(cs=>cs.branch===BRANCH);
  if(existing)return {created:false,existing:existing.name};
  const name=await exec(['codespace','create','--repo',REPO,'--branch',BRANCH,'--idle-timeout','30m','--display-name','Hobby Corner AI development'],'create');
  return {created:true,name};
 }
 async function start(name,approval){
  if(approval!=='START DEVELOPMENT CODESPACE')throw Error('Explicit start approval required');
  const v=await checked(name);if(v.state==='Available')return {started:false,alreadyRunning:true};
  await exec(['api','--method','POST',`/user/codespaces/${name}/start`],'start',name);
  return {started:true};
 }
 async function stop(name,approval){
  if(approval!=='STOP DEVELOPMENT CODESPACE')throw Error('Explicit stop approval required');
  const v=await checked(name);if(v.state==='Shutdown')return {stopped:false,alreadyStopped:true};
  await exec(['codespace','stop','--codespace',name],'stop',name);return {stopped:true};
 }
 async function test(name){
  const v=await checked(name);if(v.state!=='Available')throw Error('Codespace must be Available');
  const output=await exec(['codespace','ssh','--codespace',name,'node --version'],'node-version',name);
  if(!/^v\d+\.\d+\.\d+/.test(output))throw Error('Unexpected Node version output');
  return {command:'node --version',output:output.slice(0,200)};
 }
 async function smoke(name,approval){
  if(approval!=='RUN DEVELOPMENT SMOKE TEST')throw Error('Explicit smoke approval required');
  const v=await checked(name);const alreadyRunning=v.state==='Available';let output,error,cleanupError;
  try{
   if(!alreadyRunning)await start(name,'START DEVELOPMENT CODESPACE');
   let available=alreadyRunning;
   for(let i=0;!available&&i<30;i++){
    await pause(3000);const current=await checked(name);
    if(current.state==='Available')available=true;
    else if(['Failed','Unavailable'].includes(current.state))throw Error('Codespace failed to start');
   }
   if(!available)throw Error('Codespace startup timeout');
   output=await test(name);
  }catch(e){error=e.message;}
  finally{if(!alreadyRunning)try{await stop(name,'STOP DEVELOPMENT CODESPACE')}catch(e){cleanupError=e.message;}}
  if(error||cleanupError)return {ok:false,error:error??null,cleanupError:cleanupError??null};
  return {ok:true,stoppedAfterTest:!alreadyRunning,...output};
 }
 return {list,checked,create,start,stop,test,smoke};
}
