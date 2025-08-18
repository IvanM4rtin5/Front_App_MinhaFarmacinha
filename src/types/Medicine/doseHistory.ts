// types/Medicine/doseHistory.ts
export interface DoseHistory {
  id: number;
  medication_id: number;
  scheduled_for: string | null;
  taken_at: string | null;
  status: "programada" | "tomada" | "esquecida";
  notification_id?: number;
  medicine_name: string;
  dosage: number;
  category: string;
}