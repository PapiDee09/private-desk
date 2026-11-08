import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../app/public/index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../app/public/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../app/public/style.css', import.meta.url), 'utf8');

test('workspace is task-first and exposes all three original workflows', () => {
  for (const scenario of ['legal', 'finance', 'scheduling']) assert.match(html, new RegExp(`data-scenario="${scenario}"`));
  assert.match(html, /id="runButton"/);
  assert.match(html, /id="resultPanel"/);
  assert.match(html, /id="modeChip"/);
  assert.match(html, /id="detailsToggle"/);
  assert.doesNotMatch(html, /class="hero-art"|class="flow-preview"|class="architecture"/);
});

test('frontend continues to use existing local API and user approval boundary', () => {
  assert.match(js, /fetch\('\/api\/status'\)/);
  assert.match(js, /fetch\('\/api\/run'/);
  assert.match(html, /Nothing gets sent, signed or booked without you/);
  assert.match(js, /navigator\.clipboard\.writeText/);
});

test('mobile workspace has a dedicated responsive layout without remote fonts', () => {
  assert.match(css, /@media\(max-width:690px\)/);
  assert.doesNotMatch(html, /https?:\/\//);
});
