# MUUN Design Rollback Patch

이 패치는 사용자가 처음 업로드한 `muun_project.zip`의 **원본 프런트엔드 디자인**으로 되돌리기 위한 롤백 패치입니다.

포함:
- `client/src/**` 전체
- `client/index.html`
- `client/public/images/**`
- favicon / app icon 파일

의도적으로 제외:
- `scripts/**`
- `client/public/robots.txt`
- `client/public/sitemap*.xml`
- 서버 / API / DB 관련 파일

즉, **디자인과 프런트 동작은 원본으로 되돌리되**, 최근에 정리한 sitemap/robots 같은 SEO 파일은 유지하도록 만든 패치입니다.

적용 방법:
1. 압축 해제
2. 현재 레포 최상위에서 같은 경로로 덮어쓰기
3. `git diff` 확인
4. `pnpm build`
5. commit / push
