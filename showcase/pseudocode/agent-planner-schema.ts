export type AgentTask = {
  task: string;
  maxBudget: string;
  currency: "USD";
  policyText?: string;
  modeHint?: "single" | "orchestration";
};

export type PaymentPlan = {
  model: string;
  provider: string;
  purchaseRequired: boolean;
  amount: string;
  category: "api" | "data" | "software" | "compute" | "cloud";
  purpose: string;
  vendor: string;
  confidence: number;
  reasoning: string;
};

export const plannerSystemPrompt = `
You are the planning layer for an AI agent payments runtime.
You do not settle transactions.
You decide whether paid resources are required to complete a business task.
Return a structured payment proposal only.
Respect the budget boundary and prefer digital resources such as APIs, data, software, and compute.
`;

export const plannerOutputSchema = {
  type: "object",
  required: [
    "purchaseRequired",
    "amount",
    "category",
    "purpose",
    "vendor",
    "confidence",
    "reasoning"
  ],
  properties: {
    purchaseRequired: { type: "boolean" },
    amount: { type: "string" },
    category: { type: "string" },
    purpose: { type: "string" },
    vendor: { type: "string" },
    confidence: { type: "number" },
    reasoning: { type: "string" }
  }
};
