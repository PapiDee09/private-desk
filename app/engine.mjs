// Only fabricated data is used. No real inbox, calendar, documents, credentials or APIs.
export const DATA = Object.freeze({
  legal: {
    label: 'Contract review', eyebrow: 'LEGAL OPERATIONS', icon: '§',
    subhead: 'Spot the questions that deserve an attorney’s attention.',
    task: 'Read the sample service agreement, identify material points, and prepare a review note. Do not give legal advice.',
    document: 'DEMO ONLY — Fabricated Meridian Works consulting agreement. Monthly retainer: $4,800. Term: 12 months. Termination: either party may terminate for convenience with 15 days written notice. Payment: due within 14 days of invoice. Governing law: not specified. Confidentiality: parties agree to maintain confidentiality, no survival period specified. This is synthetic data.',
    resultTitle: 'Contract review brief',
    simulation: {
      result: 'The sample agreement outlines a $4,800 monthly retainer for 12 months. Three provisions should be reviewed before anyone signs: the short 15-day termination notice, the missing governing-law provision, and the undefined duration of confidentiality obligations. This is an issue-spotting draft, not legal advice.',
      steps: ['Flag 15-day termination notice for attorney review', 'Ask which law governs the agreement', 'Clarify confidentiality obligations after termination'],
      caution: 'Attorney approval required before client delivery.'
    }
  },
  finance: {
    label: 'Invoice triage', eyebrow: 'FINANCIAL OPERATIONS', icon: '▤',
    subhead: 'Turn a busy invoice queue into a clear review list.',
    task: 'Summarize the sample invoices, identify which is overdue as of 2026-11-07, and draft a professional follow-up. Never initiate a payment.',
    document: 'DEMO ONLY — Fabricated payables as of 2026-11-07. Invoice INV-101 Vendor A amount $1,200 due 2026-10-29 status unpaid. Invoice INV-102 Vendor B amount $730 due 2026-11-13 status unpaid. Invoice INV-103 Vendor C amount $450 due 2026-11-03 status paid. No real account data.',
    resultTitle: 'Accounts payable review',
    simulation: {
      result: 'Two invoices are unpaid, totaling $1,930. INV-101 ($1,200) is overdue as of November 7; INV-102 ($730) is not yet due. INV-103 is already marked paid. Suggested follow-up: “Could you please confirm the payment status of INV-101 and share the expected settlement date?”',
      steps: ['Review overdue INV-101 ($1,200)', 'Leave paid INV-103 untouched', 'Request human approval for any payment-related message'],
      caution: 'No payment initiated and no email sent.'
    }
  },
  scheduling: {
    label: 'Schedule assistant', eyebrow: 'EXECUTIVE OPERATIONS', icon: '◷',
    subhead: 'Propose time slots without touching a real calendar.',
    task: 'Based on the synthetic diary, propose two appointment times and draft a confirmation note. Never create or modify an actual calendar event.',
    document: 'DEMO ONLY — Fabricated executive calendar on Tuesday 2026-11-10, Africa/Lagos. Busy 09:00–10:00 project review, 11:30–12:30 investor call, 15:00–16:00 team sync. Work hours 09:00–17:00. Request: schedule a 30-minute introductory client consultation. No real calendar access.',
    resultTitle: 'Consultation scheduling draft',
    simulation: {
      result: 'Two available 30-minute windows on Tuesday, November 10 (Africa/Lagos) are 10:30–11:00 and 13:30–14:00. Draft: “Thank you for reaching out. Would 10:30 AM or 1:30 PM on Tuesday work for a short introductory call?” This is a proposal only.',
      steps: ['Offer 10:30–11:00 WAT', 'Offer 13:30–14:00 WAT', 'Await confirmation before adding anything to a calendar'],
      caution: 'No appointment has been booked.'
    }
  }
});

export function validateRequest(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Expected a JSON object');
  const scenario = typeof payload.scenario === 'string' ? payload.scenario : '';
  if (!Object.prototype.hasOwnProperty.call(DATA, scenario)) throw new Error('Unknown scenario');
  return scenario;
}

export function simulatedResponse(scenario) {
  const item = DATA[scenario];
  return { scenario, title: item.resultTitle, result: item.simulation.result,
    steps: item.simulation.steps, caution: item.simulation.caution,
    model: 'deterministic mock', engine: 'simulation', requiresApproval: true,
    actionsTaken: [], generatedAt: new Date().toISOString() };
}
