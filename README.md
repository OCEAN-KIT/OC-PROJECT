# OC-PROJECT

OC-PROJECT는 Ocean Care 서비스의 프론트엔드 모노레포입니다. 관리자, 대시보드, 현장 기록 앱을 하나의 workspace에서 관리하고, API 호출과 도메인 타입은 공용 패키지로 분리해 각 앱이 같은 계약을 바라보도록 구성되어 있습니다.

## 구성

```txt
apps/
  OC-ADMIN/        관리자 콘솔. 작업영역, 제출 검토, 회원/프로필 관리 화면을 담당합니다.
  OC-DASHBOARD/    복원 현황 대시보드. 지도, 차트, 작업영역 상세 정보를 시각화합니다.
  OC-RECORD/       현장 기록 앱. 잠수/복원 기록 작성, 임시 저장, 제출 흐름을 담당합니다.
  OC-ADMIN-NEXT/   Next.js 기반 관리자 앱 실험/전환용 코드입니다. 현재 workspace 대상에서는 제외되어 있습니다.

packages/
  dashboard-domain/    작업영역, 생장/이식/환경/미디어 로그 관련 API와 타입을 제공합니다.
  submission-domain/   제출 폼, 제출 목록/상세, 검토 도메인의 API와 타입을 제공합니다.
  shared-auth/         로그인, 회원가입, 로그아웃, 사용자 조회 같은 인증 API 경계를 제공합니다.
  shared-axios/        서비스 공통 axios 인스턴스를 제공합니다.
  shared-types/        앱과 도메인 패키지에서 공유하는 API/Auth 공통 타입을 제공합니다.

docs/                  마이그레이션, 리팩터링, Turbo/workspace 기록 문서입니다.
```

## 기술 스택

- Monorepo: pnpm workspace, Turborepo
- Language: TypeScript
- UI: React, Tailwind CSS, lucide-react
- App frameworks: Vite, Next.js
- Routing and server state: TanStack Router, TanStack Query
- Data layer: Axios, workspace domain packages
- Visualization: Mapbox GL, ECharts, Recharts
- Quality: ESLint, Prettier, Vitest
- Container: Docker, Nginx static serving for the Vite admin app

## 설계 방향

이 저장소는 앱 코드와 도메인 계약을 분리하는 쪽으로 정리되어 있습니다.

- 앱은 화면 구성, 라우팅, 사용자 상호작용을 담당합니다.
- `packages/*-domain`은 백엔드 API 호출과 요청/응답 타입을 담당합니다.
- `shared-*` 패키지는 인증, axios 설정, 공통 타입처럼 여러 앱이 같은 방식으로 써야 하는 기반 코드를 담당합니다.
- 앱 사이에서 같은 API 계약을 직접 복사하지 않고 workspace 패키지를 통해 공유합니다.

관리자 앱은 Vite 기반 SPA이며, 빌드 결과물은 Nginx 정적 서빙 이미지로 배포할 수 있게 Dockerfile이 구성되어 있습니다. 대시보드와 기록 앱은 Next.js 앱으로 별도 이미지/배포 단위를 가집니다.

## 작업 단위

루트의 package script는 앱과 패키지를 직접 실행하기 위한 진입점이라기보다, Turborepo가 각 workspace의 `build`, `lint`, `typecheck` 작업을 의존 그래프 기준으로 실행하도록 묶은 오케스트레이션 계층입니다.

일반적인 변경 단위는 다음처럼 나뉩니다.

- 화면/라우팅 변경: 해당 앱의 `apps/*/src` 내부에서 처리합니다.
- 백엔드 계약 변경: 관련 `packages/*-domain` 또는 `shared-*` 패키지에서 먼저 타입과 API 함수를 정리한 뒤 앱에서 사용합니다.
- 공통 인증/요청 정책 변경: `shared-auth`, `shared-axios`, `shared-types`의 영향 범위를 확인해야 합니다.
- 컨테이너 배포 변경: 각 앱의 Dockerfile과 해당 앱이 참조하는 workspace 패키지를 함께 봐야 합니다.

## 배포 관점

앱별 Dockerfile은 각 애플리케이션을 독립 이미지로 만들기 위한 경계입니다. CI/CD에서 변경된 앱만 이미지 빌드하도록 만들려면 GitHub Actions의 `paths` 또는 변경 파일 기반 matrix에서 앱별 경로와 관련 workspace 패키지를 함께 판단해야 합니다.

이미지 빌드가 시작된 뒤의 캐시 계층은 역할이 다릅니다.

- GitHub Actions workflow: 어떤 앱 이미지를 다시 만들지 결정합니다.
- Docker layer cache: Dockerfile의 어느 단계부터 다시 실행할지 결정합니다.
- Turborepo cache: 이미지 빌드 내부에서 어떤 workspace task를 재사용할지 결정합니다.

공용 패키지가 바뀌면 해당 패키지를 의존하는 앱 이미지는 함께 다시 빌드되어야 합니다.
