#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadColumnsDataset, loadDreamsDataset } from './utils/content-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://muunsaju.com';
const SITE_TITLE = '무운 (MuUn) - 무료 사주 운세';
const SITE_DESCRIPTION = '회원가입 없는 100% 무료 사주풀이, 신년운세, 토정비결, 궁합, 타로, 꿈해몽';
const SITE_LANGUAGE = 'ko';

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toUtcString(value) {
  const date = new Date(value || Date.now());
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

function generateColumnItem(column) {
  const link = `${BASE_URL}/guide/${column.slug || column.id}`;
  const description = column.description || '운세 칼럼';
  return `  <item>\n    <title><![CDATA[${escapeXml(column.title)}]]></title>\n    <link>${link}</link>\n    <guid isPermaLink="true">${link}</guid>\n    <pubDate>${toUtcString(column.published_at || column.created_at)}</pubDate>\n    <description><![CDATA[${escapeXml(description)}]]></description>\n    <author>${escapeXml(column.author || '무운 역술팀')}</author>\n    <category>칼럼</category>\n  </item>\n`;
}

function generateDreamItem(dream) {
  const link = `${BASE_URL}/dream/${dream.slug}`;
  const description = dream.meta_description || dream.interpretation || dream.keyword || '꿈해몽';
  return `  <item>\n    <title><![CDATA[${escapeXml(dream.keyword)}의 꿈해몽]]></title>\n    <link>${link}</link>\n    <guid isPermaLink="true">${link}</guid>\n    <pubDate>${toUtcString(dream.published_at || dream.created_at)}</pubDate>\n    <description><![CDATA[${escapeXml(description)}]]></description>\n    <category>꿈해몽</category>\n  </item>\n`;
}

function generateRssFeed(columns, dreams) {
  const now = new Date().toUTCString();
  const allItems = [
    ...columns.map((column) => ({
      date: new Date(column.published_at || column.created_at || 0),
      xml: generateColumnItem(column),
    })),
    ...dreams.map((dream) => ({
      date: new Date(dream.published_at || dream.created_at || 0),
      xml: generateDreamItem(dream),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  let rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n  <channel>\n    <title><![CDATA[${SITE_TITLE}]]></title>\n    <link>${BASE_URL}</link>\n    <description><![CDATA[${SITE_DESCRIPTION}]]></description>\n    <language>${SITE_LANGUAGE}</language>\n    <lastBuildDate>${now}</lastBuildDate>\n    <ttl>1440</ttl>\n    <image>\n      <url>${BASE_URL}/images/horse_mascot.png</url>\n      <title><![CDATA[${SITE_TITLE}]]></title>\n      <link>${BASE_URL}</link>\n    </image>\n`;

  for (const item of allItems) {
    rss += item.xml;
  }

  rss += `  </channel>\n</rss>`;
  return rss;
}

function saveRss(rss) {
  const rssPath = path.join(__dirname, '../client/public/rss.xml');
  try {
    fs.mkdirSync(path.dirname(rssPath), { recursive: true });
    fs.writeFileSync(rssPath, rss, 'utf-8');
    const stats = fs.statSync(rssPath);
    console.log(`✅ RSS feed saved: ${rssPath}`);
    console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);
    return true;
  } catch (error) {
    console.error('❌ Error saving RSS feed:', error instanceof Error ? error.message : error);
    return false;
  }
}

async function main() {
  console.log('🚀 RSS Feed Generation Started\n');
  console.log('='.repeat(50));

  const [columnsResult, dreamsResult] = await Promise.all([
    loadColumnsDataset({ limit: 50 }),
    loadDreamsDataset({ limit: 50 }),
  ]);

  console.log(`\n📚 Columns source: ${columnsResult.source}`);
  console.log(`🌙 Dreams source: ${dreamsResult.source}`);

  console.log('\n📝 Generating RSS feed...');
  const rss = generateRssFeed(columnsResult.rows, dreamsResult.rows);
  console.log(`✅ RSS feed generated with ${columnsResult.rows.length} columns + ${dreamsResult.rows.length} dreams`);

  console.log('\n💾 Saving RSS feed...');
  const saved = saveRss(rss);
  if (!saved) {
    process.exit(1);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ RSS feed generation completed successfully!');
  console.log(`\n📌 RSS Feed URL: ${BASE_URL}/rss.xml`);
  console.log('💡 네이버 서치어드바이저에 이 URL을 제출하세요.\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error instanceof Error ? error.message : error);
  process.exit(1);
});
