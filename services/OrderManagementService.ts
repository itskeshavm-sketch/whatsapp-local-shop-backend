import type { Order, OrderManagementService, OrderItem, OrderStatus } from "./interfaces.js";

/**
 * OrderManagementServiceStub — stub implementation.
 * All methods return synthetic data until real persistence layer is wired.
 */
export class OrderManagementServiceStub implements OrderManagementService {
  async createOrder(
    shopId: string,
    customerId: string,
    items: OrderItem[],
    metadata?: Record<string, unknown>,
  ): Promise<Order> {
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    return {
      id: "stub-order-" + Date.now(),
      shopId,
      customerId,
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata,
      piiEncrypted: true,
    };
  }

  async listOrders(
    _shopId: string,
    _filter?: Partial<Order>,
  ): Promise<Order[]> {
    return [];
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    return {
      id: orderId,
      shopId: "stub",
      customerId: "stub",
      items: [],
      totalAmount: 0,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
      piiEncrypted: true,
    };
  }

  async cancelOrder(_orderId: string): Promise<void> {}

  async listOrderHistory(_customerId: string, _limit = 50): Promise<Order[]> {
    return [];
  }
}
