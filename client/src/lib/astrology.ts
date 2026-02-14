import { 
  EclipticGeoMoon, 
  SunPosition,
  MakeTime,
  Body,
  GeoVector,
  Ecliptic,
  Observer,
  RotationMatrix,
  Horizon
} from 'astronomy-engine';

// 별자리 데이터 정의
export const ZODIAC_SIGNS = [
  { name: '양자리', en: 'Aries', start: 0, end: 30, icon: '♈', element: 'Fire', quality: 'Cardinal' },
  { name: '황소자리', en: 'Taurus', start: 30, end: 60, icon: '♉', element: 'Earth', quality: 'Fixed' },
  { name: '쌍둥이자리', en: 'Gemini', start: 60, end: 90, icon: '♊', element: 'Air', quality: 'Mutable' },
  { name: '게자리', en: 'Cancer', start: 90, end: 120, icon: '♋', element: 'Water', quality: 'Cardinal' },
  { name: '사자자리', en: 'Leo', start: 120, end: 150, icon: '♌', element: 'Fire', quality: 'Fixed' },
  { name: '처녀자리', en: 'Virgo', start: 150, end: 180, icon: '♍', element: 'Earth', quality: 'Mutable' },
  { name: '천칭자리', en: 'Libra', start: 180, end: 210, icon: '♎', element: 'Air', quality: 'Cardinal' },
  { name: '전갈자리', en: 'Scorpio', start: 210, end: 240, icon: '♏', element: 'Water', quality: 'Fixed' },
  { name: '사수자리', en: 'Sagittarius', start: 240, end: 270, icon: '♐', element: 'Fire', quality: 'Mutable' },
  { name: '염소자리', en: 'Capricorn', start: 270, end: 300, icon: '♑', element: 'Earth', quality: 'Cardinal' },
  { name: '물병자리', en: 'Aquarius', start: 300, end: 330, icon: '♒', element: 'Air', quality: 'Fixed' },
  { name: '물고기자리', en: 'Pisces', start: 330, end: 360, icon: '♓', element: 'Water', quality: 'Mutable' },
];

export const PLANETS = [
  { id: Body.Sun, name: '태양', en: 'Sun', icon: '☀️' },
  { id: Body.Moon, name: '달', en: 'Moon', icon: '🌙' },
  { id: Body.Mercury, name: '수성', en: 'Mercury', icon: '☿' },
  { id: Body.Venus, name: '금성', en: 'Venus', icon: '♀' },
  { id: Body.Mars, name: '화성', en: 'Mars', icon: '♂' },
  { id: Body.Jupiter, name: '목성', en: 'Jupiter', icon: '♃' },
  { id: Body.Saturn, name: '토성', en: 'Saturn', icon: '♄' },
];

/**
 * 황도 경도를 바탕으로 별자리를 판별합니다.
 */
export function getZodiacSign(longitude: number) {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  return ZODIAC_SIGNS.find(sign => normalizedLong >= sign.start && normalizedLong < sign.end) || ZODIAC_SIGNS[0];
}

/**
 * 특정 시간과 위치에서의 점성술 데이터를 계산합니다.
 */
export function calculateAstrology(date: Date, lat: number = 37.5665, lng: number = 126.9780) {
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);

  // 행성 위치 계산
  const planetsData = PLANETS.map(p => {
    let lon = 0;
    if (p.id === Body.Sun) {
      lon = SunPosition(time).elon;
    } else if (p.id === Body.Moon) {
      lon = EclipticGeoMoon(time).lon;
    } else {
      const gv = GeoVector(p.id, time, true);
      const ecl = Ecliptic(gv);
      lon = ecl.elon;
    }
    return {
      ...p,
      longitude: lon,
      sign: getZodiacSign(lon)
    };
  });

  // 상승궁(Ascendant) 계산 - 단순화된 방식
  // 실제로는 항성시와 위도를 고려한 복잡한 계산이 필요합니다.
  // astronomy-engine의 기본 기능으로는 정밀한 Ascendant 계산이 어려우므로,
  // 향후 추가 라이브러리(예: Kerykeion)와 통합하여 개선할 예정입니다.
  
  return {
    planets: planetsData,
    sun: planetsData.find(p => p.en === 'Sun'),
    moon: planetsData.find(p => p.en === 'Moon'),
    observer: { lat, lng },
    timestamp: date.getTime()
  };
}
