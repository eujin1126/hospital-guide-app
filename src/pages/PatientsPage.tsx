import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, Input, Button } from '@/components/ui';
import { appointments, maskName } from '@/data/mockData';
import { StaffUser } from '@/types';

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'registrationNumber' | 'name' | 'birthDate'>('registrationNumber');

  const staff: StaffUser = JSON.parse(
    localStorage.getItem('currentStaff') || '{}'
  );

  // 전체 환자 목록 (중복 제거 후 등록번호 오름차순)
  const allPatients = useMemo(() => {
    const seen = new Set<string>();
    const unique = appointments.filter((apt) => {
      if (seen.has(apt.patient.id)) return false;
      seen.add(apt.patient.id);
      return true;
    });

    // 정렬
    return unique.sort((a, b) => {
      if (sortField === 'registrationNumber') {
        return a.patient.registrationNumber.localeCompare(b.patient.registrationNumber);
      }
      if (sortField === 'name') {
        return a.patient.name.localeCompare(b.patient.name);
      }
      return a.patient.birthDate.localeCompare(b.patient.birthDate);
    });
  }, [sortField]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return allPatients;
    const q = searchQuery.trim().toLowerCase();
    return allPatients.filter(
      (apt) =>
        apt.patient.name.includes(searchQuery) ||
        apt.patient.birthDate.includes(searchQuery) ||
        apt.patient.registrationNumber.toLowerCase().includes(q) ||
        apt.patient.phone.includes(searchQuery) ||
        apt.department.includes(searchQuery)
    );
  }, [searchQuery, allPatients]);

  return (
    <Layout staffName={staff.name}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          전체 환자 목록
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          등록된 전체 환자 {allPatients.length}명
        </p>
      </div>

      {/* 검색 + 정렬 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <Input
              placeholder="환자 이름, 등록번호, 생년월일, 연락처, 진료과 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="registrationNumber">등록번호순</option>
            <option value="name">이름순</option>
            <option value="birthDate">생년월일순</option>
          </select>
        </div>
      </Card>

      {/* 환자 테이블 */}
      <Card padding="0">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>등록번호</th>
                <th style={thStyle}>환자이름</th>
                <th style={thStyle}>생년월일</th>
                <th style={thStyle}>성별</th>
                <th style={thStyle}>연락처</th>
                <th style={thStyle}>최근 진료과</th>
                <th style={thStyle}>최근 예약</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((apt) => (
                <tr
                  key={apt.patient.id}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                  onClick={() => navigate(`/patient/${apt.id}`)}
                >
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600 }}>{apt.patient.registrationNumber}</span>
                  </td>
                  <td style={tdStyle}>{maskName(apt.patient.name)}</td>
                  <td style={tdStyle}>{apt.patient.birthDate}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      backgroundColor: apt.patient.gender === '남' ? '#dbeafe' : '#fce7f3',
                      color: apt.patient.gender === '남' ? '#1d4ed8' : '#be185d',
                    }}>
                      {apt.patient.gender}
                    </span>
                  </td>
                  <td style={tdStyle}>{apt.patient.phone}</td>
                  <td style={tdStyle}>{apt.department}</td>
                  <td style={tdStyle}>{apt.date} {apt.time}</td>
                  <td style={tdStyle}>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/patient/${apt.id}`); }}>
                      상세
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
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
