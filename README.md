# AMD-CashCat Project-Agent-Payment

CashCat is a public-safe hackathon repository for an agent-native payments demo running on AMD cloud infrastructure.

This repo is intentionally limited to submission-safe materials for the AMD Developer Challenge. It is not the full commercial codebase.

## Track

- AMD Developer Challenge
- Track 1: AI Agents & Agentic Workflows

## What The Demo Shows

- An AI agent receives a bounded spend mandate for a task
- The runtime converts that mandate into executable payment controls
- A payment intent is created, evaluated, and wrapped in verifiable artifacts
- Proofs and receipt data make the delegated spend flow auditable

## Why This Fits Track 1

CashCat is not presented as a generic fintech backend. The intended workflow is:

1. A user gives an AI agent a complex task.
2. The AI agent decides a paid action is needed, such as buying an API call or dataset.
3. CashCat converts that decision into a safe, bounded payment flow.
4. The system returns verifiable evidence of why the spend was allowed.

This repo currently focuses on the payment-control and runtime demo layer. The next step is to attach an open-source model based AI decision layer to generate structured payment intents from natural-language tasks.

## Repository Layout

- [docs/first-wedge-demo-flow.md](D:\台式机\Codex\AMD-CashCat-Project-Agent-Payment\docs\first-wedge-demo-flow.md): public-safe walkthrough of the first demo flow
- [examples/first-wedge-demo-request.json](D:\台式机\Codex\AMD-CashCat-Project-Agent-Payment\examples\first-wedge-demo-request.json): sample request payload
- [examples/first-wedge-demo-output-sanitized.json](D:\台式机\Codex\AMD-CashCat-Project-Agent-Payment\examples\first-wedge-demo-output-sanitized.json): redacted demo output
- [public/first-wedge-demo.html](D:\台式机\Codex\AMD-CashCat-Project-Agent-Payment\public\first-wedge-demo.html): visual demo page
- [showcase/README.md](D:\台式机\Codex\AMD-CashCat-Project-Agent-Payment\showcase\README.md): selected code excerpts from the private codebase

## Public Scope

Included:

- Demo overview
- Public-safe docs and examples
- Visual demo assets
- Selected code excerpts for reviewer inspection

Excluded:

- Production credentials
- Proprietary payment routing logic
- Internal risk heuristics
- Partner integrations
- Private roadmap and commercialization details

## Model Direction

For the next iteration, the intended AI layer will use an open-source model suitable for Track 1 workflow planning and structured output. Current candidates:

- Qwen
- Mistral

The likely integration pattern is:

- user task -> AI planner -> structured payment intent -> CashCat runtime
