/**
 * API 클라이언트
 * 환경변수 VITE_API_URL을 통해 백엔드 주소를 설정합니다.
 * 로컬: http://localhost:8000
 * 배포: https://your-render-app.onrender.com
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchPatients(search?: string) {
  const url = search
    ? `${API_BASE}/api/patients?search=${encodeURIComponent(search)}`
    : `${API_BASE}/api/patients`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchPatient(patientId: string) {
  const res = await fetch(`${API_BASE}/api/patients/${patientId}`);
  return res.json();
}

export async function fetchAppointments() {
  const res = await fetch(`${API_BASE}/api/appointments`);
  return res.json();
}

export async function fetchAppointment(appointmentId: string) {
  const res = await fetch(`${API_BASE}/api/appointments/${appointmentId}`);
  return res.json();
}

export async function generateGuide(appointmentId: string) {
  const res = await fetch(`${API_BASE}/api/generate-guide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointmentId }),
  });
  return res.json();
}
