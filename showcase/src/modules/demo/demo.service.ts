import { Injectable } from "@nestjs/common";

import { createId } from "@/common/utils/id";
import { addMinutesIso, nowIso } from "@/common/utils/time";
import { ApipService } from "@/modules/apip/apip.service";
import { CapabilityGraphService } from "@/modules/capability-graph/capability-graph.service";
import { PolicyCompilerService } from "@/modules/policy-compiler/policy-compiler.service";
import { SessionKeysService } from "@/modules/session-keys/session-keys.service";
import { SpendProofsService } from "@/modules/spend-proofs/spend-proofs.service";
import { Wallet } from "@/modules/wallets/wallet.types";

import { RunFirstWedgeDemoDto } from "./dto/run-first-wedge-demo.dto";

@Injectable()
export class DemoService {
  constructor(
    private readonly policyCompilerService: PolicyCompilerService,
    private readonly sessionKeysService: SessionKeysService,
    private readonly capabilityGraphService: CapabilityGraphService,
    private readonly spendProofsService: SpendProofsService,
    private readonly apipService: ApipService
  ) {}

  runFirstWedgeDemo(dto: RunFirstWedgeDemoDto) {
    const now = nowIso();
    const principalId = dto.principalId ?? "pr_demo_founder";
    const agentId = dto.agentId ?? "ag_research_assistant";
    const treasuryWalletId = createId("wa");
    const policyWalletId = createId("wa");
    const sessionWalletId = createId("wa");
    const budgetGrantId = createId("bg");
    const paymentIntentId = createId("pi");
    const approvalId = createId("apr");

    const compiledPolicy = this.policyCompilerService.compile({
      naturalLanguageIntent:
        dto.naturalLanguagePolicy ??
        "Allow this research agent to spend up to 20 USD on API and data purchases, and require approval for anything above 10 USD."
    });

    const sessionWallet: Wallet = {
      id: sessionWalletId,
      principalId,
      agentId,
      walletType: "session",
      currency: "USD",
      availableBalance: "20.00",
      pendingBalance: "0.00",
      reservedBalance: "0.00",
      status: "active",
      purpose: "Research session for premium search and dataset access",
      spendingLimit: "20.00",
      expiresAt: addMinutesIso(30),
      createdAt: now,
      updatedAt: now
    };

    const sessionKey = this.sessionKeysService.issue({
      walletId: sessionWallet.id,
      principalId,
      agentId,
      scopes: ["payments:create", "payments:submit", "proofs:generate"],
      durationMinutes: "30"
    });

    const paymentIntent = {
      id: paymentIntentId,
      principalId,
      agentId,
      walletId: sessionWallet.id,
      executionContextId: createId("ctx"),
      amount: dto.spendAmount ?? "12.50",
      currency: "USD" as const,
      purpose: "Buy premium search results and a research dataset",
      category: dto.category ?? "api",
      status: "needs_approval" as const,
      matchedPolicyIds: [createId("pol")],
      budgetGrantId,
      reasonCodes: ["manual_approval_required", "within_budget_grant"],
      createdAt: now,
      updatedAt: now
    };

    const capabilityArtifact = this.capabilityGraphService.buildForPaymentIntent({
      paymentIntent,
      wallet: sessionWallet,
      approvalId,
      sessionKeyId: sessionKey.id
    });

    const spendProof = this.spendProofsService.createSpendProof({
      paymentIntent,
      capabilityProof: capabilityArtifact.proof,
      approvalId,
      sessionKeyId: sessionKey.id
    });

    const executionReceipt = this.spendProofsService.createExecutionReceipt(paymentIntent, spendProof);
    const agentRootKeyPair = this.apipService.generateKeyPair();

    const unsignedEnvelope = {
      protocol_version: "apip/v0.1" as const,
      payment_intent: {
        intent_id: paymentIntent.id,
        principal_id: paymentIntent.principalId,
        agent_id: paymentIntent.agentId,
        wallet_id: paymentIntent.walletId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        purpose: paymentIntent.purpose,
        category: paymentIntent.category,
        counterparty: {
          type: "service" as const,
          id: "vendor_premium_search"
        }
      },
      context_attestation: {
        execution_context_id: paymentIntent.executionContextId,
        task_type: "research",
        session_id: createId("sess"),
        expires_at: sessionWallet.expiresAt ?? now
      },
      authority_attestation: {
        budget_grant_id: paymentIntent.budgetGrantId,
        policy_ids: paymentIntent.matchedPolicyIds,
        capability_token_id: `cap_${agentId}`,
        max_authorized_amount: "20.00"
      },
      approval_attestation: {
        status: "pending" as const,
        approval_id: approvalId
      },
      capability_proof: {
        capability_graph_id: capabilityArtifact.graph.graphId,
        capability_proof_id: capabilityArtifact.proof.proofId,
        graph_hash: capabilityArtifact.proof.graphHash,
        delegation_chain_hash: capabilityArtifact.proof.delegationChainHash
      },
      spend_proof: {
        spend_proof_id: spendProof.proofId,
        payment_intent_hash: spendProof.paymentIntentHash,
        context_hash: spendProof.contextHash
      },
      session_key_attestation: {
        session_key_id: sessionKey.id,
        scopes: sessionKey.scopes,
        expires_at: sessionKey.expiresAt
      },
      execution_preferences: {
        accepted_rails: ["internal_transfer", "stablecoin", "ach"] as Array<
          "internal_transfer" | "stablecoin" | "ach"
        >,
        urgency: "standard" as const
      },
      signature: {
        algorithm: "ed25519" as const,
        key_id: "agent_root_key_1",
        value: ""
      }
    };

    const signedEnvelope = this.apipService.sign({
      envelope: unsignedEnvelope,
      privateKeyPem: agentRootKeyPair.privateKeyPem
    });

    const verificationResult = this.apipService.verify({
      envelope: signedEnvelope,
      publicKeyPem: agentRootKeyPair.publicKeyPem
    });

    return {
      narrative: {
        wedge: "Agents buying APIs, data, and digital tools under bounded budgets",
        value: "Give agents bounded spending power without exposing primary payment credentials"
      },
      apipPublicKeyPem: agentRootKeyPair.publicKeyPem,
      setup: {
        principalId,
        agentId,
        treasuryWallet: {
          id: treasuryWalletId,
          type: "treasury"
        },
        policyWallet: {
          id: policyWalletId,
          type: "policy"
        },
        budgetGrant: {
          id: budgetGrantId,
          sourceWalletId: treasuryWalletId,
          targetWalletId: sessionWallet.id,
          amountLimit: "20.00"
        }
      },
      compiledPolicy,
      sessionWallet,
      sessionKey,
      paymentIntent,
      capabilityGraph: capabilityArtifact.graph,
      capabilityProof: capabilityArtifact.proof,
      spendProof,
      executionReceipt,
      apip: {
        unsignedEnvelope,
        signedEnvelope,
        verificationResult
      }
    };
  }
}
