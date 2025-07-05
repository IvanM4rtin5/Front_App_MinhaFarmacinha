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
}