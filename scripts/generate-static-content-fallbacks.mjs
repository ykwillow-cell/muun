import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadColumnsDataset,
  loadDreamsDataset,
  loadDictionaryDataset,
  SEO_LIMITS,
} from './utils/content-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'client', 'public', 'content-fallback');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const guideHexSuffix = /-[0-9a-f]{8}$/;

function normalizeSlug(value) {
  return String(value || '').trim().toLowerCase();
}

function ensureEmptyDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(type, slug, payload) {
  const normalized = normalizeSlug(slug);
  if (!slugPattern.test(normalized)) return false;
  const dir = path.join(outputDir, type);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${normalized}.json`), JSON.stringify(payload));
  return true;
}

function guideSlug(row) {
  const slug = normalizeSlug(row.slug || row.id);
  if (guideHexSuffix.test(slug)) return slug;
  const idShort = String(row.id || '').toLowerCase().match(/^([0-9a-f]{8})/)?.[1];
  return idShort ? `${slug}-${idShort}` : slug;
}

function publicDream(row) {
  return {
    id: String(row.id),
    keyword: row.keyword || '',
    slug: normalizeSlug(row.slug || row.id),
    interpretation: row.interpretation || '',
    traditional_meaning: row.traditional_meaning || null,
    psychological_meaning: row.psychological_meaning || null,
    category: row.category || 'other',
    grade: row.grade || 'good',
    score: row.score ?? 70,
    meta_title: row.meta_title || null,
    meta_description: row.meta_description || null,
    published: row.published !== false,
    published_at: row.published_at || null,
    created_at: row.created_at || row.published_at || '',
    seo_data: row.seo_data || null,
  };
}

function publicDictionary(row) {
  return {
    id: String(row.id),
    slug: normalizeSlug(row.slug || row.id),
    category: row.category || 'basic',
    title: row.title || '',
    subtitle: row.subtitle || '',
    summary: row.summary || '',
    original_meaning: row.original_meaning || '',
    modern_interpretation: row.modern_interpretation || '',
    muun_advice: row.muun_advice || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    meta_title: row.meta_title || null,
    meta_description: row.meta_description || null,
    published: row.published !== false,
  };
}

function publicColumn(row) {
  return {
    id: String(row.id),
    slug: normalizeSlug(row.slug || row.id),
    title: row.title || '',
    description: row.description || '',
    content: row.content || '',
    category: row.category || 'luck',
    author: row.author || '무운 역술팀',
    thumbnail_url: row.thumbnail_url || '',
    read_time: row.read_time || 5,
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    meta_title: row.meta_title || null,
    meta_description: row.meta_description || null,
    published: row.published !== false,
    published_at: row.published_at || row.created_at || '',
  };
}

async function main() {
  console.log('🧰 Generating static detail fallback assets...');
  ensureEmptyDir(outputDir);

  const [columns, dreams, dictionary] = await Promise.all([
    loadColumnsDataset({ limit: SEO_LIMITS.columns }),
    loadDreamsDataset({ limit: SEO_LIMITS.dreams }),
    loadDictionaryDataset({ limit: SEO_LIMITS.dictionary }),
  ]);

  let dreamCount = 0;
  for (const row of dreams.rows) {
    if (writeJson('dreams', row.slug, publicDream(row))) dreamCount += 1;
  }

  let dictionaryCount = 0;
  for (const row of dictionary.rows) {
    if (writeJson('dictionary', row.slug, publicDictionary(row))) dictionaryCount += 1;
  }

  let guideCount = 0;
  for (const row of columns.rows) {
    const payload = publicColumn(row);
    if (writeJson('guides', guideSlug(row), payload)) guideCount += 1;
    if (payload.slug && payload.slug !== guideSlug(row) && writeJson('guides', payload.slug, payload)) guideCount += 1;
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    sources: {
      columns: columns.source,
      dreams: dreams.source,
      dictionary: dictionary.source,
    },
    counts: { dreams: dreamCount, dictionary: dictionaryCount, guides: guideCount },
  };
  fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`✅ Static fallback assets written: dreams=${dreamCount}, dictionary=${dictionaryCount}, guides=${guideCount}`);
}

main().catch((error) => {
  console.error('❌ Failed to generate static detail fallback assets:', error instanceof Error ? error.message : error);
  process.exit(1);
});
