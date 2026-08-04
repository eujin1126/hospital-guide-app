import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { appointments, maskName } from '@/data/mockData';
import { Appointment, StaffUser } from '@/types';

export const TodayPatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const staff: StaffUser = JSON.parse(localStorage.getItem('currentStaff') || '{}');

  const getGuideStatusBadge = (apt: Appointment) => {
    switch (apt.guideStatus) {
      case 'confirmed':
        return <Badge status="success">확정됨</Badge>;
      case 'generated':
        return <Badge status="warning">확인 필요</Badge>;
      default:
        return <Badge status="neutral">미생성</Badge>;
    }
  };

  const getPrintStatusBadge = (apt: Appointment) => {
    if (apt.printStatus === 'printed') {
      return <Badge status="success">출력됨</Badge>;
    }
    return <Badge status="neutral">미출력</Badge>;
  };

  return (
    <Layout staffName={staff.name}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          오늘 예약 환자
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          오늘 예약된 환자 {appointments.length}명의 목록입니다.
        </p>
      </div>

      <Card padding="0">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>접수번호</th>
                <th style={thStyle}>환자이름</th>
                <th style={thStyle}>생년월일</th>
                <th style={thStyle}>예약시간</th>
                <th style={thStyle}>진료과</th>
                <th style={thStyle}>검사수</th>
                <th style={thStyle}>안내문</th>
                <th style={thStyle}>출력</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr
                  key={apt.id}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                  onClick={() => navigate(`/patient/${apt.id}`)}
                >
                  <td style={tdStyle}>{apt.id}</td>
                  <td style={tdStyle}>{maskName(apt.patient.name)}</td>
                  <td style={tdStyle}>{apt.patient.birthDate}</td>
                  <td style={tdStyle}>{apt.time}</td>
                  <td style={tdStyle}>{apt.department}</td>
                  <td style={tdStyle}>{apt.examinations.length}건</td>
                  <td style={tdStyle}>{getGuideStatusBadge(apt)}</td>
                  <td style={tdStyle}>{getPrintStatusBadge(apt)}</td>
                  <td style={tdStyle}>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/patient/${apt.id}`); }}>
                      상세
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

const thStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: 600,
  color: '#64748b',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  color: '#334155',
};
