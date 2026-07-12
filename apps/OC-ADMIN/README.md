# OC-ADMIN

![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111)
![TanStack Router](https://img.shields.io/badge/TanStack%20Router-1.x-FF4154)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.x-FF4154)

오션캠퍼스 관리자 콘솔입니다. `OC-RECORD`에서 제출된 현장 활동 데이터를 검토하고, 공개 대시보드에 연결되는 복원 작업영역 데이터를 관리합니다.

운영 경로는 `/admin/`입니다.

## 목차

- [주요 기능](#주요-기능)
- [화면 구성](#화면-구성)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [환경 변수](#환경-변수)
- [실행 방법](#실행-방법)
- [검증](#검증)
- [배포 메모](#배포-메모)

## 주요 기능

- 관리자 로그인, 인증 가드, 내 프로필 조회/수정
- 제출 목록 조회, 검색/필터, 페이지네이션
- 제출 단건 승인/반려/삭제
- 제출 다중 선택, 일괄 승인/반려, CSV 내보내기
- 제출 상세 확인, 활동 유형별 상세 섹션 표시
- 첨부 사진 갤러리, 라이트박스, 다운로드
- 작업영역 목록 조회, 신규 작업영역 생성
- 작업영역 기본 정보, 이식 기록, 성장 기록, 환경 기록, 미디어 로그 관리
- 대시보드에서 사용할 종 데이터 생성/수정/삭제

## 화면 구성

| 경로 | 역할 |
| --- | --- |
| `/admin/login` | 관리자 로그인 |
| `/admin/` | 제출 검토 목록 |
| `/admin/review/$submissionId` | 제출 상세 검토 |
| `/admin/dashboard` | 복원 작업영역 목록 |
| `/admin/dashboard/create` | 새 작업영역 등록 |
| `/admin/dashboard/$areaId` | 작업영역 상세 관리 |
| `/admin/dashboard/speciesCreate` | 종 관리 |
| `/admin/profile` | 관리자 프로필 |

## 기술 스택

- Vite + React 19
- TypeScript
- TanStack Router file-based routing
- TanStack Query
- Tailwind CSS
- Axios
- Vitest
- `@ocean-kit/dashboard-domain`
- `@ocean-kit/submission-domain`
- `@ocean-kit/shared-auth`
- `@ocean-kit/shared-s3`

## 프로젝트 구조

```txt
src/
  routes/                 TanStack Router route 파일
  pages/
    home/                 제출 검토 목록
    review-detail/        제출 상세 검토
    dashboard/            작업영역/종 관리
    login/                로그인
    profile/              프로필
  shared/
    auth/                 인증 가드와 사용자 정보 hook
    analytics/            Google Analytics 초기화
    components/           공통 UI
    providers/            QueryProvider
    query/                queryClient, 공통 query key
```

앱 내부 화면은 라우팅과 사용자 상호작용을 담당하고, API 요청/응답 타입은 workspace 패키지에서 가져옵니다.

## 환경 변수

`vite.config.ts`에서 다음 값을 필수로 검사합니다.

```bash
API_BASE_URL=https://api.oceancampus.kr
S3_PUBLIC_BASE=https://api.oceancampus.kr
```

선택 값:

```bash
VITE_ADMIN_GA_MEASUREMENT_ID=G-...
```

## 실행 방법

루트에서 의존성을 설치합니다.

```bash
pnpm install
```

개발 서버:

```bash
pnpm dev:admin
```

직접 실행:

```bash
pnpm --filter @ocean-kit/oc-admin dev
```

기본 주소:

```txt
http://localhost:3001/admin/
```

프로덕션 빌드:

```bash
pnpm --filter @ocean-kit/oc-admin build
```

번들 분석:

```bash
pnpm --filter @ocean-kit/oc-admin build:analyze
```

## 검증

```bash
pnpm --filter @ocean-kit/oc-admin lint
pnpm --filter @ocean-kit/oc-admin test
pnpm --filter @ocean-kit/oc-admin check
```

루트 통합 검증:

```bash
pnpm build
pnpm lint
```

## 배포 메모

- Vite `base`는 `/admin/`입니다.
- TanStack Router `basepath`는 `/admin`입니다.
- 빌드 결과물은 `apps/OC-ADMIN/dist`에 생성됩니다.
- GitHub Actions는 Admin 변경이 감지되면 빌드 후 S3의 `admin/` prefix에 업로드합니다.
- nginx 설정은 `/admin/` 하위 경로에서 SPA fallback을 적용합니다.
