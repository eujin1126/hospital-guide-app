/**
 * 2026년 전체 일별 예약 건수 데이터 (가상)
 * key: 'YYYY-MM-DD', value: 예약 건수
 */

function generateYearlyData(): Record<string, number> {
  const data: Record<string, number> = {};
  const year = 2026;

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();

      // 주말은 예약 없거나 적음
      if (dayOfWeek === 0) {
        // 일요일: 예약 없음
        continue;
      }

      if (dayOfWeek === 6) {
        // 토요일: 0~3건
        const count = Math.floor(Math.random() * 4);
        if (count > 0) {
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          data[key] = count;
        }
        continue;
      }

      // 평일: 4~15건 (랜덤)
      const base = Math.floor(Math.random() * 12) + 4;
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      data[key] = base;
    }
  }

  // 오늘 날짜는 실제 mock 데이터와 맞추기 (8명)
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  data[todayKey] = 8;

  return data;
}

// 시드 기반으로 일관된 데이터 생성 (seeded random)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateConsistentYearlyData(): Record<string, number> {
  const data: Record<string, number> = {};
  const year = 2026;
  const random = seededRandom(2026);

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0) {
        random(); // consume to keep sequence consistent
        continue;
      }

      const r = random();

      if (dayOfWeek === 6) {
        const count = Math.floor(r * 4);
        if (count > 0) {
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          data[key] = count;
        }
        continue;
      }

      // 평일: 4~15건
      const count = Math.floor(r * 12) + 4;
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      data[key] = count;
    }
  }

  // 오늘 날짜는 실제 mock 데이터와 맞추기 (8명)
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  data[todayKey] = 8;

  return data;
}

export const yearlyAppointments = generateConsistentYearlyData();

// 2026년 대한민국 공휴일 목록
export const holidays2026: Record<string, string> = {
  '2026-01-01': '새해 첫날',
  '2026-01-28': '설날 전날',
  '2026-01-29': '설날',
  '2026-01-30': '설날 다음날',
  '2026-03-01': '삼일절',
  '2026-05-05': '어린이날',
  '2026-05-24': '부처님오신날',
  '2026-06-06': '현충일',
  '2026-07-17': '제헌절',
  '2026-08-15': '광복절',
  '2026-09-24': '추석 전날',
  '2026-09-25': '추석',
  '2026-09-26': '추석 다음날',
  '2026-10-03': '개천절',
  '2026-10-09': '한글날',
  '2026-12-25': '성탄절',
};

// 공휴일 예약 건수 제거
Object.keys(holidays2026).forEach((date) => {
  delete yearlyAppointments[date];
});

/**
 * 특정 날짜의 가상 예약 목록 생성
 */
export interface CalendarAppointment {
  id: string;
  patientName: string;
  time: string;
  department: string;
  examCount: number;
}

const departments = ['내과', '외과', '소화기내과', '정형외과', '호흡기내과', '내분비내과', '산부인과', '피부과'];
const names = ['김민수', '이서연', '박지훈', '정은지', '최영호', '한수진', '윤재석', '송미래', '강태현', '조하늘', '임도윤', '배소율', '신동현', '오지민', '류현우'];
const times = ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

export function getAppointmentsForDate(dateStr: string): CalendarAppointment[] {
  const count = yearlyAppointments[dateStr] || 0;
  if (count === 0) return [];

  const seed = dateStr.split('-').reduce((acc, v) => acc + parseInt(v), 0);
  const random = seededRandom(seed * 31);

  const result: CalendarAppointment[] = [];
  for (let i = 0; i < count; i++) {
    const nameIndex = Math.floor(random() * names.length);
    const deptIndex = Math.floor(random() * departments.length);
    const timeIndex = Math.min(Math.floor(random() * times.length), times.length - 1);
    const examCount = Math.floor(random() * 4) + 1;

    result.push({
      id: `${dateStr}-${i + 1}`,
      patientName: names[nameIndex],
      time: times[timeIndex],
      department: departments[deptIndex],
      examCount,
    });
  }

  // 시간순 정렬
  result.sort((a, b) => a.time.localeCompare(b.time));
  return result;
}
