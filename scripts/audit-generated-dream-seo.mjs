import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const dreamRoot = path.join(projectRoot, 'client', 'dist', 'public', 'dream');
const reportPath = path.join(projectRoot, 'reports', 'generated-dream-seo-audit.json');

function collectHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(absolutePath);
    return entry.name === 'index.html' ? [absolutePath] : [];
  });
}

function htmlDecode(value = '') {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extract(pattern, html) {
  return html.match(pattern)?.[1]?.trim() || '';
}

function duplicateGroups(values) {
  const groups = new Map();
  for (const value of values) {
    if (!value) continue;
    groups.set(value, [...(groups.get(value) || []), value]);
  }
  return [...groups.entries()]
    .filter(([, members]) => members.length > 1)
    .map(([value, members]) => ({ value, count: members.length }))
    .sort((left, right) => right.count - left.count || left.value.localeCompare(right.value, 'ko'));
}

if (!fs.existsSync(dreamRoot)) {
  throw new Error(`프리렌더 결과를 찾을 수 없습니다: ${dreamRoot}`);
}

const pages = collectHtmlFiles(dreamRoot).map((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relative = path.relative(path.join(projectRoot, 'client', 'dist', 'public'), path.dirname(filePath));
  const url = `/${relative.replaceAll(path.sep, '/')}`;
  const title = htmlDecode(extract(/<title>([^<]*)<\/title>/i, html));
  const description = htmlDecode(extract(/<meta name="description" content="([^"]*)"/i, html));
  const canonical = htmlDecode(extract(/<link rel="canonical" href="([^"]*)"/i, html));
  const relatedDreamLinks = [...html.matchAll(/href="(\/dream\/[^"?#]+)"/g)]
    .map((match) => match[1])
    .filter((href) => href !== new URL(canonical).pathname)
    .filter((href, index, all) => all.indexOf(href) === index);
  return { url, title, description, canonical, relatedDreamLinkCount: relatedDreamLinks.length };
});

const report = {
  generatedAt: new Date().toISOString(),
  pageCount: pages.length,
  titleDuplicateGroups: duplicateGroups(pages.map((page) => page.title)),
  descriptionDuplicateGroups: duplicateGroups(pages.map((page) => page.description)),
  pagesWithThreeOrMoreRelatedDreamLinks: pages.filter((page) => page.relatedDreamLinkCount >= 3).length,
  pagesWithoutRelatedDreamLinks: pages.filter((page) => page.relatedDreamLinkCount === 0).map((page) => page.url),
  samples: pages.slice(0, 3),
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Audited ${report.pageCount} generated dream pages.`);
console.log(`Duplicate titles: ${report.titleDuplicateGroups.length}; duplicate descriptions: ${report.descriptionDuplicateGroups.length}.`);
console.log(`Pages with 3+ related dream links: ${report.pagesWithThreeOrMoreRelatedDreamLinks}.`);
console.log(`Report: ${reportPath}`);

if (report.pagesWithoutRelatedDreamLinks.length > 0) {
  console.error(`Missing related dream links: ${report.pagesWithoutRelatedDreamLinks.length}`);
  process.exitCode = 1;
}
