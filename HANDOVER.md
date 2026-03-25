# MuUn (무운) 사주 서비스 기능 개선 및 오류 수정 인수인계서

## 1. 프로젝트 개요
MuUn 사주 서비스의 Vercel 배포 오류 해결, UI 개선(윤달 체크박스), 그리고 사주 계산 로직의 정확성 검증 및 수정을 목적으로 진행된 작업입니다.

## 2. 주요 작업 완료 사항

### 2.1 Vercel 배포 및 빌드 오류 수정
- **JSX 문법 오류 해결**: `Naming.tsx`, `HybridCompatibility.tsx` 파일 내 태그 닫힘 오류 및 문법 오류 수정.
- **배포 상태**: 최신 배포(`dpl_96DeUJgGjyGBokWC2Z33ohyNtnK2`)가 **READY** 상태로 정상 작동 중입니다.

### 2.2 윤달 체크박스 조건부 렌더링 및 초기화
- **조건부 렌더링**: 음력 선택 시에만 윤달 체크박스가 표시되도록 React 조건부 렌더링(`{calendarType === 'lunar' && ...}`) 구현. (총 10개 페이지 적용)
- **상태 초기화**: 음력↔양력 전환 시 `isLeapMonth` 값이 `false`로 자동 초기화되도록 `useEffect` 로직 추가.
- **UI 컴포넌트 교체**: 전역 CSS(`krds_component.css`)의 `input[type=checkbox] !important` 규칙으로 인해 체크박스가 사라지는 문제를 해결하기 위해, Shadcn UI의 `Checkbox` 컴포넌트로 전면 교체하였습니다.

### 2.3 사주 결과 데이터 안정화
- **Invalid Date 방어**: `calculateSaju` 함수 및 `YearlyFortune.tsx` 등에서 날짜 객체 유효성 검사 로직을 추가하여 `undefined` 또는 `NaN` 에러를 방지했습니다.
- **템플릿 방어**: `fortune-templates.ts`에서 데이터 부재 시 발생하던 런타임 에러를 방어 로직으로 해결했습니다.

## 3. 현재 진행 중인 작업 (일주 계산 로직 검증)

### 3.1 검증 현황
- **현재 기준**: `client/src/lib/saju.ts`의 `getDayPillar` 함수는 **2000-01-01을 戊午(무오)일**로 기준 잡고 있습니다.
- **검증 결과**:
  - **1993-05-21**: 현재 코드 결과 `壬寅(임인)` → 포스텔러 만세력 결과 `壬寅(임인)`과 **일치**.
  - **사용자 보고**: 특정 날짜에서 일주가 다르게 나온다는 제보가 있어, 추가적인 날짜(1990년 이전 등)에 대한 교차 검증이 필요합니다.

## 4. 향후 작업 가이드 (이어서 할 작업)

### 4.1 일주 계산 로직 최종 수정
1. **추가 검증**: 1980년대, 1970년대 등 과거 날짜 3~5개를 포스텔러 만세력과 대조하십시오.
2. **기준점 확인**: 만약 오차가 발견된다면 `saju.ts`의 `getDayPillar` 함수 내 `base` 날짜와 `baseStemIdx`, `baseBranchIdx`를 표준 만세력 기준으로 수정해야 합니다. (현재는 2000-01-01 戊午 기준)
3. **시간대 보정**: `getHourPillar`에서 한국 표준시(KST) 보정 로직(30분 차이)이 모든 케이스에서 정확한지 재확인하십시오.

### 4.2 localStorage 안내 (사용자 요청 사항)
- 사용자가 본인의 `birthDate` 저장 값을 확인하고 싶어 하므로, 브라우저 개발자 도구(F12) -> Application -> Local Storage -> `muun_user_data` 키를 확인하는 방법을 안내해야 합니다.

## 5. 관련 파일 목록
- `client/src/lib/saju.ts`: 사주 계산 핵심 로직 (일주 계산 수정 대상)
- `client/src/pages/*.tsx`: 각 운세 페이지 (윤달/체크박스 로직 적용됨)
- `client/src/_core/krds_component.css`: 전역 CSS (체크박스 숨김 규칙 주의)
