import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const flow=JSON.parse(readFileSync(new URL('../workflows/rare-space-private-desk.json',import.meta.url),'utf8'));
test('workflow has local webhook → prompt → Ollama → draft response', () => {
  const names=flow.nodes.map(n=>n.name);
  assert.deepEqual(names,['Incoming Demo Request','Normalize Input','Local Ollama Generation','Format Draft for Approval','Return Draft (No Side Effects)']);
  assert.equal(flow.nodes.find(n=>n.name==='Local Ollama Generation').parameters.url,'http://ollama:11434/api/generate');
  assert.equal(flow.nodes.find(n=>n.name==='Incoming Demo Request').parameters.path,'rare-space-private-desk');
  assert.equal(flow.active,false);
  assert.ok(!names.some(n=>/gmail|calendar|telegram|payment|stripe/i.test(n)));
});
test('n8n JavaScript code is syntactically valid with synthetic input', () => {
  const prepare=flow.nodes.find(n=>n.name==='Normalize Input').parameters.jsCode;
  const prepareFn=new Function('$input',prepare);
  const data=prepareFn({first:()=>({json:{body:{scenario:'legal',task:'Summarize this',document:'Synthetic example only'}}})});
  assert.equal(data[0].json.scenario,'legal');
  assert.ok(data[0].json.prompt.includes('Synthetic example only'));
  const finish=flow.nodes.find(n=>n.name==='Format Draft for Approval').parameters.jsCode;
  const finishFn=new Function('$input','$',finish);
  const output=finishFn({first:()=>({json:{response:'Review clause 3.',model:'qwen2.5:0.5b'}})},name=>({first:()=>({json:data[0].json})}));
  assert.equal(output[0].json.result,'Review clause 3.');
  assert.deepEqual(output[0].json.actionsTaken,[]);
});
