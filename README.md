# whatsapp-local-shop-backend

Backend API for local shop WhatsApp business automation SaaS (PII/SOC2 compliant).

## Phase 1 — Stub Implementations

Service interfaces with stub implementations. Real integrations (WhatsApp Business API, payment providers) wired later via COMPOSIO.

- **OrderManagementService** — createOrder, listOrders, updateOrderStatus, cancelOrder, listOrderHistory
- **WhatsAppMessagingService** — sendMessage, sendTemplate, handleIncomingMessage, sendOrderNotification, sendPaymentLink
- **PaymentService** — setupShopBilling, processOrderPayment, sendInvoiceViaWhatsApp, listTransactions
- **ComplianceMiddleware** — encryptPII, decryptPII, auditLog, enforceRole, maskPII

## Run

```bash
npm install
npm run dev
```

## Status

- GitHub repo: https://github.com/itskeshavm-sketch/whatsapp-local-shop-backend
- Only GitHub verified as connected (COMPOSIO)
- WhatsApp Business API, payment providers NOT yet connected
