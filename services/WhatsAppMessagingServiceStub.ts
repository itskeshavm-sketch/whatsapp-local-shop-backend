import type {
  WhatsAppMessage,
  WhatsAppMessagingService,
  MessageStatus,
} from "./WhatsAppMessagingService.js";

/**
 * WhatsAppMessagingServiceStub — stub implementation.
 * All methods return synthetic data until WhatsApp Business API is connected.
 */
export class WhatsAppMessagingServiceStub implements WhatsAppMessagingService {
  async sendMessage(
    to: string,
    body: string,
    metadata?: Record<string, unknown>,
  ): Promise<WhatsAppMessage> {
    return {
      id: "stub-msg-" + Date.now(),
      to,
      from: "stub-bot",
      body,
      status: "sent" as MessageStatus,
      timestamp: new Date(),
      metadata,
    };
  }

  async sendTemplate(
    to: string,
    templateName: string,
    _language: string,
    _params?: Record<string, unknown>,
  ): Promise<WhatsAppMessage> {
    return {
      id: "stub-template-" + Date.now(),
      to,
      from: "stub-bot",
      body: `[TEMPLATE:${templateName}]`,
      status: "sent" as MessageStatus,
      timestamp: new Date(),
    };
  }

  async handleIncomingMessage(
    rawPayload: Record<string, unknown>,
  ): Promise<WhatsAppMessage> {
    return {
      id: "stub-incoming-" + Date.now(),
      to: rawPayload.from as string ?? "stub",
      from: rawPayload.from as string ?? "unknown",
      body: "",
      status: "delivered" as MessageStatus,
      timestamp: new Date(),
      metadata: rawPayload,
    };
  }

  async sendOrderNotification(
    orderId: string,
    customerId: string,
    status: string,
  ): Promise<WhatsAppMessage> {
    return {
      id: "stub-notif-" + Date.now(),
      to: customerId,
      from: "stub-bot",
      body: `Order ${orderId} status: ${status}`,
      status: "sent" as MessageStatus,
      timestamp: new Date(),
    };
  }

  async sendPaymentLink(
    customerId: string,
    orderId: string,
    amount: number,
    paymentUrl: string,
  ): Promise<WhatsAppMessage> {
    return {
      id: "stub-paylink-" + Date.now(),
      to: customerId,
      from: "stub-bot",
      body: `Order ${orderId}: Pay $${amount} at ${paymentUrl}`,
      status: "sent" as MessageStatus,
      timestamp: new Date(),
    };
  }
}
