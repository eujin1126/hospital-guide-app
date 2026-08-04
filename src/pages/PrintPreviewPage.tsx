import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui';
import { getAppointmentById } from '@/data/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { StaffUser, Examination } from '@/types';

export const PrintPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(100);

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

  const qrValue = `https://hospital-app.example.com/patient-schedule/${patient.id}/${appointment.id}`;

  const totalDuration = examinations.reduce((sum, e) => sum + e.duration, 0);
  const hasFasting = examinations.some((e) => e.fasting);

  // 요일 계산
  const dayOfWeek = (() => {
    const d = new Date(date);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[d.getDay()];
  })();

  // 소변검사 성별 필터링된 주의사항
  const getFilteredPrecautions = (exam: Examination): string[] => {
    if (exam.name === '소변검사' && patient.gender === '남') {
      return exam.precautions.filter((p) => !p.includes('생리'));
    }
    return exam.precautions;
  };

  // 층별 간단한 안내도 생성
  const getFloorGuide = (exam: Examination, index: number) => {
    const prevLocation = index === 0 ? '원무과(접수)' : `${examinations[index - 1].location}`;
    return `${index === 0 ? '원무과' : `${examinations[index - 1].floor} 검사`} 완료 후 엘리베이터를 이용해 ${exam.floor}으로 이동 후, ${exam.location}로 오세요.`;
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const scaleFactor = scale / 100;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>검사 안내문 - ${patient.name}</title>
        <style>
          @page { margin: 15mm; size: A4; }
          body {
            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
            font-size: ${12 * scaleFactor}px;
            line-height: 1.5;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            transform-origin: top left;
          }
          * { box-sizing: border-box; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handleSavePDF = () => {
    handlePrint();
  };

  const sortedExams = [...examinations].sort((a, b) => a.order - b.order);

  return (
    <Layout staffName={staff.name}>
      {/* 상단 컨트롤 */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant="ghost" onClick={() => navigate(`/guide/${appointment.id}`)}>
            ← 편집으로
          </Button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            인쇄 미리보기
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* 글씨 크기 조절 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '4px 8px' }}>
            <button
              onClick={() => setScale((s) => Math.max(70, s - 10))}
              style={{
                border: 'none',
                background: scale <= 70 ? '#e2e8f0' : '#fff',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                color: scale <= 70 ? '#94a3b8' : '#334155',
                cursor: scale <= 70 ? 'not-allowed' : 'pointer',
              }}
            >
              가-
            </button>
            <button
              onClick={() => setScale(100)}
              style={{
                border: 'none',
                background: scale === 100 ? '#2563eb' : '#fff',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '15px',
                fontWeight: 700,
                color: scale === 100 ? '#fff' : '#334155',
                cursor: 'pointer',
              }}
            >
              가
            </button>
            <button
              onClick={() => setScale((s) => Math.min(140, s + 10))}
              style={{
                border: 'none',
                background: scale >= 140 ? '#e2e8f0' : '#fff',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '17px',
                fontWeight: 600,
                color: scale >= 140 ? '#94a3b8' : '#334155',
                cursor: scale >= 140 ? 'not-allowed' : 'pointer',
              }}
            >
              가+
            </button>
          </div>
          <Button variant="secondary" onClick={handleSavePDF}>
            📁 PDF 저장
          </Button>
          <Button variant="primary" size="lg" onClick={handlePrint}>
            🖨️ 인쇄
          </Button>
        </div>
      </div>

      {/* 인쇄 미리보기 영역 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#e2e8f0',
          borderRadius: '12px',
          overflow: 'auto',
        }}
      >
        <div
          ref={printRef}
          style={{
            width: '210mm',
            minHeight: '297mm',
            backgroundColor: '#fff',
            padding: '24px 28px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            fontFamily: "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif",
            fontSize: `${12 * (scale / 100)}px`,
            lineHeight: '1.5',
            color: '#1a1a1a',
            transform: `scale(${scale / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {/* === 헤더 === */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px', color: '#2563eb' }}>✚</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>세종대학교병원</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#475569', marginTop: '4px' }}>
              검사 안내문
            </div>
          </div>

          {/* === 환자 정보 바 === */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 20px',
              marginBottom: '16px',
              fontSize: '13px',
            }}
          >
            <span><strong>환자명:</strong> {patient.name}</span>
            <span><strong>방문일:</strong> {date} ({dayOfWeek})</span>
            <span><strong>예약시간:</strong> {time}</span>
            <span><strong>진료과:</strong> {department}</span>
          </div>

          {/* === 금식 안내 === */}
          {hasFasting && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: '8px',
                padding: '10px 16px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#92400e',
              }}
            >
              <span style={{ fontSize: '16px' }}>⚠️</span>
              금식 안내: 검사 전 금식이 필요합니다. 해당 검사 안내를 확인해 주세요.
            </div>
          )}

          {/* === 검사 순서 제목 === */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px' }}>📋</span>
            <span style={{ fontSize: '15px', fontWeight: 700 }}>
              검사 순서 (총 {examinations.length}건 / 예상 {totalDuration}분)
            </span>
          </div>

          {/* === 검사 항목들 === */}
          {sortedExams.map((exam, index) => {
            const precautions = getFilteredPrecautions(exam);
            return (
              <div
                key={exam.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  marginBottom: '16px',
                }}
              >
                {/* 검사 헤더 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700 }}>
                    {exam.order}. {exam.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                    <span style={{ color: '#dc2626' }}>📍</span>
                    <span>{exam.floor} {exam.location}</span>
                    <span>|</span>
                    <span>⏱️</span>
                  </div>
                </div>

                {/* 검사 설명 */}
                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '12px' }}>
                  {exam.description}
                </div>

                {/* 좌: 준비/주의사항 + 우: 안내도 */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  {/* 왼쪽: 준비/주의사항 */}
                  <div style={{ flex: '0 0 200px', fontSize: '11px' }}>
                    {exam.fasting && (
                      <div style={{ color: '#d97706', fontWeight: 700, marginBottom: '4px' }}>
                        ⚠️ 금식 필요
                      </div>
                    )}
                    {exam.preparations.length > 0 && (
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>✅ 준비:</span>{' '}
                        {exam.preparations.join(' / ')}
                      </div>
                    )}
                    {precautions.length > 0 && (
                      <div style={{ color: '#dc2626' }}>
                        <span style={{ fontWeight: 600 }}>⚠️ 주의:</span>{' '}
                        {precautions.join(' / ')}
                      </div>
                    )}
                  </div>

                  {/* 오른쪽: 층 안내도 */}
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: '#f0f9ff',
                      borderRadius: '8px',
                      padding: '12px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', marginBottom: '8px' }}>
                      {exam.floor} 안내도
                    </div>
                    {/* 간략 안내도 - 시작점 → 엘리베이터 → 도착점 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                      <div
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#1e40af',
                          textAlign: 'center',
                          minWidth: '60px',
                        }}
                      >
                        {index === 0 ? '원무과\n(접수)' : sortedExams[index - 1].location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
                        <span style={{ fontSize: '14px' }}>🚶</span>
                        <div style={{ borderTop: '2px dashed #93c5fd', flex: 1, maxWidth: '40px' }}></div>
                        <span style={{ fontSize: '12px' }}>🛗</span>
                        <div style={{ borderTop: '2px dashed #93c5fd', flex: 1, maxWidth: '40px' }}></div>
                        <span style={{ fontSize: '10px' }}>→</span>
                      </div>
                      <div
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#2563eb',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#fff',
                          textAlign: 'center',
                          minWidth: '60px',
                        }}
                      >
                        {exam.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 이동 안내 */}
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
                  <span style={{ color: '#2563eb' }}>🚶 이동 안내:</span>{' '}
                  {getFloorGuide(exam, index)}
                </div>
              </div>
            );
          })}

          {/* === 푸터 === */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '14px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              <span style={{ color: '#dc2626' }}>📍</span> 문의: 원무과 (내선 1번) / 02-1234-5678 &nbsp;|&nbsp; 담당의: {doctor}
            </div>
            <div style={{ textAlign: 'center' }}>
              <QRCodeSVG value={qrValue} size={64} />
              <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>
                환자앱에서 스캔하세요
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
