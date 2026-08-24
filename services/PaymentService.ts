export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: "active" | "canceled" | "past_due";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  customerId: string;
  status: "succeeded" | "requires_action" | "failed";
  currency: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  status: "draft" | "open" | "paid" | "void";
  issuedAt: Date;
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface PaymentService {
  createSubscription(
    customerId: string,
    planId: string,
  ): Promise<Subscription>;
  processPayment(
    amount: number,
    customerId: string,
    metadata?: Record<string, unknown>,
  ): Promise<PaymentIntent>;
  generateInvoice(subscriptionId: string): Promise<Invoice>;
  listTransactions(
    filter: Record<string, unknown>,
  ): Promise<Transaction[]>;
}
