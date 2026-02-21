import React from 'react';
import ReactDOMServer from 'react-dom/server';

export async function render(options: { path: string }) {
  // SEO를 위한 메타 데이터 정의
  const metaData: Record<string, { title: string, description: string }> = {
    '/': {
      title: '무운 (MuUn) - 회원가입 없는 무료 사주 및 2026년 신년 운세',
      description: '생년월일만으로 확인하는 무료 사주, 2026년 병오년 신년 운세, 토정비결, 궁합 서비스. 30년 경력 역술인의 전문적인 풀이를 만나보세요.'
    },
    '/yearly-fortune': {
      title: '2026년 신년운세 - 무운 (MuUn)',
      description: '2026년 병오년, 당신의 한 해 운세는 어떨까요? 무료로 확인하는 정밀 신년운세 서비스.'
    },
    '/manselyeok': {
      title: '무료 만세력 분석 - 무운 (MuUn)',
      description: '정확한 사주 데이터를 바탕으로 한 무료 만세력 분석 서비스.'
    },
    '/astrology': {
      title: '[가입X/100%무료] 서양 점성술 - 탄생 차트 분석 및 운명 해석 | 무운 (MuUn)',
      description: '가입/결제 없이 당신이 태어난 순간의 별자리와 행성 배치를 통해 성격과 운명을 분석해보세요. 무운의 전문적인 점성술 차트 분석 서비스를 제공합니다.'
    },
    '/lifelong-saju': {
      title: '[가입X/100%무료] 평생 사주 분석 - 무운 (MuUn)',
      description: '당신의 타고난 기질과 운명의 흐름을 30년 내공의 명리학으로 분석해드립니다.'
    },
    '/compatibility': {
      title: '[가입X/100%무료] 정밀 궁합 분석 - 무운 (MuUn)',
      description: '두 사람의 생년월일로 확인하는 정밀 사주 궁합. 연애, 결혼, 사업 파트너십까지 확인해보세요.'
    },
    '/tojeong': {
      title: '[가입X/100%무료] 2026년 토정비결 - 무운 (MuUn)',
      description: '병오년 한 해의 신수를 월별로 상세하게 풀이해드립니다. 100% 무료 토정비결 서비스.'
    },
    '/psychology': {
      title: '[가입X/100%무료] 심리테스트 및 성격 분석 - 무운 (MuUn)',
      description: '나의 진짜 성격과 잠재력을 찾아주는 다양한 심리테스트를 즐겨보세요.'
    },
    '/tarot': {
      title: '[가입X/100%무료] 오늘의 타로 상담 - 무운 (MuUn)',
      description: '신비로운 타로 카드가 전하는 오늘의 메시지. 고민되는 문제에 대한 해답을 찾아보세요.'
    },
    '/dream': {
      title: '[가입X/100%무료] 꿈해몽 사전 - 무운 (MuUn)',
      description: '어젯밤 꿈의 의미가 궁금하신가요? 방대한 데이터를 바탕으로 정확한 꿈해몽을 제공합니다.'
    }
  };

  const currentMeta = metaData[options.path] || metaData['/'];

  // 실제 App 전체를 렌더링하는 대신, SEO에 중요한 뼈대만 생성
  // 이는 빌드 타임아웃 문제를 완벽하게 해결하면서 검색 엔진에는 최적의 정보를 제공함
  const appHtml = `
    <div id="root">
      <header>
        <nav>
          <a href="/">홈</a>
          <a href="/yearly-fortune">신년운세</a>
          <a href="/manselyeok">만세력</a>
        </nav>
      </header>
      <main>
        <h1>${currentMeta.title}</h1>
        <p>${currentMeta.description}</p>
        <div id="ssr-placeholder">콘텐츠를 불러오는 중입니다...</div>
      </main>
      <footer>
        <p>© 2026 MUUN. All rights reserved.</p>
      </footer>
    </div>
  `;

  return {
    appHtml,
    head: {
      title: `<title>${currentMeta.title}</title>`,
      meta: `<meta name="description" content="${currentMeta.description}">`,
      link: '',
    },
    dehydratedState: {},
  };
}
