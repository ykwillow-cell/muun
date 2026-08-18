#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dreamsDir = path.join(__dirname, '../client/public/content-fallback/dreams');
const outputPath = path.join(__dirname, '../reports/dream-content-quality-audit.json');

const normalize = (value = '') => value
  .replace(/[‘’'“”"·:|]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

function add(map, value, slug) {
  const key = normalize(value);
  if (!key) return;
  const entries = map.get(key) ?? [];
  entries.push(slug);
  map.set(key, entries);
}

function duplicateSummary(map, limit = 20) {
  return [...map.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, limit)
    .map(([text, slugs]) => ({
      count: slugs.length,
      sample: text.slice(0, 180),
      slugs: slugs.slice(0, 5),
    }));
}

const files = fs.readdirSync(dreamsDir).filter((file) => file.endsWith('.json'));
const titles = new Map();
const descriptions = new Map();
const interpretations = new Map();
const traditionalMeanings = new Map();
const psychologicalMeanings = new Map();
const shortInterpretations = [];
const missingFields = [];

for (const file of files) {
  const item = JSON.parse(fs.readFileSync(path.join(dreamsDir, file), 'utf8'));
  const slug = item.slug || file.replace(/\.json$/, '');
  add(titles, item.meta_title, slug);
  add(descriptions, item.meta_description, slug);
  add(interpretations, item.interpretation, slug);
  add(traditionalMeanings, item.traditional_meaning, slug);
  add(psychologicalMeanings, item.psychological_meaning, slug);

  if ((item.interpretation || '').trim().length < 500) {
    shortInterpretations.push({ slug, length: (item.interpretation || '').trim().length });
  }
  const absent = ['meta_title', 'meta_description', 'interpretation', 'traditional_meaning', 'psychological_meaning']
    .filter((field) => !(item[field] || '').trim());
  if (absent.length) missingFields.push({ slug, fields: absent });
}

const report = {
  generatedAt: new Date().toISOString(),
  documentCount: files.length,
  shortInterpretationCount: shortInterpretations.length,
  missingFieldsCount: missingFields.length,
  duplicateGroups: {
    titles: duplicateSummary(titles),
    descriptions: duplicateSummary(descriptions),
    interpretations: duplicateSummary(interpretations),
    traditionalMeanings: duplicateSummary(traditionalMeanings),
    psychologicalMeanings: duplicateSummary(psychologicalMeanings),
  },
  shortInterpretations: shortInterpretations.slice(0, 50),
  missingFields: missingFields.slice(0, 50),
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

const duplicateCount = Object.values(report.duplicateGroups)
  .reduce((total, groups) => total + groups.reduce((sum, group) => sum + group.count, 0), 0);
console.log(`Audited ${report.documentCount} dream documents.`);
console.log(`Short interpretations: ${report.shortInterpretationCount}; missing fields: ${report.missingFieldsCount}.`);
console.log(`Top duplicate groups represented: ${duplicateCount}.`);
console.log(`Report: ${outputPath}`);
