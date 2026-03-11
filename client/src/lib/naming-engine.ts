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
  '道': 7, '允': 7,
  // 이준(李俊/以俊): 俊=준수할 준
  '俊': 7,
  // 하준(夏俊/河俊): 夏=클 하, 河=강 하
  '夏': 6, '河': 6,
  // 시우(始宇/時宇): 始=처음 시, 宇=집 우, 時=때 시
  '始': 6, '宇': 7, '時': 5,
  // 태오(太吾/太悟): 太=클 태, 吾=나 오, 悟=깨달을 오
  '太': 6, '吾': 5, '悟': 5,
  // 도현(道賢/道鉉): 賢=어질 현, 鉉=솥귀 현
  '賢': 7, '鉉': 5,
  // 도하(道河): 이미 道, 河 등재
  // 은우(恩宇/恩祐): 恩=은혜 은, 祐=도울 우
  '恩': 7, '祐': 6,
  // 이안(以安/伊安): 安=편안할 안, 以=써 이, 伊=저 이
  '安': 7, '以': 4, '伊': 5,
  // 선우(善宇/善祐): 善=착할 선
  '善': 6,
  // 서준(書俊/瑞俊): 書=글 서, 瑞=상서로울 서
  '書': 6, '瑞': 7,
  // 이현(以賢/利賢): 이미 賢 등재
  // 수호(守護/秀浩): 守=지킬 수, 護=보호할 호, 秀=빼어날 수, 浩=넓을 호
  '守': 5, '護': 4, '秀': 6, '浩': 6,
  // 지호(智浩/知浩): 智=슬기 지, 知=알 지
  '智': 7, '知': 5,
  // 은호(恩浩): 이미 恩, 浩 등재
  // 우주(宇宙): 宙=하늘 주
  '宙': 5,
  // 윤우(潤宇): 潤=윤택할 윤
  '潤': 7,
  // 주원(周元/周源): 周=두루 주, 元=으뜸 원, 源=근원 원
  '周': 5, '元': 6, '源': 5,
  // 유준(有俊/裕俊): 有=있을 유, 裕=넉넉할 유
  '有': 4, '裕': 5,
  // 시윤(時允/詩允): 詩=시 시
  '詩': 5,
  // 준서(俊瑞/俊書): 이미 俊, 瑞, 書 등재
  // 현우(賢宇/賢祐): 이미 賢, 宇, 祐 등재
  // 지훈(智勳/知勳): 勳=공 훈
  '勳': 5,
  // 민준(敏俊/旻俊): 敏=민첩할 민, 旻=하늘 민
  '敏': 5, '旻': 5,
  // 지우(智宇/知宇): 이미 등재
  // 서윤(書允/瑞允): 이미 등재
  // 예준(睿俊): 睿=밝을 예
  '睿': 6,
  // 태양(太陽): 陽=볕 양
  '陽': 5,
  // 이서(以書/怡書): 怡=기쁠 이
  '怡': 5,
  // 준혁(俊赫): 赫=빛날 혁
  '赫': 5,
  // 지안(智安/知安): 이미 등재
  // 하린(夏潾/河潾): 潾=맑을 린
  '潾': 4,
  // 우진(宇珍/祐珍): 珍=보배 진
  '珍': 5,
  // 이호(以浩/怡浩): 이미 등재
  // 민서(敏書/旻書): 이미 등재
  // 태현(太賢/太鉉): 이미 등재
  // 준우(俊宇/俊祐): 이미 등재
  // 지현(智賢/知賢): 이미 등재
  // 재원(在元/在源): 在=있을 재
  '在': 4,
  // 성준(成俊/聖俊): 成=이룰 성, 聖=성스러울 성
  '成': 5, '聖': 5,
  // 태민(太敏/太旻): 이미 등재
  // 이준(以俊): 이미 등재
  // 현준(賢俊): 이미 등재
  // 우혁(宇赫): 이미 등재

  // ── 여아 TOP 이름 한자 ──
  // 서아(瑞雅/書雅): 雅=우아할 아
  '雅': 7,
  // 이서(怡書): 이미 등재
  // 하린(夏潾): 이미 등재
  // 서윤(瑞允/書允): 이미 등재
  // 지안(智安): 이미 등재
  // 하윤(夏允/河允): 이미 등재
  // 아린(雅潾): 이미 등재
  // 지유(智柔/知柔): 柔=부드러울 유
  '柔': 6,
  // 아윤(雅允): 이미 등재
  // 시아(詩雅): 이미 등재
  // 지아(智雅/知雅): 이미 등재
  // 지우(智宇): 이미 등재
  // 채이(彩怡): 彩=채색 채
  '彩': 6,
  // 윤서(允書/潤書): 이미 등재
  // 유나(有娜/裕娜): 娜=아름다울 나
  '娜': 5,
  // 채아(彩雅): 이미 등재
  // 수아(秀雅): 이미 등재
  // 서하(瑞夏/書夏): 이미 등재
  // 지윤(智允/知允): 이미 등재
  // 나은(娜恩): 이미 등재
  // 예린(睿潾): 이미 등재
  // 하은(夏恩/河恩): 이미 등재
  // 서연(瑞然/書然): 然=그러할 연
  '然': 5,
  // 유진(有珍/裕珍): 이미 등재
  // 지수(智秀/知秀): 이미 등재
  // 예은(睿恩): 이미 등재
  // 아현(雅賢): 이미 등재
  // 서현(瑞賢/書賢): 이미 등재
  // 나현(娜賢): 이미 등재
  // 하영(夏英): 英=꽃부리 영
  '英': 5,
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
  '準': 4,  // 준수할 준 (俊의 이체자)
  '峻': 4,  // 높을 준
  '晙': 3,  // 밝을 준
  '埈': 3,  // 높을 준
  '鎭': 4,  // 진압할 진
  '振': 4,  // 떨칠 진
  '眞': 5,  // 참 진
  '炫': 5,  // 빛날 현
  '玹': 4,  // 옥빛 현
  '泫': 3,  // 눈물 현
  '熙': 5,  // 빛날 희
  '希': 5,  // 바랄 희
  '喜': 4,  // 기쁠 희
  '昊': 6,  // 하늘 호
  '皓': 5,  // 밝을 호
  '澔': 4,  // 넓을 호
  '湖': 4,  // 호수 호
  '浚': 4,  // 깊을 준
  '俐': 3,  // 영리할 리
  '利': 4,  // 이로울 리
  '李': 3,  // 오얏 리 (성씨 한자)
  '林': 3,  // 수풀 림 (성씨 한자)
  '理': 4,  // 다스릴 리
  '梨': 3,  // 배나무 리
  '璃': 4,  // 유리 리
  '里': 3,  // 마을 리
  '離': 2,  // 떠날 리
  '仁': 6,  // 어질 인
  '寅': 4,  // 범 인
  '民': 5,  // 백성 민
  '旼': 5,  // 온화할 민
  '珉': 4,  // 옥돌 민
  '閔': 3,  // 근심할 민
  '玟': 4,  // 옥빛 민
  '彬': 5,  // 빛날 빈
  '斌': 4,  // 빛날 빈
  '賓': 3,  // 손님 빈
  '彦': 5,  // 선비 언
  '燕': 4,  // 제비 연
  '涓': 4,  // 물 연
  '妍': 5,  // 고울 연
  '娟': 4,  // 예쁠 연
  '蓮': 4,  // 연꽃 련
  '連': 3,  // 이을 련
  '延': 4,  // 늘일 연
  '研': 3,  // 갈 연
  '鉛': 2,  // 납 연
  '悅': 5,  // 기쁠 열
  '烈': 4,  // 세찰 렬
  '熱': 3,  // 더울 열
  '曄': 4,  // 빛날 엽
  '葉': 3,  // 잎 엽
  '映': 5,  // 비출 영
  '瑛': 5,  // 옥빛 영
  '泳': 4,  // 헤엄칠 영
  '永': 5,  // 길 영
  '榮': 4,  // 영화 영
  '寧': 5,  // 편안할 녕
  '玲': 5,  // 옥소리 령
  '伶': 4,  // 영리할 령
  '嶺': 3,  // 고개 령
  '齡': 3,  // 나이 령
  '澄': 5,  // 맑을 징
  '澈': 5,  // 맑을 철
  '哲': 6,  // 밝을 철
  '喆': 5,  // 밝을 철
  '徹': 4,  // 통할 철
  '燦': 5,  // 빛날 찬
  '璨': 4,  // 옥빛 찬
  '贊': 4,  // 도울 찬
  '讚': 3,  // 기릴 찬
  '昌': 5,  // 번성할 창
  '彰': 4,  // 드러날 창
  '暢': 4,  // 통할 창
  '蒼': 4,  // 푸를 창
  '倉': 3,  // 곳집 창
  '宰': 4,  // 재상 재
  '才': 5,  // 재주 재
  '財': 4,  // 재물 재
  '載': 4,  // 실을 재
  '宗': 4,  // 마루 종
  '鍾': 4,  // 쇠북 종
  '鐘': 3,  // 쇠북 종
  '鎬': 4,  // 호경 호
  '鎔': 4,  // 녹일 용
  '龍': 4,  // 용 룡
  '勇': 5,  // 날랠 용
  '容': 4,  // 얼굴 용
  '鏞': 3,  // 큰 종 용
  '庸': 3,  // 평범할 용
  '佑': 6,  // 도울 우
  '禹': 4,  // 우임금 우
  '雨': 4,  // 비 우
  '羽': 3,  // 깃 우
  '遇': 3,  // 만날 우
  '虞': 3,  // 헤아릴 우
  '旭': 5,  // 아침 해 욱
  '昱': 5,  // 빛날 욱
  '煜': 4,  // 빛날 욱
  '郁': 4,  // 향기로울 욱
  '彧': 4,  // 빛날 욱
  '勖': 3,  // 힘쓸 욱
  '翼': 5,  // 날개 익
  '益': 4,  // 더할 익
  '翊': 4,  // 도울 익
  '一': 3,  // 한 일
  '逸': 4,  // 편안할 일
  '日': 3,  // 날 일
  '壹': 3,  // 하나 일
  '任': 3,  // 맡길 임
  '姙': 3,  // 아이밸 임
  '壬': 3,  // 임금 임
  '賃': 2,  // 품삯 임
  '子': 3,  // 아들 자
  '慈': 4,  // 사랑 자
  '滋': 4,  // 불을 자
  '姿': 4,  // 모양 자
  '紫': 4,  // 자주빛 자
  '磁': 3,  // 자석 자
  '雌': 3,  // 암컷 자
  '藏': 3,  // 감출 장
  '長': 3,  // 길 장
  '壯': 3,  // 씩씩할 장
  '章': 4,  // 글 장
  '莊': 4,  // 씩씩할 장
  '正': 4,  // 바를 정
  '貞': 4,  // 곧을 정
  '靜': 5,  // 고요할 정
  '晶': 5,  // 밝을 정
  '晸': 4,  // 밝을 정
  '楨': 4,  // 기둥 정
  '禎': 5,  // 상서로울 정
  '珽': 4,  // 옥홀 정
  '廷': 4,  // 조정 정
  '庭': 4,  // 뜰 정
  '亭': 4,  // 정자 정
  '丁': 3,  // 넷째 천간 정
  '情': 4,  // 뜻 정
  '精': 4,  // 정밀할 정
  '淨': 4,  // 깨끗할 정
  '鄭': 3,  // 나라 정 (성씨)
  '悰': 3,  // 즐거울 종
  '進': 4,  // 나아갈 진
  '晉': 4,  // 나아갈 진
  '秦': 3,  // 나라 진 (성씨)
  '璡': 3,  // 옥 진
  '縝': 3,  // 촘촘할 진
  '瑨': 4,  // 옥 진
  '蔘': 3,  // 인삼 삼
  '三': 2,  // 석 삼
  '森': 3,  // 빽빽할 삼
  '相': 4,  // 서로 상
  '祥': 5,  // 상서로울 상
  '尙': 4,  // 오히려 상
  '常': 4,  // 항상 상
  '商': 3,  // 장사 상
  '想': 4,  // 생각 상
  '翔': 5,  // 날 상
  '霜': 3,  // 서리 상
  '爽': 4,  // 시원할 상
  '尚': 4,  // 오히려 상
  '象': 3,  // 코끼리 상
  '詳': 4,  // 자세할 상
  '床': 3,  // 평상 상
  '賞': 3,  // 상줄 상
  '桑': 3,  // 뽕나무 상
  '晟': 6,  // 밝을 성
  '星': 5,  // 별 성
  '誠': 5,  // 정성 성
  '聲': 4,  // 소리 성
  '盛': 4,  // 성할 성
  '城': 4,  // 성 성
  '省': 3,  // 살필 성
  '性': 4,  // 성품 성
  '姓': 3,  // 성씨 성
  '昇': 5,  // 오를 승
  '承': 4,  // 이을 승
  '乘': 3,  // 탈 승
  '升': 3,  // 되 승
  '勝': 4,  // 이길 승
  '丞': 3,  // 도울 승
  '施': 4,  // 베풀 시
  '示': 3,  // 보일 시
  '視': 3,  // 볼 시
  '侍': 3,  // 모실 시
  '矢': 3,  // 화살 시
  '信': 5,  // 믿을 신
  '新': 4,  // 새 신
  '愼': 4,  // 삼갈 신
  '晨': 5,  // 새벽 신
  '辛': 3,  // 매울 신 (성씨)
  '申': 3,  // 납 신 (성씨)
  '神': 4,  // 귀신 신
  '臣': 3,  // 신하 신
  '心': 3,  // 마음 심
  '深': 4,  // 깊을 심
  '沁': 4,  // 스밀 심
  '尋': 3,  // 찾을 심
  '審': 3,  // 살필 심
  '芯': 4,  // 심지 심
  '아': 0,  // 한글 전용 이름 (한자 없음)
};

// ──────────────────────────────────────────────
// 0-B. 여아 전용 빈출 한자 가중치 테이블
// ──────────────────────────────────────────────
/**
 * 여아 전용 빈출 한자 가중치 테이블
 *
 * 기준: 대한민국 전자가족관계시스템 여아 이름 상위 500개 누적 빈도 (2020~2026)
 * 데이터 출처: baby-name.kr (전자가족관계시스템 원본 데이터)
 *
 * 설계 원칙:
 * 1. 남아 전용 한자(昊·俊·浩·準·鎭·赫·勳·鉉·碩 등)는 미등재(가중치 0)
 * 2. 여아 이름에 자주 쓰이는 한자는 독립적으로 높은 가중치 부여
 * 3. 남아에도 쓰이는 중성적 한자(書·瑞·允·潤·智·知·安·恩 등)는 여아 테이블에도 등재
 *
 * 가중치 기준:
 * - 10: 여아 TOP 10 이름에서 핵심 한자 (서윤·서연·지우·하윤·서현 등)
 * - 9:  여아 TOP 11~30 이름에서 빈출 한자
 * - 8:  여아 TOP 31~100 이름에서 빈출 한자
 * - 7:  여아 TOP 101~300 이름에서 빈출 한자
 */
export const POPULAR_HANJA_WEIGHT_FEMALE: Record<string, number> = {
  // ── 여아 TOP 1~10 이름 핵심 한자 ──
  '瑞': 7, '允': 7, '書': 7,  // 서윤·서연·서아 등 최빈출
  '然': 6,   // 서연·가연·채연
  '智': 7, '知': 6, '宇': 5,   // 지우·지아·지윤 등
  '夏': 6, '河': 5,              // 하윤·하은·하린 등
  '賢': 5,                       // 서현·지현·아현 등
  '恩': 7,                      // 하은·지은·나은 등 최빈출
  '敏': 5, '旻': 5,              // 민서·민지·민채 등
  '柔': 6,                       // 지유·은유·온유 등
  '潤': 7,                      // 윤서·윤아·윤채 등
  '雅': 7,                      // 서아·지아·수아 등 최빈출

  // ── 여아 TOP 11~30 이름 한자 ──
  '秀': 6,                       // 수아·수빈·수현 등
  '彩': 7, '源': 5,             // 채원·채아·채윤 등
  '安': 6,                       // 지안·아인·유안 등
  '民': 4,                       // 지민·소민·채민 등
  '潾': 5,                       // 하린·아린·예린 등
  '多': 5,                       // 다은·다연·다윤 등
  '睿': 6,                       // 예린·예은·예나 등
  '素': 4, '律': 5,              // 소율·소연·하율 등
  '彬': 4,                       // 수빈·은빈·채빈 등
  '娜': 6, '有': 4, '裕': 4,    // 유나·나은·나연 등
  '詩': 5,                       // 시은·시아·시연 등
  '珍': 5,                       // 유진·서진·예진 등
  '珠': 5,                       // 유주·주아·예주 등
  '佳': 5,                       // 가은·가연·가윤 등
  '緣': 4,                       // 연우·채연·가연 등
  '仁': 5,                       // 다인·가인·세인 등

  // ── 여아 TOP 31~100 이름 한자 ──
  '英': 5,                       // 서영·하영·아영 등
  '怡': 6,                       // 이서·소이·서이 등
  '世': 4,                       // 세아·세은·세연 등
  '麗': 4,                       // 리아·여원 등
  '惠': 5,                       // 혜원·혜린·혜빈 등
  '熙': 5,                       // 서희·채희·세희 등

  // ── 여아 TOP 101~200 이름 한자 ──
  '圭': 4, '璃': 4,              // 규리·유리·리나 등
  '雪': 5,                       // 설아·은설 등
  '林': 4,                       // 예림·유림·가람 등
  '露': 4,                       // 로아·루아 등
  '靜': 4,                       // 유정·소정·서정 등
  '寶': 4,                       // 보민·보경·보미 등
  '羅': 4,                       // 라희·라온·라윤 등
  '景': 4,                       // 나경·민경·도경 등
  '瑟': 4,                       // 예슬 등
  '丹': 4,                       // 단아·단비 등
  '朗': 4,                       // 하랑 등
  '松': 4,                       // 은솔·이솔·민솔 등
  '溫': 4,                       // 지온·하온·온유 등
  '太': 4,                       // 태희·태린·태은 등

  // ── 여아 TOP 201~300 이름 한자 ──
  '美': 5,                       // 소미·보미 등
  '海': 4,                       // 해린·해인·해나 등
  '善': 5,                       // 선우 등
  '飛': 4,                       // 은비 등
  '音': 4,                       // 하음 등
  '談': 3,                       // 소담·예담 등


  // ── 여아 전용 추가 한자 (여성적 이미지, 이름에 자주 쓰임) ──
  '娟': 5,   // 예쁠 연 (여성적 이미지)
  '媛': 5,   // 예쁜 여자 원 (여성적 이미지)
  '宛': 5,   // 완연할 완 (여성적 이미지)
  '宜': 5,   // 마땅할 의 (여성적 이미지)
  '芳': 6,   // 꽃다울 방 (여성적 이미지)
  '華': 5,   // 빛날 화 (여성적 이미지)
  '清': 5,   // 맑을 청
  '澄': 5,   // 맑을 징
  '妍': 5,   // 고울 연 (여성적 이미지)
  '姸': 5,   // 고울 연 (이체자)
  '嫣': 4,   // 아름다울 언 (여성적 이미지)
  '嬌': 4,   // 아리따울 교 (여성적 이미지)
  '婉': 4,   // 아름다울 완 (여성적 이미지)
  '婷': 4,   // 아름다울 정 (여성적 이미지)
  '嫻': 4,   // 우아할 한 (여성적 이미지)
  '月': 4,   // 달 월 (여성적 이미지)
  '星': 4,   // 별 성
  '花': 4,   // 꽃 화
  '蘭': 5,   // 난초 란 (이름에 자주 쓰임)
  '菊': 4,   // 국화 국 (이름에 자주 쓰임)
  '梅': 5,   // 매화 매 (이름에 자주 쓰임)
  '桂': 4,   // 계수나무 계 (이름에 자주 쓰임)
  '菁': 4,   // 우거질 청 (이름에 자주 쓰임)
  '楓': 4,   // 단풍 풍 (이름에 자주 쓰임)
  '蓮': 5,   // 연꽃 련 (이름에 자주 쓰임)
  '玉': 5,   // 구슬 옥 (여성적 이미지)
  '琪': 4,   // 아름다운 옥 기 (여성적 이미지)
  '琳': 4,   // 아름다운 옥 림 (여성적 이미지)
  '瑜': 4,   // 아름다운 옥 유 (여성적 이미지)
  '瑾': 4,   // 아름다운 옥 근 (여성적 이미지)
  '璟': 4,   // 옥빛 경 (여성적 이미지)
  '希': 5,   // 바랄 희
  '喜': 4,   // 기쁠 희
  '悅': 5,   // 기쁠 열
  '映': 5,   // 비출 영
  '瑛': 5,   // 옥빛 영
  '永': 4,   // 길 영
  '寧': 5,   // 편안할 녕
  '玲': 5,   // 옥소리 령
  '禎': 5,   // 상서로울 정
  '晶': 5,   // 밝을 정
  '祥': 5,   // 상서로울 상
  '芯': 4,   // 심지 심
  '貞': 4,   // 곧을 정 (정숙·절개, 전통 여성 이름 한자)
  '伊': 4,   // 저 이
};

/**
 * 한자의 빈출 가중치를 반환합니다.
 * gender 파라미터를 지원하여 성별 맞춤 가중치를 반환합니다.
 *
 * @param hanja  한자 문자
 * @param gender 성별 ('male' | 'female'), 기본값 'male'
 * @returns 가중치 (0~10, 미등재 시 0)
 */
export function getPopularityWeight(hanja: string, gender: 'male' | 'female' = 'male'): number {
  if (gender === 'female') {
    return POPULAR_HANJA_WEIGHT_FEMALE[hanja] ?? 0;
  }
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
  // normalizeSuri를 적용하여 81 초과 합산값을 정규화합니다.
  // 프론트엔드에서 SURI_TABLE[won]으로 직접 조회하므로,
  // raw 합산값이 81을 넘으면 undefined가 되어 흥으로 표시되는 버그가 발생합니다.
  const won  = normalizeSuri(name1Strokes + name2Strokes);
  const hyung = normalizeSuri(familyStrokes + name1Strokes);
  const i    = normalizeSuri(familyStrokes + name2Strokes);
  const jung  = normalizeSuri(familyStrokes + name1Strokes + name2Strokes);

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
  // 30 × 30 = 900개 조합 → 81수리 필터 후 충분한 후보 확보
  // 성씨에 따라 통과 가능한 획수 조합이 제한적이므로 10개로는 부족 발생
  const POOL_SIZE = 30;

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

  // ── Step 3: 블랙리스트 한자 제거 + 여아 모드에서 성별 필터 ──
  //
  // 여아 모드: POPULAR_HANJA_WEIGHT_FEMALE에 등재된 한자만 후보 풀으로 사용.
  // 동 테이블에 없는 한자는 가중치 0으로 weightedTopK에 포함되어
  // 남성적 한자(昊·俊·浩 등)가 여아 이름에 등장하는 구조적 문제를 차단합니다.
  let hanjaPool = [...rawPool];
  if (gender === 'female') {
    hanjaPool = hanjaPool.filter((h) => (POPULAR_HANJA_WEIGHT_FEMALE[h.hanja] ?? 0) > 0);
  }

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
        key: -Math.log(Math.random() + 1e-10) / (getPopularityWeight(h.hanja, gender) + 1),
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
  // 동일한 한자 쌍이 candidates에 중복 삽입되지 않도록 사전 차단
  const seenPairs = new Set<string>();

  for (const char1 of char1Candidates) {
    for (const char2 of char2Candidates) {
      // 같은 한자 중복 방지
      if (char1.hanja === char2.hanja) continue;
      // 동일 조합 중복 방지
      const pairKey = char1.hanja + '｜' + char2.hanja;
      if (seenPairs.has(pairKey)) continue;
      seenPairs.add(pairKey);

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
        (getPopularityWeight(char1.hanja, gender) + getPopularityWeight(char2.hanja, gender)) * 1.0;
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
    const EXTENDED_POOL_SIZE = POOL_SIZE * 2; // 60 × 60 = 3600개 조합 (확장 재시도)
    const char1Extended = weightedTopK(hanjaPool, EXTENDED_POOL_SIZE);
    const char2Extended = weightedTopK(hanjaPool, EXTENDED_POOL_SIZE);

    for (const char1 of char1Extended) {
      for (const char2 of char2Extended) {
        if (char1.hanja === char2.hanja) continue;
        if (!isAll4GyeokLucky(familyStrokes, char1.strokes, char2.strokes)) continue;

        // 이미 있는 후보와 중복 방지 (seenPairs Set으로 O(1) 검사)
        const extPairKey = char1.hanja + '｜' + char2.hanja;
        if (seenPairs.has(extPairKey)) continue;
        seenPairs.add(extPairKey);

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
          (getPopularityWeight(char1.hanja, gender) + getPopularityWeight(char2.hanja, gender)) * 1.0;
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

  // ── Step 8: 다양성 보장 — char1·char2 최대 2회 제한 ──
  //
  // 단순화된 단일 패스 알고리즘:
  // 1) 점수 내림차순 정렬
  // 2) candidates를 순서대로 순회하면서 char1/char2 각각 2회 제한 적용
  // 3) 최종 반환 직전 별도 검증 단계로 제한 준수 여부 확인
  const MAX_REPEAT = 2;
  candidates.sort((a, b) => b.fitnessScore - a.fitnessScore);

  const char1Count = new Map<string, number>();
  const char2Count = new Map<string, number>();
  const filtered: NameCandidate[] = [];

  for (const c of candidates) {
    if (filtered.length >= maxResults * 3) break; // 과도한 순회 방지
    const c1 = char1Count.get(c.char1.hanja) ?? 0;
    const c2 = char2Count.get(c.char2.hanja) ?? 0;
    if (c1 < MAX_REPEAT && c2 < MAX_REPEAT) {
      char1Count.set(c.char1.hanja, c1 + 1);
      char2Count.set(c.char2.hanja, c2 + 1);
      filtered.push(c);
    }
  }

  // ── Step 9: 최종 검증 — char1·char2 2회 초과 여부 확인 ──
  //
  // 앞 단계에서 누락된 엣지 케이스를 방지하기 위한 별도 검증 단계.
  // filtered를 순서대로 다시 순회하면서 char1/char2 카운터를 새로 시작하여
  // 실제로 2회를 초과하는 한자가 있는지 최종 확인합니다.
  const finalChar1Count = new Map<string, number>();
  const finalChar2Count = new Map<string, number>();
  const result: NameCandidate[] = [];
  for (const c of filtered) {
    if (result.length >= maxResults) break;
    const fc1 = finalChar1Count.get(c.char1.hanja) ?? 0;
    const fc2 = finalChar2Count.get(c.char2.hanja) ?? 0;
    if (fc1 < MAX_REPEAT && fc2 < MAX_REPEAT) {
      finalChar1Count.set(c.char1.hanja, fc1 + 1);
      finalChar2Count.set(c.char2.hanja, fc2 + 1);
      result.push(c);
    }
  }

  // ── Step 10: 점수 내림차순 정렬 후 maxResults개 반환 ──
  result.sort((a, b) => b.fitnessScore - a.fitnessScore);
  return result;
}
