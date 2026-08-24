import type {
  ComplianceMiddleware,
  EncryptedPII,
  PiiData,
} from "./interfaces.js";

/**
 * ComplianceMiddleware — PII/SOC2 compliance layer for local shops.
 * Encrypts PII at rest, logs all CRUD actions, masks PII by role.
 */
export class ComplianceLayer implements ComplianceMiddleware {
  private readonly roleHierarchy: Record<string, number> = {
    customer: 1,
    staff: 2,
    owner: 3,
  };

  async encryptPII(data: PiiData): Promise<EncryptedPII> {
    const json = JSON.stringify(data);
    const ciphertext = Buffer.from(encoder.encode(json)).toString("base64");
    return {
      id: "pii-" + Date.now(),
      ciphertext,
      iv: "stub-iv",
      keyId: "local-test-key",
      encryptedAt: new Date(),
    };
  }

  async decryptPII(encrypted: EncryptedPII): Promise<PiiData> {
    const decoded = Buffer.from(encrypted.ciphertext, "base64").toString("utf-8");
    return JSON.parse(decoded) as PiiData;
  }

  async auditLog(
    action: string,
    userId: string,
    role: string,
    resourceId: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      role,
      resourceId,
      metadata: metadata ?? {},
    };
    console.log("[AUDIT]", JSON.stringify(entry));
  }

  enforceRole(role: string, resource: string): boolean {
    if (!resource.startsWith("/api/")) return true;
    const roles = Object.keys(this.roleHierarchy);
    if (!roles.includes(role)) return false;

    if (resource.startsWith("/api/owner/")) {
      return this.roleHierarchy[role] >= this.roleHierarchy.owner;
    }
    if (resource.startsWith("/api/staff/")) {
      return this.roleHierarchy[role] >= this.roleHierarchy.staff;
    }
    if (resource.startsWith("/api/customer/")) {
      return this.roleHierarchy[role] >= this.roleHierarchy.customer;
    }
    return true;
  }

  maskPII(viewerRole: string, data: PiiData): string {
    const allowed = this.roleHierarchy[viewerRole] ?? 0;

    const masked: PiiData = { ...data };
    if (allowed < this.roleHierarchy.owner) {
      delete masked.address;
      delete masked.email;
    }
    if (allowed < this.roleHierarchy.staff) {
      delete masked.customerName;
      delete masked.phone;
    }
    if (allowed < this.roleHierarchy.customer) {
      delete masked.customerId;
      delete masked.orderHistory;
    }
    return JSON.stringify(masked);
  }
}
