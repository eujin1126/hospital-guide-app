export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  gender: '남' | '여';
  phone: string;
  registrationNumber: string;
}

export interface Examination {
  id: string;
  name: string;
  description: string;
  location: string;
  floor: string;
  order: number;
  duration: number; // 분 단위
  fasting: boolean;
  preparations: string[];
  precautions: string[];
}

export interface Appointment {
  id: string;
  patient: Patient;
  date: string;
  time: string;
  department: string;
  doctor: string;
  examinations: Examination[];
  guideStatus: 'not_generated' | 'generated' | 'confirmed';
  printStatus: 'not_printed' | 'printed';
  generatedGuide?: string;
  confirmedAt?: string;
  printedAt?: string;
}

export interface StaffUser {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: string;
}

export interface DashboardStats {
  totalAppointments: number;
  guideGenerated: number;
  guideNotGenerated: number;
  printed: number;
}

export interface RecentActivity {
  id: string;
  patientName: string;
  action: string;
  time: string;
}
