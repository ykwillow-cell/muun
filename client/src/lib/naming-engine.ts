/**
 * 무운 작명소 - 핵심 작명 알고리즘 모듈 (Client-Side)
 *
 * 아키텍처 결정:
 * - CPU 부하가 큰 81수리 역순 탐색 알고리즘을 사용자 브라우저에서 실행
 * - Vercel Serverless Function 60초 제한 및 서버 비용 완전 제거
 *
 * 구현 범위 (Phase 1):
 * - 81수리 길흉 판별 테이블 (1~81)
 * - 원격(元格)·형격(亨格)·이격(利格)·정격(貞格) 4격 계산
 * - 81 초과 수리 처리 (81로 나눈 나머지, 단 나머지 0 → 81)
 * - 사주 오행 분석 → 부족 오행 도출
 * - 길수 획수 조합 역순 탐색
 * - Supabase에서 해당 획수 + 오행 한자 조회
 *
 * 길흉 판정 원칙 (인수인계서 지침):
 * "좋은 이름을 많이 주는 것보다 나쁜 이름을 안 주는 것이 원칙"
 * → 유파별로 길흉 판정이 갈리는 애매한 수리(51, 72, 76, 77수 등)는
 *   보수적으로 무조건 흉수(凶數)로 처리
 */

import { SajuResult, calculateElementBalance } from './saju';
import { getHanjaByStrokesAndElements, HanjaQueryResult } from './naming-api';
import { passesPhoneticFilter, calculatePhoneticScore, PhoneticScore } from './phonetics';
import { suggestEnglishNames, EnglishNameSuggestion } from './english-name-matcher';

// ──────────────────────────────────────────────
// 1. 81수리 길흉 판별 테이블
// ──────────────────────────────────────────────

/**
 * 81수리 길흉 정의
 *
 * 출처: 성명학 원형이정 81수리 해설표
 *
 * 길흉 분류 기준:
 * - '길(吉)': 명확히 길수로 분류되는 수리
 * - '흉(凶)': 명확히 흉수로 분류되는 수리
 * - 애매한 수리 처리 (보수적 흉수 처리):
 *   - 49수: 일성일패(一盛一敗), 길흉 변화 → 흉
 *   - 51수: 진퇴격(進退格), 성패운 → 흉
 *   - 72수: 길흉상반(吉凶相半), 선부후곤 → 흉
 *   - 76수: 선흉후길(先凶後吉) → 흉
 *   - 77수: 전후격(前後格), 길흉운 → 흉
 */
export type SuriJudgment = '길' | '흉';

export interface SuriInfo {
  number: number;
  judgment: SuriJudgment;
  name: string;       // 격 이름 (예: "태초격")
  keyword: string;    // 운 키워드 (예: "시두운")
  description: string; // 상세 해설 요약
}

/** 81수리 전체 데이터 테이블 (1~81) */
export const SURI_TABLE: Record<number, SuriInfo> = {
  1:  { number: 1,  judgment: '길', name: '태초격', keyword: '시두운',   description: '만물의 시작, 부귀영화를 누리는 대길수' },
  2:  { number: 2,  judgment: '흉', name: '분리격', keyword: '고독운',   description: '분리와 고독, 가정을 망실하는 흉수' },
  3:  { number: 3,  judgment: '길', name: '명예격', keyword: '복덕운',   description: '지혜와 재치로 발전하는 길수' },
  4:  { number: 4,  judgment: '흉', name: '부정격', keyword: '파괴운',   description: '용두사미, 패가망신하는 흉수' },
  5:  { number: 5,  judgment: '길', name: '정성격', keyword: '성공운',   description: '온후한 성격으로 성공하는 대길수' },
  6:  { number: 6,  judgment: '길', name: '계승격', keyword: '덕후운',   description: '가업을 계승하고 부귀를 누리는 길수' },
  7:  { number: 7,  judgment: '길', name: '독립격', keyword: '발전운',   description: '독립과 인내로 대성하는 길수' },
  8:  { number: 8,  judgment: '길', name: '발달격', keyword: '전진운',   description: '강한 의지로 대업을 성취하는 길수' },
  9:  { number: 9,  judgment: '흉', name: '궁박격', keyword: '불행운',   description: '시작은 있으나 끝이 없는 흉수' },
  10: { number: 10, judgment: '흉', name: '공허격', keyword: '귀공운',   description: '만사가 허무하고 공허한 흉수' },
  11: { number: 11, judgment: '길', name: '갱신격', keyword: '재흥운',   description: '스스로 개척하여 대성하는 길수' },
  12: { number: 12, judgment: '흉', name: '유약격', keyword: '고수운',   description: '의지가 약하고 고독한 흉수' },
  13: { number: 13, judgment: '길', name: '총명격', keyword: '지달운',   description: '명철한 두뇌로 입신양명하는 길수' },
  14: { number: 14, judgment: '흉', name: '이산격', keyword: '방랑운',   description: '분리와 방랑, 가정에 파탄이 생기는 흉수' },
  15: { number: 15, judgment: '길', name: '통솔격', keyword: '복수운',   description: '지덕을 겸비하여 만인을 통솔하는 대길수' },
  16: { number: 16, judgment: '길', name: '덕망격', keyword: '유재운',   description: '인망과 재록이 풍성한 대길수' },
  17: { number: 17, judgment: '길', name: '용진격', keyword: '창달운',   description: '강한 의지로 대사를 완수하는 대길수' },
  18: { number: 18, judgment: '길', name: '발전격', keyword: '융창운',   description: '부귀영달하며 만인의 존경을 받는 대길수' },
  19: { number: 19, judgment: '흉', name: '고난격', keyword: '병액운',   description: '일시적 성공 후 중도 실패하는 흉수' },
  20: { number: 20, judgment: '흉', name: '허망격', keyword: '공허운',   description: '만사가 공허하고 단명하는 흉수' },
  21: { number: 21, judgment: '길', name: '자립격', keyword: '두령운',   description: '탁월한 지모로 부귀공명하는 대길수' },
  22: { number: 22, judgment: '흉', name: '중절격', keyword: '박약운',   description: '중도 좌절하고 단명하는 흉수' },
  23: { number: 23, judgment: '길', name: '혁신격', keyword: '왕성운',   description: '비천에서 출세하여 권세를 얻는 대길수' },
  24: { number: 24, judgment: '길', name: '출세격', keyword: '축재운',   description: '두뇌와 인화력으로 부귀영달하는 대길수' },
  25: { number: 25, judgment: '길', name: '안강격', keyword: '재록운',   description: '자수성가하여 명예와 재물을 겸득하는 길수' },
  26: { number: 26, judgment: '흉', name: '만달격', keyword: '영웅운',   description: '일시적 성공 후 파란만장한 흉수' },
  27: { number: 27, judgment: '흉', name: '대인격', keyword: '중절운',   description: '좌절과 실패가 중첩되는 흉수' },
  28: { number: 28, judgment: '흉', name: '파란격', keyword: '조난운',   description: '변란이 많고 파란만장한 흉수' },
  29: { number: 29, judgment: '길', name: '성공격', keyword: '향복운',   description: '왕성한 활동력으로 부귀장수하는 길수' },
  30: { number: 30, judgment: '흉', name: '부몽격', keyword: '불측운',   description: '길흉이 반반이나 예측 불가한 흉수' },
  31: { number: 31, judgment: '길', name: '세찰격', keyword: '흥가운',   description: '자립정신으로 부귀와 명성을 누리는 대길수' },
  32: { number: 32, judgment: '길', name: '순풍격', keyword: '왕성운',   description: '순풍에 돛단배, 의외의 생재로 대성하는 길수' },
  33: { number: 33, judgment: '길', name: '등룡격', keyword: '융성운',   description: '결단력으로 대업을 달성하는 대길수' },
  34: { number: 34, judgment: '흉', name: '변란격', keyword: '파멸운',   description: '불의의 재화가 속출하는 흉수' },
  35: { number: 35, judgment: '길', name: '태평격', keyword: '안강운',   description: '성품이 온순하고 부귀장수하는 길수' },
  36: { number: 36, judgment: '흉', name: '영웅격', keyword: '파란운',   description: '영웅 수리이나 파란이 중중한 흉수' },
  37: { number: 37, judgment: '길', name: '정치격', keyword: '출세운',   description: '강호한 과단성으로 천하에 명성을 떨치는 대길수' },
  38: { number: 38, judgment: '길', name: '문예격', keyword: '학사운',   description: '천재적 재능으로 입신양명하는 길수' },
  39: { number: 39, judgment: '길', name: '장성격', keyword: '지휘운',   description: '고결한 인격으로 부귀영예가 따르는 대길수' },
  40: { number: 40, judgment: '흉', name: '무상격', keyword: '허무운',   description: '운기가 공허하고 변화무상한 흉수' },
  41: { number: 41, judgment: '길', name: '고명격', keyword: '제중운',   description: '지도자의 자질로 사회적 명망을 얻는 길수' },
  42: { number: 42, judgment: '흉', name: '고행격', keyword: '수난운',   description: '대인관계가 원만치 못하고 형액이 따르는 흉수' },
  43: { number: 43, judgment: '흉', name: '성쇠격', keyword: '산재운',   description: '일시적 성공 후 내면이 곤고한 흉수' },
  44: { number: 44, judgment: '흉', name: '난파격', keyword: '파멸운',   description: '일생 곤액이 끊이지 않는 흉수' },
  45: { number: 45, judgment: '길', name: '대각격', keyword: '현달운',   description: '지모가 뛰어나 대지대업을 성취하는 길수' },
  46: { number: 46, judgment: '흉', name: '춘몽격', keyword: '비애운',   description: '자립대성이 어렵고 고독한 흉수' },
  47: { number: 47, judgment: '길', name: '출세격', keyword: '득시운',   description: '준걸한 영웅이 때를 얻어 재명을 떨치는 대길수' },
  48: { number: 48, judgment: '길', name: '제중격', keyword: '영달운',   description: '지모와 재능으로 만인의 지도자가 되는 길수' },
  // 49수: 일성일패, 길흉 변화 → 보수적 흉수 처리
  49: { number: 49, judgment: '흉', name: '은퇴격', keyword: '변화운',   description: '일성일패로 길흉 변화가 상반되는 불안정한 수' },
  50: { number: 50, judgment: '흉', name: '성패격', keyword: '길흉운',   description: '미래가 혼미하고 자립 불능한 흉수' },
  // 51수: 진퇴격, 성패운 → 보수적 흉수 처리
  51: { number: 51, judgment: '흉', name: '진퇴격', keyword: '성패운',   description: '진퇴가 불분명하고 성패가 엇갈리는 불안정한 수' },
  52: { number: 52, judgment: '길', name: '승룡격', keyword: '시승운',   description: '자성이 영준하여 대업을 창립하는 길수' },
  53: { number: 53, judgment: '흉', name: '우수격', keyword: '내허운',   description: '외부내빈격으로 내면이 공허한 흉수' },
  54: { number: 54, judgment: '흉', name: '신고격', keyword: '패가운',   description: '도로무공이요 패가망신하는 흉수' },
  55: { number: 55, judgment: '흉', name: '불안격', keyword: '미달운',   description: '매사 불안정하고 파산·병고의 위협이 있는 흉수' },
  56: { number: 56, judgment: '흉', name: '부족격', keyword: '한탄운',   description: '실행력이 부족하고 실패가 거듭되는 흉수' },
  57: { number: 57, judgment: '길', name: '봉시격', keyword: '강성운',   description: '굳은 의지로 부귀영화를 누리는 길수' },
  58: { number: 58, judgment: '길', name: '후영격', keyword: '후복운',   description: '인내와 노력으로 결국 성공 영달하는 길수' },
  59: { number: 59, judgment: '흉', name: '재화격', keyword: '불성운',   description: '의지가 박약하고 재화가 속출하는 흉수' },
  60: { number: 60, judgment: '흉', name: '암흑격', keyword: '재난운',   description: '화란을 헤아리기 어려운 흉수' },
  61: { number: 61, judgment: '길', name: '이지격', keyword: '재리운',   description: '견고한 지조와 결단성으로 부귀안정하는 길수' },
  62: { number: 62, judgment: '흉', name: '고독격', keyword: '쇠퇴운',   description: '운기가 쇠퇴하고 패가망신하는 흉수' },
  63: { number: 63, judgment: '길', name: '순성격', keyword: '발전운',   description: '경영하는 일이 순조로이 발전하는 길수' },
  64: { number: 64, judgment: '흉', name: '침체격', keyword: '쇠멸운',   description: '운기가 쇠퇴하여 모든 계획이 실패하는 흉수' },
  65: { number: 65, judgment: '길', name: '휘양격', keyword: '흥가운',   description: '제사가 형통하고 수복강녕하는 대길수' },
  66: { number: 66, judgment: '흉', name: '망망격', keyword: '진퇴양난', description: '진퇴양난에 재화가 속출하는 흉수' },
  67: { number: 67, judgment: '길', name: '천복격', keyword: '영달운',   description: '모든 난관을 돌파하여 부귀행복을 누리는 길수' },
  68: { number: 68, judgment: '길', name: '명지격', keyword: '발명운',   description: '창의적 발명으로 부귀영화가 따르는 길수' },
  69: { number: 69, judgment: '흉', name: '정지격', keyword: '불안운',   description: '운이 쇠퇴하고 고독·단명의 악운인 흉수' },
  70: { number: 70, judgment: '흉', name: '적막격', keyword: '공허운',   description: '매사에 자신감이 결여되고 단명하는 흉수' },
  71: { number: 71, judgment: '길', name: '현룡격', keyword: '발전운',   description: '착실한 성품으로 사회적 덕망을 얻는 길수' },
  // 72수: 길흉상반(吉凶相半), 선부후곤 → 보수적 흉수 처리
  72: { number: 72, judgment: '흉', name: '상반격', keyword: '후곤운',   description: '길흉이 상반이요 선부후곤으로 전락하는 불안정한 수' },
  73: { number: 73, judgment: '길', name: '평길격', keyword: '평복운',   description: '무난하고 평길 안과하는 길수' },
  74: { number: 74, judgment: '흉', name: '우매격', keyword: '불우운',   description: '재능이 사멸되고 실패가 많은 흉수' },
  75: { number: 75, judgment: '길', name: '정수격', keyword: '평화운',   description: '온유유덕하고 신중하여 만인의 신망을 얻는 길수' },
  // 76수: 선흉후길(先凶後吉) → 보수적 흉수 처리
  76: { number: 76, judgment: '흉', name: '선곤격', keyword: '후성운',   description: '초년에 곤궁하고 좌절이 따르는 선흉후길의 불안정한 수' },
  // 77수: 전후격(前後格), 길흉운 → 보수적 흉수 처리
  77: { number: 77, judgment: '흉', name: '전후격', keyword: '길흉운',   description: '초년 고생 후 발전하나 길흉이 교차하는 불안정한 수' },
  78: { number: 78, judgment: '길', name: '선길격', keyword: '평복운',   description: '초년에 성공을 이루는 길수' },
  79: { number: 79, judgment: '흉', name: '종극격', keyword: '부정운',   description: '행운이 따르지 않아 중도 좌절하는 흉수' },
  80: { number: 80, judgment: '흉', name: '종결격', keyword: '은둔운',   description: '일생 고난이 끊이지 않는 흉수' },
  81: { number: 81, judgment: '길', name: '환원격', keyword: '갱희운',   description: '1수로 환원되는 최극수, 크게 성공하는 대길수' },
};

/** 길수(吉數) 집합 - 빠른 조회를 위해 Set으로 관리 */
export const LUCKY_NUMBERS: Set<number> = new Set(
  Object.values(SURI_TABLE)
    .filter((s) => s.judgment === '길')
    .map((s) => s.number)
);

// ──────────────────────────────────────────────
// 2. 81수리 4격 계산
// ──────────────────────────────────────────────

/**
 * 81수리 4격 계산 결과 타입
 *
 * 성명 구조: [성(姓)] [이름 첫째자(名1)] [이름 둘째자(名2)]
 * 예) 박(朴=6획) 지(智=12획) 현(賢=15획)
 */
export interface SuriResult {
  /** 원격(元格): 이름 첫째자 + 이름 둘째자 (초년운, 건강·가정운) */
  won: number;
  /** 형격(亨格): 성 + 이름 첫째자 (청년운, 성공·사업운) */
  hyung: number;
  /** 이격(利格): 성 + 이름 둘째자 (장년운, 부부·사회운) */
  i: number;
  /** 정격(貞格): 성 + 이름 첫째자 + 이름 둘째자 (노년운, 총운) */
  jung: number;

  wonJudgment: SuriJudgment;
  hyungJudgment: SuriJudgment;
  iJudgment: SuriJudgment;
  jungJudgment: SuriJudgment;

  /** 4격 모두 길수인지 여부 */
  isAllLucky: boolean;

  wonInfo: SuriInfo;
  hyungInfo: SuriInfo;
  iInfo: SuriInfo;
  jungInfo: SuriInfo;
}

/**
 * 81수리 정규화 함수
 *
 * 획수 합이 81을 초과할 경우 81로 나눈 나머지를 사용.
 * 단, 나머지가 0이면 81로 처리 (81수 = 환원격, 길수).
 */
export function normalizeSuri(n: number): number {
  if (n <= 81) return n;
  const remainder = n % 81;
  return remainder === 0 ? 81 : remainder;
}

/**
 * 81수리 길흉 판별
 *
 * @param n 정규화 전 획수 합
 * @returns SuriInfo
 */
export function judgeSuri(n: number): SuriInfo {
  const normalized = normalizeSuri(n);
  return SURI_TABLE[normalized];
}

/**
 * 4격(원형이정) 계산 및 길흉 판별
 *
 * @param familyStrokes  성(姓)의 원획수
 * @param name1Strokes   이름 첫째자의 원획수
 * @param name2Strokes   이름 둘째자의 원획수
 */
export function calculate4Gyeok(
  familyStrokes: number,
  name1Strokes: number,
  name2Strokes: number
): SuriResult {
  const won  = name1Strokes + name2Strokes;
  const hyung = familyStrokes + name1Strokes;
  const i    = familyStrokes + name2Strokes;
  const jung  = familyStrokes + name1Strokes + name2Strokes;

  const wonInfo   = judgeSuri(won);
  const hyungInfo = judgeSuri(hyung);
  const iInfo     = judgeSuri(i);
  const jungInfo  = judgeSuri(jung);

  return {
    won,
    hyung,
    i,
    jung,
    wonJudgment:   wonInfo.judgment,
    hyungJudgment: hyungInfo.judgment,
    iJudgment:     iInfo.judgment,
    jungJudgment:  jungInfo.judgment,
    isAllLucky:
      wonInfo.judgment   === '길' &&
      hyungInfo.judgment === '길' &&
      iInfo.judgment     === '길' &&
      jungInfo.judgment  === '길',
    wonInfo,
    hyungInfo,
    iInfo,
    jungInfo,
  };
}

/**
 * 4격이 모두 길수인지 빠르게 확인 (역순 탐색 루프용)
 *
 * @param familyStrokes  성(姓)의 원획수
 * @param name1Strokes   이름 첫째자의 원획수
 * @param name2Strokes   이름 둘째자의 원획수
 */
export function isAll4GyeokLucky(
  familyStrokes: number,
  name1Strokes: number,
  name2Strokes: number
): boolean {
  const won   = normalizeSuri(name1Strokes + name2Strokes);
  const hyung = normalizeSuri(familyStrokes + name1Strokes);
  const i     = normalizeSuri(familyStrokes + name2Strokes);
  const jung  = normalizeSuri(familyStrokes + name1Strokes + name2Strokes);

  return (
    LUCKY_NUMBERS.has(won) &&
    LUCKY_NUMBERS.has(hyung) &&
    LUCKY_NUMBERS.has(i) &&
    LUCKY_NUMBERS.has(jung)
  );
}

// ──────────────────────────────────────────────
// 3. 사주 오행 분석 → 부족 오행 도출
// ──────────────────────────────────────────────

/**
 * 오행 한자 표기 → 한글 표기 변환 맵
 * (Supabase hanja_dictionary.element 컬럼 값과 일치시킴)
 */
const ELEMENT_KR_MAP: Record<string, string> = {
  '木': '목',
  '火': '화',
  '土': '토',
  '金': '금',
  '水': '수',
};

/**
 * 사주 결과에서 부족한 오행 도출
 *
 * calculateElementBalance 반환값 기준:
 * - 8개 글자(천간·지지 각 4개) 중 0~1개인 오행을 "부족"으로 판단
 * - 모든 오행이 균형 잡혀 있으면 빈 배열 반환
 *   → 이 경우 작명 엔진에서 오행 조건 없이 81수리만으로 탐색
 *
 * @returns Supabase element 컬럼 값 배열 (예: ["목", "화"])
 */
export function getWeakElements(saju: SajuResult): string[] {
  const balance = calculateElementBalance(saju);
  return balance
    .filter((b) => b.value <= 1)
    .map((b) => ELEMENT_KR_MAP[b.name] ?? b.name);
}

// ──────────────────────────────────────────────
// 4. 길수 획수 조합 역순 탐색
// ──────────────────────────────────────────────

/** 탐색 범위: 이름 한 글자당 최소·최대 획수 */
const MIN_STROKES = 2;
const MAX_STROKES = 30;

/**
 * 4격이 모두 길수인 (name1Strokes, name2Strokes) 조합 탐색
 *
 * 성능 최적화:
 * - 탐색 범위를 2~30획으로 제한 (대법원 인명용 한자 실용 범위)
 * - 조합 수: 최대 29 × 29 = 841가지 → 브라우저에서 즉시 처리 가능
 *
 * @param familyStrokes 성(姓)의 원획수
 * @returns 길수 조합 배열 [{name1Strokes, name2Strokes}]
 */
export function findLuckyStrokeCombinations(
  familyStrokes: number
): Array<{ name1Strokes: number; name2Strokes: number }> {
  const results: Array<{ name1Strokes: number; name2Strokes: number }> = [];

  for (let n1 = MIN_STROKES; n1 <= MAX_STROKES; n1++) {
    for (let n2 = MIN_STROKES; n2 <= MAX_STROKES; n2++) {
      if (isAll4GyeokLucky(familyStrokes, n1, n2)) {
        results.push({ name1Strokes: n1, name2Strokes: n2 });
      }
    }
  }

  return results;
}

// ──────────────────────────────────────────────
// 5. 작명 후보 타입 정의
// ──────────────────────────────────────────────

/** 작명 후보 한 쌍 (이름 두 글자) */
export interface NameCandidate {
  /** 이름 첫째 한자 */
  char1: HanjaQueryResult;
  /** 이름 둘째 한자 */
  char2: HanjaQueryResult;
  /** 4격 계산 결과 */
  suri: SuriResult;
  /** 한글 이름 (예: "지현") */
  hangulName: string;
  /** 한자 이름 (예: "智賢") */
  hanjaName: string;
  /** 음운 검토 결과 */
  phoneticScore?: PhoneticScore;
  /** 영어 이름 추천 */
  englishNames?: EnglishNameSuggestion[];
}

// ──────────────────────────────────────────────
// 6. 메인 작명 함수
// ──────────────────────────────────────────────

/** generateNames 옵션 */
export interface GenerateNamesOptions {
  /** 최대 반환 후보 수 (기본: 10) */
  maxResults?: number;
  /**
   * 부족 오행 우선 여부 (기본: true)
   * false로 설정하면 오행 조건 없이 81수리만으로 탐색
   */
  prioritizeWeakElements?: boolean;
  /** 음운 필터 적용 여부 (기본: true) */
  applyPhoneticFilter?: boolean;
  /** 성씨 한글 (음운 검토용, 예: "김") */
  surnameHangul?: string;
  /** 성별 (영어 이름 추천용) */
  gender?: 'male' | 'female';
}

/**
 * 메인 작명 함수 (Client-Side 비동기 실행)
 *
 * 처리 흐름:
 * 1. 사주 분석 → 부족 오행 도출
 * 2. 81수리 역순 탐색 → 4격 모두 길수인 획수 조합 산출
 * 3. 해당 획수 + 부족 오행 한자를 Supabase에서 쿼리
 * 4. 한자 조합으로 후보 생성 → 최대 maxResults개 반환
 *
 * @param saju            사주 계산 결과
 * @param familyStrokes   성(姓)의 원획수
 * @param options         옵션
 */
export async function generateNames(
  saju: SajuResult,
  familyStrokes: number,
  options: GenerateNamesOptions = {}
): Promise<NameCandidate[]> {
  const { maxResults = 10, prioritizeWeakElements = true } = options;

  // Step 1: 부족 오행 도출
  const weakElements = prioritizeWeakElements ? getWeakElements(saju) : [];

  // Step 2: 4격 모두 길수인 획수 조합 탐색
  const luckyCombinations = findLuckyStrokeCombinations(familyStrokes);

  if (luckyCombinations.length === 0) {
    return [];
  }

  // Step 3: 필요한 획수 집합 추출
  const neededStrokes1 = Array.from(new Set(luckyCombinations.map((c) => c.name1Strokes)));
  const neededStrokes2 = Array.from(new Set(luckyCombinations.map((c) => c.name2Strokes)));
  const allNeededStrokes = Array.from(new Set([...neededStrokes1, ...neededStrokes2]));

  // Step 4: Supabase 쿼리
  // 부족 오행이 있으면 오행 조건 포함, 없으면 획수만으로 조회
  let hanjaPool: HanjaQueryResult[];
  if (weakElements.length > 0) {
    hanjaPool = await getHanjaByStrokesAndElements(allNeededStrokes, weakElements);
  } else {
    // 오행 조건 없이 획수만으로 조회 (import 추가 필요 시 사용)
    const { getHanjaByStrokes } = await import('./naming-api');
    hanjaPool = await getHanjaByStrokes(allNeededStrokes);
  }

  if (hanjaPool.length === 0) {
    return [];
  }

  // 획수별 한자 인덱스 구성 (빠른 조합 생성용)
  const hanjaByStrokes: Map<number, HanjaQueryResult[]> = new Map();
  for (const hanja of hanjaPool) {
    if (!hanjaByStrokes.has(hanja.strokes)) {
      hanjaByStrokes.set(hanja.strokes, []);
    }
    hanjaByStrokes.get(hanja.strokes)!.push(hanja);
  }

  const {
    applyPhoneticFilter = true,
    surnameHangul = '',
    gender = 'male',
  } = options;

  // Step 5: 후보 생성
  const candidates: NameCandidate[] = [];

  outer: for (const combo of luckyCombinations) {
    const pool1 = hanjaByStrokes.get(combo.name1Strokes) ?? [];
    const pool2 = hanjaByStrokes.get(combo.name2Strokes) ?? [];

    for (const char1 of pool1) {
      for (const char2 of pool2) {
        // 같은 한자 중복 방지
        if (char1.hanja === char2.hanja) continue;

        const name1Hangul = char1.hangul;
        const name2Hangul = char2.hangul;

        // 음운 필터 적용
        if (applyPhoneticFilter && surnameHangul) {
          if (!passesPhoneticFilter(surnameHangul, name1Hangul, name2Hangul)) {
            continue;
          }
        }

        const suri = calculate4Gyeok(familyStrokes, char1.strokes, char2.strokes);
        const hangulName = name1Hangul + name2Hangul;

        // 음운 점수 산출
        const phoneticScore = surnameHangul
          ? calculatePhoneticScore(surnameHangul, name1Hangul, name2Hangul)
          : undefined;

        // 영어 이름 추천
        const meanings = [char1.meaning, char2.meaning];
        const englishNames = suggestEnglishNames(hangulName, meanings, gender, 3);

        candidates.push({
          char1,
          char2,
          suri,
          hangulName,
          hanjaName: char1.hanja + char2.hanja,
          phoneticScore,
          englishNames,
        });

        if (candidates.length >= maxResults) break outer;
      }
    }
  }

  return candidates;
}
