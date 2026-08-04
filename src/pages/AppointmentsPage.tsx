import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, Badge, Input, Button } from '@/components/ui';
import { appointments, maskName } from '@/data/mockData';
import { Appointment, StaffUser } from '@/types';

export const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  const staff: StaffUser = JSON.parse(
    localStorage.getItem('currentStaff') || '{}'
  );

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    // 검색 필터
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (apt) =>
          apt.patient.name.includes(searchQuery) ||
          apt.patient.birthDate.includes(searchQuery) ||
          apt.id.toLowerCase().includes(q) ||
          apt.department.includes(searchQuery)
      );
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      if (statusFilter === 'not_generated') {
        result = result.filter((a) => a.guideStatus === 'not_generated');
      } else if (statusFilter === 'generated') {
        result = result.filter(
          (a) => a.guideStatus === 'generated' || a.guideStatus === 'confirmed'
        );
      } else if (statusFilter === 'printed') {
        result = result.filter((a) => a.printStatus === 'printed');
      }
    }

    // 시간 필터
    if (timeFilter !== 'all') {
      if (timeFilter === 'morning') {
        result = result.filter((a) => parseInt(a.time.split(':')[0]) < 12);
      } else if (timeFilter === 'afternoon') {
        result = result.filter((a) => parseInt(a.time.split(':')[0]) >= 12);
      }
    }

    return result;
  }, [searchQuery, statusFilter, timeFilter]);

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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          환자 예약 목록
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
          오늘 예약된 환자 {appointments.length}명
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input
              placeholder="이름, 접수번호, 생년월일, 진료과 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="all">전체 상태</option>
            <option value="not_generated">미생성</option>
            <option value="generated">생성 완료</option>
            <option value="printed">출력 완료</option>
          </select>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="all">전체 시간</option>
            <option value="morning">오전</option>
            <option value="afternoon">오후</option>
          </select>
        </div>
      </Card>

      {/* 환자 목록 테이블 */}
      <Card padding="0">
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}
          >
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
              {filteredAppointments.map((apt) => (
                <tr
                  key={apt.id}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/patient/${apt.id}`)}
                    >
                      상세보기
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAppointments.length === 0 && (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '14px',
              }}
            >
              검색 결과가 없습니다.
            </div>
          )}
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
