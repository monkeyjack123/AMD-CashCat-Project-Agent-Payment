# AMD-CashCat-Project-Agent-Payment

CashCat is a public-safe hackathon repository for an AI agent payments product demo designed for the AMD Developer Challenge.

This repository is intentionally separated from the private `AgentWallet` project. It contains only submission-safe materials for the hackathon.

## Track

- AMD Developer Challenge
- Track 1: AI Agents & Agentic Workflows

## What This Public Repo Includes

- A static product site for the hackathon submission
- A live-feeling product demo with AI task entry and governed spend outputs
- A multi-agent orchestration showcase page
- A proof page with payment intent, receipt, spend proof, and workflow artifacts
- Submission-safe examples, docs, and selected source excerpts
- The current slide deck used for the presentation

## What The Demo Shows

- A user gives an AI agent a business task
- The AI proposes paid actions such as data, software, API, or compute purchases
- CashCat governs budget, approvals, and spend permissions
- The workflow returns evidence such as payment intent, receipt, spend proof, and downstream artifacts

## Public Site Entry Points

- [index.html](./index.html): primary product page
- [live-demo.html](./live-demo.html): explicit multi-agent orchestration showcase
- [proof-demo.html](./proof-demo.html): proof-oriented payment flow page
- [api.html](./api.html): public integration reference

## Supporting Materials

- [docs/first-wedge-demo-flow.md](./docs/first-wedge-demo-flow.md): public-safe walkthrough of the first wedge
- [examples/first-wedge-demo-request.json](./examples/first-wedge-demo-request.json): sample request payload
- [examples/first-wedge-demo-output-sanitized.json](./examples/first-wedge-demo-output-sanitized.json): redacted output example
- [showcase/README.md](./showcase/README.md): selected code excerpts from the private implementation
- [CashCat-AMD-Track1-Deck.pptx](./CashCat-AMD-Track1-Deck.pptx): current presentation deck

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

- Keep the private `AgentWallet` repository separate.
- Use this repository as the public hackathon submission shell.
- Only copy in sanitized assets and submission-safe code.
