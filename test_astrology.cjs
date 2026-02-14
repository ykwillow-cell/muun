const Astronomy = require('astronomy-engine');

const ZODIAC_SIGNS = [
  { name: '양자리', en: 'Aries', start: 0, end: 30 },
  { name: '황소자리', en: 'Taurus', start: 30, end: 60 },
  { name: '쌍둥이자리', en: 'Gemini', start: 60, end: 90 },
  { name: '게자리', en: 'Cancer', start: 90, end: 120 },
  { name: '사자자리', en: 'Leo', start: 120, end: 150 },
  { name: '처녀자리', en: 'Virgo', start: 150, end: 180 },
  { name: '천칭자리', en: 'Libra', start: 180, end: 210 },
  { name: '전갈자리', en: 'Scorpio', start: 210, end: 240 },
  { name: '사수자리', en: 'Sagittarius', start: 240, end: 270 },
  { name: '염소자리', en: 'Capricorn', start: 270, end: 300 },
  { name: '물병자리', en: 'Aquarius', start: 300, end: 330 },
  { name: '물고기자리', en: 'Pisces', start: 330, end: 360 },
];

function getZodiacSign(longitude) {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  return ZODIAC_SIGNS.find(sign => normalizedLong >= sign.start && normalizedLong < sign.end) || ZODIAC_SIGNS[0];
}

const testDate = new Date('2026-02-03T12:00:00Z');
const time = Astronomy.MakeTime(testDate);

// 태양 위치
const sunPos = Astronomy.SunPosition(time);
const sunSign = getZodiacSign(sunPos.elon); // elon: Ecliptic longitude

// 달 위치
const moonPos = Astronomy.EclipticGeoMoon(time);
const moonSign = getZodiacSign(moonPos.lon);

console.log('--- Astrology Test Result (Final) ---');
console.log(`Date: ${testDate.toISOString()}`);
console.log(`Sun Sign: ${sunSign.name} (${sunSign.en}) - Longitude: ${sunPos.elon.toFixed(2)}°`);
console.log(`Moon Sign: ${moonSign.name} (${moonSign.en}) - Longitude: ${moonPos.lon.toFixed(2)}°`);
console.log('-------------------------------------');
