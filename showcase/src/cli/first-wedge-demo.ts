import { readFileSync, writeFileSync } from "fs";

import { ApipService } from "../modules/apip/apip.service";
import { CapabilityGraphService } from "../modules/capability-graph/capability-graph.service";
import { DemoService } from "../modules/demo/demo.service";
import { RunFirstWedgeDemoDto } from "../modules/demo/dto/run-first-wedge-demo.dto";
import { PolicyCompilerService } from "../modules/policy-compiler/policy-compiler.service";
import { SessionKeysService } from "../modules/session-keys/session-keys.service";
import { SpendProofsService } from "../modules/spend-proofs/spend-proofs.service";

interface CliArgs {
  input?: string;
  output?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--input" && next) {
      args.input = next;
      index += 1;
    }

    if (token === "--output" && next) {
      args.output = next;
      index += 1;
    }
  }

  return args;
}

function createDemoService(): DemoService {
  return new DemoService(
    new PolicyCompilerService(),
    new SessionKeysService(),
    new CapabilityGraphService(),
    new SpendProofsService(),
    new ApipService()
  );
}

function loadInput(path?: string): RunFirstWedgeDemoDto {
  if (!path) {
    return {};
  }

  return JSON.parse(readFileSync(path, "utf8")) as RunFirstWedgeDemoDto;
}

function printSummary(result: ReturnType<DemoService["runFirstWedgeDemo"]>): void {
  const summary = {
    wedge: result.narrative.wedge,
    principalId: result.setup.principalId,
    agentId: result.setup.agentId,
    sessionWalletId: result.sessionWallet.id,
    sessionKeyId: result.sessionKey.id,
    paymentIntentId: result.paymentIntent.id,
    capabilityGraphId: result.capabilityGraph.graphId,
    spendProofId: result.spendProof.proofId,
    executionReceiptId: result.executionReceipt.receiptId,
    apipSignatureValid: result.apip.verificationResult.valid
  };

  process.stdout.write("First wedge demo completed\n");
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const input = loadInput(args.input);
  const demoService = createDemoService();
  const result = demoService.runFirstWedgeDemo(input);

  if (args.output) {
    writeFileSync(args.output, JSON.stringify(result, null, 2), "utf8");
    process.stdout.write(`Wrote full demo output to ${args.output}\n`);
  } else {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }

  printSummary(result);
}

main();
