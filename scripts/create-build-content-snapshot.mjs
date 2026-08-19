import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 이 스크립트는 모든 정적 SEO 산출물보다 먼저 실행됩니다.
// 기존 snapshot을 절대 재사용하지 않고, 세 데이터셋을 모두 live REST에서 읽은 경우에만 새 snapshot을 원자적으로 공개합니다.
process.env.STRICT = '1';
process.env.STRICT_CONTENT_FETCH = '1';
process.env.SUPABASE_REST_PAGE_SIZE ||= '250';
delete process.env.ALLOW_CONTENT_BACKUP_FALLBACK;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const snapshotPath = path.resolve(
  rootDir,
  process.env.CONTENT_SNAPSHOT_PATH || '.cache/build-content-snapshot.json',
);

const {
  loadColumnsDataset,
  loadDreamsDataset,
  loadDictionaryDataset,
  SEO_LIMITS,
} = await import('./utils/content-data.mjs');

function assertLive(result, tableName) {
  if (result.source !== 'supabase-rest-paginated' || result.fallbackReason) {
    throw new Error(`${tableName} did not load from live Supabase REST: ${result.fallbackReason || result.source}`);
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function loadWithRetry(label, loader, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await loader();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        console.warn(`⚠️ ${label} live fetch retry ${attempt}/${attempts - 1}`);
        await wait(attempt * 1000);
      }
    }
  }
  throw lastError;
}

async function main() {
  console.log('📦 Creating one immutable live content snapshot for this build...');
  fs.rmSync(snapshotPath, { force: true });

  const [columns, dreams, dictionary] = await Promise.all([
    loadWithRetry('columns', () => loadColumnsDataset({ limit: SEO_LIMITS.columns })),
    loadWithRetry('dreams', () => loadDreamsDataset({ limit: SEO_LIMITS.dreams })),
    loadWithRetry('fortune_dictionary', () => loadDictionaryDataset({ limit: SEO_LIMITS.dictionary })),
  ]);

  assertLive(columns, 'columns');
  assertLive(dreams, 'dreams');
  assertLive(dictionary, 'fortune_dictionary');

  const snapshot = {
    version: 1,
    generatedAt: new Date().toISOString(),
    sources: {
      columns: columns.source,
      dreams: dreams.source,
      fortune_dictionary: dictionary.source,
    },
    tables: {
      columns: { rows: columns.rows },
      dreams: { rows: dreams.rows },
      fortune_dictionary: { rows: dictionary.rows },
    },
  };

  fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
  const temporaryPath = `${snapshotPath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(snapshot)}\n`, 'utf8');
  fs.renameSync(temporaryPath, snapshotPath);

  console.log(`✅ Build snapshot written: ${path.relative(rootDir, snapshotPath)}`);
  console.log(`   columns=${columns.rows.length}, dreams=${dreams.rows.length}, dictionary=${dictionary.rows.length}`);
}

main().catch((error) => {
  console.error('❌ Failed to create live build snapshot:', error instanceof Error ? error.message : error);
  process.exit(1);
});
