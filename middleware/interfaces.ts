export interface PhiData {
  patientId?: string;
  name?: string;
  dob?: string;
  phone?: string;
  email?: string;
  appointmentDetails?: Record<string, unknown>;
  ssn?: string;
  [key: string]: unknown;
}

export interface EncryptedPHI {
  id: string;
  ciphertext: string;
  iv: string;
  keyId: string;
  encryptedAt: Date;
}

export interface ComplianceMiddleware {
  encryptPHI(data: PhiData): Promise<EncryptedPHI>;
  decryptPHI(encrypted: EncryptedPHI): Promise<PhiData>;
  auditLog(
    action: string,
    userId: string,
    role: string,
    resourceId: string,
    metadata?: Record<string, unknown>,
  ): Promise<void>;
  enforceRole(role: string, resource: string): boolean;
  maskPHI(viewerRole: string, data: PhiData): string;
}
