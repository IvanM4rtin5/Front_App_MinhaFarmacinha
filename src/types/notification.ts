export interface Notification {
    id: number;
    title: string;
    message: string;
    notification_type: string;
    status: string;
    created_at: string;
    medication_name?: string;
  }