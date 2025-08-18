import type { Medicine } from "../Medicine/medicine";

export interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  category: Medicine["category"];
  medicineId: number;
  notificationId: number | null;
  notificationStatus: string | null;
  doseId: number | null;
  status: "pending" | "taken" | "missed";  
  takenAt?: Date | null;          
  wasTaken?: boolean;            
}