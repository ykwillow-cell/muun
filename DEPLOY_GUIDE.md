# 무운 사주 AI 타로 배포 가이드

AI 타로 기능을 정상적으로 사용하기 위해서는 Vercel에 배포하고 Gemini API 키를 설정해야 합니다.

## 1. Gemini API 키 발급
1. [Google AI Studio](https://aistudio.google.com/)에 접속합니다.
2. API 키를 생성합니다 (무료 티어 사용 가능).

## 2. Vercel 배포 및 환경 변수 설정
1. GitHub 리포지토리를 Vercel에 연결합니다.
2. Vercel 프로젝트 설정의 **Environment Variables** 메뉴로 이동합니다.
3. 다음 변수를 추가합니다:
   - `GEMINI_API_KEY`: 발급받은 Gemini API 키

## 3. 로컬 개발 환경 설정
로컬에서 테스트하려면 프로젝트 루트에 `.env` 파일을 생성하고 키를 입력하세요:
```env
GEMINI_API_KEY=your_api_key_here
```

## 4. 기술적 특징
- **보안**: API 키는 클라이언트 코드에 노출되지 않으며, `api/tarot.ts` (Vercel Functions) 서버 사이드에서만 호출됩니다.
- **UI/UX**: Framer Motion을 사용한 카드 셔플 및 뒤집기 애니메이션이 적용되었습니다.
- **모델**: Gemini 2.0 Flash-Lite 모델을 사용하여 빠르고 정확한 해석을 제공합니다.
