# Ocean Campus – 다이빙 활동 제출 PWA

현장에서 다이버가 바로 **활동 환경 정보 + 모니터링 지표 + 사진/영상**을 기록하고  
관리자에게 제출할 수 있도록 만든 모바일 최적화 PWA입니다.

> 이 리포지토리는 **다이버용 제출 앱(front)** 만을 다룹니다.  
> 관리자용 검토 대시보드는 별도 웹 서비스로 운영됩니다.

---

## 주요 기능

- 다이빙 활동 제출
  - 현장명, 날짜/시간, 수심/수온, 조류, 시야 등 기본 환경 정보 입력
  - 건강 상태(등급 A–D), 성장률(cm), 자연 번식률, 생존률 입력
  - 작업 내용 텍스트 작성(천지인 커스텀 키보드 사용)
  - 사진/영상 최대 10개 첨부 후 업로드

- 임시 저장(드래프트)
  - 작성 중인 활동을 로컬에 임시 저장
  - 나중에 다시 들어와서 이어서 작성 가능
  - 여러 개의 드래프트를 목록에서 관리

- 제출 목록 조회
  - 내가 제출한 활동 리스트 확인
  - 항목 탭 → 상세 정보 페이지로 이동

- PWA (Progressive Web App)
  - iOS/Android에서 **홈 화면에 앱으로 추가** 가능
  - 모바일 세로 화면에 최적화된 UI

---

## 화면 구성

- `/login` – 로그인 페이지
- `/home` – 메인 홈 (활동 생성 / 제출물 관리 / 임시 저장 불러오기 진입)
- `/dive-create` – 다이빙 활동 제출 폼
  - 환경 정보
  - 모니터링(건강 상태 / 성장률 / 자연 번식률 / 생존률)
  - 작업 내용(천지인 키보드)
  - 첨부 파일 업로드
- `/dive-drafts` – 임시 저장 목록
- `/submit-management` (및 모바일 전용 `/submit-management/mobile`) – 제출 목록

---

## 기술 스택

- Framework
  - Next.js (App Router)
  - React

- 상태 & 데이터
  - TanStack Query (React Query) – 서버 상태 관리
  - 브라우저 `localStorage` / `sessionStorage` – 임시 저장

- 네트워크
  - Axios – 공통 `axiosInstance`로 API 통신
  - JWT 기반 인증 (로그인 후 `ACCESS_TOKEN` 로컬 저장)

- UI
  - Tailwind CSS
  - Lucide Icons, React Icons
  - 커스텀 천지인 키보드 컴포넌트

- PWA
  - Service Worker
  - Web App Manifest (아이콘/앱 이름/전체화면 설정)

---

## API 연동 개요

백엔드(Spring Boot)에서 제공하는 REST API와 연동합니다.

- 인증
  - `POST /api/auth/login` – 로그인 (access 토큰 발급)
  - `POST /api/auth/logout` – 로그아웃 (서버 세션/토큰 정리)
  - `GET /api/user/my/info` – 로그인 상태 확인

- 활동 제출
  - `POST /api/admin/submissions` – 다이빙 활동 생성
    - 환경 정보 + 활동 정보 + 모니터링 + 첨부파일 메타데이터 전송
  - `GET /api/admin/submissions` – 제출 목록 조회

- 업로드
  - `POST /api/files/presign` (예시) – S3 presigned URL 발급
  - 프론트에서 presigned URL로 이미지/영상 업로드 후 `fileUrl`만 서버로 전송

> 실제 엔드포인트 경로와 스키마는 백엔드 명세(Swagger)를 기준으로 맞춥니다.

---

## 요청 페이로드 예시

활동 생성 시 서버로 전송하는 JSON 형식 예시입니다.

```json
{
  "siteName": "울진 A 구역",
  "activityType": "TRANSPLANT",
  "submittedAt": "2025-12-02T06:58:12.900Z",
  "authorName": "string",
  "authorEmail": "string",
  "feedbackText": "",
  "latitude": 0,
  "longitude": 0,
  "basicEnv": {
    "recordDate": "2025-12-02",
    "startTime": "14:20:00",
    "endTime": "14:50:00",
    "waterTempC": 18.2,
    "visibilityM": 4.0,
    "depthM": 8.5,
    "currentState": "MEDIUM",
    "weather": "SUNNY"
  },
  "participants": {
    "leaderName": "김다이버",
    "participantCount": 1,
    "role": "CITIZEN_DIVER"
  },
  "activity": {
    "type": "TRANSPLANT",
    "details": "이식 작업 내용 텍스트...",
    "collectionAmount": 0,
    "durationHours": 0,
    "healthGrade": "A",
    "growthCm": 3.5,
    "naturalReproduction": {
      "radiusM": 50,
      "numerator": 12,
      "denominator": 30
    },
    "survival": {
      "dieCount": 3,
      "totalCount": 10
    }
  },
  "attachments": [
    {
      "fileName": "image1.jpg",
      "fileUrl": "uploads/2025/12/xxx.jpg",
      "mimeType": "image/jpeg",
      "fileSize": 123456
    }
  ]
}
