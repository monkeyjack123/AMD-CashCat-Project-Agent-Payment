# AI Runtime Design

This folder documents the public-safe AI runtime shape behind CashCat.

## Goal

The AI layer should decide what paid action is needed. CashCat should decide whether that action is allowed to proceed.

## Runtime Layers

### 1. Task Intake

Input:

- business task
- budget
- policy text
- optional hint for orchestration

Output:

- normalized agent task object

### 2. Planner

The planner is backed by:

- `Qwen2.5-14B-Instruct`
- served on AMD infrastructure

Planner responsibilities:

- detect if a paid action is needed
- estimate amount
- pick category
- suggest vendor
- explain why the spend helps complete the task

### 3. Governed Spend

CashCat converts the planner proposal into:

- normalized policy
- payment intent
- spend proof
- execution receipt

### 4. Workflow Result

A useful result must come back after the spend decision, for example:

- research brief
- benchmark result
- operations bundle
- portfolio run

## Orchestration Rule

Single-agent mode works when one bounded planner decision is enough.

Orchestration mode is activated when the task implies:

- multiple resource categories
- multi-stage operations
- higher-budget workflows
- research + software + compute together

## Public-Safe Philosophy

The public repo demonstrates:

- the workflow shape
- the schemas
- the planner interface
- the orchestration logic

It does not publish:

- secrets
- settlement adapters
- sensitive heuristics
- commercialization internals
