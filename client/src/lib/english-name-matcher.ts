/**
 * 무운 작명소 - 영어 이름 매칭 모듈 (english-name-matcher.ts)
 *
 * 구현 범위:
 * 1. 한글 발음 → 로마자 변환 (국립국어원 로마자 표기법 기반)
 * 2. 한자 의미 키워드 → 영어 이름 매칭
 * 3. 발음 유사성 기반 영어 이름 추천
 *
 * 매칭 전략:
 * - 1순위: 한자 의미 키워드와 의미적으로 연관된 영어 이름
 * - 2순위: 한글 발음과 음성적으로 유사한 영어 이름
 * - 3순위: 성별에 맞는 인기 영어 이름 (fallback)
 */

// ──────────────────────────────────────────────
// 1. 한글 → 로마자 변환 (간소화 버전)
// ──────────────────────────────────────────────

/** 초성 로마자 표기 (국립국어원 기준) */
const CHOSEONG_ROMAN: Record<string, string> = {
  'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt',
  'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's',
  'ㅆ': 'ss', 'ㅇ': '', 'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch',
  'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
};

/** 중성 로마자 표기 */
const JUNGSEONG_ROMAN: Record<string, string> = {
  'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo',
  'ㅔ': 'e', 'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa',
  'ㅙ': 'wae', 'ㅚ': 'oe', 'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo',
  'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅢ': 'ui',
  'ㅣ': 'i',
};

/** 종성 로마자 표기 */
const JONGSEONG_ROMAN: Record<string, string> = {
  '': '', 'ㄱ': 'k', 'ㄲ': 'k', 'ㄳ': 'k', 'ㄴ': 'n', 'ㄵ': 'n',
  'ㄶ': 'n', 'ㄷ': 't', 'ㄹ': 'l', 'ㄺ': 'k', 'ㄻ': 'm',
  'ㄼ': 'l', 'ㄽ': 'l', 'ㄾ': 'l', 'ㄿ': 'p', 'ㅀ': 'l',
  'ㅁ': 'm', 'ㅂ': 'p', 'ㅄ': 'p', 'ㅅ': 't', 'ㅆ': 't',
  'ㅇ': 'ng', 'ㅈ': 't', 'ㅊ': 't', 'ㅋ': 'k', 'ㅌ': 't',
  'ㅍ': 'p', 'ㅎ': 't',
};

const CHOSEONG_LIST = [
  'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ',
  'ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];
const JUNGSEONG_LIST = [
  'ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ',
  'ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ',
];
const JONGSEONG_LIST = [
  '','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ',
  'ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];

/**
 * 한글 문자열을 로마자로 변환
 */
export function hangulToRoman(hangul: string): string {
  let result = '';
  for (const char of hangul) {
    const code = char.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const offset = code - 0xAC00;
      const jongIdx = offset % 28;
      const jungIdx = Math.floor(offset / 28) % 21;
      const choIdx  = Math.floor(offset / 28 / 21);

      result += (CHOSEONG_ROMAN[CHOSEONG_LIST[choIdx]] ?? '') +
                (JUNGSEONG_ROMAN[JUNGSEONG_LIST[jungIdx]] ?? '') +
                (JONGSEONG_ROMAN[JONGSEONG_LIST[jongIdx]] ?? '');
    } else {
      result += char;
    }
  }
  return result;
}

// ──────────────────────────────────────────────
// 2. 한자 의미 키워드 → 영어 이름 매핑
// ──────────────────────────────────────────────

/**
 * 한자 의미 키워드와 연관된 영어 이름 매핑
 *
 * 형식: 키워드 → { male: 남성 이름 목록, female: 여성 이름 목록 }
 */
const MEANING_TO_ENGLISH: Record<string, { male: string[]; female: string[] }> = {
  // 자연/빛
  '빛': { male: ['Ray', 'Luke', 'Lux'], female: ['Lucy', 'Claire', 'Aurora'] },
  '광': { male: ['Ray', 'Luke'], female: ['Lucy', 'Claire'] },
  '명': { male: ['Ray', 'Lumen'], female: ['Lucy', 'Clara'] },
  '휘': { male: ['Ray', 'Lux'], female: ['Aurora', 'Dawn'] },
  '조': { male: ['Ray', 'Sol'], female: ['Dawn', 'Aurora'] },

  // 물/강
  '수': { male: ['River', 'Wade'], female: ['Brook', 'Marina'] },
  '강': { male: ['River', 'Jordan'], female: ['Brook', 'River'] },
  '해': { male: ['Ocean', 'Dylan'], female: ['Marina', 'Coral'] },
  '바다': { male: ['Ocean', 'Dylan'], female: ['Marina', 'Coral'] },
  '천': { male: ['River', 'Jordan'], female: ['Brook', 'River'] },

  // 나무/꽃/자연
  '목': { male: ['Forest', 'Ash'], female: ['Ivy', 'Willow'] },
  '화': { male: ['Blaze', 'Ash'], female: ['Flora', 'Lily'] },
  '수목': { male: ['Forest', 'Ash'], female: ['Ivy', 'Willow'] },
  '꽃': { male: ['Florian'], female: ['Flora', 'Lily', 'Rose'] },
  '매': { male: ['Florian'], female: ['May', 'Flora'] },
  '란': { male: ['Florian'], female: ['Lily', 'Orchid'] },
  '영': { male: ['Florian'], female: ['Lily', 'Flora'] },
  '화초': { male: ['Florian'], female: ['Flora', 'Lily'] },
  '나무': { male: ['Forest', 'Ash'], female: ['Ivy', 'Willow'] },
  '숲': { male: ['Forest', 'Sylvan'], female: ['Sylvia', 'Ivy'] },
  '잎': { male: ['Leaf', 'Ash'], female: ['Ivy', 'Fern'] },
  '솔': { male: ['Sylvan', 'Forest'], female: ['Sylvia', 'Fern'] },

  // 지혜/총명
  '지': { male: ['Sage', 'Ethan'], female: ['Sophia', 'Sage'] },
  '혜': { male: ['Sage', 'Ethan'], female: ['Sophia', 'Sage'] },
  '명철': { male: ['Sage', 'Ethan'], female: ['Sophia', 'Clara'] },
  '총명': { male: ['Ethan', 'Sage'], female: ['Sophia', 'Clara'] },
  '슬기': { male: ['Sage', 'Ethan'], female: ['Sophia', 'Sage'] },
  '현명': { male: ['Sage', 'Ethan'], female: ['Sophia', 'Clara'] },
  '지혜': { male: ['Sage', 'Ethan'], female: ['Sophia', 'Sage'] },

  // 강함/용기
  '강직': { male: ['Ethan', 'Victor'], female: ['Valerie', 'Vivian'] },
  '용': { male: ['Drake', 'Victor'], female: ['Valerie', 'Vivian'] },
  '웅': { male: ['Victor', 'Ethan'], female: ['Valerie', 'Vivian'] },
  '용감': { male: ['Victor', 'Ethan'], female: ['Valerie', 'Vivian'] },
  '씩씩': { male: ['Victor', 'Ethan'], female: ['Valerie', 'Vivian'] },
  '굳셈': { male: ['Ethan', 'Victor'], female: ['Valerie', 'Vivian'] },

  // 아름다움
  '미': { male: ['Beau'], female: ['Bella', 'Amy', 'Grace'] },
  '아름': { male: ['Beau'], female: ['Bella', 'Amy'] },
  '예쁨': { male: ['Beau'], female: ['Bella', 'Amy'] },
  '수려': { male: ['Beau'], female: ['Bella', 'Amy'] },
  '아름다움': { male: ['Beau'], female: ['Bella', 'Amy', 'Grace'] },

  // 덕/인품
  '덕': { male: ['Benedict', 'Felix'], female: ['Grace', 'Felicity'] },
  '인': { male: ['Benedict', 'Felix'], female: ['Grace', 'Felicity'] },
  '선': { male: ['Felix', 'Benedict'], female: ['Grace', 'Felicity'] },
  '착함': { male: ['Felix', 'Benedict'], female: ['Grace', 'Felicity'] },
  '어질': { male: ['Felix', 'Benedict'], female: ['Grace', 'Felicity'] },

  // 하늘/별
  '하늘천': { male: ['Caelum', 'Sky'], female: ['Celeste', 'Skye'] },
  '하늘': { male: ['Sky', 'Caelum'], female: ['Celeste', 'Skye'] },
  '별': { male: ['Orion', 'Star'], female: ['Stella', 'Star'] },
  '성': { male: ['Orion', 'Star'], female: ['Stella', 'Star'] },
  '달': { male: ['Orion'], female: ['Luna', 'Diana'] },
  '태양': { male: ['Sol', 'Ray'], female: ['Soleil', 'Aurora'] },

  // 평화/화합
  '평화로움': { male: ['Oliver', 'Pax'], female: ['Olivia', 'Pax'] },
  '화합': { male: ['Oliver', 'Pax'], female: ['Olivia', 'Harmony'] },
  '평화': { male: ['Oliver', 'Pax'], female: ['Olivia', 'Harmony'] },
  '화목': { male: ['Oliver', 'Pax'], female: ['Olivia', 'Harmony'] },

  // 행복/기쁨
  '복': { male: ['Felix', 'Asher'], female: ['Felicity', 'Joy'] },
  '희': { male: ['Felix', 'Asher'], female: ['Joy', 'Felicity'] },
  '행복': { male: ['Felix', 'Asher'], female: ['Felicity', 'Joy'] },
  '기쁨': { male: ['Felix', 'Asher'], female: ['Joy', 'Felicity'] },

  // 성공/번영
  '성취': { male: ['Victor', 'Ethan'], female: ['Victoria', 'Vivian'] },
  '공': { male: ['Victor', 'Ethan'], female: ['Victoria', 'Vivian'] },
  '번영': { male: ['Prosper', 'Victor'], female: ['Prosperity', 'Victoria'] },
  '성공': { male: ['Victor', 'Ethan'], female: ['Victoria', 'Vivian'] },

  // 믿음/진실
  '신': { male: ['Ethan', 'Tristan'], female: ['Faith', 'Vera'] },
  '진': { male: ['Tristan', 'Ethan'], female: ['Vera', 'Faith'] },
  '믿음': { male: ['Ethan', 'Tristan'], female: ['Faith', 'Vera'] },
  '진실': { male: ['Tristan', 'Ethan'], female: ['Vera', 'Faith'] },

  // 사랑
  '애': { male: ['Aiden', 'Amor'], female: ['Amy', 'Amara'] },
  '사랑': { male: ['Aiden', 'Amor'], female: ['Amy', 'Amara'] },

  // 돌/보석
  '석': { male: ['Jasper', 'Flint'], female: ['Crystal', 'Jade'] },
  '옥': { male: ['Jasper'], female: ['Jade', 'Crystal'] },
  '금': { male: ['Jasper', 'Gold'], female: ['Goldie', 'Crystal'] },
  '은': { male: ['Silver'], female: ['Sylvia', 'Crystal'] },
  '보석': { male: ['Jasper'], female: ['Jade', 'Crystal'] },

  // 새/동물
  '봉': { male: ['Phoenix'], female: ['Phoenix', 'Faye'] },
  '학': { male: ['Crane'], female: ['Crane', 'Faye'] },
  '새조': { male: ['Robin'], female: ['Robin', 'Wren'] },

  // 산/땅
  '산악': { male: ['Monty', 'Rocky'], female: ['Sierra', 'Montana'] },
  '대지': { male: ['Rocky', 'Monty'], female: ['Sierra', 'Montana'] },
  '원': { male: ['Glen', 'Dale'], female: ['Dale', 'Glen'] },
};

// ──────────────────────────────────────────────
// 3. 발음 유사성 기반 영어 이름 데이터베이스
// ──────────────────────────────────────────────

/**
 * 한글 발음과 유사한 영어 이름 매핑
 * 형식: 로마자 발음 패턴 → { male, female }
 */
const PHONETIC_ENGLISH_NAMES: Array<{
  pattern: RegExp;
  male: string[];
  female: string[];
}> = [
  // ㅈ 계열 (j/ch 발음)
  { pattern: /^j/, male: ['Jason', 'James', 'Jacob', 'Julian'], female: ['Jane', 'Julia', 'Jasmine'] },
  { pattern: /^ch/, male: ['Charles', 'Chris', 'Chad'], female: ['Charlotte', 'Chloe', 'Chelsea'] },

  // ㅎ 계열 (h 발음)
  { pattern: /^h/, male: ['Henry', 'Harry', 'Hugo'], female: ['Hannah', 'Hazel', 'Holly'] },

  // ㄱ/ㅋ 계열 (g/k 발음)
  { pattern: /^g/, male: ['Gavin', 'Gabriel', 'Grant'], female: ['Grace', 'Gabrielle', 'Gwen'] },
  { pattern: /^k/, male: ['Kevin', 'Kyle', 'Keith'], female: ['Kate', 'Karen', 'Kelly'] },

  // ㄴ 계열 (n 발음)
  { pattern: /^n/, male: ['Nathan', 'Noah', 'Neil'], female: ['Nora', 'Natalie', 'Nina'] },

  // ㄷ/ㅌ 계열 (d/t 발음)
  { pattern: /^d/, male: ['David', 'Daniel', 'Dylan'], female: ['Diana', 'Dana', 'Daisy'] },
  { pattern: /^t/, male: ['Thomas', 'Tyler', 'Trevor'], female: ['Tara', 'Tiffany', 'Taylor'] },

  // ㄹ 계열 (r/l 발음)
  { pattern: /^r/, male: ['Ryan', 'Robert', 'Richard'], female: ['Rachel', 'Rose', 'Ruby'] },
  { pattern: /^l/, male: ['Lucas', 'Leo', 'Liam'], female: ['Laura', 'Lily', 'Luna'] },

  // ㅁ/ㅂ/ㅍ 계열 (m/b/p 발음)
  { pattern: /^m/, male: ['Michael', 'Mark', 'Mason'], female: ['Mia', 'Maya', 'Morgan'] },
  { pattern: /^b/, male: ['Brian', 'Blake', 'Ben'], female: ['Bella', 'Brooke', 'Brenda'] },
  { pattern: /^p/, male: ['Patrick', 'Paul', 'Peter'], female: ['Patricia', 'Paula', 'Penelope'] },

  // ㅅ 계열 (s 발음)
  { pattern: /^s/, male: ['Samuel', 'Sean', 'Simon'], female: ['Sarah', 'Sophia', 'Stella'] },

  // ㅇ 계열 (a/e/i/o/u 모음 시작)
  { pattern: /^a/, male: ['Aaron', 'Adam', 'Aiden'], female: ['Amy', 'Alice', 'Anna'] },
  { pattern: /^e/, male: ['Ethan', 'Eric', 'Evan'], female: ['Emma', 'Emily', 'Eva'] },
  { pattern: /^i/, male: ['Ian', 'Ivan'], female: ['Iris', 'Ivy', 'Isabel'] },
  { pattern: /^o/, male: ['Oliver', 'Oscar', 'Owen'], female: ['Olivia', 'Ophelia'] },
  { pattern: /^u/, male: ['Ulysses'], female: ['Uma', 'Ursula'] },
  { pattern: /^y/, male: ['Yohan', 'Yul'], female: ['Yuna', 'Yuna'] },
];

// ──────────────────────────────────────────────
// 4. 성별별 인기 영어 이름 (Fallback)
// ──────────────────────────────────────────────

const POPULAR_ENGLISH_NAMES = {
  male: [
    'Ethan', 'Noah', 'Liam', 'Lucas', 'Oliver', 'Elijah', 'James',
    'Aiden', 'Logan', 'Mason', 'Ryan', 'Nathan', 'Dylan', 'Leo',
    'Julian', 'Adrian', 'Felix', 'Victor', 'Sebastian', 'Dominic',
  ],
  female: [
    'Emma', 'Olivia', 'Sophia', 'Ava', 'Isabella', 'Mia', 'Luna',
    'Lily', 'Grace', 'Chloe', 'Aria', 'Stella', 'Aurora', 'Zoe',
    'Natalie', 'Claire', 'Violet', 'Maya', 'Elena', 'Serena',
  ],
};

// ──────────────────────────────────────────────
// 5. 메인 영어 이름 추천 함수
// ──────────────────────────────────────────────

export interface EnglishNameSuggestion {
  /** 추천 영어 이름 */
  name: string;
  /** 추천 근거 */
  reason: '의미 기반' | '발음 기반' | '인기 이름';
  /** 연관 키워드 (의미 기반일 때) */
  keyword?: string;
}

/**
 * 한글 이름과 한자 의미를 기반으로 영어 이름을 추천
 *
 * 전략: 이름 두 글자를 각각 개별 분석하여 글자마다 다른 영어 이름 후보를 도출,
 * 조합하여 이름별로 고유한 추천 결과를 제공합니다.
 *
 * @param hangulName  이름 한글 (예: "지현") — 두 글자
 * @param meanings    이름 한자들의 의미 배열 (예: ["지혜 지", "어질 현"])
 * @param gender      성별
 * @param maxResults  최대 추천 수 (기본: 3)
 */
export function suggestEnglishNames(
  hangulName: string,
  meanings: string[],
  gender: 'male' | 'female',
  maxResults = 3
): EnglishNameSuggestion[] {
  const suggestions: EnglishNameSuggestion[] = [];
  const usedNames = new Set<string>();

  // 이름 두 글자를 각각 개별 분석
  const chars = Array.from(hangulName); // 예: ['지', '현']

  // 각 글자별로 의미 기반 + 발음 기반 후보 수집
  const perCharCandidates: EnglishNameSuggestion[][] = chars.map((char, idx) => {
    const charCandidates: EnglishNameSuggestion[] = [];
    const charUsed = new Set<string>();
    const meaning = meanings[idx] ?? '';

    // 1순위: 해당 글자의 한자 의미 기반 매칭
    for (const [keyword, names] of Object.entries(MEANING_TO_ENGLISH)) {
      if (meaning.includes(keyword)) {
        const nameList = names[gender];
        for (const name of nameList) {
          if (!charUsed.has(name)) {
            charCandidates.push({ name, reason: '의미 기반', keyword });
            charUsed.add(name);
            if (charCandidates.length >= 4) break;
          }
        }
        if (charCandidates.length >= 4) break;
      }
    }

    // 2순위: 해당 글자의 발음 기반 매칭
    if (charCandidates.length < 4) {
      const roman = hangulToRoman(char).toLowerCase();
      for (const { pattern, male, female } of PHONETIC_ENGLISH_NAMES) {
        if (pattern.test(roman)) {
          const nameList = gender === 'male' ? male : female;
          for (const name of nameList) {
            if (!charUsed.has(name)) {
              charCandidates.push({ name, reason: '발음 기반' });
              charUsed.add(name);
              if (charCandidates.length >= 4) break;
            }
          }
          if (charCandidates.length >= 4) break;
        }
      }
    }

    return charCandidates;
  });

  // 글자1 후보 → 글자2 후보 순으로 번갈아 채우기 (다양성 확보)
  const maxPerChar = Math.ceil(maxResults / chars.length);
  for (let i = 0; i < maxPerChar; i++) {
    for (const charCandidates of perCharCandidates) {
      if (suggestions.length >= maxResults) break;
      const candidate = charCandidates[i];
      if (candidate && !usedNames.has(candidate.name)) {
        suggestions.push(candidate);
        usedNames.add(candidate.name);
      }
    }
  }

  // 부족분은 전체 이름 발음 기반으로 보충
  if (suggestions.length < maxResults) {
    const roman = hangulToRoman(hangulName).toLowerCase();
    for (const { pattern, male, female } of PHONETIC_ENGLISH_NAMES) {
      if (pattern.test(roman)) {
        const nameList = gender === 'male' ? male : female;
        for (const name of nameList) {
          if (!usedNames.has(name)) {
            suggestions.push({ name, reason: '발음 기반' });
            usedNames.add(name);
            if (suggestions.length >= maxResults) break;
          }
        }
        if (suggestions.length >= maxResults) break;
      }
    }
  }

  // 최종 fallback: 인기 이름
  if (suggestions.length < maxResults) {
    const roman = hangulToRoman(hangulName).toLowerCase();
    const popularList = POPULAR_ENGLISH_NAMES[gender];
    const firstRoman = roman.charAt(0);
    const sorted = [
      ...popularList.filter(n => n.toLowerCase().startsWith(firstRoman)),
      ...popularList.filter(n => !n.toLowerCase().startsWith(firstRoman)),
    ];
    for (const name of sorted) {
      if (!usedNames.has(name)) {
        suggestions.push({ name, reason: '인기 이름' });
        usedNames.add(name);
        if (suggestions.length >= maxResults) break;
      }
    }
  }

  return suggestions;
}
