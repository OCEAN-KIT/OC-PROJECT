# OC-PROJECT

![pnpm](https://img.shields.io/badge/pnpm-10.33.2-F69220?logo=pnpm&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111)
![Turborepo](https://img.shields.io/badge/Turborepo-2.x-EF4444?logo=turborepo&logoColor=white)

오션캠퍼스 서비스의 프론트엔드 모노레포입니다. 현장 기록 앱, 관리자 콘솔, 공개 대시보드를 하나의 `pnpm workspace`에서 관리하고, API 호출/도메인 타입/공통 요청 로직은 `packages`로 분리해 앱들이 같은 계약을 바라보도록 구성했습니다.

- Dashboard: <https://dashboard.oceancampus.kr/dashboard>
- Admin: <https://admin.oceancampus.kr/admin/>
- Record: <https://record.oceancampus.kr/record/>

> `apps/OC-ADMIN-NEXT`는 Next.js 기반 레거시 관리자 코드입니다. 현재 workspace에서 제외되어 있고 운영/배포 대상이 아닙니다. 현재 운영 관리자 앱은 `apps/OC-ADMIN`입니다.

## 목차

- [프로젝트 목적](#프로젝트-목적)
- [애플리케이션](#애플리케이션)
- [프로젝트 구조](#프로젝트-구조)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [환경 변수](#환경-변수)
- [주요 명령어](#주요-명령어)
- [배포](#배포)
- [개발 원칙](#개발-원칙)
- [라이선스](#라이선스)

## 프로젝트 목적

오션캠퍼스의 해양 생태 복원 데이터 흐름을 프론트엔드에서 연결하는 것이 목적입니다.

1. 현장 사용자는 `OC-RECORD`에서 수중 활동을 기록하고 제출합니다.
2. 관리자는 `OC-ADMIN`에서 제출물을 검토하고, 복원 작업영역 데이터를 관리합니다.
3. 일반 사용자는 `OC-DASHBOARD`에서 복원 현황을 지도와 상세 지표로 확인합니다.

README에는 현재 코드와 배포 파이프라인에서 확인되는 내용만 적었습니다. 이전 통합 README에 있던 실제 프로젝트 구조와 맞지 않는 항목은 제거했습니다.

## 애플리케이션

| 앱 | 위치 | 역할 | 상세 문서 |
| --- | --- | --- | --- |
| `OC-ADMIN` | `apps/OC-ADMIN` | 제출 검토, 승인/반려/삭제, 작업영역/종/운영 데이터 관리 | [README](./apps/OC-ADMIN/README.md) |
| `OC-RECORD` | `apps/OC-RECORD` | 현장 활동 기록, 임시 저장, 첨부 업로드, 제출 관리, PWA 업데이트 안내 | [README](./apps/OC-RECORD/README.md) |
| `OC-DASHBOARD` | `apps/OC-DASHBOARD` | Mapbox 기반 복원 현황 지도, 지역/단계 필터, 작업영역 상세 지표 시각화 | [README](./apps/OC-DASHBOARD/README.md) |

## 프로젝트 구조

```txt
apps/
  OC-ADMIN/        관리자 콘솔, Vite + React
  OC-RECORD/       현장 기록 앱, Vite + React + PWA
  OC-DASHBOARD/    공개 대시보드, Next.js App Router
  OC-ADMIN-NEXT/   레거시 Next 관리자 코드, 현재 workspace 제외

packages/
  dashboard-domain/    대시보드/작업영역 API와 타입
  submission-domain/   제출/검토 API와 타입
  shared-auth/         인증 API 경계
  shared-axios/        공통 Axios 인스턴스
  shared-s3/           S3 presigned upload 공통 로직
  shared-types/        API/Auth 공통 타입
  design-system/       디자인 토큰/Storybook 기반 UI 작업

docs/
  리팩터링, 마이그레이션, 워크스페이스 운영 메모
```

Workspace 설정은 다음과 같습니다.

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "!apps/OC-ADMIN-NEXT"
```

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| Monorepo | pnpm workspace, Turborepo |
| Language | TypeScript |
| UI | React 19, Tailwind CSS |
| Routing | TanStack Router(Admin/Record), Next.js App Router(Dashboard) |
| Server State | TanStack Query |
| Map/Chart | Mapbox GL, ECharts, Recharts |
| Build | Vite(Admin/Record), Next.js standalone(Dashboard) |
| Quality | ESLint, TypeScript, Vitest(Admin), k6(Dashboard detail) |

## 시작하기

Node.js 22와 `pnpm@10.33.2` 기준입니다.

```bash
corepack enable
pnpm install
```

앱별 개발 서버:

```bash
pnpm dev:admin
pnpm dev:record
pnpm dev:dashboard
```

기본 개발 주소:

| 앱 | 주소 |
| --- | --- |
| Admin | `http://localhost:3001/admin/` |
| Record | `http://localhost:3002/record/` |
| Dashboard | `https://localhost:3000/dashboard` |

Dashboard 개발 서버는 `mkcert` 기반 HTTPS 옵션을 사용합니다. 로컬에 `mkcert`가 없으면 `pnpm dev:dashboard`가 실패할 수 있습니다.

## 환경 변수

Admin과 Record는 Vite 설정에서 `API_BASE_URL`, `S3_PUBLIC_BASE`를 필수로 요구합니다. Dashboard는 여기에 Mapbox 설정이 추가로 필요합니다.

```bash
API_BASE_URL=https://api.oceancampus.kr
S3_PUBLIC_BASE=https://api.oceancampus.kr
MAPBOX_TOKEN=your-mapbox-token
MAPBOX_STYLE_URL=your-mapbox-style-url
```

선택 환경 변수:

```bash
VITE_ADMIN_GA_MEASUREMENT_ID=G-...
VITE_RECORD_GA_MEASUREMENT_ID=G-...
NEXT_PUBLIC_DASHBOARD_GA_MEASUREMENT_ID=G-...
```

## 주요 명령어

```bash
pnpm build
pnpm lint
pnpm typecheck
pnpm check
```

앱 단위 명령:

```bash
pnpm --filter @ocean-kit/oc-admin test
pnpm --filter @ocean-kit/oc-dashboard k6:detail
pnpm --filter @ocean-kit/oc-record build
```

## 배포

프론트 배포는 `.github/workflows/frontend-deploy.yml`에서 처리합니다.

- `OC-ADMIN`, `OC-RECORD`는 Vite 정적 파일로 빌드한 뒤 S3 prefix에 업로드합니다.
  - Admin: `s3://<FRONTEND_S3_BUCKET>/admin/`
  - Record: `s3://<FRONTEND_S3_BUCKET>/record/`
- EC2의 정적 파일 배포 스크립트가 S3 결과물을 nginx 서빙 경로에 반영합니다.
- `OC-RECORD`는 `sw.js`, `manifest.webmanifest`, `index.html`에 no-cache 계열 헤더가 필요합니다.
- `OC-DASHBOARD`는 Next.js standalone output으로 빌드한 뒤 EC2의 `/opt/oceancampus/dashboard`에 배포하고 `oceancampus-dashboard` systemd 서비스를 재시작합니다.
- 운영 smoke test는 Admin/Record/Dashboard 엔드포인트와 Record 서비스워커 최신 빌드 참조를 확인합니다.

## 개발 원칙

- 새 관리자 기능은 `apps/OC-ADMIN`에 추가합니다. `apps/OC-ADMIN-NEXT`는 레거시 코드라 새 기능 대상이 아닙니다.
- API 계약이 바뀌면 앱 내부 임시 타입보다 `packages/*-domain` 또는 `shared-*` 패키지를 먼저 수정합니다.
- Admin/Record는 서브도메인으로 접근하더라도 asset path 안정성을 위해 각각 `/admin/`, `/record/` base path를 유지합니다.
- Dashboard는 Next.js `basePath: "/dashboard"`와 standalone output 전제를 유지합니다.
- presigned upload 응답이 이미 절대 URL이면 프론트에서 별도 public base를 붙이지 않습니다.
- README는 실행 방법, 환경 변수, 배포 경로가 바뀔 때 같이 갱신합니다.

## 라이선스

현재 저장소에는 별도 `LICENSE` 파일이 없습니다. 외부 공개 또는 오픈소스 기여를 받을 계획이라면 재사용 가능 범위를 명확히 하기 위해 라이선스 파일을 추가해야 합니다.
