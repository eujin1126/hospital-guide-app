import React from 'react';
import { Layout } from '@/components/layout';
import { Card } from '@/components/ui';
import { StaffUser } from '@/types';

export const SettingsPage: React.FC = () => {
  const staff: StaffUser = JSON.parse(localStorage.getItem('currentStaff') || '{}');

  return (
    <Layout staffName={staff.name}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          설정
        </h1>
      </div>

      {/* 계정 정보 */}
      <Card style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
          계정 정보
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <SettingItem label="이름" value={staff.name || '-'} />
          <SettingItem label="사번" value={staff.employeeId || '-'} />
          <SettingItem label="부서" value={staff.department || '-'} />
          <SettingItem label="직책" value={staff.role || '-'} />
        </div>
      </Card>

      {/* 안내문 설정 */}
      <Card style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
          안내문 설정
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#334155' }}>병원명</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>안내문에 표시되는 병원 이름</div>
            </div>
            <span style={{ fontSize: '14px', color: '#1e293b' }}>세종대학교병원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#334155' }}>문의 전화번호</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>안내문 하단에 표시되는 번호</div>
            </div>
            <span style={{ fontSize: '14px', color: '#1e293b' }}>02-1234-5678</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#334155' }}>QR 코드 연동</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>환자앱 연결 QR 코드 포함 여부</div>
            </div>
            <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: 600 }}>활성화</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#334155' }}>기본 인쇄 크기</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>안내문 인쇄 시 기본 글씨 크기</div>
            </div>
            <span style={{ fontSize: '14px', color: '#1e293b' }}>12px (기본)</span>
          </div>
        </div>
      </Card>

      {/* 시스템 정보 */}
      <Card>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
          시스템 정보
        </h3>
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          <p style={{ margin: '4px 0' }}>버전: 1.0.0 (프로토타입)</p>
          <p style={{ margin: '4px 0' }}>환경: 개발 모드 (Mock 데이터 사용)</p>
          <p style={{ margin: '4px 0' }}>최종 업데이트: 2026-08-04</p>
        </div>
      </Card>
    </Layout>
  );
};

const SettingItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{value}</div>
  </div>
);
