import { calculateAstrology } from './client/src/lib/astrology';

// 테스트: 2026년 2월 3일 정오 서울 기준
const testDate = new Date('2026-02-03T12:00:00Z');
const result = calculateAstrology(testDate);

console.log('--- Astrology Test Result ---');
console.log(`Date: ${testDate.toISOString()}`);
console.log(`Sun Sign: ${result.sun.sign.name} (${result.sun.sign.en}) - Longitude: ${result.sun.longitude.toFixed(2)}°`);
console.log(`Moon Sign: ${result.moon.sign.name} (${result.moon.sign.en}) - Longitude: ${result.moon.longitude.toFixed(2)}°`);
console.log('-----------------------------');
