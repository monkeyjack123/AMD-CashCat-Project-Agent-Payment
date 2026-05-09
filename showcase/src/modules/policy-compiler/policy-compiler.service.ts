import { Injectable } from "@nestjs/common";

import { CompilePolicyDto } from "./dto/compile-policy.dto";
import { CompiledPolicy } from "./policy-compiler.types";

@Injectable()
export class PolicyCompilerService {
  compile(dto: CompilePolicyDto): CompiledPolicy {
    if (dto.rules) {
      return {
        compilerVersion: "v0.1",
        sourceType: "structured",
        normalizedRules: dto.rules,
        explanation: ["Structured rules were accepted without semantic transformation."]
      };
    }

    const intent = (dto.naturalLanguageIntent ?? "").toLowerCase();
    const normalizedRules: Record<string, unknown> = {};
    const explanation: string[] = [];

    if (intent.includes("api")) {
      normalizedRules.allowedCategories = ["api"];
      explanation.push("Detected API-only spend intent.");
    }

    if (intent.includes("data")) {
      normalizedRules.allowedCategories = [
        ...new Set([...(normalizedRules.allowedCategories as string[] | undefined ?? []), "data"])
      ];
      explanation.push("Detected data spend permission.");
    }

    const amountMatch = intent.match(/(\d+(\.\d+)?)\s*(usd|dollars?)/);
    if (amountMatch) {
      normalizedRules.limits = {
        perTransaction: amountMatch[1]
      };
      explanation.push(`Detected per-transaction limit of ${amountMatch[1]} USD.`);
    }

    if (intent.includes("approve") || intent.includes("approval")) {
      normalizedRules.approvalRules = {
        requiresHumanApprovalOver:
          (normalizedRules.limits as Record<string, unknown> | undefined)?.perTransaction ?? "0"
      };
      explanation.push("Detected manual approval requirement.");
    }

    return {
      compilerVersion: "v0.1",
      sourceType: "natural_language",
      normalizedRules,
      explanation:
        explanation.length > 0
          ? explanation
          : ["No strong semantic hints were detected from the natural-language intent."]
    };
  }
}
