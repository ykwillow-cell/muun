import { 
  EclipticGeoMoon, 
  SunPosition,
  MakeTime
} from 'astronomy-engine';

// 별자리 데이터 정의
export const ZODIAC_SIGNS = [
  { name: '양자리', en: 'Aries', start: 0, end: 30, icon: '♈' },
  { name: '황소자리', en: 'Taurus', start: 30, end: 60, icon: '♉' },
  { name: '쌍둥이자리', en: 'Gemini', start: 60, end: 90, icon: '♊' },
  { name: '게자리', en: 'Cancer', start: 90, end: 120, icon: '♋' },
  { name: '사자자리', en: 'Leo', start: 120, end: 150, icon: '♌' },
  { name: '처녀자리', en: 'Virgo', start: 150, end: 180, icon: '♍' },
  { name: '천칭자리', en: 'Libra', start: 180, end: 210, icon: '♎' },
  { name: '전갈자리', en: 'Scorpio', start: 210, end: 240, icon: '♏' },
  { name: '사수자리', en: 'Sagittarius', start: 240, end: 270, icon: '♐' },
  { name: '염소자리', en: 'Capricorn', start: 270, end: 300, icon: '♑' },
  { name: '물병자리', en: 'Aquarius', start: 300, end: 330, icon: '♒' },
  { name: '물고기자리', en: 'Pisces', start: 330, end: 360, icon: '♓' },
];

/**
 * 황도 경도를 바탕으로 별자리를 판별합니다.
 */
export function getZodiacSign(longitude: number) {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  return ZODIAC_SIGNS.find(sign => normalizedLong >= sign.start && normalizedLong < sign.end) || ZODIAC_SIGNS[0];
}

/**
 * 특정 시간에서의 주요 점성술 데이터를 계산합니다.
 * @param date 날짜 객체
 */
export function calculateAstrology(date: Date) {
  const time = MakeTime(date);

  // 태양 위치 (Sun Sign)
  const sunPos = SunPosition(time);
  const sunSign = getZodiacSign(sunPos.elon);

  // 달 위치 (Moon Sign)
  const moonPos = EclipticGeoMoon(time);
  const moonSign = getZodiacSign(moonPos.lon);

  return {
    sun: { name: '태양', longitude: sunPos.elon, sign: sunSign },
    moon: { name: '달', longitude: moonPos.lon, sign: moonSign },
  };
}
