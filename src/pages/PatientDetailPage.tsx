import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { getAppointmentById } from '@/data/mockData';
import { StaffUser } from '@/types';

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const staff: StaffUser = JSON.parse(
    localStorage.getItem('currentStaff') || '{}'
  );

  const appointment = getAppointmentById(id || '');

  if (!appointment) {
    return (
      <Layout staffName={staff.name}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h2>환자 정보를 찾을 수 없습니다.</h2>
          <Button onClick={() => navigate('/dashboard')}>목록으로 돌아가기</Button>
        </div>
      </Layout>
    );
  }

  const { patient, examinations, department, doctor, time, date } = appointment;

  const totalDuration = examinations.reduce((sum, e) => sum + e.duration, 0);
  const hasFasting = examinations.some((e) => e.fasting);
  const hasContrastAgent = examinations.some(
    (e) => e.name.includes('CT') || e.description.includes('조영제')
  );
  const hasMRI = examinations.some((e) => e.name.includes('MRI'));
  const hasAllergy = examinations.some(
    (e) => e.precautions.some((p) => p.includes('알레르기'))
  );

  // 나이 계산
  const birthYear = parseInt(patient.birthDate.split('-')[0]);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  // 요일 계산
  const dayOfWeek = (() => {
    const d = new Date(date);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[d.getDay()];
  })();

  return (
    <Layout staffName={staff.name}>
      {/* 상단 네비게이션 */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← 목록으로
          </Button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            환자 상세 정보
          </h1>
        </div>
        <Button variant="primary" onClick={() => navigate(`/guide/${appointment.id}`)}>
          ✨ AI 안내문 생성
        </Button>
      </div>

      {/* ========== 환자 기본 정보 + 오늘 예약 정보 (2단) ========== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* 환자 기본 정보 */}
        <Card>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#334155', marginTop: 0, marginBottom: '12px' }}>
            환자 기본 정보
          </h3>
          {/* 이름 + 성별/나이 배지 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>
              {patient.name}
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: patient.gender === '남' ? '#dbeafe' : '#fce7f3',
                color: patient.gender === '남' ? '#1d4ed8' : '#be185d',
              }}
            >
              {patient.gender}
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: '#f1f5f9',
                color: '#475569',
              }}
            >
              {age}세
            </span>
          </div>
          {/* 세부 정보 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <DetailItem label="생년월일" value={patient.birthDate} />
            <DetailItem label="접수번호" value={appointment.id} />
            <DetailItem label="등록번호" value={patient.registrationNumber} />
            <DetailItem label="연락처" value={patient.phone} />
            <DetailItem label="보호자" value="김정희 (010-9876-5432)" />
          </div>
        </Card>

        {/* 오늘 예약 정보 */}
        <Card>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#334155', marginTop: 0, marginBottom: '12px' }}>
            오늘 예약 정보
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <DetailItem label="예약일" value={`${date} (${dayOfWeek})`} />
            <DetailItem label="예약시간" value={time} />
            <DetailItem label="진료과" value={department} />
            <DetailItem label="담당 의료진" value={doctor} />
            <DetailItem label="예상 소요시간" value={`약 ${totalDuration}분`} />
            <DetailItem label="보험 구분" value="건강보험" />
          </div>
        </Card>
      </div>

      {/* ========== 검사 전 확인사항 ========== */}
      <Card style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#334155', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#f59e0b' }}>⚠️</span> 검사 전 확인사항
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {/* 금식 여부 */}
          <CheckCard
            icon="🍽️"
            iconBg="#fef3c7"
            title="금식 여부"
            status={hasFasting ? '금식 필요' : '해당 없음'}
            statusColor={hasFasting ? '#dc2626' : '#16a34a'}
            statusBg={hasFasting ? '#fef2f2' : '#f0fdf4'}
            detail={hasFasting ? '8시간 이상 금식' : ''}
          />
          {/* 알레르기 */}
          <CheckCard
            icon="💊"
            iconBg="#ede9fe"
            title="알레르기"
            status={hasAllergy ? '있음' : '없음'}
            statusColor={hasAllergy ? '#dc2626' : '#16a34a'}
            statusBg={hasAllergy ? '#fef2f2' : '#f0fdf4'}
            detail={hasAllergy ? '조영제 알레르기 확인' : '특이사항 없음'}
          />
          {/* 조영제 사용 */}
          <CheckCard
            icon="💉"
            iconBg="#d1fae5"
            title="조영제 사용"
            status={hasContrastAgent ? '사용 예정' : '해당 없음'}
            statusColor={hasContrastAgent ? '#2563eb' : '#64748b'}
            statusBg={hasContrastAgent ? '#dbeafe' : '#f1f5f9'}
            detail={hasContrastAgent ? '조영제 사용 검사 포함' : ''}
          />
          {/* MRI 금속 여부 */}
          <CheckCard
            icon="🧲"
            iconBg="#fef3c7"
            title="MRI 금속 여부"
            status={hasMRI ? '확인 필요' : '해당 없음'}
            statusColor={hasMRI ? '#ea580c' : '#64748b'}
            statusBg={hasMRI ? '#fff7ed' : '#f1f5f9'}
            detail={hasMRI ? '금속 보형물 여부 확인' : ''}
          />
          {/* 기타 주의사항 */}
          <CheckCard
            icon="📋"
            iconBg="#ede9fe"
            title="기타 주의사항"
            status="없음"
            statusColor="#64748b"
            statusBg="#f1f5f9"
            detail="추가 주의사항 없음"
          />
        </div>
      </Card>

      {/* ========== 검사 순서 ========== */}
      <Card style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#334155', marginTop: 0, marginBottom: '16px' }}>
          검사 순서 (총 {examinations.length}건)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {examinations
            .sort((a, b) => a.order - b.order)
            .map((exam, index) => (
              <div
                key={exam.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: index < examinations.length - 1 ? '1px solid #f1f5f9' : 'none',
                }}
              >
                {/* 순서 번호 */}
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {exam.order}
                </span>
                {/* 검사명 + 설명 */}
                <div style={{ flex: 1, marginLeft: '14px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
                    {exam.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    {exam.description}
                  </div>
                </div>
                {/* 위치 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    📍 {exam.floor} {exam.location}
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    ⏱️ 약 {exam.duration}분
                  </span>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* 하단 액션 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          ← 이전 환자
        </Button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            다음 환자 →
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/guide/${appointment.id}`)}
          >
            ✨ AI 안내문 생성
          </Button>
        </div>
      </div>
    </Layout>
  );
};

/* 세부 정보 항목 */
const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{value}</div>
  </div>
);

/* 검사 전 확인사항 카드 */
interface CheckCardProps {
  icon: string;
  iconBg: string;
  title: string;
  status: string;
  statusColor: string;
  statusBg: string;
  detail: string;
}

const CheckCard: React.FC<CheckCardProps> = ({ icon, iconBg, title, status, statusColor, statusBg, detail }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        backgroundColor: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 8px',
        fontSize: '20px',
      }}
    >
      {icon}
    </div>
    <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
      {title}
    </div>
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: statusBg,
        color: statusColor,
      }}
    >
      {status}
    </span>
    {detail && (
      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
        {detail}
      </div>
    )}
  </div>
);
