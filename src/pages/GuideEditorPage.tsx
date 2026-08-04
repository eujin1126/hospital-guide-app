import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { getAppointmentById } from '@/data/mockData';
import { generateGuide } from '@/utils/guideGenerator';
import { StaffUser } from '@/types';

export const GuideEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const staff: StaffUser = JSON.parse(
    localStorage.getItem('currentStaff') || '{}'
  );

  const appointment = getAppointmentById(id || '');
  const [guideText, setGuideText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (appointment?.generatedGuide) {
      setGuideText(appointment.generatedGuide);
    }
  }, [appointment]);

  if (!appointment) {
    return (
      <Layout staffName={staff.name}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h2>환자 정보를 찾을 수 없습니다.</h2>
          <Button onClick={() => navigate('/appointments')}>목록으로 돌아가기</Button>
        </div>
      </Layout>
    );
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    // 가상 AI 생성 딜레이
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const guide = generateGuide(appointment);
    setGuideText(guide);
    setIsGenerating(false);
    setIsSaved(false);
  };

  const handleSave = () => {
    // 실제로는 서버에 저장하지만, 여기서는 상태만 업데이트
    appointment.generatedGuide = guideText;
    appointment.guideStatus = 'generated';
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleConfirmAndPrint = () => {
    appointment.generatedGuide = guideText;
    appointment.guideStatus = 'confirmed';
    navigate(`/print/${appointment.id}`);
  };

  const { patient, examinations, department, doctor, time, date } = appointment;

  return (
    <Layout staffName={staff.name}>
      {/* 상단 */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant="ghost" onClick={() => navigate(`/patient/${appointment.id}`)}>
            ← 돌아가기
          </Button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            AI 안내문 편집
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge status={appointment.guideStatus === 'confirmed' ? 'success' : appointment.guideStatus === 'generated' ? 'warning' : 'neutral'}>
            {appointment.guideStatus === 'confirmed' ? '확정됨' : appointment.guideStatus === 'generated' ? '생성됨' : '미생성'}
          </Badge>
        </div>
      </div>

      {/* 2단 레이아웃 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '600px' }}>
        {/* 왼쪽: 원본 예약 정보 */}
        <Card style={{ overflow: 'auto', maxHeight: '700px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
            📄 원본 예약/검사 정보
          </h2>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <p style={{ margin: '4px 0' }}><strong>환자:</strong> {patient.name} ({patient.gender}, {patient.birthDate})</p>
              <p style={{ margin: '4px 0' }}><strong>예약:</strong> {date} {time}</p>
              <p style={{ margin: '4px 0' }}><strong>진료과:</strong> {department}</p>
              <p style={{ margin: '4px 0' }}><strong>담당의:</strong> {doctor}</p>
            </div>

            {examinations
              .sort((a, b) => a.order - b.order)
              .map((exam) => (
                <div
                  key={exam.id}
                  style={{
                    marginBottom: '12px',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                    {exam.order}. {exam.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    <p style={{ margin: '2px 0' }}>📍 {exam.floor} {exam.location}</p>
                    <p style={{ margin: '2px 0' }}>⏱️ {exam.duration}분</p>
                    <p style={{ margin: '2px 0' }}>{exam.description}</p>
                    {exam.fasting && (
                      <p style={{ margin: '2px 0', color: '#ea580c', fontWeight: 600 }}>
                        ⚠️ 금식 필요
                      </p>
                    )}
                    {exam.preparations.length > 0 && (
                      <p style={{ margin: '2px 0' }}>
                        준비: {exam.preparations.join(', ')}
                      </p>
                    )}
                    {(() => {
                      let filteredPrecautions = exam.precautions;
                      if (exam.name === '소변검사' && patient.gender === '남') {
                        filteredPrecautions = exam.precautions.filter((p) => !p.includes('생리'));
                      }
                      return filteredPrecautions.length > 0 ? (
                        <p style={{ margin: '2px 0', color: '#dc2626' }}>
                          주의: {filteredPrecautions.join(', ')}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* 오른쪽: AI 생성 안내문 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                ✨ AI 생성 안내문
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? '⏳ 생성 중...' : '🔄 다시 생성'}
              </Button>
            </div>

            {guideText ? (
              <textarea
                value={guideText}
                onChange={(e) => {
                  setGuideText(e.target.value);
                  setIsSaved(false);
                }}
                style={{
                  flex: 1,
                  width: '100%',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  lineHeight: '1.8',
                  resize: 'none',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                  minHeight: '400px',
                }}
              />
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '2px dashed #e2e8f0',
                  minHeight: '400px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 16px' }}>
                    아래 버튼을 눌러 AI 안내문을 생성하세요
                  </p>
                  <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? '⏳ 생성 중...' : 'AI 안내문 생성'}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* 하단 버튼 */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {isSaved && (
              <span style={{ fontSize: '13px', color: '#16a34a', alignSelf: 'center', marginRight: '8px' }}>
                ✅ 저장되었습니다
              </span>
            )}
            <Button variant="secondary" onClick={handleSave} disabled={!guideText}>
              💾 임시 저장
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/print/${appointment.id}`)}
              disabled={!guideText}
            >
              👁️ 미리보기
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmAndPrint}
              disabled={!guideText}
            >
              ✅ 출력 확정
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
