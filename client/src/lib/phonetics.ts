/**
 * 무운 작명소 - 음운 검토 모듈 (phonetics.ts)
 *
 * 구현 범위:
 * 1. 한글 초성/종성 분리
 * 2. 초성 오행 분류 (성명학 기준)
 * 3. 오행 상생상극 판별
 * 4. 기피 발음 필터링 (사(死), 귀(鬼) 등)
 * 5. 음운 점수 산출 (0~100)
 *
 * 성명학 음운 원칙:
 * - 성씨 초성 → 이름 첫째자 초성 → 이름 둘째자 초성이 상생(相生)하면 길
 * - 연속 상극(相剋)은 흉
 * - 기피 발음(사/귀/흉 등)은 이름에 사용 금지
 */

// ──────────────────────────────────────────────
// 1. 한글 초성/중성/종성 분리
// ──────────────────────────────────────────────

/** 한글 초성 배열 (19개) */
const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

/** 한글 종성 배열 (28개, 0번은 받침 없음) */
const JONGSEONG = [
  '',   'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ',
  'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ',
  'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

export interface HangulDecomposed {
  choseong: string;  // 초성
  jungseong: string; // 중성 (모음)
  jongseong: string; // 종성 (받침, 없으면 '')
}

/**
 * 한글 음절 하나를 초성/중성/종성으로 분리
 * 한글 유니코드 공식: 가(0xAC00) ~ 힣(0xD7A3)
 */
export function decomposeHangul(char: string): HangulDecomposed | null {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return null;

  const offset = code - 0xAC00;
  const jongIdx = offset % 28;
  const jungIdx = Math.floor(offset / 28) % 21;
  const choIdx  = Math.floor(offset / 28 / 21);

  const JUNGSEONG = [
    'ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ',
    'ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ',
  ];

  return {
    choseong:  CHOSEONG[choIdx],
    jungseong: JUNGSEONG[jungIdx],
    jongseong: JONGSEONG[jongIdx],
  };
}

// ──────────────────────────────────────────────
// 2. 초성 오행 분류 (성명학 기준)
// ──────────────────────────────────────────────

/**
 * 성명학 초성 오행 분류표
 *
 * 木: ㄱ, ㅋ (목소리가 나무처럼 뻗어 나가는 소리)
 * 火: ㄴ, ㄷ, ㄹ, ㅌ (불처럼 퍼지는 소리)
 * 土: ㅇ, ㅎ (땅처럼 넓고 울리는 소리)
 * 金: ㅅ, ㅈ, ㅊ (금속처럼 날카로운 소리)
 * 水: ㅁ, ㅂ, ㅍ (물처럼 흐르는 소리)
 *
 * 경음(ㄲ, ㄸ, ㅃ, ㅆ, ㅉ)은 각각 원래 자음과 동일한 오행으로 처리
 */
export type PhoneticElement = '목' | '화' | '토' | '금' | '수' | '없음';

export const CHOSEONG_ELEMENT: Record<string, PhoneticElement> = {
  'ㄱ': '목', 'ㄲ': '목', 'ㅋ': '목',
  'ㄴ': '화', 'ㄷ': '화', 'ㄸ': '화', 'ㄹ': '화', 'ㅌ': '화',
  'ㅇ': '토', 'ㅎ': '토',
  'ㅅ': '금', 'ㅆ': '금', 'ㅈ': '금', 'ㅉ': '금', 'ㅊ': '금',
  'ㅁ': '수', 'ㅂ': '수', 'ㅃ': '수', 'ㅍ': '수',
};

/**
 * 한글 음절의 초성 오행을 반환
 */
export function getChoseongElement(hangul: string): PhoneticElement {
  const decomposed = decomposeHangul(hangul);
  if (!decomposed) return '없음';
  return CHOSEONG_ELEMENT[decomposed.choseong] ?? '없음';
}

// ──────────────────────────────────────────────
// 3. 오행 상생상극 판별
// ──────────────────────────────────────────────

/**
 * 오행 상생 관계 (A → B: A가 B를 생함)
 * 목생화(木生火) → 화생토(火生土) → 토생금(土生金) → 금생수(金生水) → 수생목(水生木)
 */
const SANGSAENG: Record<string, string> = {
  '목': '화',
  '화': '토',
  '토': '금',
  '금': '수',
  '수': '목',
};

/**
 * 오행 상극 관계 (A → B: A가 B를 극함)
 * 목극토(木剋土) → 토극수(土剋水) → 수극화(水剋火) → 화극금(火剋金) → 금극목(金剋木)
 */
const SANGGEUK: Record<string, string> = {
  '목': '토',
  '토': '수',
  '수': '화',
  '화': '금',
  '금': '목',
};

export type ElementRelation = '상생' | '상극' | '비화' | '없음';

/**
 * 두 오행 간의 관계 판별
 * @param from 앞 오행
 * @param to   뒤 오행
 */
export function getElementRelation(
  from: PhoneticElement,
  to: PhoneticElement
): ElementRelation {
  if (from === '없음' || to === '없음') return '없음';
  if (from === to) return '비화';
  if (SANGSAENG[from] === to) return '상생';
  if (SANGGEUK[from] === to) return '상극';
  // 역상생/역상극도 관계로 분류 (성명학에서는 역방향도 고려)
  if (SANGSAENG[to] === from) return '상생'; // 역상생도 길로 처리
  if (SANGGEUK[to] === from) return '상극'; // 역상극도 흉으로 처리
  return '비화';
}

// ──────────────────────────────────────────────
// 4. 기피 발음 필터링
// ──────────────────────────────────────────────

/**
 * 기피 발음 목록
 *
 * 성명학에서 이름에 사용을 피하는 발음:
 * - 사(死/邪): 죽음, 사악함 연상
 * - 귀(鬼): 귀신 연상
 * - 흉(凶): 흉함 연상
 * - 독(毒): 독 연상
 * - 악(惡): 악함 연상
 * - 암(暗): 어둠 연상
 * - 망(亡): 망함 연상
 * - 패(敗): 패배 연상
 * - 빈(貧): 가난 연상
 * - 병(病): 병 연상 (단, 성씨 병(炳)은 예외)
 * - 천(賤): 천함 연상
 * - 노(奴): 노예 연상
 * - 고(苦): 고통 연상
 * - 형(刑): 형벌 연상 (단, 성씨 형(邢)은 예외)
 *
 * 주의: 성씨에 해당하는 발음은 필터 대상에서 제외
 */
const AVOIDED_SOUNDS = new Set([
  '사', '귀', '흉', '독', '악', '암', '망', '패', '빈', '병', '천', '노', '고', '형',
  '죽', '살', '독', '음', '귀', '마', '귀', '저', '비', '욕',
]);

/**
 * 이름이 기피 발음을 포함하는지 확인
 * @param hangulName 이름 한글 (예: "지현")
 * @returns 기피 발음이 있으면 true
 */
export function hasAvoidedSound(hangulName: string): boolean {
  for (const char of hangulName) {
    if (AVOIDED_SOUNDS.has(char)) return true;
  }
  return false;
}

/**
 * 어떤 기피 발음이 포함되어 있는지 반환
 */
export function getAvoidedSounds(hangulName: string): string[] {
  const found: string[] = [];
  for (const char of hangulName) {
    if (AVOIDED_SOUNDS.has(char)) found.push(char);
  }
  return found;
}

// ──────────────────────────────────────────────
// 5. 음운 종합 점수 산출
// ──────────────────────────────────────────────

export interface PhoneticScore {
  /** 음운 종합 점수 (0~100) */
  score: number;
  /** 성씨 → 이름1 초성 관계 */
  relation1: ElementRelation;
  /** 이름1 → 이름2 초성 관계 */
  relation2: ElementRelation;
  /** 성씨 초성 오행 */
  surnameElement: PhoneticElement;
  /** 이름 첫째자 초성 오행 */
  name1Element: PhoneticElement;
  /** 이름 둘째자 초성 오행 */
  name2Element: PhoneticElement;
  /** 기피 발음 포함 여부 */
  hasAvoidedSound: boolean;
  /** 발견된 기피 발음 목록 */
  avoidedSounds: string[];
  /** 음운 평가 메시지 */
  message: string;
}

/**
 * 성씨 + 이름 두 글자의 음운 종합 점수 산출
 *
 * 점수 계산 기준:
 * - 기본 점수: 60점
 * - 성씨→이름1 상생: +15점 / 상극: -20점 / 비화: +5점
 * - 이름1→이름2 상생: +15점 / 상극: -20점 / 비화: +5점
 * - 기피 발음 없음: +10점 / 있음: -30점
 *
 * @param surnameHangul  성씨 한글 (예: "김")
 * @param name1Hangul    이름 첫째자 한글 (예: "지")
 * @param name2Hangul    이름 둘째자 한글 (예: "현")
 */
export function calculatePhoneticScore(
  surnameHangul: string,
  name1Hangul: string,
  name2Hangul: string
): PhoneticScore {
  const surnameElement = getChoseongElement(surnameHangul);
  const name1Element   = getChoseongElement(name1Hangul);
  const name2Element   = getChoseongElement(name2Hangul);

  const relation1 = getElementRelation(surnameElement, name1Element);
  const relation2 = getElementRelation(name1Element, name2Element);

  const avoidedSounds = getAvoidedSounds(name1Hangul + name2Hangul);
  const hasAvoided = avoidedSounds.length > 0;

  // 점수 계산
  let score = 60;

  // 성씨 → 이름1 관계
  if (relation1 === '상생') score += 15;
  else if (relation1 === '상극') score -= 20;
  else if (relation1 === '비화') score += 5;

  // 이름1 → 이름2 관계
  if (relation2 === '상생') score += 15;
  else if (relation2 === '상극') score -= 20;
  else if (relation2 === '비화') score += 5;

  // 기피 발음
  if (hasAvoided) score -= 30;
  else score += 10;

  // 0~100 범위로 클램핑
  score = Math.max(0, Math.min(100, score));

  // 평가 메시지
  let message = '';
  if (score >= 85) message = '음운이 매우 조화롭습니다';
  else if (score >= 70) message = '음운이 무난합니다';
  else if (score >= 50) message = '음운에 다소 주의가 필요합니다';
  else message = '음운 조화가 좋지 않습니다';

  if (hasAvoided) {
    message += ` (기피 발음 포함: ${avoidedSounds.join(', ')})`;
  }

  return {
    score,
    relation1,
    relation2,
    surnameElement,
    name1Element,
    name2Element,
    hasAvoidedSound: hasAvoided,
    avoidedSounds,
    message,
  };
}

// ──────────────────────────────────────────────
// 6. 이름 전체 음운 필터 (작명 엔진 연동용)
// ──────────────────────────────────────────────

/**
 * 종성(받침)이 초성으로 연결될 때 발음이 어색한 조합을 판별
 *
 * 한국어 음운 규칙에서 첫 글자의 받침이 다음 글자의 초성과 동일한 자음일 때
 * 연음화되어 발음이 어색하게 들립니다.
 * 예: 림 + 리(→ 림-니 연음), 민 + 니(→ 민-니 연음)
 *
 * 필터링 대상: 종성 ↔ 초성 매핑 테이블 기준
 * - 종성 γ(ᄀ), γγ(ᄁ), γγ(ᄃ) → 초성 γ(ᄀ), γγ(ᄁ)
 * - η(ᄂ) → η(ᄂ)
 * - δ(ᄃ), δδ(ᄇ) → δ(ᄃ), δδ(ᄄ)
 * - λ(ᄅ) → λ(ᄅ)
 * - μ(ᄆ) → μ(ᄆ)
 * - β(ᄇ), ββ(ᄈ) → β(ᄇ), ββ(ᄈ)
 * - σ(ᄉ), σσ(ᄊ) → σ(ᄉ), σσ(ᄊ)
 * - ζ(ᄌ), ζζ(ᄍ) → ζ(ᄌ), ζζ(ᄍ)
 * - χ(ᄎ) → χ(ᄎ)
 * - κ(ᄏ) → κ(ᄏ)
 * - τ(ᄐ) → τ(ᄐ)
 * - φ(ᄑ) → φ(ᄑ)
 * - ηη(ᄒ) → ηη(ᄒ)
 * - ε(ᄋ) → ε(ᄋ) (연음으로 사용되므로 필터 제외)
 *
 * @param name1Hangul 이름 첫째자 한글
 * @param name2Hangul 이름 둘째자 한글
 * @returns true이면 발음이 어색한 조합 (필터링 대상)
 */
export function hasRedundantJongseong(
  name1Hangul: string,
  name2Hangul: string
): boolean {
  const d1 = decomposeHangul(name1Hangul);
  const d2 = decomposeHangul(name2Hangul);
  if (!d1 || !d2) return false;

  // 첫 글자에 받침이 없으면 해당없음
  if (d1.jongseong === '') return false;

  // 종성 → 초성 동일 여부 판별 테이블
  // 단순 종성(단일 자음)은 해당 초성과 매핑
  // 복합 종성(ᄀᆨ, ᄂᆬ 등)은 첫 번째 자음으로 매핑
  const JONGSEONG_TO_CHOSEONG: Record<string, string[]> = {
    'ㄱ': ['ㄱ', 'ㄲ'],           // γ → γ, γγ
    'ㄲ': ['ㄱ', 'ㄲ'],           // γγ → γ, γγ
    'ㄳ': ['ㄱ', 'ㄲ'],           // γγ → γ, γγ (ᄀᆨ 복합종성)
    'ㄴ': ['ㄴ'],               // η → η
    'ㄵ': ['ㄴ'],               // ηζ → η (ᄂᆬ 복합종성)
    'ㄶ': ['ㄴ'],               // ηη → η (ᄂᆭ 복합종성)
    'ㄷ': ['ㄷ', 'ㄸ'],           // δ → δ, δδ
    'ㄹ': ['ㄹ'],               // λ → λ
    'ㄺ': ['ㄱ', 'ㄲ'],           // λγ → γ, γγ
    'ㄻ': ['ㅁ'],               // λμ → μ
    'ㄼ': ['ㅂ'],               // λβ → β
    'ㄽ': ['ㅅ'],               // λσ → σ (ᄅᆳ)
    'ㄾ': ['ㅌ'],               // λτ → τ (ᄅᆴ)
    'ㄿ': ['ㅍ'],               // λφ → φ (ᄅᆵ)
    'ㅀ': ['ㄹ'],               // λη → λ (ᄅᆶ)
    'ㅁ': ['ㅁ'],               // μ → μ
    'ㅂ': ['ㅂ', 'ㅃ'],           // β → β, ββ
    'ㅄ': ['ㅅ'],               // βσ → σ (ᄇᆹ)
    'ㅅ': ['ㅅ', 'ㅆ'],           // σ → σ, σσ
    'ㅆ': ['ㅅ', 'ㅆ'],           // σσ → σ, σσ
    'ㅈ': ['ㅈ', 'ㅉ'],           // ζ → ζ, ζζ
    'ㅊ': ['ㅊ'],               // χ → χ
    'ㅋ': ['ㅋ'],               // κ → κ
    'ㅌ': ['ㅌ'],               // τ → τ
    'ㅍ': ['ㅍ'],               // φ → φ
    'ㅎ': ['ㅎ'],               // ηη → ηη
    // 'ㅇ' (ε): 연음 기능으로 사용되므로 필터 제외
  };

  const matchingChoseongs = JONGSEONG_TO_CHOSEONG[d1.jongseong];
  if (!matchingChoseongs) return false;

  return matchingChoseongs.includes(d2.choseong);
}

/**
 * 이름 후보가 음운 기준을 통과하는지 확인
 *
 * 통과 기준:
 * - 기피 발음 없음 (필수)
 * - 첫 글자 받침과 둘째 글자 초성이 동일한 경우 제외 (필수)
 * - 음운 점수 50점 이상 (권장)
 *
 * @param surnameHangul  성씨 한글
 * @param name1Hangul    이름 첫째자 한글
 * @param name2Hangul    이름 둘째자 한글
 * @param strictMode     true이면 점수 70점 이상 필요 (기본: false)
 */
export function passesPhoneticFilter(
  surnameHangul: string,
  name1Hangul: string,
  name2Hangul: string,
  strictMode = false
): boolean {
  // 기피 발음 필터 (필수)
  if (hasAvoidedSound(name1Hangul + name2Hangul)) return false;

  // 첫 글자 받침 = 둘째 글자 초성 중복 종성 필터 (필수)
  // 예: 림 + 리, 민 + 니, 서 + 시 등 발음이 어색한 조합 제외
  if (hasRedundantJongseong(name1Hangul, name2Hangul)) return false;

  // 음운 점수 필터 (권장)
  const { score } = calculatePhoneticScore(surnameHangul, name1Hangul, name2Hangul);
  return score >= (strictMode ? 70 : 50);
}
