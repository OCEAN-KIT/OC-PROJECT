# Ocean Campus 폴더 구조 안내

프로젝트에서 자주 참조하는 디렉터리와 주요 파일을 한눈에 볼 수 있도록 정리했습니다.

## 루트
- `README.md` – 서비스 소개와 기능 개요.
- `next.config.ts`, `middleware.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` – Next.js, TypeScript, 린팅/스타일 구성.
- `package.json` – 스크립트/의존성 관리.
- `certificates/` – 로컬 개발용 인증서(있다면).

## public (정적 자산)
- `public/icons/`, `public/images/` – 앱 아이콘과 공용 이미지.

## src (앱 코드)
- `src/app/` – Next.js App Router 페이지와 전역 설정
  - `layout.tsx`, `providers.tsx`, `globals.css`, `manifest.ts`
  - 루트 및 주요 페이지: `page.tsx`(홈), `login/`, `register/`, `home/`, `dive-create/`, `dive-drafts/`, `submit-management/`, `pair-watch/`, `watch-data/`, `profile/`
  - `_sw-register.tsx` – 서비스 워커 등록
- `src/components/` – UI 단위 컴포넌트
  - `keyboard/` – 천지인/영어/숫자/기호 키보드(`CheonjiinKeyboard.jsx`, `CheonjiinKeyboard.css` 등)
  - `pwa/` – 설치 안내(`install-prompt.tsx`), `PushInit.ts`
  - `submission/`, `dive-management/`, `watch/` – 제출/활동/워치 데이터 카드 및 리스트
  - `ui/` – 공용 버튼/로딩 스피너
- `src/api/` – Axios 기반 API 래퍼(auth, submissions, upload-image, ai, user).
- `src/hooks/` – 커스텀 훅(인증 가드, 제출 관련, 웹 푸시 등).
- `src/lib/`
  - `validation/` – 입력 검증(`register.ts`), `firebase.ts` – Firebase 관련 설정.
- `src/react-query/` – Query client 설정과 키 정의.
- `src/utils/` – axios 인스턴스, 천지인/한글 조합 유틸, S3 도우미, 로컬 드래프트 저장소.
- `src/data/` – 정적 데이터/목록(`activity.js`, `watch-data.ts`).
- `src/types/` – API/제출 타입 정의 및 이벤트 타입 선언.

## 기타
- `public/manifest` 및 `src/app/_sw-register.tsx`를 통해 PWA 설치/오프라인 지원.
