import React from 'react';
import ReactDOMServer from 'react-dom/server';

export async function render(options: { path: string }) {
  // SEO를 위한 메타 데이터 정의
  const metaData: Record<string, { title: string, description: string, h1?: string, services?: { href: string, label: string }[] }> = {
    '/': {
      title: "무료 사주 무운 (MuUn) - 회원가입 없는 100% 무료 사주풀이 및 2026년 운세",
      description: "회원가입 없이, 개인정보 저장 없이, 생년월일만으로 바로 확인하는 100% 무료 사주풀이. 2026년 병오년 신년운세, 토정비결, 궁합, 타로, 꿈해몽까지 모든 서비스가 완전 무료입니다.",
      h1: "무료 사주 무운 (MuUn) - 회원가입 없는 100% 무료 사주풀이",
      services: [
        { href: '/yearly-fortune', label: '2026년 신년운세' },
        { href: '/manselyeok', label: '무료 만세력' },
        { href: '/lifelong-saju', label: '평생 사주 분석' },
        { href: '/compatibility', label: '정밀 궁합 분석' },
        { href: '/tojeong', label: '토정비결' },
        { href: '/tarot', label: '타로 상담' },
        { href: '/dream', label: '꿈해몽 사전' },
        { href: '/guide', label: '운세 칼럼' },
      ]
    },
    '/yearly-fortune': {
      title: "2026년 무료 신년운세 - 회원가입 없이 바로 확인 | 무운",
      description: "회원가입 없이 생년월일만 입력하면 바로 확인하는 2026년 병오년 무료 신년운세. 월별 운세, 재물운, 직업운, 애정운까지 개인정보 저장 없이 100% 무료로 제공합니다.",
      h1: "2026년 무료 신년운세",
      services: [
        { href: '/manselyeok', label: '만세력 분석' },
        { href: '/lifelong-saju', label: '평생 사주' },
        { href: '/tojeong', label: '토정비결' },
      ]
    },
    '/manselyeok': {
      title: "무료 만세력 조회 - 회원가입 없이 사주팔자 확인 | 무운 (MuUn)",
      description: "회원가입 없이 생년월일시만 입력하면 바로 확인하는 무료 만세력 분석. 사주팔자, 오행 구성, 천간지지를 개인정보 저장 없이 100% 무료로 제공합니다.",
      h1: "무료 만세력 조회",
      services: [
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/lifelong-saju', label: '평생 사주' },
      ]
    },
    '/daily-fortune': {
      title: "[가입X/100%무료] 오늘의 운세 - 무운 (MuUn)",
      description: "생년월일을 입력하면 사주팔자를 기반으로 오늘의 운세를 알려드립니다. 매일 새로운 운세를 무료로 확인하세요.",
      h1: "오늘의 운세",
      services: [
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/manselyeok', label: '만세력 분석' },
      ]
    },
    '/astrology': {
      title: "[가입X/100%무료] 서양 점성술 - 탄생 차트 분석 및 운명 해석 | 무운 (MuUn)",
      description: "가입/결제 없이 당신이 태어난 순간의 별자리와 행성 배치를 통해 성격과 운명을 분석해보세요. 무운의 전문적인 점성술 차트 분석 서비스를 제공합니다.",
      h1: "서양 점성술 - 탄생 차트 분석",
      services: [
        { href: '/psychology', label: '심리테스트' },
        { href: '/lifelong-saju', label: '평생 사주' },
      ]
    },
    '/lifelong-saju': {
      title: "무료 평생사주 풀이 - 회원가입 없이 타고난 운명 분석 | 무운",
      description: "회원가입·개인정보 저장 없이 확인하는 무료 평생사주 풀이. 타고난 기질, 인생 운세, 연애운, 결혼운, 재물운을 100% 무료로 분석해드립니다.",
      h1: "무료 평생사주 풀이",
      services: [
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/compatibility', label: '궁합 분석' },
        { href: '/manselyeok', label: '만세력' },
      ]
    },
    '/compatibility': {
      title: "무료 궁합 보기 - 회원가입 없이 사주 궁합 분석 | 무운 (MuUn)",
      description: "회원가입 없이 두 사람의 생년월일만으로 바로 확인하는 무료 사주 궁합. 오행 궁합, 성격 궁합, 연애 궁합을 개인정보 저장 없이 100% 무료로 분석합니다.",
      h1: "무료 궁합 보기",
      services: [
        { href: '/hybrid-compatibility', label: '사주×MBTI 하이브리드 궁합' },
        { href: '/family-saju', label: '가족 사주 분석' },
      ]
    },
    '/hybrid-compatibility': {
      title: "[가입X/100%무료] 사주×MBTI 하이브리드 궁합 - 무운 (MuUn)",
      description: "사주 오행(하드웨어)과 MBTI(소프트웨어)를 결합한 960가지 하이브리드 궁합 분석. 에너지 저울, 4대 영역 리포트, 인연 타임라인, 처방전까지 압도적인 정보량의 전문 궁합 리포트를 무료로 제공합니다.",
      h1: "사주×MBTI 하이브리드 궁합",
      services: [
        { href: '/compatibility', label: '정밀 궁합 분석' },
        { href: '/family-saju', label: '가족 사주 분석' },
      ]
    },
    '/tojeong': {
      title: "2026년 무료 토정비결 - 회원가입 없이 한 해 운세 확인 | 무운",
      description: "이지함 선생의 원문 괎 계산법으로 보는 2026년 병오년 무료 토정비결. 회원가입·개인정보 저장 없이 한 해의 흐름을 100% 무료로 확인하세요.",
      h1: "2026년 무료 토정비결",
      services: [
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/lifelong-saju', label: '평생 사주' },
      ]
    },
    '/psychology': {
      title: "[가입X/100%무료] 심리테스트 및 성격 분석 - 무운 (MuUn)",
      description: "나의 진짜 성격과 잠재력을 찾아주는 다양한 심리테스트를 즐겨보세요.",
      h1: "심리테스트 및 성격 분석",
      services: [
        { href: '/astrology', label: '서양 점성술' },
        { href: '/tarot', label: '타로 상담' },
      ]
    },
    '/tarot': {
      title: "무료 타로 - 회원가입 없이 무료로 | 무운 (MuUn)",
      description: "회원가입 없이 바로 시작하는 무료 타로 상담. 고민되는 문제에 대한 해답을 개인정보 저장 없이 100% 무료로 확인하세요.",
      h1: "무료 타로 상담",
      services: [
        { href: '/psychology', label: '심리테스트' },
        { href: '/dream', label: '꿈해몽 사전' },
      ]
    },
    '/dream': {
      title: "무료 꿈해몽 사전 - 회원가입 없이 꿈 풀이 확인 | 무운 (MuUn)",
      description: "어젯밤 꿈의 의미가 궁금하신가요? 회원가입 없이 바로 검색하는 무료 꿈해몽 사전. 방대한 데이터를 바탕으로 정확한 꿈 풀이를 개인정보 저장 없이 100% 무료로 제공합니다.",
      h1: "무료 꿈해몽 사전",
      services: [
        { href: '/tarot', label: '타로 상담' },
        { href: '/psychology', label: '심리테스트' },
      ]
    },
    '/family-saju': {
      title: "[가입X/100%무료] 정밀 가족 사주 분석 - 우리 가족 궁합과 조화 확인 | 무운 (MuUn)",
      description: "회원가입/결제 없이 우리 가족의 사주 궁합과 오행 조화를 확인하세요. 부모, 자녀, 배우자와의 관계 역학을 30년 내공의 명리학으로 정밀 분석해드립니다.",
      h1: "정밀 가족 사주 분석",
      services: [
        { href: '/compatibility', label: '정밀 궁합 분석' },
        { href: '/hybrid-compatibility', label: '하이브리드 궁합' },
      ]
    },
    '/fortune-dictionary': {
      title: "사주 용어 사전 - 무운 (MuUn)",
      description: "사주 명리학의 핵심 용어를 쉽게 풀이한 사주 용어 사전. 천간, 지지, 십신, 대운 등 사주 기초 개념을 무료로 학습하세요.",
      h1: "사주 용어 사전",
      services: [
        { href: '/guide', label: '운세 칼럼' },
        { href: '/manselyeok', label: '만세력 분석' },
      ]
    },
    '/lucky-lunch': {
      title: "[가입X/100%무료] 오늘의 행운 점심 메뉴 추천 - 무운 (MuUn)",
      description: "사주 오행을 기반으로 오늘 당신에게 행운을 가져다줄 점심 메뉴를 추천해드립니다.",
      h1: "오늘의 행운 점심 메뉴",
      services: [
        { href: '/daily-fortune', label: '오늘의 운세' },
        { href: '/tarot', label: '타로 상담' },
      ]
    },
    '/about': {
      title: "무운 소개 - 무운 (MuUn)",
      description: "무운(MuUn)은 30년 경력 역술인의 전문 지식을 바탕으로 만든 무료 사주 및 운세 서비스입니다.",
      h1: "무운 소개",
      services: [
        { href: '/', label: '홈으로' },
        { href: '/contact', label: '문의하기' },
      ]
    },
    '/contact': {
      title: "문의하기 - 무운 (MuUn)",
      description: "무운 서비스에 대한 문의, 제안, 피드백을 남겨주세요.",
      h1: "문의하기",
      services: [
        { href: '/about', label: '무운 소개' },
        { href: '/', label: '홈으로' },
      ]
    },
    '/privacy': {
      title: "개인정보처리방침 - 무운 (MuUn)",
      description: "무운(MuUn) 서비스의 개인정보처리방침입니다.",
      h1: "개인정보처리방침",
      services: [
        { href: '/terms', label: '이용약관' },
        { href: '/', label: '홈으로' },
      ]
    },
    '/terms': {
      title: "이용약관 - 무운 (MuUn)",
      description: "무운(MuUn) 서비스의 이용약관입니다.",
      h1: "이용약관",
      services: [
        { href: '/privacy', label: '개인정보처리방침' },
        { href: '/', label: '홈으로' },
      ]
    },
    '/guide': {
      title: "운세 칼럼 - 사주 지혜와 개운법 | 무운 (MuUn)",
      description: "30년 내공의 역술인이 전하는 사주 지혜와 개운법. 대운 변화, 자녀 교육, 재물운 등 실생활에 도움이 되는 전문 칼럼을 무료로 읽어보세요.",
      h1: "운세 칼럼 - 사주 지혜와 개운법",
      services: [
        { href: '/guide/column-001', label: '인생의 대운이 바뀌기 전, 반드시 나타나는 징조 3가지' },
        { href: '/guide/column-002', label: '내 사주팔자 스스로 보는 법: 만세력 8글자의 비밀' },
        { href: '/guide/column-003', label: '자녀의 학업운을 높여주는 사주별 공부 환경 조성법' },
        { href: '/guide/column-004', label: '사주 오행(목화토금수) 자가 진단: 나에게 부족한 기운 찾기' },
        { href: '/guide/column-005', label: '태어난 시간 모를 때 사주 보는 법' },
      ]
    },
    '/guide/column-001': {
      title: "인생의 대운이 바뀌기 전, 반드시 나타나는 징조 3가지 | 무운 (MuUn)",
      description: "인생의 대운이 바뀌기 전, 반드시 나타나는 징조 3가지에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "인생의 대운이 바뀌기 전, 반드시 나타나는 징조 3가지"
    },
    '/guide/column-002': {
      title: "내 사주팔자 스스로 보는 법: 만세력 8글자의 비밀 | 무운 (MuUn)",
      description: "사주의 기본이 되는 8글자(년월일시)의 의미를 알면, 자신의 사주를 훨씬 더 깊이 있게 이해할 수 있습니다.",
      h1: "내 사주팔자 스스로 보는 법: 만세력 8글자의 비밀"
    },
    '/guide/column-003': {
      title: "자녀의 학업운을 높여주는 사주별 공부 환경 조성법 | 무운 (MuUn)",
      description: "자녀의 학업운을 높여주는 사주별 공부 환경 조성법에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "자녀의 학업운을 높여주는 사주별 공부 환경 조성법"
    },
    '/guide/column-004': {
      title: "사주 오행(목화토금수) 자가 진단: 나에게 부족한 기운 찾기 | 무운 (MuUn)",
      description: "사주 오행(목화토금수) 자가 진단: 나에게 부족한 기운 찾기에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "사주 오행(목화토금수) 자가 진단: 나에게 부족한 기운 찾기"
    },
    '/guide/column-005': {
      title: "태어난 시간 모를 때 사주 보는 법: 특징으로 유추하는 생시 | 무운 (MuUn)",
      description: "태어난 시간 모를 때 사주 보는 법: 특징으로 유추하는 생시에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "태어난 시간 모를 때 사주 보는 법: 특징으로 유추하는 생시"
    },
    '/guide/column-006': {
      title: "사주 천간과 지지의 의미: 하늘의 기운과 땅의 환경 | 무운 (MuUn)",
      description: "사주 천간과 지지의 의미: 하늘의 기운과 땅의 환경에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "사주 천간과 지지의 의미: 하늘의 기운과 땅의 환경"
    },
    '/guide/column-007': {
      title: "내 사주에 '관성'이 많다면? 직장운과 명예운의 상관관계 | 무운 (MuUn)",
      description: "내 사주에 '관성'이 많다면? 직장운과 명예운의 상관관계에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "내 사주에 '관성'이 많다면? 직장운과 명예운의 상관관계"
    },
    '/guide/column-008': {
      title: "사주 '비겁'이 강한 사람의 특징: 자존감과 인간관계의 지혜 | 무운 (MuUn)",
      description: "사주 '비겁'이 강한 사람의 특징: 자존감과 인간관계의 지혜에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "사주 '비겁'이 강한 사람의 특징: 자존감과 인간관계의 지혜"
    },
    '/guide/column-009': {
      title: "올해 대운이 바뀌는 나이, 어떻게 알 수 있을까? | 무운 (MuUn)",
      description: "올해 대운이 바뀌는 나이, 어떻게 알 수 있을까?에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "올해 대운이 바뀌는 나이, 어떻게 알 수 있을까?"
    },
    '/guide/column-010': {
      title: "삼재(三災)를 기회로 바꾸는 법: 복삼재와 개운의 기술 | 무운 (MuUn)",
      description: "삼재(三災)를 기회로 바꾸는 법: 복삼재와 개운의 기술에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "삼재(三災)를 기회로 바꾸는 법: 복삼재와 개운의 기술"
    },
    '/guide/column-011': {
      title: "매일 아침 실천하는 운 좋아지는 습관 5가지 | 무운 (MuUn)",
      description: "매일 아침 실천하는 운 좋아지는 습관 5가지에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "매일 아침 실천하는 운 좋아지는 습관 5가지"
    },
    '/guide/column-012': {
      title: "이름이 운명에 미치는 영향: 성명학으로 보는 개명 효과 | 무운 (MuUn)",
      description: "이름이 운명에 미치는 영향: 성명학으로 보는 개명 효과에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "이름이 운명에 미치는 영향: 성명학으로 보는 개명 효과"
    },
    '/guide/column-013': {
      title: "나쁜 운을 피해가는 법: '기신'운을 현명하게 보내는 자세 | 무운 (MuUn)",
      description: "나쁜 운을 피해가는 법: '기신'운을 현명하게 보내는 자세에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "나쁜 운을 피해가는 법: '기신'운을 현명하게 보내는 자세"
    },
    '/guide/column-014': {
      title: "타고난 재물복 확인하기: 부자가 되는 사주의 특징 | 무운 (MuUn)",
      description: "타고난 재물복 확인하기: 부자가 되는 사주의 특징에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "타고난 재물복 확인하기: 부자가 되는 사주의 특징"
    },
    '/guide/column-015': {
      title: "사주에 '식신생재'가 있다면? 스스로 돈을 벌어들이는 능력 | 무운 (MuUn)",
      description: "사주에 '식신생재'가 있다면? 스스로 돈을 벌어들이는 능력에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "사주에 '식신생재'가 있다면? 스스로 돈을 벌어들이는 능력"
    },
    '/guide/column-016': {
      title: "로또 당첨자들의 사주 특징? 횡재수와 편재운의 비밀 | 무운 (MuUn)",
      description: "로또 당첨자들의 사주 특징? 횡재수와 편재운의 비밀에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "로또 당첨자들의 사주 특징? 횡재수와 편재운의 비밀"
    },
    '/guide/column-017': {
      title: "지갑 색상으로 재물운 높이기: 사주 오행별 행운의 컬러 | 무운 (MuUn)",
      description: "지갑 색상으로 재물운 높이기: 사주 오행별 행운의 컬러에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "지갑 색상으로 재물운 높이기: 사주 오행별 행운의 컬러"
    },
    '/guide/column-018': {
      title: "내 사주에 맞는 직업 찾기: 적성에 맞는 오행별 직무 가이드 | 무운 (MuUn)",
      description: "내 사주에 맞는 직업 찾기: 적성에 맞는 오행별 직무 가이드에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "내 사주에 맞는 직업 찾기: 적성에 맞는 오행별 직무 가이드"
    },
    '/guide/column-019': {
      title: "사주로 보는 자녀와의 궁합: 갈등을 줄이고 소통하는 법 | 무운 (MuUn)",
      description: "사주로 보는 자녀와의 궁합: 갈등을 줄이고 소통하는 법에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "사주로 보는 자녀와의 궁합: 갈등을 줄이고 소통하는 법"
    },
    '/guide/column-020': {
      title: "우리 아이 진로 고민, 사주 속 '인성'과 '식상'에 답이 있다 | 무운 (MuUn)",
      description: "우리 아이 진로 고민, 사주 속 '인성'과 '식상'에 답이 있다에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "우리 아이 진로 고민, 사주 속 '인성'과 '식상'에 답이 있다"
    },
    '/guide/column-021': {
      title: "가족 간의 오행 조화: 집안의 기운을 살리는 가족 사주 배치 | 무운 (MuUn)",
      description: "가족 간의 오행 조화: 집안의 기운을 살리는 가족 사주 배치에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "가족 간의 오행 조화: 집안의 기운을 살리는 가족 사주 배치"
    },
    '/guide/column-022': {
      title: "효도하는 자녀 사주는 따로 있을까? 사주로 보는 고부 갈등과 효도 | 무운 (MuUn)",
      description: "효도하는 자녀 사주는 따로 있을까? 사주로 보는 고부 갈등과 효도에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "효도하는 자녀 사주는 따로 있을까? 사주로 보는 고부 갈등과 효도"
    },
    '/guide/column-023': {
      title: "부부 갈등의 원인과 해결: 사주로 보는 관계의 지혜 | 무운 (MuUn)",
      description: "부부 갈등의 원인과 해결: 사주로 보는 관계의 지혜에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "부부 갈등의 원인과 해결: 사주로 보는 관계의 지혜"
    },
    '/guide/column-024': {
      title: "나를 도와줄 '귀인'은 어떤 사람일까? 사주 속 '천을귀인' | 무운 (MuUn)",
      description: "나를 도와줄 '귀인'은 어떤 사람일까? 사주 속 '천을귀인'에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "나를 도와줄 '귀인'은 어떤 사람일까? 사주 속 '천을귀인'"
    },
    '/guide/column-025': {
      title: "도화살과 홍염살의 차이: 사람을 끄는 매력의 비밀 | 무운 (MuUn)",
      description: "도화살과 홍염살의 차이: 사람을 끄는 매력의 비밀에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "도화살과 홍염살의 차이: 사람을 끄는 매력의 비밀"
    },
    '/guide/column-026': {
      title: "늦게 결혼해야 잘 사는 사주? 만혼(晩婚)이 유리한 특징 | 무운 (MuUn)",
      description: "늦게 결혼해야 잘 사는 사주? 만혼(晩婚)이 유리한 특징에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "늦게 결혼해야 잘 사는 사주? 만혼(晩婚)이 유리한 특징"
    },
    '/guide/column-027': {
      title: "집안에 두면 복이 들어오는 풍수 인테리어 소품 가이드 | 무운 (MuUn)",
      description: "집안에 두면 복이 들어오는 풍수 인테리어 소품 가이드에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "집안에 두면 복이 들어오는 풍수 인테리어 소품 가이드"
    },
    '/guide/column-028': {
      title: "사주 오행의 균형으로 알아보는 40대 이후 건강 관리 | 무운 (MuUn)",
      description: "사주 오행의 균형으로 알아보는 40대 이후 건강 관리에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "사주 오행의 균형으로 알아보는 40대 이후 건강 관리"
    },
    '/guide/column-029': {
      title: "침대 머리 방향과 숙면의 관계: 사주별 최적의 잠자리 위치 | 무운 (MuUn)",
      description: "침대 머리 방향과 숙면의 관계: 사주별 최적의 잠자리 위치에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "침대 머리 방향과 숙면의 관계: 사주별 최적의 잠자리 위치"
    },
    '/guide/column-030': {
      title: "꿈해몽 베스트 10: 조상 꿈, 불 꿈, 돼지 꿈이 의미하는 길몽 | 무운 (MuUn)",
      description: "꿈해몽 베스트 10: 조상 꿈, 불 꿈, 돼지 꿈이 의미하는 길몽에 대한 전문적인 사주 풀이와 지혜를 만나보세요. 30년 내공의 역술인이 전하는 개운의 기술.",
      h1: "꿈해몽 베스트 10: 조상 꿈, 불 꿈, 돼지 꿈이 의미하는 길몽"
    }
  };

  // 동적 라우트 처리: /yearly-fortune/:birthDate
  let currentMeta = metaData[options.path];
  if (!currentMeta) {
    const yearlyFortuneMatch = options.path.match(/^\/yearly-fortune\/(\d{4}-\d{2}-\d{2})$/);
    if (yearlyFortuneMatch) {
      const birthDate = yearlyFortuneMatch[1];
      const year = birthDate.split('-')[0];
      currentMeta = {
        title: `${year}년생 2026년 신년운세 - 무운 (MuUn)`,
        description: `${year}년생의 2026년 병오년 신년운세를 무료로 확인하세요. 사주팔자를 기반으로 한 정밀 운세 풀이입니다.`,
        h1: `${year}년생 2026년 신년운세`,
        services: [
          { href: '/yearly-fortune', label: '신년운세 홈' },
          { href: '/lifelong-saju', label: '평생 사주 분석' },
        ]
      };
    } else {
      currentMeta = metaData['/'];
    }
  }

  // 내비게이션 링크 생성
  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/yearly-fortune', label: '신년운세' },
    { href: '/manselyeok', label: '만세력' },
    { href: '/lifelong-saju', label: '평생사주' },
    { href: '/compatibility', label: '궁합' },
    { href: '/tojeong', label: '토정비결' },
    { href: '/tarot', label: '타로' },
    { href: '/dream', label: '꿈해몽' },
    { href: '/guide', label: '칼럼' },
  ];

  // 서비스 링크 HTML 생성
  const serviceLinksHtml = currentMeta.services
    ? currentMeta.services.map(s => `<li><a href="${s.href}">${s.label}</a></li>`).join('\n          ')
    : '';

  // 페이지별 canonical URL
  const canonicalUrl = `https://muunsaju.com${options.path}`;

  // 풍부한 콘텐츠를 포함한 HTML 생성 (로딩 텍스트 제거)
  const appHtml = `
    <div id="root">
      <header>
        <nav aria-label="주요 메뉴">
          ${navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n          ')}
        </nav>
      </header>
      <main>
        <h1>${currentMeta.h1 || currentMeta.title}</h1>
        ${options.path === '/privacy' ? `
          <section>
            <h2>1. 개인정보의 처리 목적</h2>
            <p>'무운'(이하 '서비스')은 사용자가 입력한 생년월일, 태어난 시간, 성별 등의 정보를 오직 사주 및 운세 결과 계산을 위한 목적으로만 처리합니다. 본 서비스는 회원가입을 요구하지 않으며, 입력된 정보는 서버에 영구적으로 저장되지 않습니다.</p>
            <h2>2. 처리하는 개인정보 항목</h2>
            <ul>
              <li>필수항목: 이름(별칭), 성별, 생년월일, 태어난 시간</li>
              <li>자동수집항목: 접속 로그, 쿠키, 접속 IP 정보, 행태정보(클릭, 스크롤, 마우스 움직임 등)</li>
            </ul>
            <h2>3. 개인정보의 보유 및 이용기간</h2>
            <p>사용자가 입력한 사주 정보는 브라우저의 로컬 스토리지(Local Storage)에 임시 저장되어 사용자의 편의를 돕습니다. 서버에는 어떠한 개인 식별 정보도 저장되지 않으며, 브라우저 캐시를 삭제하거나 서비스를 종료하면 정보는 더 이상 이용되지 않습니다.</p>
            <h2>4. 제3자 제공 및 위탁</h2>
            <p>서비스는 사용자의 개인정보를 외부에 제공하거나 처리를 위탁하지 않습니다. 다만, 구글 애드센스 등 광고 서비스 이용 시 비식별화된 통계 정보가 활용될 수 있습니다.</p>
            <h3>4-1. Google AdSense 및 쿠키 사용 고지</h3>
            <p>본 서비스는 수익 창출 및 서비스 운영을 위해 Google AdSense 광고를 게재합니다. 상세 내용은 <a href="https://policies.google.com/technologies/ads">Google 광고 정책</a>을 확인하시기 바랍니다.</p>
            <h3>4-2. Microsoft Clarity 분석 도구 사용 고지</h3>
            <p>본 서비스는 이용자의 서비스 이용 행태 분석 및 서비스 최적화를 위해 Microsoft Clarity 분석 도구를 사용합니다. 상세 내용은 <a href="https://clarity.microsoft.com/terms">Microsoft Clarity 이용약관</a> 및 <a href="https://privacy.microsoft.com/ko-kr/privacystatement">Microsoft 개인정보처리방침</a>을 확인하시기 바랍니다.</p>
            <h2>5. 개인정보 보호책임자</h2>
            <p>이메일: ykwillow1@naver.com</p>
            <h2>6. 시행일</h2>
            <p>본 개인정보처리방침은 2026년 3월 6일부터 시행됩니다.</p>
          </section>
        ` : `
          <p>${currentMeta.description}</p>
          ${serviceLinksHtml ? `<nav aria-label="관련 서비스"><ul>${serviceLinksHtml}</ul></nav>` : ''}
          <p>무운(MuUn)은 회원가입 없이, 개인정보를 저장하지 않는 100% 무료 사주·운세·타로·꿈해몽 서비스입니다. 생년월일만 입력하면 바로 확인할 수 있습니다.</p>
        `}
      </main>
      <footer>
        <nav aria-label="푸터 메뉴">
          <a href="/about">무운 소개</a>
          <a href="/privacy">개인정보처리방침</a>
          <a href="/terms">이용약관</a>
          <a href="/contact">문의하기</a>
        </nav>
        <p>© 2026 MUUN. All rights reserved.</p>
      </footer>
    </div>
  `;

  // 페이지별 키워드 매핑
  const keywordsMap: Record<string, string> = {
    '/': '무료사주, 무료운세, 2026년운세, 사주풀이, 무료사주풀이, 신년운세, 토정비결, 궁합, 만세력, 타로, 꿈해몽, 회원가입없는사주',
    '/yearly-fortune': '2026년운세, 신년운세, 무료신년운세, 병오년운세, 2026년신년운세, 무료운세',
    '/lifelong-saju': '평생사주, 무료사주, 사주풀이, 무료사주풀이, 사주분석, 운명분석',
    '/compatibility': '궁합, 사주궁합, 무료궁합, 연애궁합, 결혼궁합, 궁합보기',
    '/tojeong': '토정비결, 2026년토정비결, 무료토정비결, 병오년토정비결',
    '/manselyeok': '만세력, 무료만세력, 사주팔자, 만세력조회',
    '/tarot': '타로, 무료타로, 타로상담, 타로카드, 온라인타로',
    '/dream': '꿈해몽, 무료꿈해몽, 꿈풀이, 꿈해몽사전',
    '/daily-fortune': '오늘의운세, 무료오늘의운세, 오늘운세, 매일운세',
    '/psychology': '심리테스트, 무료심리테스트, 성격분석, 심리분석',
    '/astrology': '점성술, 별자리운세, 탄생차트, 서양점성술',
  };
  const keywords = keywordsMap[options.path] || '무료사주, 무료운세, 사주풀이, 무운';

  return {
    appHtml,
    head: {
      title: `<title>${currentMeta.title}</title>`,
      meta: [
        `<meta name="description" content="${currentMeta.description}">`,
        `<meta name="keywords" content="${keywords}">`,
        `<meta name="robots" content="index, follow">`,
        `<meta property="og:title" content="${currentMeta.title}">`,
        `<meta property="og:description" content="${currentMeta.description}">`,
        `<meta property="og:url" content="${canonicalUrl}">`,
        `<meta property="og:type" content="website">`,
        `<meta property="og:site_name" content="무운 (MuUn)">`,
        `<meta property="og:locale" content="ko_KR">`,
        `<meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${currentMeta.title}">`,
        `<meta name="twitter:description" content="${currentMeta.description}">`,
      ].join('\n    '),
      link: `<link rel="canonical" href="${canonicalUrl}">`,
    },
    dehydratedState: {},
  };
}
