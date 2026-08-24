import type {
  ComplianceMiddleware,
  EncryptedPHI,
  PhiData,
} from "./interfaces.js";

/**
 * ComplianceMiddleware — HIPAA + SOC2 compliance layer.
 * Encrypts PHI at rest, logs all CRUD actions, masks PHI by role.
 * Uses base64 token for stub; real AES-256-GCM wiring comes with production env.
 */
export class ComplianceLayer implements ComplianceMiddleware {
  private readonly roleHierarchy: Record<string, number> = {
    patient: 1,
    clinician: 2,
    admin: 3,
  };

  async encryptPHI(data: PhiData): Promise<EncryptedPHI> {
    const json = JSON.stringify(data);
    const ciphertext = Buffer.from(encoder.encode(json)).toString("base64");
    return {
      id: "phi-" + Date.now(),
      ciphertext,
      iv: "stub-iv",
      keyId: "local-test-key",
      encryptedAt: new Date(),
    };
  }

  async decryptPHI(encrypted: EncryptedPHI): Promise<PhiData> {
    const decoded = Buffer.from(encrypted.ciphertext, "base64").toString("utf-8");
    return JSON.parse(decoded) as PhiData;
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

    if (resource.startsWith("/api/admin/")) {
      return this.roleHierarchy[role] >= this.roleHierarchy.admin;
    }
    if (resource.startsWith("/api/clinician/")) {
      return this.roleHierarchy[role] >= this.roleHierarchy.clinician;
    }
    if (resource.startsWith("/api/patient/")) {
      return this.roleHierarchy[role] >= this.roleHierarchy.patient;
    }
    return true;
  }

  maskPHI(viewerRole: string, data: PhiData): string {
    const allowed = this.roleHierarchy[viewerRole] ?? 0;

    const masked: PhiData = { ...data };
    if (allowed < this.roleHierarchy.admin) {
      delete masked.ssn;
    }
    if (allowed < this.roleHierarchy.clinician) {
      delete masked.name;
      delete masked.dob;
      delete masked.phone;
      delete masked.email;
    }
    if (allowed < this.roleHierarchy.patient) {
      delete masked.patientId;
      delete masked.appointmentDetails;
    }
    return JSON.stringify(masked);
  }
}
