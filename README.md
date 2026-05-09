# AMD-CashCat-Project-Agent-Payment

CashCat is a public-safe hackathon repository for an AI agent payments product demo designed for the AMD Developer Challenge.

This repository contains only submission-safe materials for the hackathon.

## Rights

- Copyright: CashCat project authors
- License status: proprietary, all rights reserved
- Public visibility does not grant reuse rights without permission

## Track

- AMD Developer Challenge
- Track 1: AI Agents & Agentic Workflows

## What This Public Repo Includes

- A static product site for the hackathon submission
- A live-feeling product demo with AI task entry and governed spend outputs
- A multi-agent orchestration showcase page
- A proof page with payment intent, receipt, spend proof, and workflow artifacts
- AI architecture, schemas, and example input/output chains
- Submission-safe examples, docs, and selected source excerpts
- The current slide deck used for the presentation

## What The Demo Shows

- A user gives an AI agent a business task
- The AI proposes paid actions such as data, software, API, or compute purchases
- CashCat governs budget, approvals, and spend permissions
- The workflow returns evidence such as payment intent, receipt, spend proof, and downstream artifacts

## AI Runtime

- Model used: `Qwen2.5-14B-Instruct`
- Provider: `AMD vLLM endpoint`
- Planner role: translate natural-language tasks into structured spend proposals
- Control role: CashCat applies budget, approval, and spend-permission logic before producing governed artifacts

## Public Site Entry Points

- [index.html](./index.html): primary product page
- [live-demo.html](./live-demo.html): explicit multi-agent orchestration showcase
- [proof-demo.html](./proof-demo.html): proof-oriented payment flow page
- [api.html](./api.html): public integration reference

## Supporting Materials

- [docs/ARCHITECTURE_OVERVIEW.md](./docs/ARCHITECTURE_OVERVIEW.md): visual architecture diagram and system summary
- [docs/AI_ARCHITECTURE.md](./docs/AI_ARCHITECTURE.md): task, planner, governance, and orchestration design
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md): GitHub Pages + public API deployment model
- [docs/first-wedge-demo-flow.md](./docs/first-wedge-demo-flow.md): public-safe walkthrough of the first wedge
- [examples/first-wedge-demo-request.json](./examples/first-wedge-demo-request.json): sample request payload
- [examples/first-wedge-demo-output-sanitized.json](./examples/first-wedge-demo-output-sanitized.json): redacted output example
- [examples/research-agent-task.json](./examples/research-agent-task.json): single-agent task input
- [examples/research-planner-output.json](./examples/research-planner-output.json): planner output for a research workflow
- [examples/research-governed-result.json](./examples/research-governed-result.json): governed spend result for the same task
- [examples/research-workflow-artifact.json](./examples/research-workflow-artifact.json): downstream artifact returned after the governed run
- [examples/operations-agent-task.json](./examples/operations-agent-task.json): broader operations task input
- [examples/operations-planner-output.json](./examples/operations-planner-output.json): planner output for operations workflow
- [examples/operations-governed-result.json](./examples/operations-governed-result.json): governed spend result for operations workflow
- [examples/operations-workflow-artifact.json](./examples/operations-workflow-artifact.json): downstream operations artifact
- [schemas/agent-task.schema.json](./schemas/agent-task.schema.json): task input schema
- [schemas/payment-plan.schema.json](./schemas/payment-plan.schema.json): structured AI planner output schema
- [schemas/workflow-result.schema.json](./schemas/workflow-result.schema.json): downstream artifact schema
- [showcase/README.md](./showcase/README.md): selected code excerpts from the private implementation
- [showcase/AI_RUNTIME_DESIGN.md](./showcase/AI_RUNTIME_DESIGN.md): public-safe AI runtime design notes
- [showcase/pseudocode/agent-planner-schema.ts](./showcase/pseudocode/agent-planner-schema.ts): planner prompt and output shape
- [showcase/pseudocode/orchestration-decision.ts](./showcase/pseudocode/orchestration-decision.ts): single-agent vs orchestration routing logic
- [CashCat-AMD-Track1-Deck.pptx](./CashCat-AMD-Track1-Deck.pptx): current presentation deck
- [LICENSE](./LICENSE): repository rights statement
- [NOTICE.md](./NOTICE.md): plain-language usage notice

## Public Scope

Included:

- Product summary
- Demo pages
- Public-safe docs and examples
- Presentation assets
- Selected code excerpts for reviewer inspection

Excluded:

- Production credentials
- Proprietary payment routing logic
- Internal risk heuristics
- Partner integrations
- Private roadmap and commercialization details

## Repository Strategy

- Use this repository as the public hackathon submission shell.
- Only copy in sanitized assets and submission-safe code.
