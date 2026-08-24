export interface ShopSubscription {
  id: string;
  shopId: string;
  planId: string;
  status: "active" | "canceled" | "past_due";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  customerId: string;
  shopId: string;
  status: "succeeded" | "requires_action" | "failed";
  currency: string;
}

export interface Invoice {
  id: string;
  shopId: string;
  subscriptionId: string;
  amount: number;
  status: "draft" | "open" | "paid" | "void";
  issuedAt: Date;
  whatsappSent: boolean;
}

export interface Transaction {
  id: string;
  shopId: string;
  customerId: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface PaymentService {
  setupShopBilling(
    shopId: string,
    planId: string,
  ): Promise<ShopSubscription>;
  processOrderPayment(
    amount: number,
    customerId: string,
    shopId: string,
    metadata?: Record<string, unknown>,
  ): Promise<PaymentIntent>;
  sendInvoiceViaWhatsApp(
    subscriptionId: string,
    shopId: string,
  ): Promise<Invoice>;
  listTransactions(
    filter: Record<string, unknown>,
  ): Promise<Transaction[]>;
}
