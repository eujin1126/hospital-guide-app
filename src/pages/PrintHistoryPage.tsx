import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { appointments, maskName } from '@/data/mockData';
import { StaffUser } from '@/types';

export const PrintHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const staff: StaffUser = JSON.parse(localStorage.getItem('currentStaff') || '{}');

  const printedList = appointments.filter((a) => a.printStatus === 'printed');
  const notPrintedList = appointments.filter((a) => a.printStatus === 'not_printed');

  return (
    <Layout staffName={staff.name}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          출력 이력
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
          출력 완료 {printedList.length}건 / 미출력 {notPrintedList.length}건
        </p>
      </div>

      {/* 출력 완료 */}
      <Card style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
          출력 완료
        </h3>
        {printedList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {printedList.map((apt) => (
              <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Badge status="success">출력됨</Badge>
                  <span style={{ fontWeight: 600 }}>{maskName(apt.patient.name)}</span>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{apt.department} | {apt.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>출력: {apt.printedAt}</span>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/print/${apt.id}`)}>
                    재출력
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>출력 이력이 없습니다.</div>
        )}
      </Card>

      {/* 미출력 */}
      <Card>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
          미출력
        </h3>
        {notPrintedList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notPrintedList.map((apt) => (
              <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Badge status="neutral">미출력</Badge>
                  <span style={{ fontWeight: 600 }}>{maskName(apt.patient.name)}</span>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{apt.department} | {apt.time}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/patient/${apt.id}`)}>
                  상세보기
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>모두 출력 완료되었습니다.</div>
        )}
      </Card>
    </Layout>
  );
};
