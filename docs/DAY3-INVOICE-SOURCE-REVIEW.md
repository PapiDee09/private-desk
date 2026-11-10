# Private Desk - Day 3 invoice source review

This issue and branch concern **Private Desk**, not the internal Revenue Desk CRM.

Builder feedback from Ruslan: show the original invoice beside the amount and due date so reviewers don't approve without checking evidence.

## Day 3 source review
- Check invoices shows INV-101, USD 1,200, due November 5 2026, beside a bundled fictional invoice PDF.
- Keep text-source line citations and human approval boundary; link to PDF page 1.
- Preserve the approved chess-king monogram and remove the earlier decorative redundancy.
- No real PDF ingestion, AI document extraction, autonomous invoice payments, or outgoing emails.
- Keep existing Private Desk port 3116 when running on the developer Mac.

## Offline build checkpoint
- 21 of 21 Node automated tests passed in build environment.
- Synthetic invoice PDF rendered and was visually inspected.
- Live browser visual verification blocked by the build environment. Mac-side parity check required.
- Full feature source is available in the independently packaged Day 3 source ZIP, to be reconciled with local Mac work before committing it here.

## Productization gates
1. Consent-based PDF ingestion, parser/OCR checks, provenance, source anchors and data validation.
2. Measured n8n/Ollama quality, latency, errors and recovery on target hardware.
3. User accounts and roles, secure file storage, approved actions and immutable audit records.
4. Backup/restore, retention/deletion, privacy/security assessment, versioned releases.
5. Real client workflow validation, paid pilots, support and licensing.

Status: preparation branch only. Do not merge into main or claim Day 3 source is synchronized to GitHub until Mac reconciliation is complete.