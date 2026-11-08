import { simulatedResponse } from './engine.mjs';
const SCENARIOS = {
  legal: {
    title: 'Review a contract', category: 'LEGAL ASSISTANT', description: 'Spot the clauses that deserve a closer look.', symbol: '§',
    documentTitle: 'Meridian Works · Service agreement', documentCaption: 'SYNTHETIC CONTRACT',
    note: 'This is not legal advice.',
    fields: [ ['Monthly retainer', '$4,800'], ['Contract length', '12 months'], ['Termination notice', '15 days'], ['Governing law', 'Not specified', 'missing'] ]
  },
  finance: {
    title: 'Check invoices', category: 'FINANCE ASSISTANT', description: 'See what is due, overdue, or already paid.', symbol: '$',
    documentTitle: 'Accounts payable · November', documentCaption: 'SYNTHETIC INVOICE LIST',
    note: 'No payments or messages will be made.',
    fields: [ ['INV-101 · Vendor A', '$1,200 · Overdue', 'missing'], ['INV-102 · Vendor B', '$730 · Due 13 Nov'], ['INV-103 · Vendor C', '$450 · Paid'] ]
  },
  scheduling: {
    title: 'Plan a meeting', category: 'CALENDAR ASSISTANT', description: 'Find available times without changing a calendar.', symbol: '◷',
    documentTitle: 'Tuesday 10 Nov · Sample diary', documentCaption: 'FICTIONAL CALENDAR · WAT',
    note: 'No calendar events will be created.',
    fields: [ ['Meeting request', '30-minute consultation'], ['Busy', '09:00–10:00'], ['Busy', '11:30–12:30'], ['Busy', '15:00–16:00'] ]
  }
};

let selected = 'legal';
let running = false;
let latestDraft = null;
const $ = id => document.getElementById(id);
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function emptyState() {
  const container = el('div','empty-state');
  const icon = el('div','empty-illustration');
  icon.setAttribute('aria-hidden','true');
  const back = el('div','empty-sheet sheet-back');
  const front = el('div','empty-sheet sheet-front');
  for(let i=0;i<3;i++) front.append(el('i'));
  icon.append(back,front,el('span','sparkle','✳'));
  container.append(icon,el('h3','','Ready when you are.'),el('p','','Your draft will appear here once you run the example.'));
  return container;
}
function setScenario(key) {
  if (!Object.hasOwn(SCENARIOS, key)) return;
  selected = key;
  latestDraft = null;
  for (const button of document.querySelectorAll('.task-button')) {
    const active = button.dataset.scenario === key;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  }
  const task=SCENARIOS[key];
  $('taskIcon').textContent=task.symbol;
  $('categoryLabel').textContent=task.category;
  $('taskTitle').textContent=task.title;
  $('scenarioDescription').textContent=task.description;
  $('documentTitle').textContent=task.documentTitle;
  $('documentCaption').textContent=task.documentCaption;
  $('sampleNote').textContent=task.note;
  const rows=task.fields.map(([label,value,kind])=>{
    const row=el('div','field-row');
    row.append(el('span','field-label',label),el('span',`field-value${kind?' '+kind:''}`,value));
    return row;
  });
  $('documentFields').replaceChildren(...rows);
  $('resultPanel').replaceChildren(emptyState());
  $('draftState').textContent='WAITING TO RUN';
  $('draftState').className='draft-state';
}
function renderResult(result) {
  latestDraft=result;
  $('draftState').textContent='READY TO REVIEW';
  $('draftState').className='draft-state done';
  const wrap=el('div','result-content');
  wrap.append(el('div','result-label',result.engine==='simulation'?'SIMULATED SAMPLE RESULT':'GENERATED WITH YOUR LOCAL AI'));
  wrap.append(el('h3','',result.title || 'Your draft'));
  wrap.append(el('p','draft-text',result.result || 'No draft was returned.'));
  if (Array.isArray(result.steps) && result.steps.length) {
    const next=el('div','next-steps'); next.append(el('h4','','BEFORE YOU USE THIS'));
    const ol=el('ol'); result.steps.slice(0,4).forEach(s=>ol.append(el('li','',String(s))));
    next.append(ol); wrap.append(next);
  }
  const actions=el('div','result-actions');
  const copy=el('button','secondary-action','Copy draft');
  copy.type='button';
  copy.addEventListener('click',async()=>{
    try {
      await navigator.clipboard.writeText([result.title,result.result,...(result.steps||[])].filter(Boolean).join('\n\n'));
      copy.textContent='Copied ✓';
    } catch { copy.textContent='Copy unavailable'; }
  });
  actions.append(copy,el('span','result-model',result.engine==='simulation'?'Demo preview · No model used':'n8n + Ollama · Local inference'));
  wrap.append(actions);
  $('resultPanel').replaceChildren(wrap);
}
function runSelected() {
  if (running) return;
  running=true;
  const key=selected;
  const button=$('runButton');
  button.disabled=true;
  button.replaceChildren(el('span','','Working…'),el('span','button-spinner'));
  $('draftState').textContent='PREPARING DRAFT';
  $('draftState').className='draft-state';
  const loading=el('div','loading-state');
  loading.append(el('div','loading-ring'),el('h3','','Putting your draft together…'),el('p','','Using a prewritten sample result.'));
  $('resultPanel').replaceChildren(loading);
  try {
    renderResult(simulatedResponse(key));
  } catch(error) {
    if(key===selected){
      const message=el('div','error-state');
      message.append(el('h3','','Couldn’t finish this one.'),el('p','',String(error.message||'Something went wrong.')));
      $('resultPanel').replaceChildren(message);
      $('draftState').textContent='NEEDS ATTENTION';
      $('draftState').className='draft-state error';
    }
  } finally {
    running=false;
    button.disabled=false;
    const arrow=el('span','','→');
    arrow.setAttribute('aria-hidden','true');
    button.replaceChildren(el('span','','Run example'),arrow);
  }
}
function init() {
  for(const button of document.querySelectorAll('.task-button')) {
    button.addEventListener('click',()=>setScenario(button.dataset.scenario));
  }
  $('runButton').addEventListener('click',runSelected);
  $('detailsToggle').addEventListener('click',()=>{
    const panel=$('detailsPanel');
    const open=panel.hidden;
    panel.hidden=!open;
    $('detailsToggle').setAttribute('aria-expanded',String(open));
    $('detailsArrow').textContent=open?'↘':'↗';
  });
  setScenario('legal');

}
init();
