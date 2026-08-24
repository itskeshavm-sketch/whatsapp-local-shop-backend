import type {
  Appointment,
  SchedulingService,
  TimeSlot,
  FindFreeSlotsFilter,
} from "./interfaces.js";

/**
 * SchedulingServiceStub — stub implementation.
 * All methods return empty or synthetic data until a real calendar
 * API (Outlook / Google Calendar via COMPOSIO) is connected.
 */
export class SchedulingServiceStub implements SchedulingService {
  async createAppointment(
    patientId: string,
    slotId: string,
    dentistId: string,
    metadata?: Record<string, unknown>,
  ): Promise<Appointment> {
    return {
      id: "stub-appt-" + Date.now(),
      patientId,
      dentistId,
      startTime: new Date(),
      endTime: new Date(Date.now() + 30 * 60_000),
      status: "scheduled",
      phiEncrypted: true,
      metadata,
    };
  }

  async listSlots(_date: Date, _dentistId: string): Promise<TimeSlot[]> {
    return [];
  }

  async rescheduleAppointment(
    apptId: string,
    newSlotId: string,
  ): Promise<Appointment> {
    return {
      id: apptId,
      patientId: "stub",
      dentistId: "stub",
      startTime: new Date(),
      endTime: new Date(),
      status: "scheduled",
      phiEncrypted: true,
    };
  }

  async cancelAppointment(_apptId: string): Promise<void> {}

  async findFreeSlots(_filter: FindFreeSlotsFilter): Promise<TimeSlot[]> {
    return [];
  }
}
