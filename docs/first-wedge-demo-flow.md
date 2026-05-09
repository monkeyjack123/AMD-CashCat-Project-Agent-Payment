# First Wedge Demo Flow

## Objective

This document defines the fastest way to demonstrate the first customer wedge of Agent Finance OS.

The wedge is:

`safe, bounded, verifiable spend for agents buying APIs, data, and digital tools`

## Demo endpoint

`POST /v1/demo/first-wedge-flow`

This endpoint is designed as a no-database reference flow.

It generates a complete artifact chain without requiring real funding rails or PostgreSQL setup.

## What it demonstrates

The demo synthesizes:

- principal
- agent
- treasury wallet
- policy wallet
- budget grant
- compiled policy
- session wallet
- session spend key
- payment intent
- capability graph
- capability proof
- spend proof
- execution receipt
- APIP envelope
- APIP signature verification

## Why this demo matters

It answers the most important early-stage product question:

`What does this system actually look like when used for a real agent spending flow?`

## Suggested demo story

1. A startup has a research agent.
2. The agent gets a bounded budget for a single session.
3. The policy allows API and data purchases up to a fixed amount.
4. A payment intent is created for premium search results.
5. The system produces delegated authority proofs.
6. The APIP envelope is signed and verified.

## Example request

```json
{
  "principalId": "pr_demo_founder",
  "agentId": "ag_research_assistant",
  "naturalLanguagePolicy": "Allow this research agent to spend up to 20 USD on API and data purchases, and require approval for anything above 10 USD.",
  "spendAmount": "12.50",
  "category": "api"
}
```

## Demo output structure

The response is intentionally narrative and artifact-rich.

Top-level sections:

- `narrative`
- `setup`
- `compiledPolicy`
- `sessionWallet`
- `sessionKey`
- `paymentIntent`
- `capabilityGraph`
- `capabilityProof`
- `spendProof`
- `executionReceipt`
- `apip`

## What to show in a product demo

Highlight these four things:

### 1. Session wallet

The agent gets bounded financial capability, not unrestricted payment credentials.

### 2. Session spend key

The runtime authorization is tied to a narrow execution scope and expiry window.

### 3. Capability graph and spend proof

The system can explain and prove why this spend was valid.

### 4. APIP signature verification

The protocol output is portable and machine-verifiable.

## How this maps to the wedge narrative

This is the demo-friendly version of the value proposition:

- Stripe moves money
- Agent Finance OS governs delegated spend authority

## Recommended next step after the demo

After this demo is stable, build:

1. API examples for every step
2. a CLI wrapper
3. a small sandbox UI
4. a verifier SDK
