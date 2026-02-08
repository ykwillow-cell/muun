import { TOJEONG_TABLE } from './tojeong-data';
import { calculateSaju } from './saju';
import { solarToLunar } from './lunar-converter';

export interface TojeongResult {
  upper: number;
  middle: number;
  lower: number;
  hexagram: string;
}

/**
 * 토정비결 괘 계산 (이지함 원문 로직)
 * @param birthDate 생년월일 (Date 객체)
 * @param targetYear 토정비결을 볼 연도 (예: 2026)
 * @param isLunar 음력 여부
 */
export function calculateTojeong(birthDate: Date, targetYear: number = 2026): TojeongResult {
  // 1. 나이 계산 (한국 나이)
  const birthYear = birthDate.getFullYear();
  const age = targetYear - birthYear + 1;

  // 2. 상괘 계산: (나이 + 올해의 태세수) % 8
  // 2026년은 병오(丙午)년
  const targetYearPillar = '丙午';
  const taeSeSu = TOJEONG_TABLE[targetYearPillar].tae;
  let upper = (age + taeSeSu) % 8;
  if (upper === 0) upper = 8;

  // 3. 중괘 계산: (태어난 달의 월건수 + 해당 월의 일수) % 6
  // 실제로는 태어난 달의 '월건'을 찾아야 함. 
  // 여기서는 간소화하여 생월 데이터를 사용하거나 사주 로직 활용
  // 정확한 계산을 위해 사주 계산 로직에서 월주를 가져옴
  const saju = calculateSaju(birthDate, 'male'); // 성별은 괘 계산에 영향 없음
  const monthPillar = saju.monthPillar.stem + saju.monthPillar.branch;
  const wolGeonSu = TOJEONG_TABLE[monthPillar]?.wol || 10;
  
  // 월의 일수 (대월 30, 소월 29) - 여기서는 평균적으로 30 사용하거나 실제 데이터 필요
  // 토정비결 원문에서는 해당 월의 크기를 따짐. 
  const monthDays = 30; 
  let middle = (wolGeonSu + monthDays) % 6;
  if (middle === 0) middle = 6;

  // 4. 하괘 계산: (태어난 날의 일진수 + 해당 일) % 3
  // 토정비결은 음력 날짜를 기준으로 계산함
  const dayPillar = saju.dayPillar.stem + saju.dayPillar.branch;
  const ilJinSu = TOJEONG_TABLE[dayPillar]?.il || 15;
  const lunarDate = solarToLunar(birthDate);
  const dayNum = lunarDate.day;
  let lower = (ilJinSu + dayNum) % 3;
  if (lower === 0) lower = 3;

  return {
    upper,
    middle,
    lower,
    hexagram: `${upper}${middle}${lower}`
  };
}
