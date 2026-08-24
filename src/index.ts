import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { OrderManagementServiceStub } from "../services/OrderManagementService.js";
import { WhatsAppMessagingServiceStub } from "../services/WhatsAppMessagingServiceStub.js";
import { PaymentServiceStub } from "../services/PaymentServiceStub.js";
import { ComplianceLayer } from "../middleware/ComplianceMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

const orderService = new OrderManagementServiceStub();
const whatsappService = new WhatsAppMessagingServiceStub();
const paymentService = new PaymentServiceStub();
const compliance = new ComplianceLayer();

app.use("/api", async (req, res, next) => {
  const role = req.headers["x-user-role"] as string | undefined;
  if (role && !compliance.enforceRole(role, req.path)) {
    await compliance.auditLog("forbidden_access", "unknown", role, req.path, {
      method: req.method,
    });
    return res.status(403).json({ error: "Insufficient role permissions" });
  }
  await compliance.auditLog("request", "unknown", role ?? "anonymous", req.path, {
    method: req.method,
  });
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "whatsapp-local-shop-backend",
    version: "0.1.0-stub",
  });
});

app.post("/api/orders", async (req, res) => {
  const { shopId, customerId, items, metadata } = req.body;
  const order = await orderService.createOrder(shopId, customerId, items, metadata);
  await compliance.auditLog("create_order", customerId, "api", order.id);
  res.status(201).json(order);
});

app.get("/api/orders", async (req, res) => {
  const { shopId } = req.query as { shopId: string };
  const orders = await orderService.listOrders(shopId);
  res.json(orders);
});

app.post("/api/whatsapp/send", async (req, res) => {
  const { to, body, metadata } = req.body;
  const msg = await whatsappService.sendMessage(to, body, metadata);
  await compliance.auditLog("send_message", "unknown", "api", msg.id);
  res.status(200).json(msg);
});

app.post("/api/payments/subscriptions", async (req, res) => {
  const { shopId, planId } = req.body;
  const sub = await paymentService.setupShopBilling(shopId, planId);
  await compliance.auditLog("setup_shop_billing", shopId, "api", sub.id);
  res.status(201).json(sub);
});

app.listen(PORT, () => {
  console.log(`whatsapp-local-shop-backend listening on http://localhost:${PORT}`);
});
