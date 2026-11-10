import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCodespaces,REPO,BRANCH,redact} from '../scripts/codespaces-core.mjs';
function fixture({branch=BRANCH,state='Shutdown',failNode=false}={}){
 const calls=[];const run=async args=>{
  calls.push(args);
  if(args[0]==='codespace'&&args[1]==='list')return JSON.stringify([{name:'safe-dev-123',repository:REPO,state,gitStatus:{ref:branch}}]);
  if(args[0]==='codespace'&&args[1]==='view')return JSON.stringify({name:'safe-dev-123',repository:REPO,state,gitStatus:{ref:branch}});
  if(args[0]==='codespace'&&args[1]==='ssh'){if(failNode)throw Error('SSH failed');return 'v22.16.0';}
  if(args[0]==='api'&&args.includes('--method')){state='Available';return '';}
  if(args[0]==='codespace'&&args[1]==='stop'){state='Shutdown';return '';}
  if(args[0]==='codespace'&&args[1]==='create')return 'new-space';
  return '';
 };return {api:makeCodespaces({run,pause:async()=>{}}),calls};
}
test('list uses supported CLI fields',async()=>{
 const {api,calls}=fixture();assert.equal((await api.list())[0].branch,BRANCH);
 assert.equal(calls[0].at(-1),'name,state,repository,gitStatus,displayName');
});
test('deny branch outside allowlist',async()=>{
 const {api,calls}=fixture({branch:'main'});await assert.rejects(api.test('safe-dev-123'),/not found in allowed repository|outside allowlist/);
 assert.ok(!calls.some(a=>a.includes('ssh')));
});
test('deny unsafe names',async()=>{
 const {api,calls}=fixture();await assert.rejects(api.stop('foo; rm -rf /','STOP DEVELOPMENT CODESPACE'),/Invalid Codespace name/);
 assert.ok(!calls.some(a=>a.includes('stop')));
});
test('start requires approval',async()=>{
 const {api,calls}=fixture();await assert.rejects(api.start('safe-dev-123','yes'),/approval/);assert.equal(calls.length,0);
});
test('smoke starts tests stops',async()=>{
 const {api,calls}=fixture();const r=await api.smoke('safe-dev-123','RUN DEVELOPMENT SMOKE TEST');
 assert.equal(r.ok,true);assert.equal(r.stoppedAfterTest,true);
 assert.ok(calls.some(a=>a[0]==='api'));
 assert.ok(calls.some(a=>a[1]==='ssh'&&a.at(-1)==='node --version'));
 assert.ok(calls.some(a=>a[1]==='stop'));
});
test('smoke preserves already running Codespace',async()=>{
 const {api,calls}=fixture({state:'Available'});const r=await api.smoke('safe-dev-123','RUN DEVELOPMENT SMOKE TEST');
 assert.equal(r.ok,true);assert.equal(r.stoppedAfterTest,false);assert.ok(!calls.some(a=>a[1]==='stop'));
});
test('smoke stops after test failure',async()=>{
 const {api,calls}=fixture({failNode:true});const r=await api.smoke('safe-dev-123','RUN DEVELOPMENT SMOKE TEST');
 assert.equal(r.ok,false);assert.ok(calls.some(a=>a[1]==='stop'));
});
test('create reuses existing Codespace',async()=>{
 const {api,calls}=fixture();const r=await api.create('CREATE DEVELOPMENT CODESPACE');
 assert.equal(r.created,false);assert.ok(!calls.some(a=>a[1]==='create'));
});
test('token redaction',()=>assert.equal(redact('Bearer abc123 github_pat_abcdefghijklmnop'),'[REDACTED] [REDACTED]'));

test('read-only listing excludes other development branches',async()=>{
 const {api}=fixture({branch:'main'});
 assert.deepEqual(await api.list(),[]);
});
test('fixed source profile requires active allowed environment and explicit approval',async()=>{
 const {api,calls}=fixture({state:'Available'});
 await assert.rejects(api.runProfile('safe-dev-123','owner-source','yes'),/approval/);
 const result=await api.runProfile('safe-dev-123','owner-source','RUN DEVELOPMENT TEST PROFILE');
 assert.equal(result.profile,'owner-source');
 const ssh=calls.find(a=>a[1]==='ssh');
 assert.match(ssh.at(-1),/^cd \/workspaces\/Lightspeed && node --check/);
 assert.ok(!ssh.at(-1).includes('npm install'));
});
test('no arbitrary profile name can reach SSH',async()=>{
 const {api,calls}=fixture({state:'Available'});
 await assert.rejects(api.runProfile('safe-dev-123',';curl evil','RUN DEVELOPMENT TEST PROFILE'),/Unknown test profile/);
 assert.ok(!calls.some(a=>a[1]==='ssh'));
});
test('fixed postgres profile uses only documented tests',async()=>{
 const {api,calls}=fixture({state:'Available'});
 const result=await api.runProfile('safe-dev-123','owner-postgres','RUN DEVELOPMENT TEST PROFILE');
 assert.equal(result.profile,'owner-postgres');
 const ssh=calls.find(a=>a[1]==='ssh');
 assert.match(ssh.at(-1),/first-owner-passkey-registration-postgres\.test\.mjs/);
 assert.ok(!ssh.at(-1).includes('DATABASE_URL='));
});
