/**
 * Vercel Build Output API 구조 생성 스크립트
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'client', 'dist', 'public');
const outDir = path.join(root, '.vercel', 'output');
const staticDir = path.join(outDir, 'static');
const vercelConfigPath = path.join(root, 'vercel.json');
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('📦 Generating Vercel Build Output API structure...');
fs.mkdirSync(staticDir, { recursive: true });
function copyDir(src, dest) { fs.mkdirSync(dest, { recursive: true }); for (const entry of fs.readdirSync(src, { withFileTypes: true })) { const srcPath = path.join(src, entry.name); const destPath = path.join(dest, entry.name); if (entry.isDirectory()) copyDir(srcPath, destPath); else fs.copyFileSync(srcPath, destPath); } }
copyDir(srcDir, staticDir);
console.log('✅ Copied dist/public → .vercel/output/static');
function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function normalizeSlug(value) { return String(value || '').trim().toLowerCase(); }
function loadRedirectsFromVercelJson() { try { if (!fs.existsSync(vercelConfigPath)) return []; const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8')); return (config.redirects || []).map((redirect) => ({ src: `^${escapeRegex(redirect.source)}$`, status: redirect.statusCode || 301, headers: { Location: redirect.destination } })); } catch (error) { console.warn('⚠️ vercel.json 리다이렉트 로드 실패:', error instanceof Error ? error.message : error); return []; } }
async function buildGuideUuidRedirects() { try { const { data, error } = await supabase.from('columns').select('id, slug').eq('published', true).order('published_at', { ascending: false, nullsFirst: false }); if (error) { console.warn('⚠️ guide UUID 리다이렉트용 columns 조회 실패:', error.message); return []; } const redirects = []; const seen = new Set(); for (const row of data || []) { const id = String(row.id || '').trim(); const slug = normalizeSlug(row.slug); if (!UUID_PATTERN.test(id)) continue; if (!SLUG_PATTERN.test(slug) || slug === id) continue; const src = `^${escapeRegex(`/guide/${id}`)}$`; if (seen.has(src)) continue; seen.add(src); redirects.push({ src, status: 301, headers: { Location: `/guide/${slug}` } }); } console.log(`✅ Built ${redirects.length} guide UUID redirects from Supabase`); return redirects; } catch (error) { console.warn('⚠️ guide UUID 리다이렉트 생성 실패:', error instanceof Error ? error.message : error); return []; } }
const deletedUrls = ['/dictionary/baekho-sal','/dictionary/bi-gyeop','/dictionary/byeong-hwa','/dictionary/gab-mok','/dictionary/chung','/dictionary/dae-un','/dictionary/earthly-branches','/dictionary/eul-mok','/dictionary/fire-element','/dictionary/gi-sin','/dictionary/gi-to','/dictionary/gwanseong','/dictionary/gwimun-sal','/dictionary/gye-su','/dictionary/heavenly-stems','/dictionary/hui-sin','/dictionary/hwagae-sal','/dictionary/hyeong','/dictionary/im-su','/dictionary/inseong','/dictionary/jaeseong','/dictionary/jeong-hwa','/dictionary/metal-element','/dictionary/mu-to','/dictionary/sam-jae','/dictionary/se-un','/dictionary/siksang','/dictionary/sin-geum','/dictionary/wonjin-sal','/dictionary/wood-element','/dictionary/yin-yang-five-elements','/dictionary/yong-sin','/guide/column-001','/guide/column-002','/guide/column-003','/guide/saju-basics','/dream/가위','/dream/강도','/dream/개','/dream/거미','/dream/거북이','/dream/거울','/dream/거지','/dream/결혼','/dream/경찰','/dream/고래','/dream/고양이','/dream/과일','/dream/기린','/dream/기본','/dream/길','/dream/꽃','/dream/나무','/dream/냉장고','/dream/노인','/dream/눈(신체','/dream/달','/dream/닭','/dream/대통령','/dream/도둑','/dream/도망치는 꿈','/dream/돈','/dream/동굴','/dream/동물','/dream/돼지','/dream/떨어지는 꿈','/dream/똥','/dream/물','/dream/바늘','/dream/바다','/dream/밥','/dream/벌','/dream/보석','/dream/봉황','/dream/불','/dream/비','/dream/비행기','/dream/사냥하는 꿈','/dream/사자','/dream/산','/dream/상어','/dream/샘물','/dream/소','/dream/손가락','/dream/술','/dream/숲','/dream/시계','/dream/시험','/dream/씨앗','/dream/아이','/dream/안개','/dream/양','/dream/얼음','/dream/연예인','/dream/예수님','/dream/우는 꿈','/dream/웃는 꿈','/dream/원숭이','/dream/의사','/dream/이별','/dream/이사','/dream/입','/dream/죽음','/dream/쥐','/dream/지네','/dream/지진','/dream/집','/dream/쫓기는 꿈','/dream/책','/dream/천둥번개','/dream/침대','/dream/코','/dream/코끼리','/dream/태양','/dream/토끼','/dream/폭포','/dream/하늘','/dream/하늘을 나는 꿈','/dream/학교','/dream/호랑이','/dream/홍수','/dream/화내는 꿈','/dream/화산폭발','/dream/화해하는 꿈','/dream/흙','/dream/TV'];
function buildDeletedUrlRedirects() { return deletedUrls.flatMap((url) => { const destination = url.startsWith('/dictionary/') ? '/fortune-dictionary' : url.startsWith('/dream/') ? '/dream' : url.startsWith('/guide/') ? '/guide' : '/'; const routes = [{ src: `^${escapeRegex(url)}$`, status: 301, headers: { Location: destination } }]; const encoded = encodeURI(url); if (encoded !== url) routes.push({ src: `^${escapeRegex(encoded)}$`, status: 301, headers: { Location: destination } }); return routes; }); }
function dedupeRoutes(routes) { const seen = new Set(); return routes.filter((route) => { if (!route?.src) return false; if (seen.has(route.src)) return false; seen.add(route.src); return true; }); }
const extraRedirects = [{ src: '^/dictionary$', status: 301, headers: { Location: '/fortune-dictionary' } }];
const headers = [{ src: '/assets/(.*)', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }, continue: true }, { src: '/(.*)\\.js', headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' }, continue: true }, { src: '/(.*)\\.css', headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' }, continue: true }, { src: '/(.*)\\.(?:webp|jpg|jpeg|png|gif|svg|ico)', headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' }, continue: true }, { src: '/sitemap(?:-[\\w-]+)?\\.xml', headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' }, continue: true }, { src: '/(.*)\\.html', headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' }, continue: true }];
async function main() { const redirectRoutes = dedupeRoutes([...extraRedirects, ...loadRedirectsFromVercelJson(), ...(await buildGuideUuidRedirects()), ...buildDeletedUrlRedirects()]); const config = { version: 3, routes: [...redirectRoutes, ...headers, { handle: 'filesystem' }, { src: '^/(guide|dream|dictionary)/.+$', status: 404, dest: '/index.html' }, { src: '/.*', dest: '/index.html' }] }; fs.writeFileSync(path.join(outDir, 'config.json'), JSON.stringify(config, null, 2)); console.log(`✅ Generated .vercel/output/config.json with ${redirectRoutes.length} redirects`); console.log('🎉 Vercel Build Output API structure ready!'); }
main().catch((error) => { console.error('❌ Failed to build Vercel output:', error instanceof Error ? error.message : error); process.exit(1); });
