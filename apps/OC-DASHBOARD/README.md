# OC-DASHBOARD

![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111)
![Mapbox](https://img.shields.io/badge/Mapbox%20GL-3.x-000000?logo=mapbox&logoColor=white)
![ECharts](https://img.shields.io/badge/ECharts-5.x-AA344D)

오션캠퍼스의 공개 복원 현황 대시보드입니다. Mapbox 지도를 중심으로 포항/울진 지역의 복원 작업영역을 보여주고, 작업영역 상세 페이지에서 상태, 생태, 환경, 사진 데이터를 시각화합니다.

운영 경로는 `/dashboard`입니다.

## 목차

- [주요 기능](#주요-기능)
- [화면 구성](#화면-구성)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [환경 변수](#환경-변수)
- [실행 방법](#실행-방법)
- [성능 테스트](#성능-테스트)
- [배포 메모](#배포-메모)

## 주요 기능

- Mapbox 기반 전체 화면 복원 현황 지도
- 포항/울진 지역 선택
- 작업 단계 필터, 작업영역 검색
- 데스크톱 우상단 패널과 모바일 바텀시트 컨트롤
- 작업영역 선택 및 지도 카메라 이동
- 작업영역 상세 페이지
- 개요, 현황, 생태, 환경, 사진 탭
- 종별 현황, 방식별 분포, 최근 작업 추이, 생장/수온 차트
- S3 이미지 URL 정규화와 Next Image remote pattern 설정
- Google Analytics 선택 연동
- k6 기반 상세 페이지 성능 테스트

## 화면 구성

| 경로 | 역할 |
| --- | --- |
| `/dashboard` | 지도 기반 복원 현황 |
| `/dashboard/detailInfo/[id]` | 작업영역 상세 정보 |
| `/dashboard/dashBoard` | `/`로 redirect되는 호환 경로 |

Next.js `basePath`가 `/dashboard`로 설정되어 있으므로 로컬과 운영 모두 `/dashboard` prefix를 기준으로 접근해야 합니다.

## 기술 스택

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- Mapbox GL
- ECharts
- `@ocean-kit/dashboard-domain`
- `@ocean-kit/shared-axios`

## 프로젝트 구조

```txt
src/
  app/                           Next.js 라우트와 전역 provider
    (map)/page.tsx               지도 라우트
    detailInfo/[id]/page.tsx     작업영역 상세 라우트
    @modal/                      상세 정보 intercepting route
  features/
    map/
      components/                지도, 마커, 검색/필터 컨트롤
      hooks/                     Mapbox 수명주기와 지도 상태
      lib/mapbox/                Mapbox DOM/카메라 adapter
      model/                     지역과 지도 view model
    area-detail/
      components/                상세 화면, 모달, 탭과 차트
      lib/                       상세 전용 이미지 URL 변환
      model/                     상세 전용 표시 메타데이터
  shared/
    analytics/                   Google Analytics
    model/                       여러 feature가 공유하는 단계 메타
k6/
  dashboard-detail.js          상세 페이지 부하 테스트
  docker-compose.yml           InfluxDB/Grafana 로컬 스택
```

`app`은 URL 연결만 담당하고, 제품 로직과 UI는 `features`가 소유합니다.
`shared`에는 둘 이상의 feature가 실제로 사용하는 코드만 둡니다.

## 환경 변수

`next.config.ts`에서 다음 값을 필수로 검사합니다.

```bash
API_BASE_URL=https://api.oceancampus.kr
S3_PUBLIC_BASE=https://api.oceancampus.kr
MAPBOX_TOKEN=your-mapbox-token
MAPBOX_STYLE_URL=your-mapbox-style-url
```

선택 값:

```bash
NEXT_PUBLIC_DASHBOARD_GA_MEASUREMENT_ID=G-...
```

## 실행 방법

루트에서 의존성을 설치합니다.

```bash
pnpm install
```

개발 서버:

```bash
pnpm dev:dashboard
```

직접 실행:

```bash
pnpm --filter @ocean-kit/oc-dashboard dev
```

기본 주소:

```txt
https://localhost:3000/dashboard
```

개발 서버는 `mkcert` 인증서를 사용한 HTTPS 옵션으로 실행됩니다. 로컬에 `mkcert`가 없으면 `mkcert -CAROOT` 호출에서 실패할 수 있습니다.

프로덕션 빌드:

```bash
pnpm --filter @ocean-kit/oc-dashboard build
```

프로덕션 실행:

```bash
pnpm --filter @ocean-kit/oc-dashboard start
```

## 성능 테스트

단일 k6 실행:

```bash
pnpm --filter @ocean-kit/oc-dashboard k6:detail
```

Grafana/InfluxDB 로컬 스택:

```bash
pnpm --filter @ocean-kit/oc-dashboard k6:grafana:up
pnpm --filter @ocean-kit/oc-dashboard k6:detail:grafana
pnpm --filter @ocean-kit/oc-dashboard k6:grafana:down
```

Grafana 기본 주소는 `http://localhost:3001`이고 기본 계정은 `admin / admin`입니다.

## 배포 메모

- Next.js `basePath`는 `/dashboard`입니다.
- `output: "standalone"`으로 빌드합니다.
- GitHub Actions는 Dashboard 변경이 감지되면 `.next/standalone`, `.next/static`, `public`을 EC2로 동기화합니다.
- 원격 실행 경로는 `/opt/oceancampus/dashboard` 기준입니다.
- 배포 후 `oceancampus-dashboard` systemd 서비스를 재시작합니다.
- 운영 smoke test는 `https://dashboard.oceancampus.kr/dashboard` 응답을 확인합니다.
