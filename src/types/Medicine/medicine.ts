export interface Medicine {
  id: number;
  name: string;
  dosage: number;
  category: string;
  frequency: string;
  schedules: string[];
  stock: number;
  boxes: number;
  status: string;
  pills_per_box: number;
  created_at: string;
  days_until_empty?: number;
  is_low_stock?: boolean;
  duration?: number | null;
  notes?: string | null;
}

export interface MedicineForm {
  id: number;
  name: string;
  dosage: number;
  category: string;
  frequency: string;
  schedules: string[];
  stock: number;
  pills_per_box: number;
  boxes: number;
  created_at?: string;
  days_until_empty: number;
}

export interface MedicineToReplace {
  name: string;
  dosage: string;
  notification_type: string;
  created_at: string;
}

