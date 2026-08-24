export type MessageStatus = "sent" | "delivered" | "read" | "failed";

export interface WhatsAppMessage {
  id: string;
  to: string;
  from: string;
  body: string;
  status: MessageStatus;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  components: Record<string, unknown>[];
}

export interface WhatsAppMessagingService {
  sendMessage(
    to: string,
    body: string,
    metadata?: Record<string, unknown>,
  ): Promise<WhatsAppMessage>;
  sendTemplate(
    to: string,
    templateName: string,
    language: string,
    params?: Record<string, unknown>,
  ): Promise<WhatsAppMessage>;
  handleIncomingMessage(
    rawPayload: Record<string, unknown>,
  ): Promise<WhatsAppMessage>;
  sendOrderNotification(
    orderId: string,
    customerId: string,
    status: string,
  ): Promise<WhatsAppMessage>;
  sendPaymentLink(
    customerId: string,
    orderId: string,
    amount: number,
    paymentUrl: string,
  ): Promise<WhatsAppMessage>;
}
