#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const BACKUPS_DIR = path.join(ROOT_DIR, 'backups');

const DEFAULT_SUPABASE_URL = 'https://vuifbmsdggnwygvgcrkj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI';

export const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

function isDateFolder(name) {
  return /^\d{4}-\d{2}-\d{2}$/.test(name);
}

function listBackupDirs() {
  if (!fs.existsSync(BACKUPS_DIR)) return [];
  return fs
    .readdirSync(BACKUPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isDateFolder(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => b.localeCompare(a));
}

function getLatestBackupPath(tableName) {
  for (const dirName of listBackupDirs()) {
    const candidate = path.join(BACKUPS_DIR, dirName, `${tableName}.json`);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function readBackupTable(tableName) {
  const backupPath = getLatestBackupPath(tableName);
  if (!backupPath) {
    throw new Error(`No backup file found for ${tableName}`);
  }

  const raw = fs.readFileSync(backupPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Backup file for ${tableName} is not an array: ${backupPath}`);
  }

  return {
    rows: parsed,
    source: `backup:${path.relative(ROOT_DIR, backupPath)}`,
  };
}

function normalizeBoolean(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

async function fetchRestTable(tableName, { select = '*', filters = [], order = [], limit } = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${tableName}`);
  url.searchParams.set('select', select);

  for (const filter of filters) {
    const op = filter.op || 'eq';
    const value = typeof filter.value === 'boolean' ? normalizeBoolean(filter.value) : String(filter.value);
    url.searchParams.set(filter.field, `${op}.${value}`);
  }

  for (const sortExpr of order) {
    url.searchParams.append('order', sortExpr);
  }

  if (typeof limit === 'number' && Number.isFinite(limit)) {
    url.searchParams.set('limit', String(limit));
  }

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${tableName} REST fetch failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`${tableName} REST fetch returned non-array payload`);
  }

  return {
    rows: data,
    source: 'supabase-rest',
  };
}

function toTime(value) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function sortByPublishedDesc(rows) {
  return [...rows].sort((a, b) => {
    const aTime = toTime(a.published_at || a.created_at || a.updated_at);
    const bTime = toTime(b.published_at || b.created_at || b.updated_at);
    return bTime - aTime;
  });
}

function normalizeDreamMeta(row) {
  const seoData = row && typeof row.seo_data === 'object' && row.seo_data ? row.seo_data : {};
  return {
    ...row,
    meta_title: row.meta_title || seoData.meta_title || seoData.title || null,
    meta_description: row.meta_description || seoData.meta_description || seoData.description || null,
  };
}

function normalizeDictionaryMeta(row) {
  return {
    ...row,
    meta_title: row.meta_title || null,
    meta_description: row.meta_description || null,
  };
}

export async function loadColumnsDataset({ limit = 200 } = {}) {
  try {
    const result = await fetchRestTable('columns', {
      select: 'id,slug,title,description,content,category,author,thumbnail_url,read_time,meta_title,meta_description,keywords,published_at,created_at,updated_at,published',
      filters: [{ field: 'published', value: true }],
      order: ['published_at.desc.nullslast'],
      limit,
    });

    return {
      rows: sortByPublishedDesc(result.rows),
      source: result.source,
    };
  } catch (error) {
    const backup = readBackupTable('columns');
    return {
      rows: sortByPublishedDesc(backup.rows.filter((row) => row.published !== false)).slice(0, limit),
      source: backup.source,
      fallbackReason: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function loadDreamsDataset({ limit = 600 } = {}) {
  try {
    const result = await fetchRestTable('dreams', {
      select: 'id,keyword,slug,interpretation,traditional_meaning,psychological_meaning,category,grade,score,published_at,created_at,updated_at,published,meta_title,meta_description,seo_data',
      filters: [{ field: 'published', value: true }],
      order: ['published_at.desc.nullslast'],
      limit,
    });

    return {
      rows: sortByPublishedDesc(result.rows).map(normalizeDreamMeta),
      source: result.source,
    };
  } catch (error) {
    const backup = readBackupTable('dreams');
    return {
      rows: sortByPublishedDesc(backup.rows.filter((row) => row.published !== false)).slice(0, limit).map(normalizeDreamMeta),
      source: backup.source,
      fallbackReason: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function loadDictionaryDataset({ limit = 300 } = {}) {
  try {
    const result = await fetchRestTable('fortune_dictionary', {
      select: 'id,slug,title,subtitle,summary,original_meaning,modern_interpretation,muun_advice,category,tags,meta_title,meta_description,published_at,created_at,updated_at,published',
      filters: [{ field: 'published', value: true }],
      order: ['published_at.desc.nullslast', 'created_at.desc'],
      limit,
    });

    return {
      rows: sortByPublishedDesc(result.rows).map(normalizeDictionaryMeta),
      source: result.source,
    };
  } catch (error) {
    const backup = readBackupTable('fortune_dictionary');
    return {
      rows: sortByPublishedDesc(backup.rows.filter((row) => row.published !== false)).slice(0, limit).map(normalizeDictionaryMeta),
      source: backup.source,
      fallbackReason: error instanceof Error ? error.message : String(error),
    };
  }
}
