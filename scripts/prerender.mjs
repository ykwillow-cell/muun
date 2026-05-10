import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadColumnsDataset, loadDreamsDataset, loadDictionaryDataset } from './utils/content-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);
const BASE_URL = 'https://muunsaju.com';

const STATIC_ROUTES = [
  '/', '/yearly-fortune', '/manselyeok', '/daily-fortune', '/dream', '/lifelong-saju',
  '/compatibility', '/tojeong', '/psychology', '/astrology', '/tarot', '/about',
  '/privacy', '/terms', '/family-saju', '/hybrid-compatibility', '/fortune-dictionary',
  '/naming', '/lucky-lunch', '/contact', '/guide',
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
  const title = `${column.title} | 무운 운세 칼럼`;
  const description = truncate(stripHtml(column.content), 160);
  const canonicalUrl = `${BASE_URL}/guide/${column.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", "headline": column.title, "description": description, "author": { "@type": "Organization", "name": "무운 (MuUn)" }, "datePublished": column.created_at };
  return {
    appHtml: buildPageShell({ sectionLabel: categoryLabel, h1: column.title, description: `발행일: ${formatKoreanDate(column.created_at)}`, sections: [{ paragraphs: [stripHtml(column.content)] }], breadcrumbs: [{ href: '/', label: '홈' }, { href: '/guide', label: '운세 칼럼' }, { label: column.title }], relatedLinks: [{ href: '/guide', label: '칼럼 더 보기' }, { href: '/lifelong-saju', label: '무료 평생사주 보기' }] }),
    head: makeHead({ title, description, canonicalUrl, keywords: [column.title, categoryLabel, '사주칼럼', '운세팁'].join(', '), ogType: 'article', schema, extraMeta: [`<meta property="article:published_time" content="${column.created_at}">`, `<meta property="article:section" content="${escapeHtml(categoryLabel)}">`] }),
  };
}

function buildDreamPage(dream) {
  const categoryLabel = DREAM_CATEGORY_LABELS[dream.category] || '꿈해몽';
  const title = `${dream.keyword} 꿈해몽 풀이 | 무운`;
  // DB 실제 필드명: interpretation (content 는 레거시 호환)
  const dreamContent = dream.interpretation || dream.traditional_meaning || dream.psychological_meaning || dream.content || '';
  const description = truncate(stripHtml(dreamContent), 160);
  const canonicalUrl = `${BASE_URL}/dream/${dream.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", "headline": `${dream.keyword} 꿈해몽`, "description": description, "author": { "@type": "Organization", "name": "무운 (MuUn)" } };
  return {
    appHtml: buildPageShell({ sectionLabel: `꿈해몽 > ${categoryLabel}`, h1: `${dream.keyword} 꿈해몽`, description: '꿈속의 상징이 알려주는 당신의 미래와 심리 상태를 확인하세요.', sections: [{ paragraphs: [stripHtml(dreamContent)] }], breadcrumbs: [{ href: '/', label: '홈' }, { href: '/dream', label: '꿈해몽' }, { label: dream.keyword }], relatedLinks: [{ href: '/dream', label: '다른 꿈해몽 찾기' }, { href: '/daily-fortune', label: '오늘의 운세 보기' }] }),
    head: makeHead({ title, description, canonicalUrl, keywords: [dream.keyword, '꿈해몽', '꿈풀이', categoryLabel].join(', '), ogType: 'article', schema }),
  };
}

function buildDictionaryPage(entry) {
  const categoryLabel = DICTIONARY_CATEGORY_LABELS[entry.category] || '사주 용어';
  const title = `${entry.title} 뜻과 특징 - 사주 용어 사전 | 무운`;
  // DB 실제 필드명: original_meaning, modern_interpretation (content 는 레거시 호환)
  const entryContent = [entry.original_meaning, entry.modern_interpretation, entry.content].filter(Boolean).join('\n\n');
  const description = truncate(stripHtml(entry.summary || entryContent), 160);
  const canonicalUrl = `${BASE_URL}/dictionary/${entry.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", "headline": entry.title, "description": description, "author": { "@type": "Organization", "name": "무운 (MuUn)" } };
  return {
    appHtml: buildPageShell({ sectionLabel: `운세 사전 > ${categoryLabel}`, h1: entry.title, description: entry.summary || '사주 명리학의 핵심 용어를 알기 쉽게 설명해 드립니다.', sections: [{ heading: '용어 설명', paragraphs: [stripHtml(entryContent) || entry.summary || ''] }, entry.muun_advice ? { heading: '무운의 조언', paragraphs: [truncate(stripHtml(entry.muun_advice), 900)] } : null].filter(Boolean), breadcrumbs: [{ href: '/', label: '홈' }, { href: '/fortune-dictionary', label: '운세 사전' }, { label: entry.title }], relatedLinks: [{ href: '/fortune-dictionary', label: '운세 사전 더 보기' }, { href: '/lifelong-saju', label: '무료 평생사주 보기' }, { href: '/family-saju', label: '가족사주 보기' }] }),
    head: makeHead({ title, description, canonicalUrl, keywords: [entry.title, ...(Array.isArray(entry.tags) ? entry.tags : []), '운세사전', '사주용어'].filter(Boolean).join(', '), ogType: 'article', schema, extraMeta: [`<meta property="article:section" content="${escapeHtml(categoryLabel)}">`] }),
  };
}

async function fetchColumns() {
  const result = await loadColumnsDataset({ limit: 500 });
  return result.rows.filter((row) => isValidSlug(row.slug || row.id) && row.title);
}

async function fetchDreams() {
  const result = await loadDreamsDataset({ limit: 600 });
  return result.rows.filter((row) => isValidSlug(row.slug) && row.keyword);
}

async function fetchDictionaryEntries() {
  const result = await loadDictionaryDataset({ limit: 500 });
  return result.rows.filter((row) => isValidSlug(row.slug) && row.title);
}

function buildHtmlFromTemplate(template, page) { 
  return template
    .replace('<!--app-head-->', `${page.head.title}${page.head.meta}${page.head.link}`)
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
  
  // fortune-dictionary 인덱스: stale short slug(20자 이하 3단어 이하)는 링크에서 제외
  const validDictEntries = dictionaryEntries.filter(e => {
    const s = normalizeSlug(e.slug);
    return s.length > 20 || s.split('-').length > 3;
  });
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

  const dreamIndexHtml = buildPageShell({
    h1: '무운 꿈해몽 사전',
    description: '어젯밤 꿈속의 상징이 궁금하신가요? 500개 이상의 꿈 키워드로 당신의 무의식을 해석해 드립니다.',
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
      if (url === '/fortune-dictionary') {
        page = dictionaryIndexPage;
      } else if (url === '/yearly-fortune') {
        page = { appHtml: yearlyFortuneHtml, head: makeHead({ title: '2026년 신년운세 - 무운', description: '2026년 병오년 상세 운세 리포트', canonicalUrl: `${BASE_URL}/yearly-fortune` }) };
      } else if (url === '/dream') {
        page = { appHtml: dreamIndexHtml, head: makeHead({ title: '꿈해몽 사전 - 무운', description: '500개 이상의 키워드로 풀어보는 무료 꿈해몽', canonicalUrl: `${BASE_URL}/dream` }) };
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
