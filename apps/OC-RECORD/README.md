# OC-RECORD

![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111)
![PWA](https://img.shields.io/badge/PWA-Service%20Worker-5A0FC8)
![TanStack Router](https://img.shields.io/badge/TanStack%20Router-1.x-FF4154)

오션캠퍼스 현장 활동 기록 앱입니다. 현장에서 활동 정보를 작성하고, 네트워크 상태를 확인한 뒤 첨부 파일과 함께 제출합니다. 오프라인 상황에서는 서버 제출을 막고, 입력 중인 기록은 브라우저 로컬 저장소에 임시 저장할 수 있습니다.

운영 경로는 `/record/`입니다.

## 목차

- [주요 기능](#주요-기능)
- [화면 구성](#화면-구성)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [환경 변수](#환경-변수)
- [실행 방법](#실행-방법)
- [데이터 흐름](#데이터-흐름)
- [검증](#검증)
- [배포 메모](#배포-메모)

## 주요 기능

- 로그인, 회원가입, 로그아웃, 프로필 조회/수정
- 활동 기록 생성
- 공통 환경 정보 입력
- 이식, 조식동물 작업, 부착기질 개선, 모니터링, 해양정화 활동별 입력 폼
- 모바일 입력 환경을 위한 천지인 키보드 sheet
- 사진/영상 첨부 최대 10개 선택
- 이미지 WebP 변환 후 S3 presigned upload
- 제출 실패 시 업로드된 이미지 정리
- 임시 저장 목록 조회/삭제
- 페이지 이탈 전 저장 여부 확인
- 네트워크 오프라인 상태에서 제출 차단
- 제출 목록 조회와 새로고침
- PWA 서비스워커 등록, 새 버전 업데이트 안내
- Google Analytics 선택 연동

## 화면 구성

| 경로 | 역할 |
| --- | --- |
| `/record/` | 홈 |
| `/record/login` | 로그인 |
| `/record/register` | 회원가입 |
| `/record/profile` | 프로필 |
| `/record/dive-create` | 활동 기록 작성 |
| `/record/dive-drafts` | 임시 저장 목록 |
| `/record/submit-management` | 제출 목록 |

## 기술 스택

- Vite + React 19
- TypeScript
- TanStack Router file-based routing
- TanStack Query
- Tailwind CSS
- React Hook Form
- Zod
- vite-plugin-pwa
- `react-cji-keyboard`
- `@ocean-kit/submission-domain`
- `@ocean-kit/shared-auth`
- `@ocean-kit/shared-s3`

## 프로젝트 구조

```txt
src/
  routes/                 TanStack Router route 파일
  app/                    실제 페이지 컴포넌트
    home/
    login/
    register/
    profile/
    dive-create/
    dive-drafts/
    submit-management/
  components/
    dive-create/          활동 기록 입력 폼
    submission/           제출 목록 UI
    pwa/                  설치/업데이트 관련 UI
    ui/                   공통 UI
  hooks/                  인증, 제출, 임시 저장, 온라인 상태 hook
  api/                    앱 단위 API adapter
  utils/                  폼 payload 변환, draft storage, S3, 이미지 변환
  react-query/            queryClient, query key
```

## 환경 변수

`vite.config.ts`에서 다음 값을 필수로 검사합니다.

```bash
API_BASE_URL=https://api.oceancampus.kr
S3_PUBLIC_BASE=https://api.oceancampus.kr
```

선택 값:

```bash
VITE_RECORD_GA_MEASUREMENT_ID=G-...
```

## 실행 방법

루트에서 의존성을 설치합니다.

```bash
pnpm install
```

개발 서버:

```bash
pnpm dev:record
```

직접 실행:

```bash
pnpm --filter @ocean-kit/oc-record dev
```

기본 주소:

```txt
http://localhost:3002/record/
```

프로덕션 빌드:

```bash
pnpm --filter @ocean-kit/oc-record build
```

프로덕션 빌드 미리보기:

```bash
pnpm --filter @ocean-kit/oc-record preview
```

## 데이터 흐름

1. 사용자가 활동 유형과 공통 환경 정보를 입력합니다.
2. 활동 유형에 따라 이식/조식동물/부착기질/모니터링/해양정화 상세 폼을 표시합니다.
3. 제출 전 `validateSubmission`으로 필수 입력을 검증합니다.
4. 첨부 이미지는 WebP로 변환한 뒤 presigned URL을 통해 업로드합니다.
5. 화면 폼 값은 `formToPayload`에서 서버 요청 payload로 변환합니다.
6. 제출 성공 시 제출 목록 query를 invalidate합니다.
7. 제출 중 실패하면 이미 업로드된 파일을 삭제해 불완전한 첨부를 줄입니다.

임시 저장은 `localStorage`의 `diveDrafts` key를 사용합니다. 현재 임시 저장은 폼 입력값 중심이며, 브라우저 `File` 객체 자체를 복원하지 않습니다. 첨부 파일은 다시 선택해야 합니다.

## 검증

```bash
pnpm --filter @ocean-kit/oc-record lint
pnpm --filter @ocean-kit/oc-record build
```

루트 통합 검증:

```bash
pnpm build
pnpm lint
```

## 배포 메모

- Vite `base`는 `/record/`입니다.
- TanStack Router `basepath`는 `/record`입니다.
- 빌드 결과물은 `apps/OC-RECORD/dist`에 생성됩니다.
- GitHub Actions는 Record 변경이 감지되면 빌드 후 S3의 `record/` prefix에 업로드합니다.
- nginx 설정은 `/record/` 하위 경로에서 SPA fallback을 적용합니다.
- `sw.js`, `manifest.webmanifest`, `index.html`은 최신 배포 반영을 위해 no-cache 계열 헤더가 필요합니다.
- 운영 smoke test는 Record 서비스워커가 현재 빌드 asset을 참조하는지 확인합니다.
