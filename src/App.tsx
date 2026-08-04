import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  LoginPage,
  DashboardPage,
  AppointmentsPage,
  PatientDetailPage,
  GuideEditorPage,
  PrintPreviewPage,
  PatientsPage,
  CalendarPage,
  GuidesPage,
  PrintHistoryPage,
  SettingsPage,
  TodayPatientsPage,
} from '@/pages';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/print-today" element={<TodayPatientsPage />} />
        <Route path="/print-history" element={<PrintHistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/patient/:id" element={<PatientDetailPage />} />
        <Route path="/guide/:id" element={<GuideEditorPage />} />
        <Route path="/print/:id" element={<PrintPreviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
