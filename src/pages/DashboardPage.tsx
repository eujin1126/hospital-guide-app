import React from 'react';
import { Layout } from '@/components/layout';
import { Card } from '@/components/ui';
import { appointments } from '@/data/mockData';
import { yearlyAppointments } from '@/data/calendarData';
import { StaffUser } from '@/types';

export const DashboardPage: React.FC = () => {
  const staff: StaffUser = JSON.parse(
    localStorage.getItem('currentStaff') || '{}'
  );

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 오늘 통계
  const todayTotal = appointments.length;
  const todayCompleted = appointments.filter(a => a.guideStatus === 'confirmed').length;
  const todayPending = appointments.filter(a => a.guideStatus === 'not_generated').length;
  const todayPrinted = appointments.filter(a => a.printStatus === 'printed').length;
  const todayWaiting = todayTotal - todayCompleted;

  // 이번 주 데이터 (월~일)
  const getWeekData = () => {
    const data: { label: string; count: number }[] = [];
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      data.push({
        label: `${dayNames[d.getDay()]}`,
        count: yearlyAppointments[key] || 0,
      });
    }
    return data;
  };

  // 월별 데이터 (올해)
  const getMonthlyData = () => {
    const data: { label: string; count: number }[] = [];
    for (let month = 0; month < 12; month++) {
      let total = 0;
      const daysInMonth = new Date(2026, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const key = `2026-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        total += yearlyAppointments[key] || 0;
      }
      data.push({ label: `${month + 1}월`, count: total });
    }
    return data;
  };

  // 시간대별 분포
  const getHourlyData = () => {
    const hours: Record<string, number> = {};
    appointments.forEach((apt) => {
      const hour = apt.time.split(':')[0] + ':00';
      hours[hour] = (hours[hour] || 0) + 1;
    });
    return Object.entries(hours)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, count]) => ({ label, count }));
  };

  // 진료과별 분포
  const getDepartmentData = () => {
    const depts: Record<string, number> = {};
    appointments.forEach((apt) => {
      depts[apt.department] = (depts[apt.department] || 0) + 1;
    });
    return Object.entries(depts)
      .sort(([, a], [, b]) => b - a)
      .map(([label, count]) => ({ label, count }));
  };

  const weekData = getWeekData();
  const monthlyData = getMonthlyData();
  const hourlyData = getHourlyData();
  const departmentData = getDepartmentData();

  const maxWeek = Math.max(...weekData.map(d => d.count), 1);
  const maxMonthly = Math.max(...monthlyData.map(d => d.count), 1);
  const maxHourly = Math.max(...hourlyData.map(d => d.count), 1);

  return (
    <Layout staffName={staff.name}>
      {/* 헤더 */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          대시보드
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          오늘의 환자 현황과 통계를 한눈에 확인할 수 있습니다.
        </p>
      </div>

      {/* 상단 통계 카드 4개 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="오늘 전체 예약" value={todayTotal} unit="명" color="#4a7dff" />
        <StatCard label="대기 환자" value={todayWaiting} unit="명" color="#f59e0b" />
        <StatCard label="안내문 미생성" value={todayPending} unit="건" color="#ef4444" />
        <StatCard label="출력 완료" value={todayPrinted} unit="건" color="#10b981" />
      </div>

      {/* 차트 영역 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* 이번 주 예약 추이 */}
        <Card>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
            이번 주 예약 현황
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px' }}>
            {weekData.map((d, i) => {
              const height = d.count > 0 ? (d.count / maxWeek) * 110 + 20 : 4;
              const isToday = i === (today.getDay() === 0 ? 6 : today.getDay() - 1);
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{d.count}</span>
                  <div style={{
                    width: '100%',
                    height: `${height}px`,
                    borderRadius: '6px',
                    backgroundColor: isToday ? '#4a7dff' : '#dbeafe',
                    transition: 'height 0.3s',
                  }} />
                  <span style={{ fontSize: '11px', color: isToday ? '#4a7dff' : '#94a3b8', fontWeight: isToday ? 700 : 400 }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 시간대별 분포 */}
        <Card>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
            오늘 시간대별 예약 분포
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {hourlyData.map((d) => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', width: '40px', flexShrink: 0 }}>{d.label}</span>
                <div style={{ flex: 1, height: '24px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(d.count / maxHourly) * 100}%`,
                    height: '100%',
                    backgroundColor: '#4a7dff',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '8px',
                  }}>
                    <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>{d.count}명</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* 월별 예약 추이 */}
        <Card>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
            2026년 월별 환자 수 추이
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '160px' }}>
            {monthlyData.map((d, i) => {
              const height = d.count > 0 ? (d.count / maxMonthly) * 130 + 20 : 4;
              const isCurrent = i === today.getMonth();
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748b' }}>{d.count}</span>
                  <div style={{
                    width: '100%',
                    height: `${height}px`,
                    borderRadius: '5px',
                    backgroundColor: isCurrent ? '#4a7dff' : '#e0e7ff',
                    transition: 'height 0.3s',
                  }} />
                  <span style={{ fontSize: '10px', color: isCurrent ? '#4a7dff' : '#94a3b8', fontWeight: isCurrent ? 700 : 400 }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 진료과별 분포 */}
        <Card>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
            오늘 진료과별 현황
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {departmentData.map((d) => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#334155' }}>{d.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '60px',
                    height: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${(d.count / todayTotal) * 100}%`,
                      height: '100%',
                      backgroundColor: '#4a7dff',
                      borderRadius: '4px',
                    }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', minWidth: '24px', textAlign: 'right' }}>{d.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

const StatCard: React.FC<{ label: string; value: number; unit: string; color: string }> = ({ label, value, unit, color }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  }}>
    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <span style={{ fontSize: '32px', fontWeight: 800, color }}>{value}</span>
      <span style={{ fontSize: '14px', color: '#94a3b8' }}>{unit}</span>
    </div>
  </div>
);
