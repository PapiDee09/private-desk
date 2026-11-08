# Private Desk · Rare Space Studio

Private Desk is a local-first assistant prototype for contract review, invoice triage, and scheduling. It uses fictional records throughout. Every output is a draft for human review.

![Private Desk invoice triage in simulation mode](assets/private-desk-ui-preview.png)

## Public simulation

[Open the interactive simulation](https://rare-space-private-desk.xbbnkwb722.chatgpt.site/).

The static files in `docs/` reuse the dashboard and its sample outputs. Running an example displays a prewritten draft in the browser. The public site has no AI endpoint, application API, real records, credentials, external integrations, or write actions.

## Run locally in simulation mode

With Node.js 22 or later, run `node app/server.mjs` from the project root. Open `http://localhost:3105` on the same computer, choose one of the three workflows, and select **Run example**. The Node server binds to loopback by default. Port 3000 is reserved for a separate project.

## Local AI mode

The included Docker Compose stack keeps its published ports bound to loopback. Copy `.env.example` to `.env`, replace the placeholder encryption key with a generated secret, and run `docker compose up -d --build`. Pull a small model with `docker compose exec ollama ollama pull qwen2.5:0.5b`. In local n8n, import `workflows/rare-space-private-desk.json` and activate the workflow. Set `DEMO_MODE=live` in the local environment and recreate only the dashboard with `docker compose up -d --force-recreate dashboard`.

In local AI mode the dashboard calls the Node.js API, which sends the synthetic task to the n8n webhook. The workflow requests a draft from Ollama and returns it to the UI for human review. Keep those services local. The live n8n–Ollama path was not verified end to end for this public release.

## Tests and architecture

Run `node --test tests/*.test.mjs`. The tests cover the simulation, local HTTP endpoints, workflow structure, responsive CSS, and port isolation. The local AI test checks configuration and workflow code only.

![Private Desk architecture](assets/private-desk-system-diagram.png)
