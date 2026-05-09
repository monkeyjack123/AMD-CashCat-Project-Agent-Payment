# AI Architecture

CashCat is structured as an AI-driven workflow with a separate financial control layer.

## Core Flow

`task -> planner -> governed spend -> workflow artifact`

1. A user gives the agent a natural-language business task.
2. The planner decides whether paid resources are required.
3. CashCat converts that proposal into a governed spend decision.
4. The run returns evidence and a downstream workflow artifact.

## Planner Layer

- Model: `Qwen2.5-14B-Instruct`
- Provider: `AMD vLLM endpoint`
- Responsibility:
  - interpret the task
  - decide whether paid resources are needed
  - estimate vendor, amount, category, and confidence
  - return structured planner output

The planner does not directly move money. It proposes a spend action.

## Governed Spend Layer

CashCat sits between AI intent and any financial action.

Responsibilities:

- enforce budget ceilings
- apply category restrictions
- trigger approval thresholds
- produce payment intent, receipt, and spend proof
- preserve separation between agent action and primary funds

## Workflow Artifact Layer

The system does not stop at a payment event. A governed run should return a visible result, for example:

- `research_brief`
- `benchmark_result`
- `operations_bundle`
- `portfolio_run`

This is the layer that proves the workflow actually completed useful work.

## Single Agent vs Orchestration

### Single Agent

Used when a task is narrow enough to be handled by one planner-runner flow.

Typical examples:

- buy premium market data under a fixed budget
- purchase a single tool or API for a bounded task

### Orchestration

Used when the task implies multiple resource types or multiple execution lanes.

Typical triggers:

- launch workflows
- vendor sourcing across multiple categories
- cloud, software, and data in one task
- higher-budget operational work

In orchestration mode:

- a coordinator interprets the top-level task
- CashCat splits budget and permissions into delegated lanes
- specialist agents return separate governed proposals
- the final artifact summarizes the portfolio-level run

## Why AMD Matters

AMD infrastructure gives the demo a real model-backed planning layer instead of a purely mocked front end.

It enables:

- open-model inference
- controllable deployment
- lower dependence on external closed APIs
- a credible path from demo to production architecture
