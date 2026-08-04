import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { appointments } from '@/data/mockData';
import { yearlyAppointments, getAppointmentsForDate, CalendarAppointment, holidays2026 } from '@/data/calendarData';
import { StaffUser } from '@/types';

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const staff: StaffUser = JSON.parse(localStorage.getItem('currentStaff') || '{}');

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedAppointments, setSelectedAppointments] = useState<CalendarAppointment[]>(
    getAppointmentsForDate(todayStr)
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isToday = (day: number) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const getDateStr = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getCountForDay = (day: number): number => {
    const dateStr = getDateStr(day);
    return yearlyAppointments[dateStr] || 0;
  };

  const isHoliday = (day: number): string | null => {
    const dateStr = getDateStr(day);
    return holidays2026[dateStr] || null;
  };

  const handleDayClick = (day: number) => {
    const dateStr = getDateStr(day);
    setSelectedDate(dateStr);

    if (dateStr === todayStr) {
      setSelectedAppointments(
        appointments.map((apt) => ({
          id: apt.id,
          patientName: apt.patient.name,
          time: apt.time,
          department: apt.department,
          examCount: apt.examinations.length,
        }))
      );
    } else {
      setSelectedAppointments(getAppointmentsForDate(dateStr));
    }
  };

  const isSelected = (day: number) => {
    return getDateStr(day) === selectedDate;
  };

  // 파란색 진하기로 건수 표현
  const getCountBgColor = (count: number) => {
    if (count === 0) return 'transparent';
    if (count <= 3) return '#eff6ff';    // 매우 연한 파랑
    if (count <= 6) return '#dbeafe';    // 연한 파랑
    if (count <= 9) return '#bfdbfe';    // 중간 파랑
    if (count <= 12) return '#93c5fd';   // 진한 파랑
    return '#60a5fa';                     // 매우 진한 파랑
  };

  const getCountTextColor = (count: number) => {
    if (count <= 9) return '#1e40af';
    return '#fff';
  };

  const selectedDateObj = new Date(selectedDate);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const selectedDayName = dayNames[selectedDateObj.getDay()];
  const selectedHoliday = holidays2026[selectedDate] || null;

  return (
    <Layout staffName={staff.name}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          예약 캘린더
        </h1>
      </div>

      {/* 세로 레이아웃 */}
      <Card style={{ marginBottom: '16px' }}>
        {/* 캘린더 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Button variant="ghost" onClick={prevMonth}>← 이전</Button>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            {currentYear}년 {currentMonth + 1}월
          </h2>
          <Button variant="ghost" onClick={nextMonth}>다음 →</Button>
        </div>

        {/* 요일 헤더 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <div key={day} style={{ textAlign: 'center', fontSize: '13px', fontWeight: 600, color: i === 0 ? '#ef4444' : i === 6 ? '#2563eb' : '#64748b', padding: '8px' }}>
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} style={{ minHeight: '90px' }} />;
            }
            const count = getCountForDay(day);
            const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
            const holiday = isHoliday(day);
            const isRed = dayOfWeek === 0 || !!holiday;

            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                style={{
                  minHeight: '90px',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  border: isToday(day)
                    ? '2px solid #1e3a5f'
                    : isSelected(day)
                    ? '2px solid #2563eb'
                    : '1px solid #f1f5f9',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  fontSize: '13px',
                  fontWeight: isToday(day) || isSelected(day) ? 700 : 400,
                  color: isRed ? '#ef4444' : dayOfWeek === 6 ? '#2563eb' : '#334155',
                  marginBottom: '4px',
                }}>
                  {day}
                  {isToday(day) && <span style={{ fontSize: '9px', marginLeft: '2px', color: '#1e3a5f' }}>오늘</span>}
                </div>
                {holiday && (
                  <div style={{ fontSize: '9px', color: '#ef4444', marginBottom: '2px' }}>
                    {holiday}
                  </div>
                )}
                {count > 0 && (
                  <div style={{
                    marginTop: '2px',
                    padding: '3px 6px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: getCountBgColor(count),
                    color: getCountTextColor(count),
                    textAlign: 'center',
                  }}>
                    {count}건
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 범례 */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#eff6ff', border: '1px solid #dbeafe', display: 'inline-block' }}></span> 1~3건
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#dbeafe', display: 'inline-block' }}></span> 4~6건
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#bfdbfe', display: 'inline-block' }}></span> 7~9건
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#93c5fd', display: 'inline-block' }}></span> 10~12건
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#60a5fa', display: 'inline-block' }}></span> 13건+
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', border: '2px solid #1e3a5f', display: 'inline-block' }}></span> 오늘
          </span>
        </div>
      </Card>

      {/* 선택된 날짜 예약 목록 */}
      <Card>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '4px' }}>
          {selectedDate} ({selectedDayName})
          {selectedHoliday && <span style={{ fontSize: '13px', color: '#ef4444', marginLeft: '8px' }}>{selectedHoliday}</span>}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
          예약 {selectedAppointments.length}건
        </p>

        {selectedAppointments.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
            {selectedAppointments.map((apt) => (
              <div
                key={apt.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                      {apt.patientName}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>
                      {apt.department}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>
                    {apt.time}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  검사 {apt.examCount}건
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
            <p>{selectedHoliday ? `${selectedHoliday} - 휴진` : '이 날짜에는 예약이 없습니다.'}</p>
          </div>
        )}
      </Card>
    </Layout>
  );
};
