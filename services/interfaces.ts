export interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "completed" | "cancelled";
  metadata?: Record<string, unknown>;
  phiEncrypted: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  dentistId: string;
  availability: "free" | "booked" | "blocked";
}

export type FindFreeSlotsFilter = {
  start: Date;
  end: Date;
  dentistId: string;
};

export interface SchedulingService {
  createAppointment(
    patientId: string,
    slotId: string,
    dentistId: string,
    metadata?: Record<string, unknown>,
  ): Promise<Appointment>;
  listSlots(date: Date, dentistId: string): Promise<TimeSlot[]>;
  rescheduleAppointment(
    apptId: string,
    newSlotId: string,
  ): Promise<Appointment>;
  cancelAppointment(apptId: string): Promise<void>;
  findFreeSlots(filter: FindFreeSlotsFilter): Promise<TimeSlot[]>;
}
