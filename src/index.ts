import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { SchedulingServiceStub } from "../services/SchedulingService.js";
import { PaymentServiceStub } from "../services/PaymentServiceStub.js";
import { ComplianceLayer } from "../middleware/ComplianceMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

const schedulingService = new SchedulingServiceStub();
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
  res.json({ status: "ok", service: "dental-saas-backend", version: "0.1.0-stub" });
});

app.post("/api/appointments", async (req, res) => {
  const { patientId, slotId, dentistId, metadata } = req.body;
  const appt = await schedulingService.createAppointment(patientId, slotId, dentistId, metadata);
  await compliance.auditLog("create_appointment", patientId, "api", appt.id);
  res.status(201).json(appt);
});

app.get("/api/slots", async (req, res) => {
  const { date, dentistId } = req.query as { date: string; dentistId: string };
  const slots = await schedulingService.listSlots(new Date(date), dentistId);
  res.json(slots);
});

app.post("/api/payments/subscriptions", async (req, res) => {
  const { customerId, planId } = req.body;
  const sub = await paymentService.createSubscription(customerId, planId);
  await compliance.auditLog("create_subscription", customerId, "api", sub.id);
  res.status(201).json(sub);
});

app.listen(PORT, () => {
  console.log(`dental-saas-backend listening on http://localhost:${PORT}`);
});
