# dental-saas-backend

Backend API for vertical-specific dental scheduling SaaS (HIPAA + SOC2 compliant).

## Phase 1 — Stub Implementations

Service interfaces with stub implementations. Real integrations (Google Calendar, Stripe) wired later via COMPOSIO.

- **SchedulingService** — createAppointment, listSlots, reschedule, cancel, findFreeSlots
- **PaymentService** — createSubscription, processPayment, generateInvoice, listTransactions
- **ComplianceMiddleware** — encryptPHI, decryptPHI, auditLog, enforceRole, maskPHI

## Run

```bash
npm install
npm run dev
```

## Status

- GitHub repo: https://github.com/itskeshavm-sketch/dental-saas-backend
- Only GitHub verified as connected (COMPOSIO)
- Calendar (Outlook/Google), Stripe NOT yet connected
