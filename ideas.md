# 무운(MUUN) 메인 페이지 리뉴얼 디자인 아이디어

## 요구사항 요약
- Mystical Modernism & Personalization 컨셉
- 글래스모피즘(Glassmorphism) + 네온 글로우(Neon Glow)
- 딥 네이비 컬러 유지, 신비로운 우주적 분위기
- Hero Section: 인터랙티브 배너 + 추상 그래픽
- Category: 탭/칩 + 2x2 그리드 + 가로 슬라이더 혼합
- Personalization 대시보드
- 마이크로 인터랙션 (Fade-in, Slide-up, 글로우 효과)
- 플로팅 버튼(FAB) 재배치

---

<response>
## 아이디어 1: "Celestial Observatory" (천체 관측소)
<probability>0.07</probability>

### Design Movement
**Cosmic Brutalism** — 우주의 광활함과 미니멀한 구조적 강인함을 결합. NASA의 제임스 웹 망원경 이미지에서 영감을 받은 심우주 팔레트.

### Core Principles
1. **Orbital Hierarchy**: 모든 요소가 중심 오브(천체)를 중심으로 궤도를 그리듯 배치
2. **Nebula Depth**: 성운처럼 겹겹이 쌓인 반투명 레이어로 깊이감 연출
3. **Stellar Contrast**: 극도로 어두운 배경 위에 별빛처럼 빛나는 액센트
4. **Gravitational Flow**: 스크롤이 중력처럼 자연스럽게 콘텐츠를 끌어당기는 느낌

### Color Philosophy
- **Primary Void**: `#0a0e1a` (심우주 블랙-네이비)
- **Nebula Purple**: `#6c3ce0` → `#a855f7` (보라 그라데이션, 신비로움)
- **Starlight Gold**: `#f5c542` → `#fbbf24` (별빛, 행운의 상징)
- **Cosmic Teal**: `#14b8a6` (차가운 우주의 청록)
- **Glass White**: `rgba(255,255,255,0.06)` ~ `rgba(255,255,255,0.12)` (글래스모피즘)

### Layout Paradigm
- Hero: 전체 화면 천체 애니메이션 + 중앙 오브 형태의 "오늘의 운세" 카드
- 카테고리: 상단 가로 스크롤 칩 → 하단 비대칭 벤토 그리드 (2x2 + 1x2 혼합)
- 개인화: 상단 고정 바에 미니 프로필 + 행운 컬러 표시

### Signature Elements
1. **Orbital Ring**: 메뉴 아이콘 주변을 감싸는 얇은 궤도 링 애니메이션
2. **Nebula Blur**: 카드 뒤에 퍼지는 색상 블러 (각 카테고리별 고유 색상)
3. **Star Particle**: 스크롤 시 미세한 별 파티클이 떠다니는 배경

### Interaction Philosophy
- 터치 시 카드가 약간 기울어지며 빛 반사 효과 (3D tilt)
- 스크롤 시 패럴랙스로 배경 별들이 천천히 이동
- 카테고리 전환 시 성운 같은 색상 전환 애니메이션

### Animation
- 페이지 진입: 중앙에서 바깥으로 퍼지는 빛의 파동
- 카드 등장: 아래에서 위로 0.3s ease-out + opacity 0→1
- 호버: 카드 테두리에 네온 글로우 + 미세한 scale(1.02)
- 배경: CSS로 구현한 느린 별 파티클 움직임

### Typography System
- **Display**: "Noto Serif KR" Bold — 한국적 격조 + 명리학 분위기
- **Body**: "Pretendard" Regular/Medium — 가독성 최적화
- **Accent**: "Space Grotesk" — 영문 로고/숫자에 미래적 느낌
</response>

<response>
## 아이디어 2: "Ink & Oracle" (먹과 신탁)
<probability>0.05</probability>

### Design Movement
**Digital Calligraphy** — 동양 수묵화의 여백미와 디지털 글리치 아트의 결합. 전통 명리학의 뿌리를 시각적으로 존중하면서 현대적 기술감을 더함.

### Core Principles
1. **Ink Flow**: 수묵화의 번짐 효과를 디지털로 재해석한 트랜지션
2. **Sacred Geometry**: 팔괘, 오행 도형을 현대적 기하학으로 변환
3. **Void Mastery**: 동양 미학의 여백을 적극 활용한 비대칭 레이아웃
4. **Ritual Rhythm**: 사용자 행동을 의식(ritual)처럼 단계적으로 안내

### Color Philosophy
- **Ink Black**: `#0d1117` (먹의 깊이)
- **Rice Paper**: `rgba(255,248,240,0.08)` (한지 질감의 글래스)
- **Cinnabar Red**: `#dc2626` → `#ef4444` (주사, 전통 인장의 빨강)
- **Jade Green**: `#059669` (옥의 색, 행운)
- **Gold Leaf**: `#d4a017` (금박, 고급스러움)

### Layout Paradigm
- Hero: 세로 스크롤형 두루마리 메타포 — 펼쳐지는 느낌의 애니메이션
- 카테고리: 좌측 세로 탭 (모바일에서는 상단 가로 칩) + 우측 콘텐츠 영역
- 개인화: 전통 인장(도장) 형태의 프로필 아이콘

### Signature Elements
1. **Ink Splash**: 페이지 전환 시 먹물이 번지는 듯한 트랜지션
2. **Seal Mark**: 각 카테고리에 전통 인장 스타일의 아이콘
3. **Brush Stroke Divider**: 섹션 구분선이 붓질 형태

### Interaction Philosophy
- 카드 터치 시 먹물이 스며드는 듯한 ripple 효과
- 스크롤 시 두루마리가 펼쳐지는 듯한 reveal 애니메이션
- 결과 표시 시 붓글씨가 써지는 듯한 텍스트 애니메이션

### Animation
- 페이지 진입: 두루마리 펼침 (clip-path 애니메이션)
- 카드 등장: 먹물 번짐 → 형태 완성 (0.5s)
- 호버: 금박 테두리 빛남
- 로딩: 팔괘 회전 애니메이션

### Typography System
- **Display**: "Nanum Myeongjo" Bold — 전통 서체의 격조
- **Body**: "Pretendard" Regular — 현대적 가독성
- **Accent**: "Gowun Batang" — 한문/숫자에 전통미
</response>

<response>
## 아이디어 3: "Aurora Nexus" (오로라 연결점)
<probability>0.08</probability>

### Design Movement
**Ethereal Glassmorphism** — 북극 오로라의 유동적 색채와 글래스모피즘의 투명한 레이어를 결합. 신비롭지만 접근하기 쉬운 현대적 인터페이스.

### Core Principles
1. **Flowing Light**: 오로라처럼 끊임없이 흐르는 색상 그라데이션
2. **Layered Glass**: 다층 글래스 패널로 정보의 깊이 표현
3. **Warm Mysticism**: 차가운 우주 + 따뜻한 골드로 친근한 신비로움
4. **Intuitive Discovery**: 탐색 자체가 즐거운 인터랙션 설계

### Color Philosophy
- **Deep Space**: `#0b1120` → `#111827` (깊은 남색, 밤하늘)
- **Aurora Violet**: `#7c3aed` → `#a78bfa` (보라 오로라)
- **Aurora Cyan**: `#06b6d4` → `#22d3ee` (청록 오로라)
- **Mystic Gold**: `#f59e0b` → `#fbbf24` (황금빛, 운명의 색)
- **Glass Surface**: `rgba(255,255,255,0.05)` ~ `rgba(255,255,255,0.15)` (다층 글래스)
- **Neon Glow**: `box-shadow: 0 0 20px rgba(124,58,237,0.3)` (네온 글로우)

### Layout Paradigm
- Hero: 풀스크린 오로라 그라데이션 배경 + 중앙 개인화 카드 (글래스모피즘)
- 카테고리: 상단 가로 스크롤 칩(대분류) → Featured 카로셀(추천) → 2열 그리드(전체)
- 개인화: Hero 내부에 "OO님의 오늘" 글래스 카드 — 행운 컬러, 키워드, 점수
- FAB: 우하단 플로팅 버튼 (타로 기록)

### Signature Elements
1. **Aurora Gradient**: 배경에 천천히 흐르는 보라-청록 그라데이션 애니메이션
2. **Glass Card**: 배경 블러 + 미세한 보더 빛남 + 내부 그라데이션 오버레이
3. **Glow Pulse**: 주요 CTA 버튼에 은은하게 맥박치는 네온 글로우

### Interaction Philosophy
- 카드 호버 시 글래스 표면에 빛이 스치는 효과 (shimmer)
- 스크롤 시 각 섹션이 부드럽게 떠오르며 배경 오로라 색상 변화
- 카테고리 칩 선택 시 해당 색상의 글로우가 퍼지는 피드백
- 버튼 클릭 시 ripple + 짧은 진동(haptic) 느낌의 scale 애니메이션

### Animation
- 배경: CSS @keyframes로 오로라 그라데이션 천천히 이동 (60s 주기)
- 페이지 진입: 위에서 아래로 오로라 빛이 내려오는 커튼 효과
- 카드 등장: stagger 0.1s 간격으로 Fade-in + Slide-up (translateY 20px → 0)
- 호버: border-color 트랜지션 + box-shadow 글로우 확대
- CTA 버튼: 2s 주기로 은은하게 밝아졌다 어두워지는 pulse
- 칩 전환: 선택된 칩에 underline이 슬라이드하는 indicator

### Typography System
- **Display**: "Noto Sans KR" Black/Bold — 강렬하면서도 현대적
- **Body**: "Pretendard" Regular/Medium — 최적의 한글 가독성
- **Accent Numbers**: "Space Grotesk" Semi-Bold — 숫자/영문에 테크 느낌
- **Hierarchy**: Display 28-32px / Section Title 20-24px / Body 14-16px / Caption 12px
</response>

---

## 선택: 아이디어 3 — "Aurora Nexus" (오로라 연결점)

### 선택 이유
1. **요구사항 완벽 충족**: 글래스모피즘 + 네온 글로우 + 딥 네이비가 자연스럽게 통합
2. **접근성**: 신비롭지만 지나치게 전통적이지 않아 40대 여성 타겟에 적합
3. **구현 가능성**: CSS 기반 애니메이션으로 성능 부담 없이 화려한 효과 가능
4. **확장성**: 카로셀 + 그리드 혼합 레이아웃이 12개 메뉴를 효과적으로 수용
5. **차별화**: 오로라 그라데이션이 일반적인 다크 테마와 확실히 차별화
