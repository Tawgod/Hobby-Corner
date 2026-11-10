import test from 'node:test';
import assert from 'node:assert/strict';
import {launchAssessment} from '../scripts/railway-entrypoint.mjs';

test('Railway deployment stays disconnected without explicit activation',()=>{
 assert.deepEqual(launchAssessment({}),{mode:'standby',missing:[]});
 assert.equal(launchAssessment({GH_TOKEN:'synthetic'}).mode,'standby');
});
test('activation fails closed without required independent credentials',()=>{
 const result=launchAssessment({HC_BRIDGE_ENABLED:'true'});
 assert.equal(result.mode,'blocked');
 assert.ok(result.missing.includes('CONTROL_PLANE_API_KEY'));
 assert.ok(result.missing.includes('GH_TOKEN'));
});
test('all required credentials permit tunnel process only in explicit mode',()=>{
 const result=launchAssessment({
  HC_BRIDGE_ENABLED:'true',CONTROL_PLANE_TUNNEL_ID:'tunnel_test',
  CONTROL_PLANE_API_KEY:'synthetic',GH_TOKEN:'synthetic',
  HC_CODESPACE_AUDIT_PATH:'/data/audit/codespaces.jsonl'
 });
 assert.equal(result.mode,'tunnel');
});
test('invalid tunnel identifiers fail closed',()=>{
 const result=launchAssessment({
  HC_BRIDGE_ENABLED:'true',CONTROL_PLANE_TUNNEL_ID:'https://example.com',
  CONTROL_PLANE_API_KEY:'synthetic',GH_TOKEN:'synthetic',
  HC_CODESPACE_AUDIT_PATH:'/data/audit/codespaces.jsonl'
 });
 assert.equal(result.mode,'blocked');
});
test('execution requires persistent private audit directory',()=>{
 const result=launchAssessment({
  HC_BRIDGE_ENABLED:'true',HC_CODESPACE_EXECUTION_ENABLED:'true',
  CONTROL_PLANE_TUNNEL_ID:'tunnel_test',CONTROL_PLANE_API_KEY:'synthetic',
  GH_TOKEN:'synthetic',HC_CODESPACE_AUDIT_PATH:'/tmp/log.jsonl'
 });
 assert.equal(result.mode,'blocked');
});
