# OC-PROJECT

오션캠퍼스 서비스의 프론트엔드 모노레포입니다.
<a>https://dashboard.oceancampus.kr/dashboard</a>
<a>https://dashboard.oceancampus.kr</a>
<a>https://record.oceancampus.kr</a>

관리자 콘솔, 현장 기록 앱, 공개 대시보드를 하나의 pnpm workspace에서 관리하고, API 호출/도메인 타입/공통 요청 로직은 `packages`로 분리해 앱들이 같은 계약을 바라보도록 구성되어 있습니다.

> `apps/OC-ADMIN-NEXT`는 Next.js 기반 레거시 관리자 코드입니다. 현재 workspace에서 제외되어 있고 운영/배포 대상이 아닙니다. 현재 운영 관리자 앱은 `apps/OC-ADMIN`입니다.

## 프로젝트 구성

```txt
apps/
  OC-ADMIN/        관리자 콘솔
  OC-RECORD/       현장 기록 앱
  OC-DASHBOARD/    공개 대시보드
  OC-ADMIN-NEXT/   레거시 Next 관리자 코드, 현재 미사용

packages/
  dashboard-domain/    대시보드/작업영역 도메인 API와 타입
  submission-domain/   제출/검토 도메인 API와 타입
  shared-auth/         인증 API 경계
  shared-axios/        공통 Axios 인스턴스
  shared-s3/           S3 presigned upload 공통 로직
  shared-types/        API/Auth 공통 타입
  design-system/       디자인 토큰/Storybook 기반 UI 기반 작업

docs/
  리팩터링, 마이그레이션, 워크스페이스 운영 메모
```

## 앱별 역할

| 앱 | 역할 | 운영 여부 |
| --- | --- | --- |
| `apps/OC-ADMIN` | 작업영역 관리, 제출 검토, 관리자/프로필 화면 | 운영 |
| `apps/OC-RECORD` | 현장 기록 작성, 임시 저장, 제출 플로우 | 운영 |
| `apps/OC-DASHBOARD` | 지도 기반 복원 현황, 작업영역 상세, 시각화 화면 | 운영 |
| `apps/OC-ADMIN-NEXT` | 과거 Next.js 관리자 구현 | 미사용 |

## 프로젝트별 기술 스택

| 프로젝트 | 프레임워크 | 주요 기술 |
| --- | --- | --- |
| `OC-ADMIN` | Vite + React | TanStack Router, TanStack Query, Tailwind CSS, Axios |
| `OC-RECORD` | Vite + React | TanStack Router, TanStack Query, PWA, Tailwind CSS |
| `OC-DASHBOARD` | Next.js | Mapbox GL, ECharts, TanStack Query, Tailwind CSS |
| `design-system` | Storybook + Vite | 디자인 토큰, reset/style 기반 패키지 |

공통 기반:

- Package manager: `pnpm@10.33.2`
- Monorepo orchestration: Turborepo
- Language: TypeScript
- UI runtime: React 19
- Quality: ESLint, TypeScript typecheck, Vitest 일부

## 모노레포 구조

이 저장소는 `apps/*`와 `packages/*`를 pnpm workspace로 묶습니다.

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "!apps/OC-ADMIN-NEXT"
```

핵심 원칙은 앱과 도메인 계약을 분리하는 것입니다.

- 앱은 라우팅, 화면 구성, 사용자 상호작용을 담당합니다.
- 도메인 패키지는 백엔드 API 호출 함수와 요청/응답 타입을 담당합니다.
- 공통 패키지는 인증, Axios, S3 업로드, 공통 타입처럼 여러 앱에서 반복되면 안 되는 코드를 담당합니다.
- `OC-ADMIN-NEXT`는 workspace에서 제외되어 루트 빌드/배포 대상에 포함되지 않습니다.

루트 스크립트는 Turborepo를 통해 운영 대상 앱만 실행합니다.

```bash
pnpm dev:admin
pnpm dev:record
pnpm dev:dashboard
pnpm build
pnpm lint
pnpm typecheck
```

## 패키지 역할

| 패키지 | 역할 |
| --- | --- |
| `@ocean-kit/dashboard-domain` | 작업영역, 상세 정보, 환경/성장/이식/미디어 로그 API와 타입 |
| `@ocean-kit/submission-domain` | 기록 제출, 제출 목록/상세, 검토 관련 API와 타입 |
| `@ocean-kit/shared-auth` | 로그인, 회원가입, 로그아웃, 사용자 조회 API |
| `@ocean-kit/shared-axios` | `API_BASE_URL` 기반 공통 Axios 인스턴스 |
| `@ocean-kit/shared-s3` | presigned URL 발급, S3 PUT 업로드, 삭제 공통 로직 |
| `@ocean-kit/shared-types` | API 응답, 인증 사용자 등 공통 타입 |
| `@ocean-kit/design-system` | 디자인 토큰과 Storybook 기반 UI 실험/정리 패키지 |

## 배포 방식

현재 프론트 배포는 GitHub Actions의 `.github/workflows/frontend-deploy.yml`에서 처리합니다.

### Admin / Record

- `OC-ADMIN`, `OC-RECORD`는 Vite 정적 파일로 빌드됩니다.
- 빌드 base path는 기존 경로를 유지합니다.
  - Admin: `/admin/`
  - Record: `/record/`
- 빌드 결과물은 S3 prefix에 업로드됩니다.
  - `s3://oceancampus-prod-frontend/admin/`
  - `s3://oceancampus-prod-frontend/record/`
- 이후 EC2 nginx에서 사용할 수 있도록 별도 sync/반영합니다.

### Dashboard

- `OC-DASHBOARD`는 Next.js standalone output으로 빌드됩니다.
- GitHub Actions에서 EC2로 배포하고 `oceancampus-dashboard` systemd 서비스를 재시작합니다.
- 실행 경로는 `/opt/oceancampus/dashboard` 기준입니다.

### 환경변수

운영 빌드 기준 주요 값:

```txt
API_BASE_URL=https://api.oceancampus.kr
S3_PUBLIC_BASE=https://api.oceancampus.kr
```

CloudFront는 운영 도메인 기준에서 제거되었습니다.
빌드 산출물에 기존 CloudFront 도메인이 남아있으면 배포 workflow가 실패하도록 검사합니다.

```txt
d24m5p5t9qbt5o.cloudfront.net
```

## 개발 시 주의사항

- `OC-ADMIN-NEXT`는 레거시 코드이므로 새 기능을 추가하지 않습니다.
- API 계약이 바뀌면 앱 내부에서 임시 타입을 만들기보다 관련 `packages/*-domain` 또는 `shared-*` 패키지부터 수정합니다.
- `API_BASE_URL`, `S3_PUBLIC_BASE`, `MAPBOX_TOKEN`, `MAPBOX_STYLE_URL`은 빌드 결과에 영향을 주므로 Turborepo env cache key에 포함되어 있습니다.
- Admin/Record는 서브도메인으로 접근하더라도 asset path 안정성을 위해 `/admin/`, `/record/` base path를 유지합니다.
- presigned upload 응답이 이미 절대 URL이면 프론트에서 별도 public base를 붙이지 않고 그대로 사용합니다.
