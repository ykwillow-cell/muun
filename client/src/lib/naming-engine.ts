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
// 0. 빈출 이름 한자 가중치 테이블
// ──────────────────────────────────────────────
/**
 * 통계청·대법원 출생신고 인기 이름 상위 500개에서 추출한 빈출 한자 가중치
 *
 * 기준: 2020~2026년 신생아 이름 순위 누적 빈도
 * - 가중치 10: 최상위 빈출 (도윤·이준·서아 등 TOP 10 한자)
 * - 가중치 8: 상위 빈출 (TOP 20~50)
 * - 가중치 5: 중간 빈출 (TOP 50~100)
 * - 가중치 3: 하위 빈출 (TOP 100~200)
 * - 가중치 0: 미등재 (일반 한자)
 *
 * 한자(유니코드) → 가중치 점수
 */
export const POPULAR_HANJA_WEIGHT: Record<string, number> = {
  // ── 남아 TOP 이름 한자 ──
  // 도윤(道允): 道=길 도, 允=진실 윤
  '道': 10, '允': 10,
  // 이준(李俊/以俊): 俊=준수할 준
  '俊': 10,
  // 하준(夏俊/河俊): 夏=클 하, 河=강 하
  '夏': 9, '河': 9,
  // 시우(始宇/時宇): 始=처음 시, 宇=집 우, 時=때 시
  '始': 9, '宇': 10, '時': 8,
  // 태오(太吾/太悟): 太=클 태, 吾=나 오, 悟=깨달을 오
  '太': 9, '吾': 8, '悟': 8,
  // 도현(道賢/道鉉): 賢=어질 현, 鉉=솥귀 현
  '賢': 10, '鉉': 8,
  // 도하(道河): 이미 道, 河 등재
  // 은우(恩宇/恩祐): 恩=은혜 은, 祐=도울 우
  '恩': 10, '祐': 9,
  // 이안(以安/伊安): 安=편안할 안, 以=써 이, 伊=저 이
  '安': 10, '以': 7, '伊': 8,
  // 선우(善宇/善祐): 善=착할 선
  '善': 9,
  // 서준(書俊/瑞俊): 書=글 서, 瑞=상서로울 서
  '書': 9, '瑞': 10,
  // 이현(以賢/利賢): 이미 賢 등재
  // 수호(守護/秀浩): 守=지킬 수, 護=보호할 호, 秀=빼어날 수, 浩=넓을 호
  '守': 8, '護': 7, '秀': 9, '浩': 9,
  // 지호(智浩/知浩): 智=슬기 지, 知=알 지
  '智': 10, '知': 8,
  // 은호(恩浩): 이미 恩, 浩 등재
  // 우주(宇宙): 宙=하늘 주
  '宙': 8,
  // 윤우(潤宇): 潤=윤택할 윤
  '潤': 10,
  // 주원(周元/周源): 周=두루 주, 元=으뜸 원, 源=근원 원
  '周': 8, '元': 9, '源': 8,
  // 유준(有俊/裕俊): 有=있을 유, 裕=넉넉할 유
  '有': 7, '裕': 8,
  // 시윤(時允/詩允): 詩=시 시
  '詩': 8,
  // 준서(俊瑞/俊書): 이미 俊, 瑞, 書 등재
  // 현우(賢宇/賢祐): 이미 賢, 宇, 祐 등재
  // 지훈(智勳/知勳): 勳=공 훈
  '勳': 8,
  // 민준(敏俊/旻俊): 敏=민첩할 민, 旻=하늘 민
  '敏': 8, '旻': 8,
  // 지우(智宇/知宇): 이미 등재
  // 서윤(書允/瑞允): 이미 등재
  // 예준(睿俊): 睿=밝을 예
  '睿': 9,
  // 태양(太陽): 陽=볕 양
  '陽': 8,
  // 이서(以書/怡書): 怡=기쁠 이
  '怡': 8,
  // 준혁(俊赫): 赫=빛날 혁
  '赫': 8,
  // 지안(智安/知安): 이미 등재
  // 하린(夏潾/河潾): 潾=맑을 린
  '潾': 7,
  // 우진(宇珍/祐珍): 珍=보배 진
  '珍': 8,
  // 이호(以浩/怡浩): 이미 등재
  // 민서(敏書/旻書): 이미 등재
  // 태현(太賢/太鉉): 이미 등재
  // 준우(俊宇/俊祐): 이미 등재
  // 지현(智賢/知賢): 이미 등재
  // 재원(在元/在源): 在=있을 재
  '在': 7,
  // 성준(成俊/聖俊): 成=이룰 성, 聖=성스러울 성
  '成': 8, '聖': 8,
  // 태민(太敏/太旻): 이미 등재
  // 이준(以俊): 이미 등재
  // 현준(賢俊): 이미 등재
  // 우혁(宇赫): 이미 등재

  // ── 여아 TOP 이름 한자 ──
  // 서아(瑞雅/書雅): 雅=우아할 아
  '雅': 10,
  // 이서(怡書): 이미 등재
  // 하린(夏潾): 이미 등재
  // 서윤(瑞允/書允): 이미 등재
  // 지안(智安): 이미 등재
  // 하윤(夏允/河允): 이미 등재
  // 아린(雅潾): 이미 등재
  // 지유(智柔/知柔): 柔=부드러울 유
  '柔': 9,
  // 아윤(雅允): 이미 등재
  // 시아(詩雅): 이미 등재
  // 지아(智雅/知雅): 이미 등재
  // 지우(智宇): 이미 등재
  // 채이(彩怡): 彩=채색 채
  '彩': 9,
  // 윤서(允書/潤書): 이미 등재
  // 유나(有娜/裕娜): 娜=아름다울 나
  '娜': 8,
  // 채아(彩雅): 이미 등재
  // 수아(秀雅): 이미 등재
  // 서하(瑞夏/書夏): 이미 등재
  // 지윤(智允/知允): 이미 등재
  // 나은(娜恩): 이미 등재
  // 예린(睿潾): 이미 등재
  // 하은(夏恩/河恩): 이미 등재
  // 서연(瑞然/書然): 然=그러할 연
  '然': 8,
  // 유진(有珍/裕珍): 이미 등재
  // 지수(智秀/知秀): 이미 등재
  // 예은(睿恩): 이미 등재
  // 아현(雅賢): 이미 등재
  // 서현(瑞賢/書賢): 이미 등재
  // 나현(娜賢): 이미 등재
  // 하영(夏英): 英=꽃부리 영
  '英': 8,
  // 지은(智恩/知恩): 이미 등재
  // 아영(雅英): 이미 등재
  // 서은(瑞恩/書恩): 이미 등재
  // 유은(有恩/裕恩): 이미 등재
  // 하나(夏娜/河娜): 이미 등재
  // 서진(瑞珍/書珍): 이미 등재
  // 예나(睿娜): 이미 등재
  // 지나(智娜/知娜): 이미 등재
  // 아나(雅娜): 이미 등재
  // 유아(有雅/裕雅): 이미 등재
  // 하아(夏雅/河雅): 이미 등재

  // ── 추가 빈출 한자 (TOP 100~200 이름에서 자주 등장) ──
  '準': 7,  // 준수할 준 (俊의 이체자)
  '峻': 7,  // 높을 준
  '晙': 6,  // 밝을 준
  '埈': 6,  // 높을 준
  '鎭': 7,  // 진압할 진
  '振': 7,  // 떨칠 진
  '眞': 8,  // 참 진
  '炫': 8,  // 빛날 현
  '玹': 7,  // 옥빛 현
  '泫': 6,  // 눈물 현
  '熙': 8,  // 빛날 희
  '希': 8,  // 바랄 희
  '喜': 7,  // 기쁠 희
  '昊': 9,  // 하늘 호
  '皓': 8,  // 밝을 호
  '澔': 7,  // 넓을 호
  '湖': 7,  // 호수 호
  '浚': 7,  // 깊을 준
  '俐': 6,  // 영리할 리
  '利': 7,  // 이로울 리
  '李': 5,  // 오얏 리 (성씨 한자)
  '林': 5,  // 수풀 림 (성씨 한자)
  '理': 7,  // 다스릴 리
  '梨': 6,  // 배나무 리
  '璃': 7,  // 유리 리
  '里': 5,  // 마을 리
  '離': 4,  // 떠날 리
  '仁': 9,  // 어질 인
  '寅': 7,  // 범 인
  '民': 8,  // 백성 민
  '旼': 8,  // 온화할 민
  '珉': 7,  // 옥돌 민
  '閔': 6,  // 근심할 민
  '玟': 7,  // 옥빛 민
  '彬': 8,  // 빛날 빈
  '斌': 7,  // 빛날 빈
  '賓': 6,  // 손님 빈
  '彦': 8,  // 선비 언
  '燕': 7,  // 제비 연
  '涓': 7,  // 물 연
  '妍': 8,  // 고울 연
  '娟': 7,  // 예쁠 연
  '蓮': 7,  // 연꽃 련
  '連': 6,  // 이을 련
  '延': 7,  // 늘일 연
  '研': 6,  // 갈 연
  '鉛': 4,  // 납 연
  '悅': 8,  // 기쁠 열
  '烈': 7,  // 세찰 렬
  '熱': 5,  // 더울 열
  '曄': 7,  // 빛날 엽
  '葉': 6,  // 잎 엽
  '映': 8,  // 비출 영
  '瑛': 8,  // 옥빛 영
  '泳': 7,  // 헤엄칠 영
  '永': 8,  // 길 영
  '榮': 7,  // 영화 영
  '寧': 8,  // 편안할 녕
  '玲': 8,  // 옥소리 령
  '伶': 7,  // 영리할 령
  '嶺': 6,  // 고개 령
  '齡': 5,  // 나이 령
  '澄': 8,  // 맑을 징
  '澈': 8,  // 맑을 철
  '哲': 9,  // 밝을 철
  '喆': 8,  // 밝을 철
  '徹': 7,  // 통할 철
  '燦': 8,  // 빛날 찬
  '璨': 7,  // 옥빛 찬
  '贊': 7,  // 도울 찬
  '讚': 6,  // 기릴 찬
  '昌': 8,  // 번성할 창
  '彰': 7,  // 드러날 창
  '暢': 7,  // 통할 창
  '蒼': 7,  // 푸를 창
  '倉': 6,  // 곳집 창
  '宰': 7,  // 재상 재
  '才': 8,  // 재주 재
  '財': 7,  // 재물 재
  '載': 7,  // 실을 재
  '宗': 7,  // 마루 종
  '鍾': 7,  // 쇠북 종
  '鐘': 6,  // 쇠북 종
  '鎬': 7,  // 호경 호
  '鎔': 7,  // 녹일 용
  '龍': 7,  // 용 룡
  '勇': 8,  // 날랠 용
  '容': 7,  // 얼굴 용
  '鏞': 6,  // 큰 종 용
  '庸': 5,  // 평범할 용
  '佑': 9,  // 도울 우
  '禹': 7,  // 우임금 우
  '雨': 7,  // 비 우
  '羽': 6,  // 깃 우
  '遇': 6,  // 만날 우
  '虞': 5,  // 헤아릴 우
  '旭': 8,  // 아침 해 욱
  '昱': 8,  // 빛날 욱
  '煜': 7,  // 빛날 욱
  '郁': 7,  // 향기로울 욱
  '彧': 7,  // 빛날 욱
  '勖': 6,  // 힘쓸 욱
  '翼': 8,  // 날개 익
  '益': 7,  // 더할 익
  '翊': 7,  // 도울 익
  '一': 5,  // 한 일
  '逸': 7,  // 편안할 일
  '日': 5,  // 날 일
  '壹': 6,  // 하나 일
  '任': 5,  // 맡길 임
  '姙': 6,  // 아이밸 임
  '壬': 5,  // 임금 임
  '賃': 4,  // 품삯 임
  '子': 5,  // 아들 자
  '慈': 7,  // 사랑 자
  '滋': 7,  // 불을 자
  '姿': 7,  // 모양 자
  '紫': 7,  // 자주빛 자
  '磁': 6,  // 자석 자
  '雌': 5,  // 암컷 자
  '藏': 5,  // 감출 장
  '長': 5,  // 길 장
  '壯': 6,  // 씩씩할 장
  '章': 7,  // 글 장
  '莊': 7,  // 씩씩할 장
  '正': 7,  // 바를 정
  '貞': 7,  // 곧을 정
  '靜': 8,  // 고요할 정
  '晶': 8,  // 밝을 정
  '晸': 7,  // 밝을 정
  '楨': 7,  // 기둥 정
  '禎': 8,  // 상서로울 정
  '珽': 7,  // 옥홀 정
  '廷': 7,  // 조정 정
  '庭': 7,  // 뜰 정
  '亭': 7,  // 정자 정
  '丁': 5,  // 넷째 천간 정
  '情': 7,  // 뜻 정
  '精': 7,  // 정밀할 정
  '淨': 7,  // 깨끗할 정
  '鄭': 5,  // 나라 정 (성씨)
  '悰': 6,  // 즐거울 종
  '進': 7,  // 나아갈 진
  '晉': 7,  // 나아갈 진
  '秦': 5,  // 나라 진 (성씨)
  '璡': 6,  // 옥 진
  '縝': 6,  // 촘촘할 진
  '瑨': 7,  // 옥 진
  '蔘': 5,  // 인삼 삼
  '三': 4,  // 석 삼
  '森': 6,  // 빽빽할 삼
  '相': 7,  // 서로 상
  '祥': 8,  // 상서로울 상
  '尙': 7,  // 오히려 상
  '常': 7,  // 항상 상
  '商': 6,  // 장사 상
  '想': 7,  // 생각 상
  '翔': 8,  // 날 상
  '霜': 6,  // 서리 상
  '爽': 7,  // 시원할 상
  '尚': 7,  // 오히려 상
  '象': 6,  // 코끼리 상
  '詳': 7,  // 자세할 상
  '床': 5,  // 평상 상
  '賞': 6,  // 상줄 상
  '桑': 6,  // 뽕나무 상
  '晟': 9,  // 밝을 성
  '星': 8,  // 별 성
  '誠': 8,  // 정성 성
  '聲': 7,  // 소리 성
  '盛': 7,  // 성할 성
  '城': 7,  // 성 성
  '省': 6,  // 살필 성
  '性': 7,  // 성품 성
  '姓': 5,  // 성씨 성
  '昇': 8,  // 오를 승
  '承': 7,  // 이을 승
  '乘': 6,  // 탈 승
  '升': 5,  // 되 승
  '勝': 7,  // 이길 승
  '丞': 6,  // 도울 승
  '施': 7,  // 베풀 시
  '示': 5,  // 보일 시
  '視': 6,  // 볼 시
  '侍': 6,  // 모실 시
  '矢': 5,  // 화살 시
  '信': 8,  // 믿을 신
  '新': 7,  // 새 신
  '愼': 7,  // 삼갈 신
  '晨': 8,  // 새벽 신
  '辛': 5,  // 매울 신 (성씨)
  '申': 5,  // 납 신 (성씨)
  '神': 7,  // 귀신 신
  '臣': 5,  // 신하 신
  '心': 5,  // 마음 심
  '深': 7,  // 깊을 심
  '沁': 7,  // 스밀 심
  '尋': 6,  // 찾을 심
  '審': 6,  // 살필 심
  '芯': 7,  // 심지 심
  '아': 0,  // 한글 전용 이름 (한자 없음)
};

/**
 * 한자의 빈출 가중치를 반환합니다.
 * @param hanja 한자 문자
 * @returns 가중치 (0~10, 미등재 시 0)
 */
export function getPopularityWeight(hanja: string): number {
  return POPULAR_HANJA_WEIGHT[hanja] ?? 0;
}

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
// 3-1. 이름에 쓰면 안 되는 한자 블랙리스트
// ──────────────────────────────────────────────

/**
 * 이름에 사용을 금지하는 한자 블랙리스트
 *
 * 분류 기준:
 * A. 신체 부위 / 생리 관련: 이름에 쓰면 천박하거나 부정적 인상을 줌
 * B. 식물 (꽃·열매·채소 제외 일반 식물): 이름에 쓰기엔 어색한 식물 명칭
 * C. 동물 (용·봉황 등 상서로운 동물 제외): 이름에 쓰기엔 어색한 동물 명칭
 * D. 부정적 뜻 (찢다·썩다·죽다 등): 의미 자체가 불길하거나 불쾌함
 * E. 포도·과실류 등 특정 식물 명칭: 이름에 쓰기엔 어색한 과실 명칭
 *
 * ※ 수리(획수)가 맞더라도 이 목록에 포함된 한자는 후보에서 제외합니다.
 */
export const HANJA_BLACKLIST = new Set<string>([
  // ── A. 신체 부위 / 생리 관련 ──
  '骨', // 뼈 골
  '髅', // 돈지뼈 해
  '骸', // 뼈 해 (이체자)
  '骼', // 뼈 격
  '髑', // 해골 독
  '髏', // 해골 루
  '腸', // 창자 장
  '胃', // 위 위
  '膽', // 쓸개 담
  '肛', // 항문 항
  '屎', // 똥 시
  '尿', // 오줌 뇠
  '臭', // 냄새 취
  '垃', // 쓰레기 라 (垃圾의 앞 글자, 이름에 부적절)
  '垒', // 보루 루 (이름에 쓰이는 예가 없음)
  '垢', // 때 구 (때를 뜻함, 이름에 부적절)
  '汗', // 땀 한 (이름 용도로 부적절)
  '膿', // 고름 농
  '痰', // 가래 담
  '痢', // 이질 리
  '瘡', // 부스럼 창
  '疥', // 옰 개
  '癩', // 문둥병 라
  '癬', // 버짐 선
  '疣', // 사마귀 우
  '疽', // 종기 저
  '癰', // 종기 옹
  '痔', // 치질 치
  '疝', // 산증 산
  '瘻', // 누공 루
  '屍', // 시체 시
  '尸', // 주검 시
  '殍', // 굶어죽을 표
  '殣', // 굶어죽을 근

  // ── B. 부정적 뜻 (찢다·썩다·죽다·해치다 등) ──
  '裂', // 찢을 렬
  '裡', // 속 리 (裏의 이체자, 이름에 부적절)
  '裏', // 속 리 (이름에 부적절)
  '腐', // 썩을 부
  '朽', // 썩을 후
  '爛', // 썩을 란
  '潰', // 무너질 궤
  '崩', // 무너질 붕
  '壞', // 무너질 괴
  '毁', // 헐 훼
  '毀', // 헐 훼
  '滅', // 멸할 멸
  '亡', // 망할 망
  '殺', // 죽일 살
  '弑', // 죽일 시
  '戮', // 죽일 륙
  '斬', // 벨 참
  '刑', // 형벌 형
  '罰', // 벌 벌
  '束', // 묶을 속
  '縛', // 묶을 박
  '桎', // 차꼬 질
  '梏', // 차꼬 곡
  '囚', // 가둘 수
  '獄', // 감옥 옥
  '奴', // 종 노
  '婢', // 계집종 비
  '賤', // 천할 천
  '卑', // 낮을 비 (비하 의미)
  '鄙', // 더러울 비
  '穢', // 더러울 예
  '汚', // 더러울 오
  '污', // 더러울 오 (이체자)
  '濁', // 흐릴 탁
  '毒', // 독 독
  '鴆', // 독새 짐
  '蠱', // 독충 고
  '禍', // 재앙 화
  '殃', // 재앙 앙
  '災', // 재앙 재
  '厄', // 재앙 액
  '凶', // 흉할 흉
  '惡', // 악할 악
  '邪', // 간사할 사
  '妖', // 요사할 요
  '魔', // 마귀 마
  '鬼', // 귀신 귀
  '魑', // 도깨비 리
  '魅', // 도깨비 매
  '魍', // 도깨비 망
  '魎', // 도깨비 량
  '怨', // 원망할 원
  '恨', // 한 한
  '悲', // 슬플 비
  '哀', // 슬플 애
  '悼', // 슬플 도
  '泣', // 울 읍
  '哭', // 울 곡
  '苦', // 쓸 고
  '痛', // 아플 통
  '病', // 병 병
  '疾', // 병 질
  '患', // 근심 환
  '憂', // 근심 우
  '愁', // 근심 수
  '悶', // 답답할 민
  '懼', // 두려울 구
  '恐', // 두려울 공
  '怖', // 두려울 포
  '驚', // 놀랄 경
  '懼', // 두려울 구 (이체자)
  '貧', // 가난할 빈
  '窮', // 궁할 궁
  '困', // 곤할 곤
  '乏', // 모자랄 핍
  '飢', // 주릴 기
  '餓', // 굶을 아
  '離', // 떠날 리 (이별 의미)
  '別', // 이별 별 (이별 의미)
  '孤', // 외로울 고
  '獨', // 홀로 독
  '寡', // 과부 과
  '鰥', // 홀아비 환
  '喪', // 잃을 상
  '失', // 잃을 실
  '敗', // 패할 패
  '挫', // 꺾일 좌
  '頹', // 무너질 퇴
  '落', // 떨어질 락 (이름에 부적절)
  '墜', // 떨어질 추
  '沈', // 가라앉을 침 (이름에 부적절, 성씨 沈은 예외이나 이름 글자로는 부적절)
  '溺', // 빠질 닉
  '陷', // 빠질 함
  '迷', // 미혹할 미
  '惑', // 미혹할 혹
  '狂', // 미칠 광
  '癲', // 미칠 전
  '癡', // 어리석을 치
  '愚', // 어리석을 우
  '拙', // 졸렬할 졸
  '劣', // 못할 렬
  '弱', // 약할 약 (이름에 부적절)
  '殘', // 잔인할 잔
  '忍', // 참을 인 (잔인 의미 포함)
  '暴', // 사나울 폭
  '猛', // 사나울 맹 (이름에 부적절)
  '獰', // 사나울 녕
  '兇', // 흉악할 흉
  '悍', // 사나울 한
  '戾', // 어그러질 려
  '乖', // 어그러질 괴
  '逆', // 거스를 역
  '叛', // 배반할 반
  '謀', // 꾀할 모 (음모 의미)
  '詐', // 속일 사
  '欺', // 속일 기
  '僞', // 거짓 위
  '虛', // 빌 허 (이름에 부적절)
  '幻', // 허깨비 환
  '夢', // 꿈 몽 (이름에 부적절)
  '影', // 그림자 영 (이름에 부적절)
  '暗', // 어두울 암
  '晦', // 어두울 회
  '冥', // 어두울 명
  '幽', // 그윽할 유 (어둠 의미)
  '陰', // 음 음 (부정적 의미)
  '鬱', // 답답할 울
  '沮', // 막힐 저
  '阻', // 막힐 조
  '滯', // 막힐 체
  '塞', // 막힐 색
  '窒', // 막힐 질
  '閉', // 닫힐 폐
  '廢', // 폐할 폐
  '棄', // 버릴 기
  '捨', // 버릴 사
  '遺', // 버릴 유 (유기 의미)
  '忘', // 잊을 망
  '滅', // 멸할 멸 (이체자)
  '絶', // 끊을 절
  '斷', // 끊을 단
  '截', // 끊을 절
  '割', // 벨 할
  '剖', // 쪼갤 부
  '劈', // 쪼갤 벽
  '碎', // 부술 쇄
  '破', // 깨뜨릴 파
  '毁', // 헐 훼 (이체자)
  '傷', // 다칠 상
  '損', // 손상할 손
  '害', // 해칠 해
  '傷', // 다칠 상 (이체자)
  '刺', // 찌를 자
  '刃', // 칼날 인
  '刀', // 칼 도 (이름에 부적절)
  '劍', // 칼 검 (이름에 부적절)
  '矛', // 창 모
  '戈', // 창 과
  '弓', // 활 궁 (이름에 부적절)
  '箭', // 화살 전
  '炸', // 터질 작
  '爆', // 터질 폭
  '燒', // 불사를 소
  '焚', // 불사를 분
  '焦', // 탈 초 (이름에 부적절)
  '灰', // 재 회 (이름에 부적절)

  // ── C. 식물 (이름에 쓰기 어색한 식물 명칭) ──
  //
  // │ 제외 기준: 이름에 실제로 쓰이는 꽃·나무 한자는 블랙리스트에서 제외합니다.
  // │ 이름에 자주 쓰이는 꽃·나무 한자 예시 (블랙리스트 미포함):
  // │   梅(매화), 蓮(난), 菊(국화), 蓮(련/연꽃), 桂(계수), 楓(동), 楓(풍),
  // │   菁(청), 梅(매화), 桦(복숭아), 樱(앙두), 柳(버등), 桂(계피), 桂(계피),
  // │   菳(마름), 芙(부용), 芙(부용), 華(화), 苳(링), 艹(당), 艹(당)
  // │
  // │ 블랙리스트에 넣는 기준: 이름에 절대 쓰지 않는 식물만 포함
  // │   - 이끼·해조류: 이름에 쓰이는 예가 없음
  // │   - 버섯류: 이름에 쓰이는 예가 없음
  // │   - 잡초·해초 (쑥·명아주·엉겅퀴 등): 이름에 쓰이는 예가 없음
  // │   - 덩굴류 (덩굴·등나무): 이름에 쓰이는 예가 없음
  // │   - 가시류 (가시·남가새): 이름에 쓰이는 예가 없음
  // │   - 피·그루터기: 이름에 쓰이는 예가 없음
  // │   - 시들다·마르다: 부정적 의미로 이름에 부적절

  '葡', // 포도 포 (葡萄의 앞 글자) — 포도를 뜻하는 복합어 전용, 독립적 이름 사용 불가
  '萄', // 포도 독 (葡萄의 뒷 글자) — 동일
  '苔', // 이끼 태 — 이끼를 뜻함, 이름에 쓰이는 예가 없음
  '藻', // 해조 조 — 해조를 뜻함, 이름에 쓰이는 예가 없음
  '蘚', // 이끼 선 — 이끼를 뜻함, 이름에 쓰이는 예가 없음
  '菌', // 버섯 균 — 버섯를 뜻함, 이름에 쓰이는 예가 없음
  '蕈', // 버섯 심 — 버섯를 뜻함, 이름에 쓰이는 예가 없음
  '藜', // 명아주 려 — 잡초를 뜻함, 이름에 쓰이는 예가 없음
  '蓬', // 쑥 봉 — 쑥를 뜻함, 이름에 쓰이는 예가 없음
  '蒿', // 쑥 호 — 쑥를 뜻함, 이름에 쓰이는 예가 없음
  '薊', // 엉겅퀴 계 — 잡초를 뜻함, 이름에 쓰이는 예가 없음
  // '葛' 칡 갈 — 제외: 葛를 성씨로 쓰기도 하며, 葛색(葛色)의 의미로 이름에 쓰이는 예가 있음
  '蔓', // 덩굴 만 — 덩굴를 뜻함, 이름에 쓰이는 예가 없음
  '藤', // 등나무 등 — 등나무를 뜻함, 이름에 쓰이는 예가 없음
  '棘', // 가시 극 — 가시를 뜻함, 이름에 쓰이는 예가 없음
  '荊', // 가시 형 — 가시를 뜻함, 이름에 쓰이는 예가 없음
  '蒺', // 남가새 질 — 잡초를 뜻함, 이름에 쓰이는 예가 없음
  '莠', // 강아지풀 유 — 잡초를 뜻함, 이름에 쓰이는 예가 없음
  '稗', // 피 패 — 피를 뜻함, 이름에 쓰이는 예가 없음
  '蘖', // 그루터기 얼 — 그루터기를 뜻함, 이름에 쓰이는 예가 없음
  '枯', // 마를 고 — 마르다를 뜻함, 이름에 부적절
  '槁', // 마를 고 — 마르다를 뜻함, 이름에 부적절
  '萎', // 시들 위 — 시들다를 뜻함, 이름에 부적절
  '凋', // 시들 조 — 시들다를 뜻함, 이름에 부적절
  // '腐' 썩을 부 — B 카테고리(부정적 뜻)에서 이미 정의됨, 여기서는 중복 제거

  // ── D. 동물 (이름에 쓰기 어색한 동물 명칭) ──
  '蛆', // 구더기 저
  '蛆', // 구더기 저 (이체자)
  '蛆', // 구더기
  '蚤', // 벼룩 조
  '蝨', // 이 슬
  '蚊', // 모기 문
  '蠅', // 파리 승
  '蟑', // 바퀴벌레 장
  '蟲', // 벌레 충 (이름에 부적절)
  '蛇', // 뱀 사
  '蝮', // 독사 복
  '蠍', // 전갈 갈
  '蜘', // 거미 지
  '蛛', // 거미 주
  '蟾', // 두꺼비 섬
  '蛤', // 조개 합 (이름에 부적절)
  '蛙', // 개구리 와
  '蟾', // 두꺼비 섬 (이체자)
  '鼠', // 쥐 서
  '豕', // 돼지 시
  '豬', // 돼지 저
  '猪', // 돼지 저 (이체자)
  '狐', // 여우 호 (이름에 부적절)
  '狼', // 이리 랑
  '豺', // 승냥이 시
  '獾', // 오소리 환
  '貂', // 담비 초 (이름에 부적절)
  '鼬', // 족제비 유
  '蝙', // 박쥐 편
  '蝠', // 박쥐 복 (이름에 부적절)
  '鴉', // 까마귀 아
  '鴟', // 솔개 치
  '鷲', // 독수리 취 (이름에 부적절)
  '鷹', // 매 응 (이름에 부적절)
  '梟', // 올빼미 효
  '鴞', // 올빼미 효 (이체자)
  '蟒', // 왕뱀 망
  '蜥', // 도마뱀 석
  '蜴', // 도마뱀 역
  '鱷', // 악어 악
  '鯊', // 상어 사
]);

/**
 * 한자가 블랙리스트에 포함되어 있는지 확인
 * @param hanja 검사할 한자 문자
 * @returns 블랙리스트에 있으면 true
 */
export function isBlacklistedHanja(hanja: string): boolean {
  return HANJA_BLACKLIST.has(hanja);
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
  /**
   * 적합도 점수 (0~100, 소수점 1자리)
   * 계산 기준:
   * - 4격 모두 길수 충족: 기본 70점
   * - 음운 점수 반영: phoneticScore.score * 0.3
   * - 오행 보완 한자 포함 여부: +5점
   * - 최종 범위: 0~100
   */
  fitnessScore: number;
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
 * 신구조 첫 글자 후보 풀 × 두 번째 글자 후보 풀 → 조합 → 81수리 필터 → 점수순:
 *
 * 1. 사주 분석 → 부족 오행 도출
 * 2. Supabase에서 전체 후보 한자 풀 조회 (오행 조건 적용)
 * 3. 블랙리스트 제거
 * 4. 전체 풀에서 가중치 기반 상위 N개를 첫 글자 후보로 독립 선발
 * 5. 전체 풀에서 가중치 기반 상위 N개를 두 번째 글자 후보로 독립 선발
 * 6. 첫 글자 후보 × 두 번째 글자 후보 = 전체 조합 생성
 * 7. 각 조합에 대해 81수리 4격 검사 → 모두 길수인 조합만 유지
 * 8. 점수 계산 후 내림차순 정렬 → 상위 maxResults개 반환
 *
 * 핵심 설계 원칙:
 * - 첫 글자와 두 번째 글자를 완전히 독립적으로 선발하여 특정 한자가 첫 글자를 독점하는 현상 방지
 * - 81수리는 조합 생성 후 필터로 적용 (사전 탐색 없음)
 * - 실제 작명소 방식과 동일: 첫 글자 후보 풀 + 두 번째 글자 후보 풀 조합
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
  const {
    maxResults = 10,
    prioritizeWeakElements = true,
    applyPhoneticFilter = true,
    surnameHangul = '',
    gender = 'male',
  } = options;

  // 첫 글자와 두 번째 글자 후보를 각각 몇 개씩 선발할지 설정
  // 10 × 10 = 100개 조합 → 81수리 필터 후 충분한 후보 확보
  const POOL_SIZE = 10;

  // ── Step 1: 부족 오행 독출 ──
  const weakElements = prioritizeWeakElements ? getWeakElements(saju) : [];

  // ── Step 2: Supabase에서 전체 후보 한자 풀 조회 ──
  // 오행 조건: 부족 오행이 있으면 해당 오행 한자만 조회, 없으면 전체 조회
  // 획수 조건: 이름 한 글자당 2~30획 범위 내 모든 한자
  const allStrokes = Array.from({ length: 29 }, (_, i) => i + 2); // 2~30

  let rawPool: HanjaQueryResult[];
  if (weakElements.length > 0) {
    rawPool = await getHanjaByStrokesAndElements(allStrokes, weakElements);
  } else {
    const { getHanjaByStrokes } = await import('./naming-api');
    rawPool = await getHanjaByStrokes(allStrokes);
  }

  if (rawPool.length === 0) {
    return [];
  }

  // ── Step 3: 블랙리스트 한자 제거 ──
  const hanjaPool = rawPool.filter((h) => !isBlacklistedHanja(h.hanja));

  if (hanjaPool.length === 0) {
    return [];
  }

  // ── Step 4 & 5: 첫 글자 / 두 번째 글자 후보를 독립적으로 선발 ──
  //
  // 핵심: 전체 풀에서 가중치 기반 상위 POOL_SIZE개를 독립적으로 도출합니다.
  // 이렇게 하면 첫 글자와 두 번째 글자가 서로 다른 한자 풀에서 선발되어
  // 특정 한자가 첫 글자를 독점하는 현상이 구조적으로 방지됩니다.
  //
  // 가중치 기반 상위 K개 선발 알고리즘:
  // 지수 분포 샘플링 key = -log(U) / w 를 사용하면
  // 가중치가 높을수록 선발될 확률이 높아지되, 동일 가중치 내에서는 무작위로 선발됩니다.
  function weightedTopK(arr: HanjaQueryResult[], k: number): HanjaQueryResult[] {
    return arr
      .map((h) => ({
        h,
        key: -Math.log(Math.random() + 1e-10) / (getPopularityWeight(h.hanja) + 1),
      }))
      .sort((a, b) => a.key - b.key)
      .slice(0, k)
      .map((item) => item.h);
  }

  const char1Candidates = weightedTopK(hanjaPool, POOL_SIZE);
  const char2Candidates = weightedTopK(hanjaPool, POOL_SIZE);

  // ── Step 6: 첫 글자 × 두 번째 글자 전체 조합 생성 ──
  // ── Step 7: 각 조합에 81수리 4격 검사 필터 적용 ──
  const candidates: NameCandidate[] = [];

  for (const char1 of char1Candidates) {
    for (const char2 of char2Candidates) {
      // 같은 한자 중복 방지
      if (char1.hanja === char2.hanja) continue;

      // 81수리 4격 모두 길수 검사
      if (!isAll4GyeokLucky(familyStrokes, char1.strokes, char2.strokes)) continue;

      const name1Hangul = char1.hangul;
      const name2Hangul = char2.hangul;

      // 음운 필터 적용
      if (applyPhoneticFilter && surnameHangul) {
        if (!passesPhoneticFilter(surnameHangul, name1Hangul, name2Hangul)) continue;
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

      // 적합도 점수 계산
      let fitnessScore = 60; // 기본점 (4격 모두 길수 충족)
      if (phoneticScore) fitnessScore += phoneticScore.score * 0.2;
      const hasWeakElement = weakElements.some(
        (el) => char1.element === el || char2.element === el
      );
      if (hasWeakElement) fitnessScore += 5;
      const popularityBonus =
        (getPopularityWeight(char1.hanja) + getPopularityWeight(char2.hanja)) * 1.0;
      fitnessScore += Math.min(20, popularityBonus);
      fitnessScore = Math.round(Math.min(100, Math.max(0, fitnessScore)) * 10) / 10;

      candidates.push({
        char1,
        char2,
        suri,
        hangulName,
        hanjaName: char1.hanja + char2.hanja,
        phoneticScore,
        englishNames,
        fitnessScore,
      });
    }
  }

  // 후보가 부족하면 풀 크기를 늘려 재시도
  // (POOL_SIZE × POOL_SIZE 조합에서 81수리 통과한 것이 maxResults보다 적을 때)
  if (candidates.length < maxResults) {
    const EXTENDED_POOL_SIZE = POOL_SIZE * 3; // 30 × 30 = 900개 조합
    const char1Extended = weightedTopK(hanjaPool, EXTENDED_POOL_SIZE);
    const char2Extended = weightedTopK(hanjaPool, EXTENDED_POOL_SIZE);

    for (const char1 of char1Extended) {
      for (const char2 of char2Extended) {
        if (char1.hanja === char2.hanja) continue;
        if (!isAll4GyeokLucky(familyStrokes, char1.strokes, char2.strokes)) continue;

        // 이미 있는 후보와 중복 방지
        const alreadyExists = candidates.some(
          (c) => c.char1.hanja === char1.hanja && c.char2.hanja === char2.hanja
        );
        if (alreadyExists) continue;

        const name1Hangul = char1.hangul;
        const name2Hangul = char2.hangul;

        if (applyPhoneticFilter && surnameHangul) {
          if (!passesPhoneticFilter(surnameHangul, name1Hangul, name2Hangul)) continue;
        }

        const suri = calculate4Gyeok(familyStrokes, char1.strokes, char2.strokes);
        const hangulName = name1Hangul + name2Hangul;
        const phoneticScore = surnameHangul
          ? calculatePhoneticScore(surnameHangul, name1Hangul, name2Hangul)
          : undefined;
        const meanings = [char1.meaning, char2.meaning];
        const englishNames = suggestEnglishNames(hangulName, meanings, gender, 3);

        let fitnessScore = 60;
        if (phoneticScore) fitnessScore += phoneticScore.score * 0.2;
        const hasWeakElement = weakElements.some(
          (el) => char1.element === el || char2.element === el
        );
        if (hasWeakElement) fitnessScore += 5;
        const popularityBonus =
          (getPopularityWeight(char1.hanja) + getPopularityWeight(char2.hanja)) * 1.0;
        fitnessScore += Math.min(20, popularityBonus);
        fitnessScore = Math.round(Math.min(100, Math.max(0, fitnessScore)) * 10) / 10;

        candidates.push({
          char1,
          char2,
          suri,
          hangulName,
          hanjaName: char1.hanja + char2.hanja,
          phoneticScore,
          englishNames,
          fitnessScore,
        });

        if (candidates.length >= maxResults * 2) break;
      }
      if (candidates.length >= maxResults * 2) break;
    }
  }

  // ── Step 8: 점수 내림차순 정렬 후 maxResults개 반환 ──
  candidates.sort((a, b) => b.fitnessScore - a.fitnessScore);
  return candidates.slice(0, maxResults);
}
