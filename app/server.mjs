import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DATA, validateRequest, simulatedResponse } from './engine.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const mode = process.env.DEMO_MODE === 'live' ? 'live' : 'simulation';
const endpoint = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/rare-space-private-desk';
const port = Number(process.env.PORT || 3105);
const history = [];
const filenames = { '/': 'index.html', '/index.html': 'index.html', '/style.css': 'style.css', '/app.js': 'app.js' };
const contentTypes = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8' };

function json(res, code, value) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'"
  });
  res.end(JSON.stringify(value));
}

async function parseBody(req) {
  let text = '';
  for await (const chunk of req) {
    text += chunk.toString('utf8');
    if (text.length > 6000) throw new Error('Request too large');
  }
  return JSON.parse(text || '{}');
}

async function run(scenario) {
  if (mode === 'simulation') return simulatedResponse(scenario);
  const task = DATA[scenario];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario, task: task.task, document: task.document, resultTitle: task.resultTitle }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`n8n returned HTTP ${response.status}. Is the workflow published?`);
    const data = await response.json();
    if (!data || typeof data.result !== 'string' || !data.result.trim()) throw new Error('The workflow returned no generated text.');
    return {
      scenario, title: task.resultTitle, result: data.result.trim(),
      steps: Array.isArray(data.steps) ? data.steps.slice(0, 4) : ['Review the generated output'],
      caution: 'Human approval is required. Nothing was sent or booked.',
      model: data.model || 'qwen2.5:0.5b', engine: 'n8n + local Ollama',
      requiresApproval: true, actionsTaken: [], generatedAt: new Date().toISOString()
    };
  } finally { clearTimeout(timeout); }
}

export const app = http.createServer(async (req, res) => {
  const path = (req.url || '/').split('?')[0];
  if (req.method === 'GET' && path === '/api/status') return json(res, 200, {
    mode, service: 'Rare Space Private Desk', privacy: 'Local-only demo with synthetic inputs',
    integrations: 'Mock only', persistence: 'No records written to disk',
    scenarios: Object.keys(DATA).map(key => ({ key, label: DATA[key].label, eyebrow: DATA[key].eyebrow, subhead: DATA[key].subhead, icon: DATA[key].icon }))
  });
  if (req.method === 'GET' && path === '/api/health') return json(res, 200, { ok: true, mode });
  if (req.method === 'GET' && path === '/api/history') return json(res, 200, { items: history });
  if (req.method === 'POST' && path === '/api/run') {
    try {
      const scenario = validateRequest(await parseBody(req));
      const result = await run(scenario);
      history.unshift({ id: `RD-${String(history.length + 1).padStart(3, '0')}`, ...result });
      history.splice(12);
      return json(res, 200, result);
    } catch (error) {
      const reason = String(error.message || 'Unexpected error');
      return json(res, /Unknown scenario|Expected a JSON|Request too large|Unexpected token/.test(reason) ? 400 : 502, {
        error: reason.slice(0, 240), mode, tip: mode === 'live' ? 'Verify Ollama model and publish the imported n8n workflow.' : 'Choose an included scenario.'
      });
    }
  }
  if (req.method === 'GET' && filenames[path]) {
    try {
      const filename = filenames[path];
      const body = await readFile(join(root, 'public', filename));
      res.writeHead(200, { 'Content-Type': contentTypes[filename.split('.').at(-1)], 'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'" });
      return res.end(body);
    } catch { return json(res, 404, { error: 'Asset missing' }); }
  }
  return json(res, 404, { error: 'Not found' });
});

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  app.listen(port, process.env.BIND_HOST || '127.0.0.1', () => console.log(`Private Desk (${mode}) listening on http://localhost:${port}`));
}
