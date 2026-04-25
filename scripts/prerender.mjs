#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadColumnsDataset, loadDreamsDataset, loadDictionaryDataset } from './utils/content-data.mjs';

const BUILD_START_TIME = Date.now();
const MAX_PRERENDER_SECONDS = 2000;
const BASE_URL = 'https://muunsaju.com';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

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

function ensureTemplateMarkers(template) {
  let next = template;
  if (!next.includes('<!--app-html-->')) next = next.replace('<div id="root"></div>', '<div id="root"><!--app-html--></div>');
  if (!next.includes('<!--app-head-->')) next = next.replace('</title>', '</title><!--app-head-->');
  if (!next.includes('<!--__REACT_QUERY_STATE__-->')) next = next.replace('</body>', '<!--__REACT_QUERY_STATE__--></body>');
  return next;
}

function escapeHtml(value = '') { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function stripHtml(value = '') { return String(value).replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim(); }
function truncate(value = '', maxLength = 160) { const text = String(value).trim(); return text.length <= maxLength ? text : `${text.slice(0, Math.max(0, maxLength - 1)).trim()}…`; }
function formatKoreanDate(value) { if (!value) return ''; const date = new Date(value); return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }); }
function normalizeSlug(value) { return String(value || '').trim().toLowerCase(); }
function isValidSlug(value) { return SLUG_PATTERN.test(normalizeSlug(value)); }

function buildPageShell({ sectionLabel, h1, description, metaLines = [], sections = [], breadcrumbs = [], relatedLinks = [] }) {
  const breadcrumbHtml = breadcrumbs.length ? `<nav aria-label="breadcrumb"><ol>${breadcrumbs.map((item, index) => { const content = item.href ? `<a href="${item.href}">${escapeHtml(item.label)}</a>` : `<span aria-current="page">${escapeHtml(item.label)}</span>`; return `<li>${content}${index < breadcrumbs.length - 1 ? ' › ' : ''}</li>`; }).join('')}</ol></nav>` : '';
  const metaHtml = metaLines.length ? `<ul>${metaLines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : '';
  const sectionsHtml = sections.filter(Boolean).map((section) => `<section>${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}${(section.paragraphs || []).filter(Boolean).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('');
  const relatedHtml = relatedLinks.length ? `<section aria-label="관련 서비스"><h2>함께 보면 좋은 서비스</h2><ul>${relatedLinks.map((link) => `<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`).join('')}</ul></section>` : '';
  return `<header><nav aria-label="주요 메뉴"><a href="/">홈</a><a href="/yearly-fortune">신년운세</a><a href="/lifelong-saju">평생사주</a><a href="/compatibility">궁합</a><a href="/dream">꿈해몽</a><a href="/guide">운세 칼럼</a></nav></header><main>${breadcrumbHtml}<article>${sectionLabel ? `<p>${escapeHtml(sectionLabel)}</p>` : ''}<h1>${escapeHtml(h1)}</h1><p>${escapeHtml(description)}</p>${metaHtml}${sectionsHtml}</article>${relatedHtml}</main><footer><nav aria-label="푸터 메뉴"><a href="/about">무운 소개</a><a href="/contact">문의하기</a><a href="/privacy">개인정보처리방침</a><a href="/terms">이용약관</a></nav><p>© 2026 MUUN. All rights reserved.</p></footer>`;
}

function makeHead({ title, description, canonicalUrl, keywords = '', ogType = 'article', ogImage = `${BASE_URL}/images/horse_mascot.png`, schema = [], extraMeta = [] }) {
  const schemaScripts = schema.filter(Boolean).map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join('\n    ');
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
      `<link rel="alternate" type="application/rss+xml" title="무운 (MuUn) RSS" href="${BASE_URL}/rss.xml">`,
      ...extraMeta,
      schemaScripts,
    ].filter(Boolean).join('\n    '),
    link: `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
  };
}

function buildGuidePage(column) {
  const slug = normalizeSlug(column.slug || column.id);
  const canonicalUrl = `${BASE_URL}/guide/${slug}`;
  const title = column.meta_title || `${column.title} | 무운 (MuUn)`;
  const plainContent = stripHtml(column.content || '');
  const description = column.meta_description || column.description || truncate(plainContent, 155);
  const articlePreview = truncate(plainContent, 1200);
  const categoryLabel = GUIDE_CATEGORY_LABELS[column.category] || '운세 칼럼';
  const publishedDate = column.published_at || column.created_at || undefined;
  const schema = [
    { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: column.title, description, url: canonicalUrl, datePublished: publishedDate, dateModified: publishedDate, author: { '@type': 'Organization', name: column.author || '무운 역술팀' }, publisher: { '@type': 'Organization', name: '무운 (MuUn)', url: BASE_URL, logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/muun_logo.png` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }, image: column.thumbnail_url || `${BASE_URL}/images/horse_mascot.png`, keywords: Array.isArray(column.keywords) ? column.keywords.join(', ') : '', articleBody: articlePreview, articleSection: categoryLabel, inLanguage: 'ko-KR' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL }, { '@type': 'ListItem', position: 2, name: '운세 칼럼', item: `${BASE_URL}/guide` }, { '@type': 'ListItem', position: 3, name: column.title, item: canonicalUrl }] },
  ];
  return {
    appHtml: buildPageShell({ sectionLabel: categoryLabel, h1: column.title, description, metaLines: [column.author ? `작성: ${column.author}` : '', formatKoreanDate(publishedDate), column.read_time ? `${column.read_time}분 읽기` : ''].filter(Boolean), sections: [{ heading: '핵심 요약', paragraphs: [description] }, articlePreview ? { heading: '본문 미리보기', paragraphs: [articlePreview] } : null].filter(Boolean), breadcrumbs: [{ href: '/', label: '홈' }, { href: '/guide', label: '운세 칼럼' }, { label: column.title }], relatedLinks: [{ href: '/guide', label: '운세 칼럼 더 보기' }, { href: '/lifelong-saju', label: '무료 평생사주 보기' }, { href: '/compatibility', label: '무료 궁합 보기' }] }),
    head: makeHead({ title, description, canonicalUrl, keywords: Array.isArray(column.keywords) ? column.keywords.join(', ') : '사주칼럼, 운세칼럼, 개운법, 무운', ogType: 'article', ogImage: column.thumbnail_url || `${BASE_URL}/images/horse_mascot.png`, schema, extraMeta: [publishedDate ? `<meta property="article:published_time" content="${escapeHtml(publishedDate)}">` : '', publishedDate ? `<meta property="article:modified_time" content="${escapeHtml(publishedDate)}">` : '', `<meta property="article:section" content="${escapeHtml(categoryLabel)}">`] }),
  };
}

function buildDreamPage(dream) {
  const canonicalUrl = `${BASE_URL}/dream/${dream.slug}`;
  const title = dream.meta_title || `${dream.keyword} 꿈해몽 | 무운`;
  const description = dream.meta_description || truncate(stripHtml(dream.interpretation || ''), 155) || `${dream.keyword} 꿈의 의미와 해석을 알아보세요.`;
  const gradeLabel = dream.grade === 'great' ? '황금빛 길몽' : dream.grade === 'bad' ? '보랏빛 흉몽' : '푸른 평몽';
  const categoryLabel = DREAM_CATEGORY_LABELS[dream.category] || '기타';
  const publishedDate = dream.published_at || dream.created_at || undefined;
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: `${dream.keyword} 꿈은 무슨 의미인가요?`, acceptedAnswer: { '@type': 'Answer', text: truncate(stripHtml(dream.interpretation || ''), 400) } }, dream.traditional_meaning ? { '@type': 'Question', name: `${dream.keyword} 꿈의 전통적 해석은 무엇인가요?`, acceptedAnswer: { '@type': 'Answer', text: truncate(stripHtml(dream.traditional_meaning), 400) } } : null, dream.psychological_meaning ? { '@type': 'Question', name: `${dream.keyword} 꿈의 심리적 의미는 무엇인가요?`, acceptedAnswer: { '@type': 'Answer', text: truncate(stripHtml(dream.psychological_meaning), 400) } } : null].filter(Boolean) };
  const schema = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: title, description, url: canonicalUrl, datePublished: publishedDate, dateModified: publishedDate, publisher: { '@type': 'Organization', name: '무운 (MuUn)', url: BASE_URL, logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/muun_logo.png` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }, articleSection: categoryLabel, articleBody: truncate(stripHtml(dream.interpretation || ''), 1200), inLanguage: 'ko-KR' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL }, { '@type': 'ListItem', position: 2, name: '꿈해몽', item: `${BASE_URL}/dream` }, { '@type': 'ListItem', position: 3, name: dream.keyword, item: canonicalUrl }] },
    faqSchema,
  ];
  return {
    appHtml: buildPageShell({ sectionLabel: `꿈해몽 · ${categoryLabel}`, h1: `${dream.keyword} 꿈해몽`, description, metaLines: [gradeLabel, typeof dream.score === 'number' ? `해석 점수 ${dream.score}점` : '', formatKoreanDate(publishedDate)].filter(Boolean), sections: [{ heading: '꿈의 해석', paragraphs: [truncate(stripHtml(dream.interpretation || ''), 1200)] }, dream.traditional_meaning ? { heading: '전통적 의미', paragraphs: [truncate(stripHtml(dream.traditional_meaning), 800)] } : null, dream.psychological_meaning ? { heading: '심리학적 해석', paragraphs: [truncate(stripHtml(dream.psychological_meaning), 800)] } : null].filter(Boolean), breadcrumbs: [{ href: '/', label: '홈' }, { href: '/dream', label: '꿈해몽' }, { label: dream.keyword }], relatedLinks: [{ href: '/dream', label: '다른 꿈해몽 검색하기' }, { href: '/daily-fortune', label: '오늘의 운세 보기' }, { href: '/lifelong-saju', label: '무료 평생사주 보기' }] }),
    head: makeHead({ title, description, canonicalUrl, keywords: `${dream.keyword}, 꿈해몽, 꿈풀이, 무운`, ogType: 'article', schema, extraMeta: [publishedDate ? `<meta property="article:published_time" content="${escapeHtml(publishedDate)}">` : '', publishedDate ? `<meta property="article:modified_time" content="${escapeHtml(publishedDate)}">` : '', `<meta property="article:section" content="${escapeHtml(categoryLabel)}">`] }),
  };
}

function buildDictionaryPage(entry) {
  const canonicalUrl = `${BASE_URL}/dictionary/${entry.slug}`;
  const title = entry.meta_title || `${entry.title} - ${entry.summary} | 무운 운세 사전`;
  const description = entry.meta_description || entry.summary || truncate(stripHtml(entry.original_meaning || ''), 155);
  const tagText = Array.isArray(entry.tags) ? entry.tags.join(', ') : '';
  const categoryLabel = DICTIONARY_CATEGORY_LABELS[entry.category] || '운세 사전';
  const schema = [
    { '@context': 'https://schema.org', '@type': 'DefinedTerm', name: entry.title, description, url: canonicalUrl, inDefinedTermSet: { '@type': 'DefinedTermSet', name: '무운 운세 사전', url: `${BASE_URL}/fortune-dictionary` }, inLanguage: 'ko-KR' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL }, { '@type': 'ListItem', position: 2, name: '운세 사전', item: `${BASE_URL}/fortune-dictionary` }, { '@type': 'ListItem', position: 3, name: entry.title, item: canonicalUrl }] },
  ];
  return {
    appHtml: buildPageShell({ sectionLabel: categoryLabel, h1: entry.title, description, metaLines: [entry.subtitle || '', tagText ? `관련 키워드: ${tagText}` : ''].filter(Boolean), sections: [entry.summary ? { heading: '요약', paragraphs: [entry.summary] } : null, entry.original_meaning ? { heading: '원래 의미', paragraphs: [truncate(stripHtml(entry.original_meaning), 900)] } : null, entry.modern_interpretation ? { heading: '현대적 해석', paragraphs: [truncate(stripHtml(entry.modern_interpretation), 900)] } : null, entry.muun_advice ? { heading: '무운의 조언', paragraphs: [truncate(stripHtml(entry.muun_advice), 900)] } : null].filter(Boolean), breadcrumbs: [{ href: '/', label: '홈' }, { href: '/fortune-dictionary', label: '운세 사전' }, { label: entry.title }], relatedLinks: [{ href: '/fortune-dictionary', label: '운세 사전 더 보기' }, { href: '/lifelong-saju', label: '무료 평생사주 보기' }, { href: '/family-saju', label: '가족사주 보기' }] }),
    head: makeHead({ title, description, canonicalUrl, keywords: [entry.title, ...(Array.isArray(entry.tags) ? entry.tags : []), '운세사전', '사주용어'].filter(Boolean).join(', '), ogType: 'article', schema, extraMeta: [`<meta property="article:section" content="${escapeHtml(categoryLabel)}">`] }),
  };
}

async function fetchColumns() {
  const result = await loadColumnsDataset({ limit: 500 });
  console.log(`📚 columns source: ${result.source}`);
  if (result.fallbackReason) console.warn(`⚠️ columns fallback reason: ${result.fallbackReason}`);
  return result.rows.filter((row) => {
    const routeSlug = normalizeSlug(row.slug || row.id);
    const ok = isValidSlug(routeSlug) && row.title;
    if (!ok) console.warn(`⏭️  Skipping invalid guide row: ${row.slug || row.id}`);
    return ok;
  });
}

async function fetchDreams() {
  const result = await loadDreamsDataset({ limit: 1000 });
  console.log(`📚 dreams source: ${result.source}`);
  if (result.fallbackReason) console.warn(`⚠️ dreams fallback reason: ${result.fallbackReason}`);
  return result.rows.filter((row) => {
    const ok = isValidSlug(row.slug) && row.keyword;
    if (!ok) console.warn(`⏭️  Skipping invalid dream row: ${row.slug}`);
    return ok;
  });
}

async function fetchDictionaryEntries() {
  const result = await loadDictionaryDataset({ limit: 500 });
  console.log(`📚 dictionary source: ${result.source}`);
  if (result.fallbackReason) console.warn(`⚠️ dictionary fallback reason: ${result.fallbackReason}`);
  return result.rows.filter((row) => {
    const ok = isValidSlug(row.slug) && row.title;
    if (!ok) console.warn(`⏭️  Skipping invalid dictionary row: ${row.slug}`);
    return ok;
  });
}

function buildHtmlFromTemplate(template, page) { return template.replace('<!--app-head-->', `${page.head.title}${page.head.meta}${page.head.link}`).replace('<!--app-html-->', page.appHtml).replace('<!--__REACT_QUERY_STATE__-->', `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(page.dehydratedState || {})}</script>`); }
function writeOutput(url, html) { const filePath = url === '/' ? toAbsolute('../client/dist/public/index.html') : toAbsolute(`../client/dist/public${url}/index.html`); fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, html); }
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
  const guidePages = dedupeByUrl(columns.map((column) => ({ url: `/guide/${normalizeSlug(column.slug || column.id)}`, page: buildGuidePage({ ...column, slug: normalizeSlug(column.slug || column.id) }) })));
  const dreamPages = dedupeByUrl(dreams.map((dream) => ({ url: `/dream/${normalizeSlug(dream.slug)}`, page: buildDreamPage({ ...dream, slug: normalizeSlug(dream.slug) }) })));
  const dictionaryPages = dedupeByUrl(dictionaryEntries.map((entry) => ({ url: `/dictionary/${normalizeSlug(entry.slug)}`, page: buildDictionaryPage({ ...entry, slug: normalizeSlug(entry.slug) }) })));
  const yearlyRoutes = []; for (let year = 1970; year <= 2020; year += 1) yearlyRoutes.push(`/yearly-fortune/${year}-01-01`);
  console.log(`📦 Static routes: ${STATIC_ROUTES.length}`); console.log(`📦 Guide pages: ${guidePages.length}`); console.log(`📦 Dream pages: ${dreamPages.length}`); console.log(`📦 Dictionary pages: ${dictionaryPages.length}`); console.log(`📦 Yearly-fortune dynamic pages: ${yearlyRoutes.length}`);
  let successCount = 0; let skippedCount = 0;
  const staticAndYearly = [...STATIC_ROUTES, ...yearlyRoutes];
  for (const url of staticAndYearly) {
    const elapsedSeconds = (Date.now() - BUILD_START_TIME) / 1000;
    if (elapsedSeconds > MAX_PRERENDER_SECONDS) { console.warn(`⏱️  Build time limit approaching (${elapsedSeconds.toFixed(1)}s elapsed). Stopping prerender to avoid timeout.`); skippedCount += staticAndYearly.length - successCount; break; }
    try { const page = await render({ path: url }); if (page.statusCode === 404) { skippedCount += 1; console.log(`⏭️  Skipping 404 page: ${url}`); continue; } writeOutput(url, buildHtmlFromTemplate(template, page)); successCount += 1; } catch (error) { console.error(`❌ Failed to render ${url}:`, error instanceof Error ? error.message : error); }
  }
  const detailPages = [...guidePages, ...dreamPages, ...dictionaryPages];
  for (const { url, page } of detailPages) {
    const elapsedSeconds = (Date.now() - BUILD_START_TIME) / 1000;
    if (elapsedSeconds > MAX_PRERENDER_SECONDS) { console.warn(`⏱️  Build time limit approaching (${elapsedSeconds.toFixed(1)}s elapsed). Stopping detail prerender to avoid timeout.`); skippedCount += 1; break; }
    try { writeOutput(url, buildHtmlFromTemplate(template, { ...page, dehydratedState: {} })); successCount += 1; if (successCount % 50 === 0) console.log(`✅ Processed ${successCount} pages... (${elapsedSeconds.toFixed(1)}s)`); } catch (error) { console.error(`❌ Failed to build detail page ${url}:`, error instanceof Error ? error.message : error); }
  }
  const elapsed = ((Date.now() - BUILD_START_TIME) / 1000).toFixed(1);
  console.log(`✨ Successfully pre-rendered ${successCount} pages in ${elapsed}s`); if (skippedCount > 0) console.warn(`⚠️  Skipped ${skippedCount} pages.`);
}

run().catch((error) => { console.error('❌ Fatal prerender error:', error instanceof Error ? error.message : error); process.exit(1); });
