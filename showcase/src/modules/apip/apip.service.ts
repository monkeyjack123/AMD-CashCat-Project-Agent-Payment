import { Injectable } from "@nestjs/common";
import { createPrivateKey, createPublicKey, generateKeyPairSync, sign, verify } from "crypto";

import { ApipEnvelope } from "@/protocols/apip/apip.types";

import { SignApipDto } from "./dto/sign-apip.dto";
import { VerifyApipDto } from "./dto/verify-apip.dto";

@Injectable()
export class ApipService {
  generateKeyPair(): { privateKeyPem: string; publicKeyPem: string; algorithm: string } {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");

    return {
      algorithm: "ed25519",
      privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
      publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString()
    };
  }

  sign(dto: SignApipDto): ApipEnvelope {
    const privateKey = createPrivateKey(dto.privateKeyPem);
    const payload = this.serializeEnvelopeForSigning({
      ...dto.envelope,
      signature: {
        ...dto.envelope.signature,
        value: ""
      }
    });

    const signature = sign(null, payload, privateKey).toString("base64");

    return {
      ...dto.envelope,
      signature: {
        ...dto.envelope.signature,
        value: signature
      }
    };
  }

  verify(dto: VerifyApipDto): { valid: boolean } {
    const publicKey = createPublicKey(dto.publicKeyPem);
    const payload = this.serializeEnvelopeForSigning({
      ...dto.envelope,
      signature: {
        ...dto.envelope.signature,
        value: ""
      }
    });

    return {
      valid: verify(null, payload, publicKey, Buffer.from(dto.envelope.signature.value, "base64"))
    };
  }

  private serializeEnvelopeForSigning(envelope: ApipEnvelope): Buffer {
    return Buffer.from(this.stableStringify(envelope));
  }

  private stableStringify(value: unknown): string {
    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(",")}]`;
    }

    if (value && typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
      return `{${entries
        .map(([key, entryValue]) => `${JSON.stringify(key)}:${this.stableStringify(entryValue)}`)
        .join(",")}}`;
    }

    return JSON.stringify(value);
  }
}
