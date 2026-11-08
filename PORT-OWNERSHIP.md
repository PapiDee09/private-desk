# PORT OWNERSHIP — RARE SPACE / A&P

**Project-wide hard rule:** TCP port `3000` belongs to A&P / BigBag Emporium. Do not bind any Rare Space demo or related service to it. Do not stop A&P or terminate its process to free this port.

| Owner | Local TCP port | Host binding |
|---|---:|---|
| A&P / BigBag Emporium | 3000 | Existing project; keep untouched |
| Rare Space Private Desk dashboard | 3105 | 127.0.0.1:3105 |
| Private Desk n8n | 5678 | 127.0.0.1:5678 |
| Private Desk Ollama | 11434 | 127.0.0.1:11434 |

If another service already occupies a reserved port, inspect the service before doing anything. Do not kill or overwrite unrelated processes. Update this registry and all documentation/configuration/tests when intentionally changing ports.

This rule applies to source code, container orchestration, setup notes, demo screenshots, portfolio run instructions, and future integration work. The Private Desk application uses 3105 by default; do not revert to 3000.
