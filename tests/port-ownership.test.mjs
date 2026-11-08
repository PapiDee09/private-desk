import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const project = new URL('../', import.meta.url);
const file = (name) => readFileSync(new URL(name, project), 'utf8');

test('Private Desk reserves 3105 and does not claim A&P port 3000', () => {
  const app = file('app/server.mjs');
  const docker = file('compose.yaml');
  const image = file('app/Dockerfile');
  assert.match(app, /process\.env\.PORT \|\| 3105/);
  assert.match(docker, /127\.0\.0\.1:3105:3105/);
  assert.match(docker, /PORT: '3105'/);
  assert.match(image, /EXPOSE 3105/);
  assert.doesNotMatch(app + docker + image, /3000/);
});
