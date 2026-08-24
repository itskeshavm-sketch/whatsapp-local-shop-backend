import type {
  PaymentService,
  ShopSubscription,
  PaymentIntent,
  Invoice,
  Transaction,
} from "./PaymentService.js";

/**
 * PaymentServiceStub — stub implementation.
 * Reframed for local shops. All methods return synthetic data until payment provider connected.
 */
export class PaymentServiceStub implements PaymentService {
  async setupShopBilling(
    shopId: string,
    planId: string,
  ): Promise<ShopSubscription> {
    return {
      id: "stub-sub-" + Date.now(),
      shopId,
      planId,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60_000),
    };
  }

  async processOrderPayment(
    amount: number,
    customerId: string,
    shopId: string,
    _metadata?: Record<string, unknown>,
  ): Promise<PaymentIntent> {
    return {
      id: "stub-pi-" + Date.now(),
      amount,
      customerId,
      shopId,
      status: "succeeded",
      currency: "usd",
    };
  }

  async sendInvoiceViaWhatsApp(
    subscriptionId: string,
    shopId: string,
  ): Promise<Invoice> {
    return {
      id: "stub-inv-" + Date.now(),
      shopId,
      subscriptionId,
      amount: 0,
      status: "draft",
      issuedAt: new Date(),
      whatsappSent: false,
    };
  }

  async listTransactions(_filter: Record<string, unknown>): Promise<Transaction[]> {
    return [];
  }
}
