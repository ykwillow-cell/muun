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
