import { Link } from 'wouter';
import { ChevronRight, BookMarked } from 'lucide-react';

// 대표 용어 — 자주 검색되는 명리학 키워드
const FEATURED_TERMS = [
  { label: '일주', desc: '나를 나타내는 핵심 기둥', slug: 'il-ju' },
  { label: '용신', desc: '나에게 유리한 오행', slug: 'yong-sin' },
  { label: '대운', desc: '10년 단위 운의 흐름', slug: 'dae-un' },
  { label: '천간', desc: '하늘의 기운 10가지', slug: 'cheon-gan' },
  { label: '지지', desc: '땅의 기운 12가지', slug: 'ji-ji' },
  { label: '오행', desc: '목·화·토·금·수', slug: 'o-haeng' },
];

export function HomeDictionarySection() {
  return (
    <section style={{ padding: '0 16px 8px' }}>
      {/* 섹션 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookMarked size={16} style={{ color: '#6B5FFF' }} />
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#191F28', fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}>
            운세 사전
          </span>
        </div>
        <Link href="/fortune-dictionary">
          <span style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            fontSize: '13px', color: '#4E5968', cursor: 'pointer',
            fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
          }}>
            전체보기 <ChevronRight size={14} />
          </span>
        </Link>
      </div>

      {/* 용어 그리드 — 2열 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
      }}>
        {FEATURED_TERMS.map((term) => (
          <Link key={term.slug} href={`/fortune-dictionary`}>
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '14px 16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              transition: 'box-shadow 0.15s, transform 0.15s',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(107,95,255,0.12)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{
                fontSize: '16px', fontWeight: 700, color: '#191F28',
                fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
              }}>
                {term.label}
              </span>
              <span style={{
                fontSize: '11px', color: '#8B95A1', lineHeight: '1.4',
                fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
              }}>
                {term.desc}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* 전체 사전 CTA */}
      <Link href="/fortune-dictionary">
        <div style={{
          marginTop: '8px',
          background: '#ffffff',
          borderRadius: '14px',
          padding: '14px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#F8F9FA')}
          onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
        >
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#191F28', fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}>
              명리학 용어 전체 보기
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#8B95A1', fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}>
              일주·용신·대운·천간·지지 등 100+ 용어
            </p>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(107,95,255,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChevronRight size={16} style={{ color: '#6B5FFF' }} />
          </div>
        </div>
      </Link>
    </section>
  );
}
