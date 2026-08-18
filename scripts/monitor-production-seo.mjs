#!/usr/bin/env node

/**
 * Public production SEO health monitor.
 *
 * This intentionally performs only low-volume requests against the public site.
 * It validates the same SEO contracts Googlebot relies on: reachable core pages,
 * sitemap availability, a representative pre-rendered detail page, and a
 * self-referencing canonical for that detail page.
 */

const siteUrl = (process.env.SITE_URL || 'https://muunsaju.com').replace(/\/$/, '');
const generatedAt = new Date().toISOString();

const checks = [
  {
    name: '홈페이지',
    url: `${siteUrl}/`,
    expectedStatus: 200,
    expectedCanonical: `${siteUrl}/`,
    requiredText: '무운사주',
  },
  {
    name: '루트 사이트맵',
    url: `${siteUrl}/sitemap.xml`,
    expectedStatus: 200,
    requiredText: 'sitemap-dream.xml',
  },
  {
    name: '꿈해몽 사이트맵',
    url: `${siteUrl}/sitemap-dream.xml`,
    expectedStatus: 200,
    requiredText: '/dream/',
  },
  {
    name: '사전 사이트맵',
    url: `${siteUrl}/sitemap-dictionary.xml`,
    expectedStatus: 200,
    requiredText: '/dictionary/',
  },
  {
    name: '가이드 사이트맵',
    url: `${siteUrl}/sitemap-guide.xml`,
    expectedStatus: 200,
    requiredText: '/guide/',
  },
  {
    name: '프리렌더 꿈해몽 상세 표본',
    url: `${siteUrl}/dream/dream-alone-crossing-water-watch-seen-through-door-391`,
    expectedStatus: 200,
    expectedCanonical: `${siteUrl}/dream/dream-alone-crossing-water-watch-seen-through-door-391`,
    requiredText: '꿈 해몽',
  },
];

function extractCanonical(html) {
  const match = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  return match?.[1] ?? null;
}

async function runCheck(check) {
  const startedAt = Date.now();
  try {
    const response = await fetch(check.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: {
        'user-agent': 'muunsaju-seo-health-monitor/1.0 (+https://muunsaju.com)',
        accept: 'text/html,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const body = await response.text();
    const canonical = extractCanonical(body);
    const failures = [];

    if (response.status !== check.expectedStatus) {
      failures.push(`HTTP ${response.status} (expected ${check.expectedStatus})`);
    }
    if (check.requiredText && !body.includes(check.requiredText)) {
      failures.push(`required content missing: ${check.requiredText}`);
    }
    if (check.expectedCanonical && canonical !== check.expectedCanonical) {
      failures.push(`canonical ${canonical || 'missing'} (expected ${check.expectedCanonical})`);
    }

    return {
      ...check,
      status: response.status,
      finalUrl: response.url,
      canonical,
      durationMs: Date.now() - startedAt,
      ok: failures.length === 0,
      message: failures.length ? failures.join('; ') : 'OK',
    };
  } catch (error) {
    return {
      ...check,
      status: null,
      finalUrl: null,
      canonical: null,
      durationMs: Date.now() - startedAt,
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

function toMarkdown(results) {
  const rows = results.map((result) => {
    const status = result.status ?? 'request failed';
    const outcome = result.ok ? 'PASS' : 'FAIL';
    return `| ${outcome} | ${result.name} | ${status} | ${result.durationMs} ms | ${result.message.replaceAll('|', '\\|')} |`;
  });

  return [
    '# 무운사주 운영 SEO 상태 점검',
    '',
    `- 점검 시각(UTC): ${generatedAt}`,
    `- 대상 사이트: ${siteUrl}`,
    `- 전체 결과: ${results.every((result) => result.ok) ? 'PASS' : 'FAIL'}`,
    '',
    '| 결과 | 항목 | HTTP | 응답 시간 | 상세 |',
    '|---|---|---:|---:|---|',
    ...rows,
    '',
    '이 점검은 공개 HTTP 응답·사이트맵·대표 프리렌더 URL의 canonical 계약만 검증합니다. Google Search Console의 색인·클릭·노출 수치는 속성 권한이 있는 Google 계정에서 별도로 확인해야 합니다.',
    '',
  ].join('\n');
}

const results = await Promise.all(checks.map(runCheck));
const report = toMarkdown(results);
console.log(report);

if (!results.every((result) => result.ok)) {
  process.exitCode = 1;
}
