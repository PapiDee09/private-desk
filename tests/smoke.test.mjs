import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA, validateRequest, simulatedResponse } from '../app/engine.mjs';
import { app } from '../app/server.mjs';

test('three synthetic use cases are included', () => assert.deepEqual(Object.keys(DATA), ['legal','finance','scheduling']));
test('rejects unrecognized scenarios', () => assert.throws(() => validateRequest({scenario:'email-sender'}), /Unknown scenario/));
test('rejects invalid body', () => assert.throws(() => validateRequest(null), /Expected a JSON object/));
test('only draft output, no external side effects', () => {
  for (const id of Object.keys(DATA)) {
    const result = simulatedResponse(id);
    assert.equal(result.requiresApproval, true);
    assert.deepEqual(result.actionsTaken, []);
    assert.equal(result.engine, 'simulation');
    assert.ok(result.result.length > 70);
  }
});
test('HTTP API reports mode and returns synthetic response', async () => {
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  try {
    const base = `http://127.0.0.1:${app.address().port}`;
    const status = await (await fetch(base+'/api/status')).json();
    assert.equal(status.mode, 'simulation');
    const result = await fetch(base+'/api/run', {method:'POST',headers:{'Content-Type':'application/json'}, body:JSON.stringify({scenario:'legal'})});
    assert.equal(result.status,200);
    const body = await result.json();
    assert.equal(body.actionsTaken.length,0);
    const invalid = await fetch(base+'/api/run', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenario:'bogus'})});
    assert.equal(invalid.status,400);
    const homepage = await fetch(base+'/');
    assert.equal(homepage.status,200);
    assert.ok((await homepage.text()).includes('PRIVATE DESK'));
  } finally { await new Promise(resolve => app.close(resolve)); }
});
