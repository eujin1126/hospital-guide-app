import { Appointment, Examination } from '@/types';

/**
 * 가상 AI 안내문 생성 함수
 * 실제 AI API 대신 검사 정보를 환자가 이해하기 쉬운 문장으로 변환합니다.
 */
export function generateGuide(appointment: Appointment): string {
  const { patient, examinations, date, time, department, doctor } = appointment;

  let guide = '';

  guide += `안녕하세요, ${patient.name}님.\n`;
  guide += `${date} ${time}에 ${department} ${doctor}님 진료와 함께 아래 검사가 예정되어 있습니다.\n\n`;

  // 금식 필요 여부 종합 안내
  const fastingExams = examinations.filter((e) => e.fasting);
  if (fastingExams.length > 0) {
    guide += `⚠️ 중요: 금식이 필요합니다\n`;
    guide += `아래 검사를 위해 검사 전 금식이 필요합니다. 검사 전날 밤부터 음식을 드시지 마세요.\n`;
    guide += `(해당 검사: ${fastingExams.map((e) => e.name).join(', ')})\n\n`;
  }

  guide += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  guide += `📋 검사 순서 안내\n`;
  guide += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  examinations
    .sort((a, b) => a.order - b.order)
    .forEach((exam, index) => {
      guide += `${index + 1}번째 검사: ${exam.name}\n`;
      guide += `📍 장소: ${exam.floor} ${exam.location}\n`;
      guide += `⏱️ 소요시간: 약 ${exam.duration}분\n`;
      guide += `\n`;
      guide += `${simplifyDescription(exam)}\n`;

      if (exam.preparations.length > 0) {
        guide += `\n준비사항:\n`;
        exam.preparations.forEach((prep) => {
          guide += `  ✅ ${prep}\n`;
        });
      }

      if (exam.precautions.length > 0) {
        guide += `\n주의사항:\n`;
        exam.precautions.forEach((precaution) => {
          guide += `  ⚠️ ${precaution}\n`;
        });
      }

      guide += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    });

  const totalDuration = examinations.reduce((sum, e) => sum + e.duration, 0);
  guide += `📌 전체 예상 소요시간: 약 ${totalDuration}분\n\n`;
  guide += `문의사항이 있으시면 원무과(내선 1번)로 연락해 주세요.\n`;
  guide += `건강한 하루 되세요! 🏥\n`;

  return guide;
}

function simplifyDescription(exam: Examination): string {
  const simplified: Record<string, string> = {
    '혈액검사 (CBC)': '팔에서 소량의 혈액을 채취하여 혈액 상태를 확인하는 검사입니다. 바늘로 잠깐 따끔할 수 있습니다.',
    '흉부 X-ray': '가슴 부위를 촬영하여 폐와 심장 상태를 확인합니다. 촬영은 몇 초 만에 끝나며 통증은 없습니다.',
    '심전도 (ECG)': '가슴에 작은 패드를 붙여 심장 박동을 기록합니다. 통증 없이 편하게 누워 계시면 됩니다.',
    '복부 초음파': '배 위에 젤을 바르고 초음파 기기로 내부 장기를 확인합니다. 통증 없는 검사입니다.',
    '위내시경': '가느다란 카메라를 입으로 넣어 위 내부를 직접 관찰합니다. 수면내시경을 선택하시면 잠든 사이에 검사가 진행됩니다.',
    'CT (복부)': '원통형 기계 안에 누워 배 내부를 정밀 촬영합니다. 조영제를 주사할 때 몸이 따뜻한 느낌이 들 수 있습니다.',
    '혈액검사 (간기능)': '팔에서 소량의 혈액을 채취하여 간 건강 상태를 확인합니다.',
    '소변검사': '소변을 컵에 받아 제출하는 간단한 검사입니다.',
    'MRI (무릎)': '원통형 기계 안에 누워 무릎 내부를 정밀하게 촬영합니다. 검사 중 큰 소리가 나지만 통증은 없습니다. 약 40분간 움직이지 않고 누워 계셔야 합니다.',
    '대장내시경': '항문으로 가느다란 카메라를 넣어 대장 내부를 관찰합니다. 수면 상태에서 진행되며, 검사 전 장을 깨끗이 비우는 준비가 필요합니다.',
    '혈액검사 (종합)': '팔에서 혈액을 채취하여 전반적인 건강 상태를 종합적으로 확인합니다.',
    '갑상선 초음파': '목에 젤을 바르고 초음파 기기로 갑상선 상태를 확인합니다. 통증 없는 간단한 검사입니다.',
    '혈액검사 (갑상선기능)': '팔에서 소량의 혈액을 채취하여 갑상선 호르몬 수치를 확인합니다.',
    '폐기능검사': '마우스피스를 물고 힘껏 숨을 불어 폐 기능을 측정합니다. 여러 번 반복할 수 있으며 약간 어지러울 수 있습니다.',
    '흉부 CT': '원통형 기계 안에 누워 가슴 부위를 정밀 촬영합니다. 짧은 시간 숨을 참는 동작이 필요합니다.',
    '골밀도 검사 (DEXA)': '특수 장비 위에 누워 뼈의 단단한 정도를 측정합니다. 통증 없이 몇 분이면 끝나는 검사입니다.',
    '유방 초음파': '가슴에 젤을 바르고 초음파 기기로 유방 조직을 확인합니다. 통증 없는 검사입니다.',
    '혈액검사 (여성호르몬)': '팔에서 소량의 혈액을 채취하여 호르몬 수치를 확인합니다.',
  };

  return simplified[exam.name] || exam.description;
}
