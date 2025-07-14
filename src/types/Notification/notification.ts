export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  status: string;
  scheduled_for?: string;
  sent_at?: string;
  read_at?: string;
  created_at: string;
  medication_name?: string;
  medication_dosage?: string;
  medication_id?: number;
}
export enum NotificationType {
  MEDICATION_REMINDER = "MEDICATION_REMINDER",
  LOW_STOCK_ALERT = "LOW_STOCK_ALERT",
  MEDICATION_EXPIRY = "MEDICATION_EXPIRY",
  REFILL_REMINDER = "REFILL_REMINDER",
  GENERAL = "GENERAL"
}
