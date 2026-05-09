(function () {
  const MODEL = "qwen2.5-14b";
  const PROVIDER = "amd-vllm";
  let sequence = 1;

  function now() {
    return new Date().toISOString();
  }

  function nextId(prefix) {
    const id = String(sequence++).padStart(4, "0");
    return `${prefix}_${id}`;
  }

  function toNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function money(value) {
    return value.toFixed(2);
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function approvalThreshold(policyText, fallbackBudget) {
    const match = String(policyText || "").match(/approval(?:\s+required)?\s+(?:above|over)\s+(\d+(?:\.\d+)?)/i);
    return match ? toNumber(match[1], Math.min(50, fallbackBudget)) : Math.min(50, fallbackBudget);
  }

  function taskFlavor(task) {
    const text = String(task || "").toLowerCase();
    if (/(benchmark|evaluate|evaluation|latency|model|inference)/.test(text)) {
      return "benchmark";
    }
    if (/(launch|operations|vendor|procurement|initiative|workspace|rollout|go.to.market|internal)/.test(text)) {
      return "operations";
    }
    return "research";
  }

  function plannerForTask(task, maxBudget) {
    const flavor = taskFlavor(task);
    const budget = Math.max(10, toNumber(maxBudget, 120));

    if (flavor === "benchmark") {
      const amount = Math.min(64, Math.max(18, budget * 0.32));
      return {
        model: MODEL,
        provider: PROVIDER,
        purchaseRequired: true,
        amount: money(amount),
        category: "compute",
        purpose: "Run a controlled model evaluation workflow with governed compute and benchmarking resources.",
        vendor: "amd_eval_compute",
        confidence: 0.91,
        reasoning:
          "The task requires paid inference and benchmarking capacity to compare model quality, latency, and operating cost before committing to a deployment choice."
      };
    }

    if (flavor === "operations") {
      const amount = Math.min(95, Math.max(24, budget * 0.36));
      return {
        model: MODEL,
        provider: PROVIDER,
        purchaseRequired: true,
        amount: money(amount),
        category: "software",
        purpose: "Acquire the software and vendor services needed to complete an operational rollout under budget.",
        vendor: "workflow_ops_stack",
        confidence: 0.89,
        reasoning:
          "The task spans multiple operational resources, so the AI proposes a software-led spend package that can unlock vendor sourcing, workflow execution, and launch readiness."
      };
    }

    const amount = Math.min(48, Math.max(12, budget * 0.22));
    return {
      model: MODEL,
      provider: PROVIDER,
      purchaseRequired: true,
      amount: money(amount),
      category: "data",
      purpose: "Purchase premium research data and intelligence signals needed to complete the task with higher quality evidence.",
      vendor: "premium_market_signal",
      confidence: 0.93,
      reasoning:
        "The AI determined that better market intelligence requires paid data rather than only free search results, so it proposed a bounded premium research purchase."
    };
  }

  function buildWorkflowArtifact(task, planner) {
    const flavor = taskFlavor(task);
    const generatedAt = now();

    if (flavor === "benchmark") {
      return {
        artifactType: "benchmark_result",
        artifactId: nextId("artifact"),
        title: "Model Benchmark Result",
        generatedAt,
        summary: "CashCat governed the spend for a compute-backed evaluation run and returned benchmark evidence the team can act on.",
        deliverables: ["Latency table", "Quality score", "Cost-per-run estimate"],
        metrics: [
          { label: "Latency", value: "420 ms median" },
          { label: "Eval score", value: "91 / 100" },
          { label: "Cost per run", value: `$${planner.amount}` }
        ],
        recommendation: "Proceed with the higher-quality configuration for external-facing agent tasks, and reserve the lower-cost path for internal experimentation."
      };
    }

    if (flavor === "operations") {
      return {
        artifactType: "operations_bundle",
        artifactId: nextId("artifact"),
        title: "Launch Operations Bundle",
        generatedAt,
        summary: "The governed workflow produced a vendor stack and launch-ready plan rather than stopping at a payment event.",
        deliverables: ["Vendor short list", "Readiness checklist", "Next-step launch plan"],
        stack: [
          { title: "Research and data", value: "Premium market signal package selected" },
          { title: "Workflow software", value: "Ops collaboration suite approved" },
          { title: "Compute and APIs", value: "Bounded external resources reserved" }
        ],
        readiness: [
          "Budget remains inside delegated limits",
          "Approval threshold is visible before final settlement",
          "Each purchased resource maps to a concrete launch deliverable"
        ]
      };
    }

    return {
      artifactType: "research_brief",
      artifactId: nextId("artifact"),
      title: "Market Intelligence Brief",
      generatedAt,
      summary: "The AI used governed spend to unlock higher-quality research inputs and returned a concise decision-ready brief.",
      deliverables: ["Executive summary", "Competitive signal scan", "Recommended wedge"],
      highlights: ["Premium data improved coverage in fast-moving AI infra categories", "Pricing and control layers remain fragmented across the market"],
      sections: [
        { title: "Key market signal", value: "AI teams want agent autonomy without losing finance controls." },
        { title: "Competitive gap", value: "Most tools stop at recommendation instead of governed execution." },
        { title: "Recommended wedge", value: "Start with digital spend and expand into broader delegated operations." }
      ]
    };
  }

  function buildDemoResult(task, planner, maxBudget, policyText, principalId, agentId) {
    const budget = toNumber(maxBudget, 120);
    const approval = approvalThreshold(policyText, budget);
    const amount = toNumber(planner.amount, 0);
    const status = amount > approval ? "needs_approval" : "approved";
    const intentId = nextId("pi");
    const proofId = nextId("sproof");
    const receiptId = nextId("rcpt");

    return {
      compiledPolicy: {
        compilerVersion: "v0.2-static-demo",
        sourceType: "natural_language",
        normalizedRules: {
          allowedCategories: ["data", "software", "compute", "api", "cloud"],
          limits: {
            perTransaction: money(budget)
          },
          approvalRules: {
            requiresHumanApprovalOver: money(approval)
          }
        },
        explanation: [
          `Detected a governed spend ceiling of ${money(budget)} USD.`,
          `Detected a manual approval gate above ${money(approval)} USD.`,
          `Detected target category ${planner.category}.`
        ]
      },
      paymentIntent: {
        id: intentId,
        principalId: principalId || "pr_cashcat_founder",
        agentId: agentId || "ag_cashcat_operator",
        walletId: "wa_cashcat_session",
        amount: planner.amount,
        currency: "USD",
        purpose: planner.purpose,
        category: planner.category,
        status,
        matchedPolicyIds: ["pol_cashcat_demo"],
        reasonCodes:
          status === "needs_approval"
            ? ["approval_threshold_triggered", "within_budget_grant"]
            : ["within_policy", "within_budget_grant"]
      },
      spendProof: {
        proofId,
        paymentIntentId: intentId,
        decisionSummary: `CashCat evaluated ${intentId} and returned ${status}.`
      },
      capabilityProof: {
        proofId: nextId("cproof"),
        summary: `Delegated spend authority was minted for ${agentId || "ag_cashcat_operator"} under a bounded session wallet.`
      },
      sessionWallet: {
        id: "wa_cashcat_session",
        principalId: principalId || "pr_cashcat_founder",
        agentId: agentId || "ag_cashcat_operator",
        walletType: "session",
        currency: "USD",
        availableBalance: money(budget),
        status: "active",
        purpose: planner.purpose,
        spendingLimit: money(budget)
      },
      executionReceipt: {
        receiptId,
        paymentIntentId: intentId,
        status,
        settled: status === "approved",
        spendProofId: proofId,
        receiptHash: slugify(`${receiptId}-${task}`)
      },
      apip: {
        verificationResult: {
          valid: true
        }
      }
    };
  }

  function buildStaticAgentFlow(input) {
    const task = input.task;
    const plannerResult = plannerForTask(task, input.maxAmount);
    const demoResult = buildDemoResult(
      task,
      plannerResult,
      input.maxAmount,
      input.naturalLanguagePolicy,
      input.principalId,
      input.agentId
    );
    const workflowResult = buildWorkflowArtifact(task, plannerResult);

    return {
      agentTask: {
        task,
        startedAt: now()
      },
      plannerEvidence: {
        model: MODEL,
        provider: PROVIDER,
        decisionAt: now(),
        rawDecision: {
          purchaseRequired: plannerResult.purchaseRequired,
          vendor: plannerResult.vendor,
          category: plannerResult.category,
          amount: plannerResult.amount,
          confidence: plannerResult.confidence
        }
      },
      plannerResult,
      demoResult,
      workflowResult
    };
  }

  function splitBudget(total) {
    const base = toNumber(total, 500);
    const research = base * 0.36;
    const tooling = base * 0.29;
    const compute = base - research - tooling;
    return [research, tooling, compute].map((v) => money(v));
  }

  function buildStaticMultiAgentFlow(input) {
    const totalBudget = toNumber(input.totalBudget, 500);
    const approval = toNumber(input.approvalThreshold, Math.min(50, totalBudget));
    const budgets = splitBudget(totalBudget);
    const laneSpecs = [
      {
        role: "Market Intelligence Agent",
        agentId: "ag_market_intelligence",
        task: "Source premium market data and competitor intelligence signals.",
        planner: {
          model: MODEL,
          provider: PROVIDER,
          purchaseRequired: true,
          amount: money(Math.min(120, totalBudget * 0.19)),
          category: "data",
          purpose: "Acquire premium market signal coverage for the top-level workflow.",
          vendor: "market_signal_terminal",
          confidence: 0.92,
          reasoning: "This lane needs paid intelligence coverage to reduce uncertainty in the overall workflow."
        }
      },
      {
        role: "Tooling Procurement Agent",
        agentId: "ag_tooling_procurement",
        task: "Secure the software tools needed to execute the workflow with minimal friction.",
        planner: {
          model: MODEL,
          provider: PROVIDER,
          purchaseRequired: true,
          amount: money(Math.min(95, totalBudget * 0.16)),
          category: "software",
          purpose: "Acquire workflow software and specialized tools for the delegated task.",
          vendor: "ops_enablement_suite",
          confidence: 0.88,
          reasoning: "This lane needs approved software capacity so the workflow can move from planning to execution."
        }
      },
      {
        role: "Compute Operations Agent",
        agentId: "ag_compute_operations",
        task: "Allocate bounded infrastructure and compute capacity to finish the run.",
        planner: {
          model: MODEL,
          provider: PROVIDER,
          purchaseRequired: true,
          amount: money(Math.min(130, totalBudget * 0.21)),
          category: "compute",
          purpose: "Reserve governed compute and API capacity for the downstream workload.",
          vendor: "amd_compute_lane",
          confidence: 0.9,
          reasoning: "This lane needs dedicated compute and API capacity to make the workflow operational instead of theoretical."
        }
      }
    ];

    const agentRuns = laneSpecs.map((lane, index) => ({
      role: lane.role,
      agentId: lane.agentId,
      assignedBudget: budgets[index],
      plannerResult: lane.planner,
      demoResult: buildDemoResult(
        lane.task,
        lane.planner,
        budgets[index],
        `approval above ${approval}`,
        "pr_cashcat_founder",
        lane.agentId
      )
    }));

    const requestedTotal = agentRuns
      .reduce((sum, run) => sum + toNumber(run.plannerResult.amount, 0), 0);
    const status = requestedTotal > approval ? "portfolio_needs_review" : "portfolio_approved";

    return {
      coordinator: {
        task: input.task,
        coordinatorAgentId: "ag_cashcat_orchestrator",
        delegatedAgents: agentRuns.length,
        totalBudget: money(totalBudget),
        approvalThreshold: money(approval),
        currency: input.currency || "USD"
      },
      fundingPlan: {
        requestedTotal: money(requestedTotal),
        status
      },
      agentRuns,
      workflowResult: {
        artifactType: "portfolio_run",
        artifactId: nextId("artifact"),
        title: "Delegated Portfolio Run",
        generatedAt: now(),
        summary: "CashCat split a top-level mission into multiple governed payment lanes while keeping the primary funds protected.",
        deliverables: ["Research lane", "Software lane", "Compute lane"],
        lanes: agentRuns.map((run) => ({
          role: run.role,
          vendor: run.plannerResult.vendor.replace(/_/g, " "),
          amount: run.plannerResult.amount,
          category: run.plannerResult.category,
          receiptId: run.demoResult.executionReceipt.receiptId
        }))
      }
    };
  }

  window.CashCatSiteData = {
    buildStaticAgentFlow,
    buildStaticMultiAgentFlow
  };
})();
