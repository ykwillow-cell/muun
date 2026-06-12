import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadColumnsDataset, loadDreamsDataset, loadDictionaryDataset, SEO_LIMITS } from './utils/content-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);
const BASE_URL = 'https://muunsaju.com';

const STATIC_ROUTES = [
  '/', '/yearly-fortune', '/manselyeok', '/daily-fortune', '/dream', '/lifelong-saju',
  '/compatibility', '/career-fortune', '/moving-fortune', '/tojeong', '/psychology', '/astrology', '/tarot', '/about',
  '/privacy', '/terms', '/family-saju', '/hybrid-compatibility', '/fortune-dictionary',
  '/naming', '/lucky-lunch', '/contact', '/guide',
  '/tarot-history', '/past-life', '/more',
];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const GUIDE_CATEGORY_LABELS = { luck: '개운법', basic: '사주 기초', relationship: '관계 · 궁합', health: '건강 · 운', money: '재물운', flow: '운의 흐름', career: '취업 · 커리어', love: '연애 · 결혼', family: '가족 · 자녀' };
const DREAM_CATEGORY_LABELS = { animal: '동물', nature: '자연', person: '사람', object: '사물', action: '행동', emotion: '감정', place: '장소', other: '기타' };
const DICTIONARY_CATEGORY_LABELS = { basic: '사주 기초', stem: '천간', branch: '지지', 'ten-stem': '십신', sipsin: '십신', 'evil-spirit': '신살', 'luck-flow': '운의 흐름', relation: '관계 · 궁합', concept: '운세 개념', wealth: '재물 · 직업', health: '건강 · 신체', other: '기타' };

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

function truncate(value = '', maxLength = 160) { const text = String(value).trim(); return text.length <= maxLength ? text : `${text.slice(0, Math.max(0, maxLength - 1)).trim()}…`; }
function formatKoreanDate(value) { if (!value) return ''; const date = new Date(value); return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }); }
function normalizeSlug(value) { return String(value || '').trim().toLowerCase(); }
function isValidSlug(value) { return SLUG_PATTERN.test(normalizeSlug(value)); }

function buildPageShell({ sectionLabel, h1, description, metaLines = [], sections = [], breadcrumbs = [], relatedLinks = [] }) {
  const breadcrumbHtml = breadcrumbs.length ? `<nav aria-label="breadcrumb"><ol>${breadcrumbs.map((item, index) => { const content = item.href ? `<a href="${item.href}">${escapeHtml(item.label)}</a>` : `<span aria-current="page">${escapeHtml(item.label)}</span>`; return `<li>${content}${index < breadcrumbs.length - 1 ? ' › ' : ''}</li>`; }).join('')}</ol></nav>` : '';
  const metaHtml = metaLines.length ? `<ul>${metaLines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : '';
  const sectionsHtml = sections.filter(Boolean).map((section) => `<section>${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}${((Array.isArray(section.paragraphs) ? section.paragraphs : (section.paragraphs ? [section.paragraphs] : []))).filter(Boolean).map((paragraph) => `<p>${paragraph.startsWith('<a') ? paragraph : escapeHtml(paragraph)}</p>`).join('')}</section>`).join('');
  const relatedHtml = relatedLinks.length ? `<section aria-label="관련 서비스"><h2>함께 보면 좋은 서비스</h2><ul>${relatedLinks.map((link) => `<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`).join('')}</ul></section>` : '';
  
  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/daily-fortune', label: '오늘의 운세' },
    { href: '/yearly-fortune', label: '신년운세' },
    { href: '/lifelong-saju', label: '평생사주' },
    { href: '/compatibility', label: '궁합' },
    { href: '/dream', label: '꿈해몽' },
    { href: '/fortune-dictionary', label: '운세 사전' },
    { href: '/psychology', label: '심리테스트' },
    { href: '/astrology', label: '점성술' },
    { href: '/guide', label: '운세 칼럼' }
  ];
  const navHtml = `<nav aria-label="주요 메뉴">${navLinks.map(link => `<a href="${link.href}">${link.label}</a>`).join('')}</nav>`;
  return `<header>${navHtml}</header><main>${breadcrumbHtml}<article>${sectionLabel ? `<p>${escapeHtml(sectionLabel)}</p>` : ''}<h1>${escapeHtml(h1)}</h1><p>${escapeHtml(description)}</p>${metaHtml}${sectionsHtml}</article>${relatedHtml}</main><footer><nav aria-label="푸터 메뉴"><a href="/about">무운 소개</a><a href="/contact">문의하기</a><a href="/privacy">개인정보처리방침</a><a href="/terms">이용약관</a></nav><p>© 2026 MUUN. All rights reserved.</p></footer>`;
}

function makeHead({ title, description, canonicalUrl, keywords = '', ogType = 'article', ogImage = `${BASE_URL}/images/horse_mascot.png`, schema = [], extraMeta = [] }) {
  const schemaArray = Array.isArray(schema) ? schema : (schema ? [schema] : []);
  const schemaScripts = schemaArray.filter(Boolean).map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join('\n    ');
  return {
    title: `<title>${escapeHtml(title)}</title>`,
    meta: [
      `<meta name="description" content="${escapeHtml(description)}">`,
      keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">` : '',
      '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">',
      `<meta property="og:title" content="${escapeHtml(title)}">`,
      `<meta property="og:description" content="${escapeHtml(description)}">`,
      `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
      `<meta property="og:type" content="${escapeHtml(ogType)}">`,
      '<meta property="og:site_name" content="무운 (MuUn)">',
      '<meta property="og:locale" content="ko_KR">',
      `<meta property="og:image" content="${escapeHtml(ogImage)}">`,
      '<meta name="twitter:card" content="summary_large_image">',
      `<meta name="twitter:title" content="${escapeHtml(title)}">`,
      `<meta name="twitter:description" content="${escapeHtml(description)}">`,
      `<meta name="twitter:image" content="${escapeHtml(ogImage)}">`,
      `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
      ...extraMeta
    ].filter(Boolean).join('\n    '),
    link: '',
    schema: schemaScripts
  };
}

function ensureTemplateMarkers(html) {
  let result = html;
  if (!result.includes('<!--app-head-->')) {
    result = result.replace('</head>', '<!--app-head-->\n</head>');
  }
  if (!result.includes('<!--app-html-->')) {
    result = result.replace('<div id="root"></div>', '<div id="root"><!--app-html--></div>');
  }
  if (!result.includes('<!--__REACT_QUERY_STATE__-->')) {
    result = result.replace('</body>', '<!--__REACT_QUERY_STATE__-->\n</body>');
  }
  return result;
}

function buildGuidePage(column) {
  const categoryLabel = GUIDE_CATEGORY_LABELS[column.category] || '운세 칼럼';
  const title = column.meta_title || `${column.title} | 무운 운세 칼럼`;
  const description = truncate(stripHtml(column.meta_description || column.description || column.content), 160);
  const canonicalUrl = `${BASE_URL}/guide/${column.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", "headline": column.title, "description": description, "author": { "@type": "Organization", "name": "무운 (MuUn)" }, "datePublished": column.created_at };
  return {
    appHtml: buildPageShell({ sectionLabel: categoryLabel, h1: column.title, description: `발행일: ${formatKoreanDate(column.created_at)}`, sections: [{ paragraphs: [stripHtml(column.content)] }], breadcrumbs: [{ href: '/', label: '홈' }, { href: '/guide', label: '운세 칼럼' }, { label: column.title }], relatedLinks: [{ href: '/guide', label: '칼럼 더 보기' }, { href: '/lifelong-saju', label: '무료 평생사주 보기' }] }),
    head: makeHead({ title, description, canonicalUrl, keywords: [column.title, categoryLabel, '사주칼럼', '운세팁'].join(', '), ogType: 'article', schema, extraMeta: [`<meta property="article:published_time" content="${column.created_at}">`, `<meta property="article:section" content="${escapeHtml(categoryLabel)}">`] }),
  };
}

function buildDreamPage(dream) {
  const categoryLabel = DREAM_CATEGORY_LABELS[dream.category] || '꿈해몽';
  const title = dream.meta_title || `${dream.keyword} 꿈해몽 풀이 | 무운`;
  // DB 실제 필드명: interpretation (content 는 레거시 호환)
  const dreamContent = dream.interpretation || dream.traditional_meaning || dream.psychological_meaning || dream.content || '';
  const description = dream.meta_description || truncate(stripHtml(dreamContent), 160);
  // 현재 Supabase의 꿈해몽 slug는 숫자로 끝나도 고유 URL일 수 있으므로 항상 self-canonical 처리합니다.
  const canonicalUrl = `${BASE_URL}/dream/${dream.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", "headline": `${dream.keyword} 꿈해몽`, "description": description, "author": { "@type": "Organization", "name": "무운 (MuUn)" } };
  return {
    appHtml: buildPageShell({ sectionLabel: `꿈해몽 > ${categoryLabel}`, h1: `${dream.keyword} 꿈해몽`, description: '꿈속의 상징이 알려주는 당신의 미래와 심리 상태를 확인하세요.', sections: [{ paragraphs: [stripHtml(dreamContent)] }], breadcrumbs: [{ href: '/', label: '홈' }, { href: '/dream', label: '꿈해몽' }, { label: dream.keyword }], relatedLinks: [{ href: '/dream', label: '다른 꿈해몽 찾기' }, { href: '/daily-fortune', label: '오늘의 운세 보기' }] }),
    head: makeHead({ title, description, canonicalUrl, keywords: [dream.keyword, '꿈해몽', '꿈풀이', categoryLabel].join(', '), ogType: 'article', schema }),
  };
}

function buildDictionaryPage(entry) {
  const categoryLabel = DICTIONARY_CATEGORY_LABELS[entry.category] || '사주 용어';
  const title = entry.meta_title || `${entry.title} 뜻과 특징 - 사주 용어 사전 | 무운`;
  // DB 실제 필드명: original_meaning, modern_interpretation (content 는 레거시 호환)
  const entryContent = [entry.original_meaning, entry.modern_interpretation, entry.content].filter(Boolean).join('\n\n');
  const description = entry.meta_description || truncate(stripHtml(entry.summary || entryContent), 160);
  const canonicalUrl = `${BASE_URL}/dictionary/${entry.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", "headline": entry.title, "description": description, "author": { "@type": "Organization", "name": "무운 (MuUn)" } };
  return {
    appHtml: buildPageShell({ sectionLabel: `운세 사전 > ${categoryLabel}`, h1: entry.title, description: entry.summary || '사주 명리학의 핵심 용어를 알기 쉽게 설명해 드립니다.', sections: [{ heading: '용어 설명', paragraphs: [stripHtml(entryContent) || entry.summary || ''] }, entry.muun_advice ? { heading: '무운의 조언', paragraphs: [truncate(stripHtml(entry.muun_advice), 900)] } : null].filter(Boolean), breadcrumbs: [{ href: '/', label: '홈' }, { href: '/fortune-dictionary', label: '운세 사전' }, { label: entry.title }], relatedLinks: [{ href: '/fortune-dictionary', label: '운세 사전 더 보기' }, { href: '/lifelong-saju', label: '무료 평생사주 보기' }, { href: '/family-saju', label: '가족사주 보기' }] }),
    head: makeHead({ title, description, canonicalUrl, keywords: [entry.title, ...(Array.isArray(entry.tags) ? entry.tags : []), '운세사전', '사주용어'].filter(Boolean).join(', '), ogType: 'article', schema, extraMeta: [`<meta property="article:section" content="${escapeHtml(categoryLabel)}">`] }),
  };
}

async function fetchColumns() {
  const result = await loadColumnsDataset({ limit: SEO_LIMITS.columns });
  return result.rows.filter((row) => isValidSlug(row.slug || row.id) && row.title);
}

async function fetchDreams() {
  const result = await loadDreamsDataset({ limit: SEO_LIMITS.dreams });
  return result.rows.filter((row) => isValidSlug(row.slug) && row.keyword);
}

async function fetchDictionaryEntries() {
  const result = await loadDictionaryDataset({ limit: SEO_LIMITS.dictionary });
  return result.rows.filter((row) => isValidSlug(row.slug) && row.title);
}



const CORE_LANDING_CONTENT = {
  '/': {
    title: '무운 사주 - 무료 사주, 운세, 궁합, 꿈해몽',
    description: '무운사주는 생년월일시를 바탕으로 평생사주, 신년운세, 궁합, 작명, 꿈해몽, 운세 사전을 무료로 확인할 수 있는 운세 서비스입니다.',
    h1: '무운 사주',
    intro: '회원가입 없이 무료로 사주와 운세를 확인하고, 꿈해몽과 사주 용어까지 함께 살펴볼 수 있습니다.',
    sections: [
      ['무운사주에서 볼 수 있는 것', ['평생사주, 오늘의 운세, 신년운세, 궁합, 가족사주, 작명, 이사운, 직업운, 꿈해몽, 운세 사전, 운세 칼럼을 한 곳에서 확인할 수 있습니다.', '각 메뉴는 단순한 결과 출력이 아니라 해석 기준과 주의점, 관련 운세 흐름을 함께 보여주는 방식으로 구성되어 있습니다.']],
      ['처음 이용하는 분께', ['정확한 생년월일시를 입력하면 더 구체적인 해석을 볼 수 있습니다. 태어난 시간을 모르는 경우에도 기본 운세 흐름은 확인할 수 있도록 구성했습니다.']]
    ],
    related: [['/lifelong-saju','평생사주'], ['/compatibility','궁합'], ['/dream','꿈해몽'], ['/fortune-dictionary','운세 사전']]
  },
  '/family-saju': {
    title: '가족사주 무료 분석 - 부모와 자녀의 오행 궁합 | 무운사주',
    description: '부모와 자녀, 부부, 형제자매의 사주 오행 흐름을 함께 보고 가족 관계의 조화와 갈등 포인트를 해석합니다.',
    h1: '가족사주 무료 분석',
    intro: '가족사주는 한 사람의 운세만 보는 것이 아니라 가족 구성원 사이의 기운이 어떻게 부딪히고 보완되는지를 함께 살피는 메뉴입니다.',
    sections: [
      ['가족사주를 보는 이유', ['부모와 자녀는 같은 공간에서 생활하지만 타고난 오행, 성향, 표현 방식이 다를 수 있습니다. 가족사주는 이런 차이를 사주 관점에서 해석해 서로를 이해하는 데 도움을 줍니다.', '예를 들어 한 사람은 적극적인 화(火)의 기운이 강하고 다른 사람은 차분한 수(水)의 기운이 강하다면, 대화 속도와 감정 표현에서 차이가 크게 느껴질 수 있습니다.']],
      ['분석하는 항목', ['가족 구성원의 오행 균형, 부모와 자녀의 관계 흐름, 부부 사이의 보완점, 가족 내 갈등이 생기기 쉬운 지점, 서로에게 힘이 되는 관계 패턴을 확인합니다.', '결과는 가족을 단정하거나 판단하기 위한 것이 아니라, 생활 속 대화 방식과 역할 분담을 조정하는 참고 자료로 활용하는 것이 좋습니다.']],
      ['자주 묻는 질문', ['아이의 사주가 부모와 맞지 않는다고 해서 관계가 나쁘다는 뜻은 아닙니다. 오히려 부족한 기운을 서로 채워주는 관계일 수 있습니다.', '가족사주는 이사, 양육 방식, 부부 대화, 자녀와의 소통을 고민할 때 함께 참고하면 좋습니다.']]
    ],
    related: [['/compatibility','부부 궁합'], ['/lifelong-saju','평생사주'], ['/moving-fortune','이사운'], ['/daily-fortune','오늘의 운세']]
  },
  '/naming': {
    title: '무료 작명 풀이 - 이름 오행과 81수리 분석 | 무운사주',
    description: '이름의 한자 오행, 발음 오행, 수리 흐름과 사주와의 조화를 함께 살펴보는 무료 작명 풀이 서비스입니다.',
    h1: '무료 작명 풀이',
    intro: '작명은 예쁜 이름을 고르는 것에서 끝나지 않고, 이름이 가진 소리와 글자의 기운이 사주와 어떻게 어울리는지를 함께 보는 과정입니다.',
    sections: [
      ['사주 작명과 일반 작명의 차이', ['일반 작명이 어감과 인상을 중심으로 본다면, 사주 작명은 태어난 시점의 오행 균형과 이름이 보완하는 기운을 함께 살핍니다.', '무운의 작명 풀이는 이름의 뜻, 소리, 한자 구성, 81수리 흐름을 종합해 이름이 주는 인상과 운세적 조화를 해석합니다.']],
      ['이름 오행이 중요한 이유', ['사주에서 특정 오행이 부족하거나 과하면 이름을 통해 부족한 기운을 보완하는 방식이 사용됩니다. 이름이 모든 운명을 바꾸는 것은 아니지만, 오래 불리는 호칭이기 때문에 상징적 영향은 가볍게 볼 수 없습니다.', '특히 개명이나 아이 이름을 고민할 때는 발음하기 쉬운지, 부정적 의미가 없는지, 성씨와 조화로운지도 함께 확인하는 것이 좋습니다.']],
      ['결과 활용 방법', ['좋은 점수만 보고 이름을 결정하기보다, 어떤 부분이 강하고 어떤 부분이 약한지 살펴보는 것이 중요합니다.', '작명 결과는 최종 결정의 참고 자료로 활용하고, 가족이 부르기 편한 이름인지도 함께 고려하세요.']]
    ],
    related: [['/lifelong-saju','평생사주'], ['/family-saju','가족사주'], ['/fortune-dictionary','사주 용어 사전'], ['/guide','운세 칼럼']]
  },
  '/hybrid-compatibility': {
    title: '사주 MBTI 궁합 - 하이브리드 궁합 무료 분석 | 무운사주',
    description: '사주 오행과 MBTI 성향을 함께 비교해 연애, 결혼, 대화 방식, 갈등 포인트를 입체적으로 해석합니다.',
    h1: '사주 MBTI 하이브리드 궁합',
    intro: '하이브리드 궁합은 전통 사주 궁합과 현대 성격 유형인 MBTI를 함께 비교해 관계를 더 현실적으로 이해하도록 만든 궁합 분석입니다.',
    sections: [
      ['사주 궁합과 MBTI 궁합의 차이', ['사주 궁합은 태어난 연월일시의 오행과 십성 흐름을 바탕으로 관계의 기운을 봅니다. 반면 MBTI 궁합은 사고방식, 에너지 방향, 판단 기준, 생활 패턴의 차이를 중심으로 봅니다.', '두 기준을 함께 보면 “왜 끌리는지”, “왜 같은 문제로 반복해서 부딪히는지”, “어떤 대화 방식이 서로에게 편한지”를 더 구체적으로 살펴볼 수 있습니다.']],
      ['무운의 하이브리드 궁합이 보는 항목', ['오행의 보완 관계, 감정 표현 방식, 대화 속도, 갈등이 생기기 쉬운 상황, 장기 관계에서 중요한 생활 리듬을 함께 해석합니다.', '연애 초반의 끌림뿐 아니라 결혼이나 장기 연애에서 중요한 안정감, 신뢰감, 현실적인 역할 분담까지 함께 확인할 수 있도록 구성했습니다.']],
      ['이 결과를 어떻게 활용하면 좋을까', ['궁합 결과는 상대를 판단하기 위한 점수가 아니라 관계를 이해하기 위한 지도에 가깝습니다. 낮은 점수가 나와도 서로의 차이를 알고 조율하면 관계의 안정성이 높아질 수 있습니다.', '반대로 높은 점수가 나와도 대화 습관, 생활 방식, 감정 표현이 맞지 않으면 갈등이 생길 수 있으므로 결과의 해석 내용을 함께 읽는 것이 중요합니다.']]
    ],
    related: [['/compatibility','정통 사주 궁합'], ['/family-saju','가족사주'], ['/daily-fortune','오늘의 운세'], ['/guide','궁합 칼럼']]
  },
  '/compatibility': {
    title: '무료 사주 궁합 - 연애와 결혼 궁합 분석 | 무운사주',
    description: '두 사람의 생년월일시로 오행 조화, 성향 차이, 연애운과 결혼운의 흐름을 분석하는 무료 사주 궁합 서비스입니다.',
    h1: '무료 사주 궁합',
    intro: '사주 궁합은 두 사람의 타고난 기운이 서로에게 어떤 영향을 주는지 살피는 관계 해석입니다.',
    sections: [['궁합에서 보는 핵심', ['오행의 균형, 서로에게 필요한 기운, 감정 표현 방식, 갈등이 생기기 쉬운 지점, 장기 관계에서의 안정성을 함께 확인합니다.', '점수보다 중요한 것은 왜 그런 결과가 나왔는지 이해하는 것입니다. 무운은 결과 해석을 통해 관계를 더 잘 조율할 수 있는 방향을 제안합니다.']], ['연애와 결혼에서의 활용', ['연애 궁합은 끌림과 감정 흐름을, 결혼 궁합은 생활 리듬과 현실적인 조화를 더 중요하게 봅니다.', '서로 다른 기운이 반드시 나쁜 것은 아니며, 부족한 부분을 보완하는 관계일 수도 있습니다.']]],
    related: [['/hybrid-compatibility','사주 MBTI 궁합'], ['/family-saju','가족사주'], ['/lifelong-saju','평생사주']]
  },
  '/lifelong-saju': {
    title: '무료 평생사주 - 타고난 성향과 인생 흐름 분석 | 무운사주',
    description: '생년월일시를 바탕으로 성격, 재물운, 직업운, 연애운, 건강운, 대운 흐름을 종합적으로 보는 무료 평생사주입니다.',
    h1: '무료 평생사주',
    intro: '평생사주는 한 해 운세보다 더 넓은 관점에서 타고난 성향과 인생의 큰 흐름을 살피는 분석입니다.',
    sections: [['평생사주에서 확인하는 것', ['나의 기본 성향, 강한 오행과 부족한 오행, 재물과 일의 방향, 관계에서 반복되는 패턴, 인생의 중요한 전환기를 함께 확인합니다.', '결과는 정해진 운명을 단정하는 것이 아니라 나에게 맞는 선택 방향을 찾기 위한 참고 자료로 활용할 수 있습니다.']], ['대운과 세운의 차이', ['대운은 긴 주기로 바뀌는 인생의 큰 흐름이고, 세운은 해마다 달라지는 구체적인 분위기입니다.', '평생사주를 먼저 보면 매년 운세를 해석할 때 기준점이 생깁니다.']]],
    related: [['/yearly-fortune','2026년 신년운세'], ['/daily-fortune','오늘의 운세'], ['/career-fortune','직업운']]
  },
  '/daily-fortune': {
    title: '오늘의 운세 무료 확인 - 하루 운세와 조언 | 무운사주',
    description: '오늘의 재물운, 연애운, 일운, 건강운 흐름과 하루를 보내는 데 필요한 조언을 무료로 확인하세요.',
    h1: '오늘의 운세',
    intro: '오늘의 운세는 하루의 기운을 가볍게 확인하고 중요한 선택이나 대화에서 참고할 수 있는 짧은 운세 가이드입니다.',
    sections: [['오늘 운세에서 보는 항목', ['재물운, 연애운, 일운, 건강운, 주의해야 할 행동과 오늘의 조언을 함께 제공합니다.', '하루 운세는 큰 결정을 대신해 주는 도구가 아니라, 감정과 상황을 차분히 살피는 작은 기준으로 활용하는 것이 좋습니다.']], ['활용 팁', ['중요한 약속이나 업무가 있는 날에는 운세의 좋은 흐름보다 조심해야 할 부분을 먼저 확인해 보세요.', '좋은 운이 들어오는 날에도 무리한 선택보다는 준비된 일에 집중하는 것이 더 좋은 결과로 이어질 수 있습니다.']]],
    related: [['/yearly-fortune','신년운세'], ['/lifelong-saju','평생사주'], ['/dream','꿈해몽']]
  },
  '/yearly-fortune': {
    title: '2026년 신년운세 무료 분석 - 병오년 운세 | 무운사주',
    description: '2026년 병오년의 재물운, 직업운, 연애운, 건강운과 한 해의 중요한 흐름을 무료로 확인하세요.',
    h1: '2026년 신년운세',
    intro: '신년운세는 한 해 동안 나에게 어떤 기운이 강하게 들어오는지 살피고, 중요한 선택을 준비하는 데 도움을 주는 운세입니다.',
    sections: [['2026년 병오년의 흐름', ['2026년은 불의 기운이 강하게 작용하는 해로, 추진력과 변화의 흐름이 두드러질 수 있습니다.', '개인의 사주에 따라 좋은 기회로 작용할 수도 있고, 조급함이나 과열로 나타날 수도 있으므로 자신의 사주와 함께 보는 것이 중요합니다.']], ['분석 항목', ['총운, 재물운, 직업운, 연애운, 건강운, 월별 흐름, 조심해야 할 시기와 기회가 되는 시기를 함께 확인합니다.']]],
    related: [['/daily-fortune','오늘의 운세'], ['/lifelong-saju','평생사주'], ['/tojeong','토정비결']]
  },
  '/career-fortune': {
    title: '직업운 무료 분석 - 적성, 이직운, 커리어 흐름 | 무운사주',
    description: '사주를 바탕으로 나에게 맞는 일의 방향, 이직운, 직장운, 커리어 전환 시기를 확인합니다.',
    h1: '직업운 무료 분석',
    intro: '직업운은 단순히 좋은 직업을 맞히는 것이 아니라, 나의 기질과 강점이 어떤 일의 방식에서 잘 드러나는지 살피는 분석입니다.',
    sections: [['직업운에서 보는 것', ['십성과 오행을 통해 책임감, 창의성, 실행력, 분석력, 사람을 상대하는 능력, 독립성이 어떻게 나타나는지 봅니다.', '이직이나 창업을 고민할 때는 현재 대운과 세운의 흐름도 함께 보는 것이 좋습니다.']], ['커리어 해석 방법', ['직업운이 좋다는 것은 무조건 일이 편해진다는 뜻이 아니라, 나의 역량을 드러낼 기회가 많아진다는 의미일 수 있습니다.', '반대로 일이 답답한 시기에는 방향을 바꾸기보다 준비와 정리가 필요한 때일 수 있습니다.']]],
    related: [['/lifelong-saju','평생사주'], ['/yearly-fortune','신년운세'], ['/fortune-dictionary','운세 사전']]
  },
  '/moving-fortune': {
    title: '이사운 무료 분석 - 이사 방향과 시기 운세 | 무운사주',
    description: '사주와 운의 흐름을 바탕으로 이사, 집 선택, 방향, 시기와 관련된 운세를 확인합니다.',
    h1: '이사운 무료 분석',
    intro: '이사운은 집을 옮기는 시기와 방향이 나의 운세 흐름과 어떻게 맞물리는지 살피는 분석입니다.',
    sections: [['이사운에서 보는 항목', ['이사 시기, 새로운 환경과의 조화, 가족 구성원의 기운, 재물운과 생활 안정성, 방향 선택에서 주의할 점을 함께 확인합니다.', '좋은 이사운은 단순히 집값 상승을 뜻하기보다 새로운 공간에서 생활 리듬이 안정되고 기회가 넓어지는 흐름을 말합니다.']], ['이사 전 확인할 점', ['사주상 좋은 시기라도 실제 생활 조건, 통근, 학교, 예산, 건강 상태가 맞지 않으면 만족도가 떨어질 수 있습니다.', '운세는 현실 조건을 대체하는 것이 아니라 선택의 기준을 보완하는 역할로 보는 것이 좋습니다.']]],
    related: [['/family-saju','가족사주'], ['/yearly-fortune','신년운세'], ['/lifelong-saju','평생사주']]
  },
  '/manselyeok': {
    title: '만세력 무료 보기 - 사주팔자와 대운 확인 | 무운사주',
    description: '생년월일시로 사주팔자, 천간지지, 오행, 십성, 대운 정보를 확인할 수 있는 무료 만세력입니다.',
    h1: '무료 만세력',
    intro: '만세력은 사주 분석의 기본이 되는 네 기둥과 여덟 글자를 확인하는 도구입니다.',
    sections: [['만세력에서 확인하는 정보', ['년주, 월주, 일주, 시주, 천간과 지지, 오행 분포, 십성, 대운 흐름을 확인할 수 있습니다.', '사주 해석을 깊이 이해하려면 먼저 자신의 만세력을 보는 것이 도움이 됩니다.']], ['사용 방법', ['태어난 날짜와 시간을 입력하면 사주팔자가 계산됩니다. 태어난 시간을 모르는 경우에는 시주 해석이 제한될 수 있습니다.']]],
    related: [['/fortune-dictionary','사주 용어 사전'], ['/lifelong-saju','평생사주'], ['/guide','사주 칼럼']]
  },
  '/tojeong': {
    title: '토정비결 무료 보기 - 한 해 운세 풀이 | 무운사주',
    description: '전통적인 토정비결 방식으로 한 해의 운세 흐름과 조심해야 할 시기를 확인합니다.',
    h1: '토정비결 무료 보기',
    intro: '토정비결은 한 해의 길흉과 생활 속 조언을 살펴보는 전통 운세입니다.',
    sections: [['토정비결의 특징', ['신년운세가 사주와 해의 기운을 종합적으로 본다면, 토정비결은 한 해 동안의 생활 흐름과 조심해야 할 점을 비교적 쉽게 풀어보는 방식입니다.', '무운에서는 어렵게 느껴지는 전통 해석을 현대적인 문장으로 이해하기 쉽게 제공합니다.']], ['활용 방법', ['새해 계획을 세우거나 중요한 선택을 앞두고 있을 때, 토정비결의 조언을 참고해 무리한 시기와 준비가 필요한 시기를 구분해 보세요.']]],
    related: [['/yearly-fortune','신년운세'], ['/daily-fortune','오늘의 운세'], ['/lifelong-saju','평생사주']]
  },
  '/psychology': {
    title: '무료 심리테스트 - 성향과 관계 패턴 확인 | 무운사주',
    description: '간단한 질문을 통해 나의 성향, 감정 표현, 관계 패턴을 확인할 수 있는 무료 심리테스트입니다.',
    h1: '무료 심리테스트',
    intro: '심리테스트는 사주와는 다른 방식으로 현재의 감정 상태와 관계 패턴을 가볍게 확인하는 콘텐츠입니다.',
    sections: [['심리테스트에서 알 수 있는 것', ['선택 성향, 대화 방식, 스트레스 반응, 관계에서 반복되는 행동 패턴을 확인할 수 있습니다.', '결과는 절대적인 진단이 아니라 자신을 이해하기 위한 참고 자료입니다.']], ['사주와 함께 보면 좋은 이유', ['사주는 타고난 기질과 운의 흐름을 보고, 심리테스트는 현재의 마음 상태와 습관을 살핍니다.', '두 관점을 함께 보면 자신을 더 입체적으로 이해할 수 있습니다.']]],
    related: [['/hybrid-compatibility','사주 MBTI 궁합'], ['/daily-fortune','오늘의 운세'], ['/guide','운세 칼럼']]
  },
  '/astrology': {
    title: '무료 점성술 네이탈 차트 - 별자리와 행성 해석 | 무운사주',
    description: '태어난 시각과 장소를 바탕으로 네이탈 차트, 별자리, 행성 위치를 해석하는 무료 점성술 메뉴입니다.',
    h1: '무료 점성술 네이탈 차트',
    intro: '점성술은 태어난 순간의 행성 위치와 별자리 배치를 통해 성향과 인생의 테마를 해석하는 방식입니다.',
    sections: [['네이탈 차트란?', ['네이탈 차트는 태어난 순간의 하늘을 개인의 지도처럼 펼쳐 보는 도구입니다.', '태양, 달, 상승궁, 금성, 화성 등 행성의 위치를 통해 성향, 관계, 일, 감정 표현의 특징을 살펴볼 수 있습니다.']], ['사주와 점성술의 차이', ['사주는 음양오행과 천간지지를 중심으로 보고, 점성술은 별자리와 행성의 배치를 중심으로 봅니다.', '무운에서는 동양 운세와 서양 점성술을 함께 탐색할 수 있도록 메뉴를 구성했습니다.']]],
    related: [['/lifelong-saju','평생사주'], ['/psychology','심리테스트'], ['/guide','운세 칼럼']]
  },
  '/tarot': {
    title: '무료 타로 보기 - 오늘의 카드와 고민 상담 | 무운사주',
    description: '지금의 고민에 맞는 타로 카드를 뽑고 카드가 전하는 조언을 확인하는 무료 타로 메뉴입니다.',
    h1: '무료 타로 보기',
    intro: '타로는 현재의 고민과 마음 상태를 상징적인 카드로 살펴보는 직관형 운세입니다.',
    sections: [['타로가 잘 맞는 질문', ['연애, 인간관계, 선택의 고민, 일의 방향처럼 지금 마음이 흔들리는 주제에 잘 어울립니다.', '타로는 미래를 단정하기보다 현재 상황에서 놓치고 있는 포인트를 보여주는 조언으로 이해하면 좋습니다.']], ['결과를 읽는 방법', ['좋은 카드와 나쁜 카드를 단순히 나누기보다, 카드가 말하는 상황과 태도를 함께 살펴보세요.', '같은 카드라도 질문에 따라 의미가 달라질 수 있습니다.']]],
    related: [['/tarot-history','타로 히스토리'], ['/daily-fortune','오늘의 운세'], ['/psychology','심리테스트']]
  },
  '/lucky-lunch': {
    title: '오늘의 행운 점심 메뉴 추천 | 무운사주',
    description: '오늘의 운세 흐름에 맞춰 가볍게 참고할 수 있는 행운의 점심 메뉴를 추천합니다.',
    h1: '오늘의 행운 점심',
    intro: '행운 점심은 하루 운세를 가볍고 재미있게 활용할 수 있도록 만든 메뉴 추천 콘텐츠입니다.',
    sections: [['행운 메뉴의 의미', ['오행과 계절감, 하루의 기운을 바탕으로 오늘 어울리는 음식의 분위기를 제안합니다.', '중요한 결정이 아니라 일상 속 작은 재미로 활용하면 좋습니다.']], ['활용 방법', ['메뉴를 고르기 어려운 날, 오늘의 운세와 함께 행운 점심을 확인해 보세요.', '가벼운 선택이 하루의 기분을 바꾸는 계기가 될 수 있습니다.']]],
    related: [['/daily-fortune','오늘의 운세'], ['/yearly-fortune','신년운세']]
  },
  '/past-life': {
    title: '전생 테스트 무료 보기 - 나의 전생 성향 해석 | 무운사주',
    description: '상징적인 질문을 통해 나의 전생 이미지와 현재 성향의 연결점을 재미있게 확인하는 무료 전생 테스트입니다.',
    h1: '전생 테스트',
    intro: '전생 테스트는 운세를 가볍게 즐길 수 있도록 만든 상징형 콘텐츠입니다.',
    sections: [['전생 테스트의 의미', ['전생 결과는 실제 과거를 증명하는 진단이 아니라, 현재 나의 성향을 상징적인 이야기로 풀어보는 방식입니다.', '자신이 중요하게 여기는 가치, 관계에서 반복되는 태도, 끌리는 이미지 등을 재미있게 확인할 수 있습니다.']], ['함께 보면 좋은 메뉴', ['전생 테스트를 본 뒤 평생사주나 심리테스트를 함께 보면 나의 성향을 다른 관점에서 비교할 수 있습니다.']]],
    related: [['/psychology','심리테스트'], ['/lifelong-saju','평생사주'], ['/daily-fortune','오늘의 운세']]
  },
  '/tarot-history': {
    title: '타로 카드의 역사와 의미 | 무운사주',
    description: '타로 카드가 어떻게 시작되었고, 오늘날 운세와 상담 도구로 활용되는지 쉽게 정리했습니다.',
    h1: '타로 카드의 역사',
    intro: '타로는 오랜 시간 동안 상징과 이야기의 도구로 사용되어 왔고, 오늘날에는 고민을 정리하는 상담형 콘텐츠로 많이 활용됩니다.',
    sections: [['타로의 시작', ['타로 카드는 놀이 카드에서 시작해 점차 상징 해석과 상담의 도구로 확장되었습니다.', '각 카드는 인물, 숫자, 색, 장면을 통해 감정과 상황을 표현합니다.']], ['타로를 읽는 태도', ['타로는 정답을 알려주는 도구라기보다 질문을 더 깊게 바라보게 하는 상징 체계입니다.', '카드의 의미를 현재 상황에 맞춰 해석하는 것이 중요합니다.']]],
    related: [['/tarot','무료 타로 보기'], ['/psychology','심리테스트']]
  },
  '/more': {
    title: '무운 전체 메뉴 - 무료 사주와 운세 서비스 모아보기 | 무운사주',
    description: '무운사주의 평생사주, 신년운세, 궁합, 작명, 꿈해몽, 운세 사전, 점성술, 타로 등 전체 메뉴를 한눈에 확인하세요.',
    h1: '무운 전체 메뉴',
    intro: '무운의 전체 운세 메뉴를 한눈에 볼 수 있는 안내 페이지입니다.',
    sections: [['주요 운세 메뉴', ['평생사주, 오늘의 운세, 신년운세, 궁합, 가족사주, 작명, 이사운, 직업운처럼 자주 찾는 메뉴를 빠르게 이동할 수 있습니다.', '꿈해몽, 운세 사전, 운세 칼럼은 검색을 통해 들어온 사용자도 관련 정보를 이어서 읽을 수 있도록 구성했습니다.']], ['어떤 메뉴부터 보면 좋을까', ['처음 방문했다면 평생사주로 기본 성향을 확인하고, 오늘의 운세와 신년운세로 현재 흐름을 비교해 보세요.', '관계 고민이 있다면 궁합과 가족사주를, 이름이나 이사를 고민한다면 작명과 이사운 메뉴를 함께 보는 것이 좋습니다.']]],
    related: [['/lifelong-saju','평생사주'], ['/compatibility','궁합'], ['/naming','작명'], ['/dream','꿈해몽']]
  },
  '/about': {
    title: '무운 소개 - 무료 사주와 운세 콘텐츠 서비스',
    description: '무운사주는 사주, 운세, 궁합, 꿈해몽, 운세 사전을 쉽고 편하게 볼 수 있도록 만든 무료 운세 콘텐츠 서비스입니다.',
    h1: '무운 소개',
    intro: '무운은 어려운 운세 용어를 쉽고 편하게 풀어내고, 누구나 회원가입 없이 자신의 운세 흐름을 확인할 수 있도록 만든 서비스입니다.',
    sections: [['서비스 방향', ['무운은 운세를 맹신하기보다 나를 이해하고 선택을 정리하는 참고 자료로 활용하는 것을 지향합니다.', '사주, 점성술, 타로, 심리테스트처럼 서로 다른 관점을 한 곳에서 비교할 수 있도록 콘텐츠를 확장하고 있습니다.']]],
    related: [['/guide','운세 칼럼'], ['/fortune-dictionary','운세 사전'], ['/contact','문의하기']]
  },
  '/contact': {
    title: '무운 문의하기 - 서비스 제안과 오류 신고',
    description: '무운사주 서비스 이용 중 궁금한 점, 오류 신고, 제휴 제안이 있다면 문의해 주세요.',
    h1: '문의하기',
    intro: '무운 이용 중 불편한 점이나 개선 의견이 있다면 언제든 문의해 주세요.',
    sections: [['문의 가능한 내용', ['서비스 오류, 콘텐츠 수정 요청, 제휴 제안, 개인정보 관련 문의 등을 남길 수 있습니다.', '운세 결과는 참고용 콘텐츠이므로 개인의 중요한 의사결정은 현실적인 조건과 함께 판단하는 것을 권장합니다.']]],
    related: [['/about','무운 소개'], ['/privacy','개인정보처리방침'], ['/terms','이용약관']]
  },
  '/privacy': {
    title: '개인정보처리방침 | 무운사주',
    description: '무운사주의 개인정보 수집, 이용, 보관, 파기 기준을 안내합니다.',
    h1: '개인정보처리방침',
    intro: '무운은 서비스 제공에 필요한 범위 내에서 개인정보를 처리하며, 관련 법령과 내부 기준에 따라 안전하게 관리합니다.',
    sections: [['개인정보 처리 원칙', ['입력한 생년월일시 등 운세 분석 정보는 결과 제공을 위한 목적으로 사용됩니다.', '서비스 운영에 필요한 최소한의 정보만 처리하고, 불필요한 정보 보관을 지양합니다.']]],
    related: [['/terms','이용약관'], ['/contact','문의하기']]
  },
  '/terms': {
    title: '이용약관 | 무운사주',
    description: '무운사주 서비스 이용 조건과 책임 범위, 콘텐츠 이용 기준을 안내합니다.',
    h1: '이용약관',
    intro: '무운사주를 이용하기 전에 서비스 이용 조건과 콘텐츠 활용 기준을 확인해 주세요.',
    sections: [['서비스 이용 안내', ['무운의 운세 콘텐츠는 참고용 정보이며, 법률·의료·투자 등 전문 의사결정을 대신하지 않습니다.', '서비스의 안정적인 운영을 방해하거나 콘텐츠를 무단으로 복제하는 행위는 제한될 수 있습니다.']]],
    related: [['/privacy','개인정보처리방침'], ['/contact','문의하기']]
  }
};

function buildCoreLandingPage(url) {
  const config = CORE_LANDING_CONTENT[url];
  if (!config) return null;
  return {
    appHtml: buildPageShell({
      h1: config.h1,
      description: config.intro,
      sections: config.sections.map(([heading, paragraphs]) => ({ heading, paragraphs })),
      breadcrumbs: [{ href: '/', label: '홈' }, { label: config.h1 }],
      relatedLinks: (config.related || []).map(([href, label]) => ({ href, label })),
    }),
    head: makeHead({
      title: config.title,
      description: config.description,
      canonicalUrl: `${BASE_URL}${url}`,
      ogType: 'website',
      schema: [
        { '@context': 'https://schema.org', '@type': 'WebPage', name: config.h1, url: `${BASE_URL}${url}`, description: config.description, isPartOf: { '@type': 'WebSite', name: '무운사주', url: BASE_URL } },
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL }, { '@type': 'ListItem', position: 2, name: config.h1, item: `${BASE_URL}${url}` } ] }
      ]
    }),
    dehydratedState: {}
  };
}

function buildHtmlFromTemplate(template, page) { 
  return template
    .replace('<!--app-head-->', `${page.head.title}${page.head.meta}${page.head.link || ''}${page.head.schema ? `\n    ${page.head.schema}` : ''}`)
    .replace('<!--app-html-->', page.appHtml)
    .replace('<!--__REACT_QUERY_STATE__-->', `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(page.dehydratedState || {})}</script>`); 
}

function writeOutput(url, html) { 
  const filePath = url === '/' ? toAbsolute('../client/dist/public/index.html') : toAbsolute(`../client/dist/public${url}/index.html`); 
  fs.mkdirSync(path.dirname(filePath), { recursive: true }); 
  fs.writeFileSync(filePath, html); 
}

function dedupeByUrl(pages) { const seen = new Set(); return pages.filter((item) => { if (seen.has(item.url)) return false; seen.add(item.url); return true; }); }

async function run() {
  console.log('🚀 Starting SEO-optimized pre-render (DB-driven detail pages)...');
  const templatePath = toAbsolute('../client/dist/public/index.html');
  const rawTemplate = fs.readFileSync(templatePath, 'utf-8');
  const template = ensureTemplateMarkers(rawTemplate);
  const serverEntryPath = toAbsolute('../client/dist/server/entry-server.js');
  const { render } = await import(pathToFileURL(serverEntryPath).href);
  
  console.log('📡 Fetching published SEO datasets from Supabase...');
  const [columns, dreams, dictionaryEntries] = await Promise.all([fetchColumns(), fetchDreams(), fetchDictionaryEntries()]);
  
  const HEX_SUFFIX_PATTERN = /-[0-9a-f]{8}$/;
  function resolveGuideSlug(column) {
    const slug = normalizeSlug(column.slug || column.id);
    if (HEX_SUFFIX_PATTERN.test(slug)) return slug; // 이미 hex suffix 있음
    const idShort = String(column.id || '').toLowerCase().match(/^([0-9a-f]{8})/)?.[1];
    return idShort ? `${slug}-${idShort}` : slug;
  }

  const guidePages = dedupeByUrl(columns.map((column) => {
    const finalSlug = resolveGuideSlug(column);
    return { url: `/guide/${finalSlug}`, page: buildGuidePage({ ...column, slug: finalSlug }) };
  }));
  const dreamPages = dedupeByUrl(dreams.map((dream) => ({ url: `/dream/${normalizeSlug(dream.slug)}`, page: buildDreamPage({ ...dream, slug: normalizeSlug(dream.slug) }) })));
  const dictionaryPages = dedupeByUrl(dictionaryEntries.map((entry) => ({ url: `/dictionary/${normalizeSlug(entry.slug)}`, page: buildDictionaryPage({ ...entry, slug: normalizeSlug(entry.slug) }) })));
  
  // fortune-dictionary 인덱스: 발행된 사전 항목은 단어별 상세 URL로 모두 연결합니다.
  const validDictEntries = dictionaryEntries
    .map((entry) => ({ ...entry, slug: normalizeSlug(entry.slug) }))
    .filter((entry) => entry.slug);
  const dictionaryIndexHtml = buildPageShell({
    h1: '무운 운세 사전',
    description: '사주 명리학의 핵심 용어를 쉽게 풀이한 무료 사주 용어 사전입니다.',
    sections: [
      { heading: '사주 용어 목록', paragraphs: ['아래는 무운에서 제공하는 주요 사주 용어들입니다. 각 항목을 클릭하여 상세한 설명을 확인하세요.'] },
      { heading: '용어 리스트', paragraphs: validDictEntries.map(e => `<a href="/dictionary/${e.slug}">${e.title}</a>`) }
    ],
    breadcrumbs: [{ href: '/', label: '홈' }, { label: '운세 사전' }]
  });
  
  const dictionaryIndexPage = {
    appHtml: dictionaryIndexHtml,
    head: makeHead({ title: '사주 용어 사전 - 무운', description: '사주 명리학의 핵심 용어를 쉽게 풀이한 무료 사주 용어 사전', canonicalUrl: `${BASE_URL}/fortune-dictionary` })
  };

  const yearlyFortuneHtml = buildPageShell({
    h1: '2026년 신년운세 - 무운 (MuUn)',
    description: '당신의 생년월일시로 풀어보는 2026년 병오년(丙午年) 상세 운세 리포트입니다.',
    sections: [
      { heading: '2026년 병오년, 당신의 운명은?', paragraphs: ['무운의 신년운세는 정통 명리학을 바탕으로 당신의 사주 팔자와 2026년의 기운이 어떻게 조화를 이루는지 분석합니다.', '재물운, 연애운, 건강운, 직업운 등 인생의 주요 영역에 대한 상세한 가이드를 확인하세요.'] },
      { heading: '운세 분석 항목', paragraphs: ['1. 총운: 한 해의 전반적인 흐름과 핵심 키워드', '2. 재물운: 자산 관리 및 투자, 소득의 변화', '3. 애정운: 새로운 인연 또는 관계의 발전', '4. 건강운: 주의해야 할 질환 및 에너지 관리'] }
    ],
    breadcrumbs: [{ href: '/', label: '홈' }, { label: '신년운세' }],
    relatedLinks: [{ href: '/daily-fortune', label: '오늘의 운세 보기' }, { href: '/lifelong-saju', label: '평생사주 보기' }]
  });

  const guideIndexHtml = buildPageShell({
    h1: '무운 운세 칼럼',
    description: `사주, 운세, 궁합, 개운법을 쉽게 이해할 수 있도록 정리한 ${columns.length.toLocaleString('ko-KR')}개의 운세 칼럼입니다.`,
    sections: [
      { heading: '운세 칼럼에서 다루는 주제', paragraphs: ['사주 기초, 십성, 오행, 궁합, 재물운, 직업운, 건강운, 가족운, 개운법처럼 실제로 자주 궁금해하는 주제를 쉽게 풀어 설명합니다.', '칼럼은 단순한 운세 결과가 아니라 왜 그런 해석이 나오는지 이해할 수 있도록 원리와 예시를 함께 제공합니다.'] },
      { heading: '최근 운세 칼럼', paragraphs: columns.slice(0, 30).map((c) => `<a href="/guide/${resolveGuideSlug(c)}">${escapeHtml(c.title)}</a>`) }
    ],
    breadcrumbs: [{ href: '/', label: '홈' }, { label: '운세 칼럼' }],
    relatedLinks: [{ href: '/fortune-dictionary', label: '운세 사전' }, { href: '/lifelong-saju', label: '평생사주' }, { href: '/dream', label: '꿈해몽' }]
  });

  const dreamIndexHtml = buildPageShell({
    h1: '무운 꿈해몽 사전',
    description: `어젯밤 꿈속의 상징이 궁금하신가요? ${dreams.length.toLocaleString('ko-KR')}개 꿈 키워드로 당신의 무의식을 해석해 드립니다.`,
    sections: [
      { heading: '꿈해몽 카테고리', paragraphs: ['동물 꿈, 사람 꿈, 자연 꿈 등 다양한 상황별 꿈풀이를 제공합니다.', '꿈은 당신의 심리 상태와 다가올 미래의 징조를 담고 있습니다.'] },
      { heading: '인기 꿈해몽 키워드', paragraphs: dreams.slice(0, 20).map(d => `<a href="/dream/${d.slug}">${d.keyword}</a>`) }
    ],
    breadcrumbs: [{ href: '/', label: '홈' }, { label: '꿈해몽' }]
  });

  console.log(`📦 Static routes: ${STATIC_ROUTES.length}`);
  let successCount = 0;
  for (const url of STATIC_ROUTES) {
    try {
      let page;
      const coreLandingPage = buildCoreLandingPage(url);
      if (url === '/fortune-dictionary') {
        page = dictionaryIndexPage;
      } else if (url === '/guide') {
        page = { appHtml: guideIndexHtml, head: makeHead({ title: '운세 칼럼 - 사주와 궁합을 쉽게 읽는 글 | 무운사주', description: `${columns.length.toLocaleString('ko-KR')}개의 사주, 운세, 궁합, 개운법 칼럼을 쉽게 읽어보세요.`, canonicalUrl: `${BASE_URL}/guide`, ogType: 'website' }) };
      } else if (url === '/dream') {
        page = { appHtml: dreamIndexHtml, head: makeHead({ title: '꿈해몽 사전 - 무운', description: `${dreams.length.toLocaleString('ko-KR')}개 키워드로 풀어보는 무료 꿈해몽`, canonicalUrl: `${BASE_URL}/dream`, ogType: 'website' }) };
      } else if (coreLandingPage) {
        // 전체 메뉴 색인 실패 대응: React SSR 결과가 얇거나 폼 중심으로 보이는 것을 막기 위해
        // 핵심/서브 메뉴는 고유 본문이 포함된 정적 SEO 랜딩 HTML을 우선 배포합니다.
        page = coreLandingPage;
      } else {
        page = await render({ path: url });
      }
      writeOutput(url, buildHtmlFromTemplate(template, page));
      successCount += 1;
    } catch (error) { console.error(`❌ Failed to render ${url}:`, error); }
  }
  
  const detailPages = [...guidePages, ...dreamPages, ...dictionaryPages];
  for (const { url, page } of detailPages) {
    try { writeOutput(url, buildHtmlFromTemplate(template, { ...page, dehydratedState: {} })); successCount += 1; } catch (error) { console.error(`❌ Failed to build detail page ${url}:`, error); }
  }
  console.log(`✨ Successfully pre-rendered ${successCount} pages`);
}

run().catch((error) => { console.error('❌ Fatal prerender error:', error); process.exit(1); });
