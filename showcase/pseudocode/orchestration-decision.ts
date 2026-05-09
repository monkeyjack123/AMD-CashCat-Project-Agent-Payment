import type { AgentTask } from "./agent-planner-schema";

export function shouldUseOrchestration(task: AgentTask): boolean {
  const text = task.task.toLowerCase();
  const budget = Number(task.maxBudget || "0");

  if (task.modeHint === "orchestration") {
    return true;
  }

  if (budget >= 150) {
    return true;
  }

  if (
    /launch|operations|workflow|vendor|initiative|portfolio|compute|cloud|software|data/.test(text)
  ) {
    return true;
  }

  return false;
}

export function orchestrationShape() {
  return {
    coordinator: "ag_cashcat_orchestrator",
    specialistAgents: [
      "ag_market_intelligence",
      "ag_tooling_procurement",
      "ag_compute_operations"
    ],
    outputs: [
      "delegated budgets",
      "governed payment lanes",
      "portfolio result artifact"
    ]
  };
}
