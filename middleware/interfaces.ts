export interface PiiData {
  customerId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  orderHistory?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface EncryptedPII {
  id: string;
  ciphertext: string;
  iv: string;
  keyId: string;
  encryptedAt: Date;
}

export interface ComplianceMiddleware {
  encryptPII(data: PiiData): Promise<EncryptedPII>;
  decryptPII(encrypted: EncryptedPII): Promise<PiiData>;
  auditLog(
    action: string,
    userId: string,
    role: string,
    resourceId: string,
    metadata?: Record<string, unknown>,
  ): Promise<void>;
  enforceRole(role: string, resource: string): boolean;
  maskPII(viewerRole: string, data: PiiData): string;
}
