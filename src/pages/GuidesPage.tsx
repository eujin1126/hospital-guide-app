import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { appointments, maskName } from '@/data/mockData';
import { StaffUser } from '@/types';

export const GuidesPage: React.FC = () => {
  const navigate = useNavigate();
  const staff: StaffUser = JSON.parse(localStorage.getItem('currentStaff') || '{}');
  const [tab, setTab] = useState<'generated' | 'not_generated'>('generated');

  const generatedList = appointments.filter(
    (a) => a.guideStatus === 'generated' || a.guideStatus === 'confirmed'
  );
  const notGeneratedList = appointments.filter(
    (a) => a.guideStatus === 'not_generated'
  );

  const currentList = tab === 'generated' ? generatedList : notGeneratedList;

  return (
    <Layout staffName={staff.name}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          안내문 관리
        </h1>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        <button
          onClick={() => setTab('generated')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: tab === 'generated' ? '#fff' : 'transparent',
            color: tab === 'generated' ? '#1e293b' : '#64748b',
            boxShadow: tab === 'generated' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          안내문 생성 완료 ({generatedList.length})
        </button>
        <button
          onClick={() => setTab('not_generated')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: tab === 'not_generated' ? '#fff' : 'transparent',
            color: tab === 'not_generated' ? '#1e293b' : '#64748b',
            boxShadow: tab === 'not_generated' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          안내문 미생성 ({notGeneratedList.length})
        </button>
      </div>

      {/* 목록 */}
      <Card padding="0">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>접수번호</th>
                <th style={thStyle}>환자이름</th>
                <th style={thStyle}>예약시간</th>
                <th style={thStyle}>진료과</th>
                <th style={thStyle}>검사수</th>
                <th style={thStyle}>상태</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((apt) => (
                <tr key={apt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{apt.id}</td>
                  <td style={tdStyle}>{maskName(apt.patient.name)}</td>
                  <td style={tdStyle}>{apt.time}</td>
                  <td style={tdStyle}>{apt.department}</td>
                  <td style={tdStyle}>{apt.examinations.length}건</td>
                  <td style={tdStyle}>
                    {apt.guideStatus === 'confirmed' && <Badge status="success">확정됨</Badge>}
                    {apt.guideStatus === 'generated' && <Badge status="warning">확인 필요</Badge>}
                    {apt.guideStatus === 'not_generated' && <Badge status="neutral">미생성</Badge>}
                  </td>
                  <td style={tdStyle}>
                    {tab === 'generated' ? (
                      <Button variant="outline" size="sm" onClick={() => navigate(`/guide/${apt.id}`)}>
                        편집
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => navigate(`/guide/${apt.id}`)}>
                        생성
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentList.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              해당하는 항목이 없습니다.
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
