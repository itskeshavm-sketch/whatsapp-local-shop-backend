export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  shopId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
  piiEncrypted: boolean;
}

export interface OrderManagementService {
  createOrder(
    shopId: string,
    customerId: string,
    items: OrderItem[],
    metadata?: Record<string, unknown>,
  ): Promise<Order>;
  listOrders(
    shopId: string,
    filter?: Partial<Order>,
  ): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
  cancelOrder(orderId: string): Promise<void>;
  listOrderHistory(
    customerId: string,
    limit?: number,
  ): Promise<Order[]>;
}
