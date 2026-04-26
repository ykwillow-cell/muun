/**
 * muun_user_birth (히어로 입력) → 운세 폼 필드 변환 유틸
 *
 * 히어로 섹션에서 저장하는 구조:
 *   { birth: "19930521" | "930521", calType: "solar"|"lunar", siju: "12:30"|"unknown", savedAt: ISO string }
 *
 * 운세 폼에서 사용하는 구조:
 *   { birthDate: "1993-05-21", calendarType: "solar"|"lunar", birthTime: "12:30", birthTimeUnknown: boolean }
 */

export interface HeroBirthData {
  birthDate: string;          // YYYY-MM-DD
  calendarType: "solar" | "lunar";
  birthTime: string;          // HH:MM
  birthTimeUnknown: boolean;
}

/**
 * localStorage의 muun_user_birth를 읽어 운세 폼 필드 형식으로 변환합니다.
 * muun_user_birth가 없거나 파싱 실패 시 null을 반환합니다.
 */
export function getHeroBirthForForm(): HeroBirthData | null {
  try {
    const raw = localStorage.getItem("muun_user_birth");
    if (!raw) return null;

    const data = JSON.parse(raw);
    const digits = (data.birth ?? "").replace(/\D/g, "");

    let birthDate: string | null = null;

    if (digits.length === 8) {
      // YYYYMMDD → YYYY-MM-DD
      birthDate = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    } else if (digits.length === 6) {
      // YYMMDD → YYYY-MM-DD (00~30 → 2000년대, 31~ → 1900년대)
      const yy = parseInt(digits.slice(0, 2), 10);
      const fullYear = yy <= 30 ? 2000 + yy : 1900 + yy;
      birthDate = `${fullYear}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
    }

    if (!birthDate) return null;

    const calendarType: "solar" | "lunar" =
      data.calType === "lunar" ? "lunar" : "solar";

    const siju = data.siju ?? "unknown";
    const birthTimeUnknown = siju === "unknown";
    const birthTime = birthTimeUnknown ? "12:30" : siju;

    return { birthDate, calendarType, birthTime, birthTimeUnknown };
  } catch {
    return null;
  }
}

/**
 * muun_user_birth가 최근(5분 이내)에 저장된 경우 true를 반환합니다.
 * 메인화면에서 새로 입력한 생년월일을 muun_user_data보다 우선 적용할 때 사용합니다.
 */
export function isHeroBirthFresh(thresholdMs = 5 * 60 * 1000): boolean {
  try {
    const raw = localStorage.getItem("muun_user_birth");
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data.savedAt) return false;
    const savedAt = new Date(data.savedAt).getTime();
    return Date.now() - savedAt < thresholdMs;
  } catch {
    return false;
  }
}
