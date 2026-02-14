/**
 * 음력 → 양력 변환 유틸리티
 * korean-lunar-calendar 라이브러리를 사용하여 음력 날짜를 양력으로 변환합니다.
 * 윤달도 지원합니다.
 */
import KoreanLunarCalendar from 'korean-lunar-calendar';

/**
 * 음력 날짜를 양력 날짜로 변환합니다.
 * @param year 음력 연도
 * @param month 음력 월
 * @param day 음력 일
 * @param isLeapMonth 윤달 여부 (기본값: false)
 * @returns 양력 날짜 문자열 (YYYY-MM-DD 형식) 또는 null (변환 실패 시)
 */
export function lunarToSolar(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): { year: number; month: number; day: number } | null {
  try {
    const calendar = new KoreanLunarCalendar();
    const isValid = calendar.setLunarDate(year, month, day, isLeapMonth);
    if (!isValid) return null;

    const solar = calendar.getSolarCalendar();
    return {
      year: solar.year,
      month: solar.month,
      day: solar.day,
    };
  } catch {
    return null;
  }
}

/**
 * 날짜 문자열(YYYY-MM-DD)과 calendarType을 받아서,
 * 음력인 경우 양력으로 변환된 Date 객체를 반환합니다.
 * 양력인 경우 그대로 Date 객체를 반환합니다.
 * 
 * @param dateStr 날짜 문자열 (YYYY-MM-DD)
 * @param timeStr 시간 문자열 (HH:MM)
 * @param calendarType "solar" | "lunar"
 * @param isLeapMonth 윤달 여부 (음력일 때만 사용)
 * @returns Date 객체
 */
export function convertToSolarDate(
  dateStr: string,
  timeStr: string,
  calendarType: "solar" | "lunar",
  isLeapMonth: boolean = false
): Date {
  if (calendarType === "solar") {
    return new Date(`${dateStr}T${timeStr}`);
  }

  // 음력 → 양력 변환
  const [year, month, day] = dateStr.split("-").map(Number);
  const solar = lunarToSolar(year, month, day, isLeapMonth);

  if (solar) {
    const solarDateStr = `${solar.year}-${String(solar.month).padStart(2, '0')}-${String(solar.day).padStart(2, '0')}`;
    return new Date(`${solarDateStr}T${timeStr}`);
  }

  // 변환 실패 시 원래 날짜를 그대로 사용 (fallback)
  console.warn(`음력→양력 변환 실패: ${dateStr}, 양력으로 간주합니다.`);
  return new Date(`${dateStr}T${timeStr}`);
}

/**
 * 특정 연도/월이 윤달인지 확인합니다.
 * @param year 음력 연도
 * @param month 음력 월
 * @returns 해당 월이 윤달이 있는지 여부
 */
export function hasLeapMonth(year: number, month: number): boolean {
  try {
    const calendar = new KoreanLunarCalendar();
    // 윤달로 설정해보고 유효한지 확인
    return calendar.setLunarDate(year, month, 1, true);
  } catch {
    return false;
  }
}

/**
 * 양력 날짜를 음력 날짜로 변환합니다.
 * @param date Date 객체
 * @returns 음력 날짜 정보
 */
export function solarToLunar(date: Date): { year: number; month: number; day: number; isLeap: boolean } {
  const calendar = new KoreanLunarCalendar();
  calendar.setSolarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = calendar.getLunarCalendar();
  return {
    year: lunar.year,
    month: lunar.month,
    day: lunar.day,
    isLeap: lunar.isLeap
  };
}
