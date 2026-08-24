import type {
  PaymentService,
  Subscription,
  PaymentIntent,
  Invoice,
  Transaction,
} from "./PaymentService.js";

/**
 * PaymentServiceStub — stub implementation.
 * All methods return synthetic data until Stripe (via stripe_mcp) is connected.
 */
export class PaymentServiceStub implements PaymentService {
  async createSubscription(
    customerId: string,
    planId: string,
  ): Promise<Subscription> {
    return {
		id: "stub-sub-" + Date.now(),
		customerId,
		planId,
		status: "active",
		currentPeriodStart: new Date(),
		currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60_000),
    };
  }

  async processPayment(
    amount: number,
    customerId: string,
    _metadata?: Record<string, unknown>,
  ): Promise<PaymentIntent> {
    return {
      id: "stub-pi-" + Date.now(),
      amount,
      customerId,
      status: "succeeded",
      currency: "usd",
    };
  }

  async generateInvoice(subscriptionId: string): Promise<Invoice> {
    return {
      id: "stub-inv-" + Date.now(),
      subscriptionId,
      amount: 0,
      status: "draft",
      issuedAt: new Date(),
    };
  }

  async listTransactions(_filter: Record<string, unknown>): Promise<Transaction[]> {
    return [];
  }
}
