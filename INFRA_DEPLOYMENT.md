# Infrastructure And Deployment

Last checked: 2026-06-18

이 문서는 현재 AWS 리소스, 프론트엔드 모노레포, 백엔드 레포, EC2 내부 상태를 기준으로 정리한 운영/배포 문서다. 시크릿 값은 의도적으로 적지 않는다.

## Summary

현재 운영 구조는 단순하다.

```txt
Browser
  |
  v
CloudFront d24m5p5t9qbt5o.cloudfront.net
  |-- default, /admin*, /record*  -> S3 oceancampus-prod-frontend
  |-- /api/*                     -> EC2 nginx -> Spring Boot API :8080
  |-- /dashboard*                -> EC2 nginx -> Next.js dashboard :3000
  `-- uploads/*                  -> S3 oceancampus-prod-uploads

Spring Boot API -> RDS PostgreSQL
Spring Boot API -> S3 presigned PUT URL 발급
Browser         -> S3 uploads bucket로 presigned PUT 직접 업로드
```

현재 CI/CD workflow는 확인되지 않았다. 운영 배포는 S3 sync, CloudFront invalidation, EC2 파일 교체, systemd restart 기반의 수동 배포로 보는 게 맞다.

## AWS Resources

리전은 `ap-northeast-2` 기준이다.

| 구분 | 리소스 |
| --- | --- |
| CloudFront | `E2M0Y165HYU3RC`, `d24m5p5t9qbt5o.cloudfront.net` |
| Frontend S3 | `oceancampus-prod-frontend` |
| Upload S3 | `oceancampus-prod-uploads` |
| App EC2 | `i-0c76c2d3636be24bb`, `oceancampus-prod-app-01이부분`, `t3.small`, Amazon Linux 2023 |
| RDS | `oceancampus-prod-db`, PostgreSQL 18.3, `db.t4g.micro`, private |
| VPC | `vpc-05399d1266351e6b5` |
| Load Balancer | 없음 |
| Route53 Hosted Zone | 없음 |
| ECR | `oc-admin`, `oc-dashboard`, `oc-record` 저장소는 있음. 단, 현재 운영 EC2에는 Docker가 없어서 운영 배포에는 쓰이지 않는다. |

보안그룹 핵심은 다음과 같다.

| Security Group | 용도 | Inbound |
| --- | --- | --- |
| `sg-0604c1505fd172724` / `launch-wizard-1` | 현재 운영 App EC2 | 80, 443 open. SSH 22는 `112.217.167.202/32`, `1.212.70.3/32`만 허용 |
| `sg-0a17553fec160dee9` / `oceancampus-prod-db-sg` | RDS | 5432를 App EC2 SG에서만 허용 |
| `sg-098ab0ef7364d5538` / `oceankit-prod-sg` | stopped EC2용 | 현재 운영 트래픽 아님 |

주의: EC2 보안그룹에 443은 열려 있지만, EC2 nginx 설정은 현재 80만 listen한다. 외부 HTTPS는 CloudFront가 담당한다.

## Monthly Cost Estimate

Last checked: 2026-06-18

계산 기준:

- AWS Price List API 기준 On-Demand 요금
- 월 730시간 기준
- Linux/UNIX EC2, Reserved Instance/Savings Plans 미적용
- RDS는 Single-AZ PostgreSQL 기준
- 트래픽성 비용은 현재 관측치 기준. 사용량이 늘면 CloudFront/S3 request/data transfer 비용은 별도 증가한다.

### Instance Change

기존 `m7i-flex.large`에서 현재 `t3.small`로 바꾸면서 EC2 컴퓨트 비용은 다음처럼 줄었다.

| Instance | Hourly | Monthly, 730h |
| --- | ---: | ---: |
| `m7i-flex.large` | `$0.11771/hr` | `$85.93/mo` |
| `t3.small` | `$0.02600/hr` | `$18.98/mo` |
| Reduction | `$0.09171/hr` | `$66.95/mo` |

컴퓨트 비용만 보면 약 `77.9%` 감소다.

### Current Monthly Estimate

나머지 인프라를 동일하게 둔다고 보고, 현재 운영 기준으로 합산하면 다음과 같다. 이 표는 오래된 stopped EC2의 EBS 50GB는 제외한 "운영에 필요한 리소스" 기준이다.

| Item | Basis | Monthly |
| --- | --- | ---: |
| EC2 app server | `t3.small`, `$0.026/hr * 730h` | `$18.98` |
| EC2 EBS | active gp3 30GB, `$0.0912/GB-month` | `$2.74` |
| RDS instance | `db.t4g.micro`, `$0.025/hr * 730h` | `$18.25` |
| RDS storage | gp3 20GB, `$0.131/GB-month` | `$2.62` |
| S3 storage | frontend + uploads 약 7.3MB, `$0.025/GB-month` | `~$0.00` |
| CloudFront | 현재 관측치 기준, Free Tier 내 | `$0.00` |
| **Total** |  | **`$42.59/mo`** |

기존 `m7i-flex.large`를 같은 나머지 인프라와 합산하면 약 `$109.53/mo`다. 따라서 운영 기준 총액은 `$109.53/mo -> $42.59/mo`로 줄었고, 월 약 `$66.95` 절감이다.

### Current Account Caveat

AWS 계정에는 stopped 상태의 이전 EC2 `i-0770adf1d3a839e5e`에 붙은 gp3 50GB EBS 볼륨이 아직 남아 있다.

| Leftover resource | Monthly |
| --- | ---: |
| old stopped EC2 EBS gp3 50GB | `$4.56/mo` |

이 볼륨을 유지하면 실제 계정 기준 월 추정치는 `$42.59 + $4.56 = $47.15/mo`에 가깝다. stopped EC2는 컴퓨트 비용은 안 나가지만 EBS는 계속 과금된다. 필요 없으면 삭제하는 게 맞다.

### CloudFront Cost For Moving Admin/Record

`OC-ADMIN`, `OC-RECORD`를 EC2에서 직접 서빙하지 않고 S3 + CloudFront로 옮긴 비용은 현재 사용량에서는 사실상 0에 가깝다.

현재 CloudFront 관측치, 2026-06-14 to 2026-06-18. 이 값은 배포 전체 기준이라 `/api`, `/dashboard`, `uploads`까지 섞여 있다. `OC-ADMIN`, `OC-RECORD` 정적 파일만 놓고 보면 이보다 작거나 같다.

| Metric | Observed | Monthly projection |
| --- | ---: | ---: |
| Requests | 36 | 약 274 requests/mo |
| Bytes downloaded | 205,495 bytes | 약 0.0016 GB/mo |

CloudFront Asia Pacific pay-as-you-go 단가:

| Item | Unit price |
| --- | ---: |
| Data transfer out, first paid tier | `$0.120/GB` |
| HTTPS GET/HEAD requests | `$0.012 per 10,000 requests` |
| HTTP GET/HEAD requests | `$0.009 per 10,000 requests` |
| CloudFront Function executions | first 2,000,000/mo free, then `$0.10 per 1,000,000` |
| Invalidations | first 1,000 paths/mo free, then `$0.005/path` |

현재 관측치를 유료 단가로 그대로 계산해도 월 약 `$0.0005` 수준이다. 그리고 AWS CloudFront Free Tier는 CloudFront data transfer out 1TB/mo, HTTP/HTTPS requests 10M/mo, CloudFront Function invocations 2M/mo를 포함하므로 현재 규모에서는 CloudFront 추가 비용을 `$0.00/mo`로 보는 게 현실적이다.

트래픽이 늘 때의 빠른 계산식. CloudFront Free Tier를 적용하면 1TB/mo와 HTTP/HTTPS 10M requests/mo를 먼저 빼고 계산해야 한다.

```txt
paid_data_gb = max(total_data_transfer_gb - 1024, 0)
paid_https_requests = max(total_https_requests - 10,000,000, 0)

CloudFront estimate =
  paid_data_gb * 0.120
  + paid_https_requests * 0.0000012
  + max(function_executions - 2,000,000, 0) * 0.0000001
  + max(invalidation_paths - 1,000, 0) * 0.005
```

예를 들어 Free Tier를 무시하고 10GB/mo, HTTPS 100,000 requests/mo로 계산해도 `10 * 0.120 + 100000 * 0.0000012 = $1.32/mo`다. Free Tier 적용 범위 안이면 이 예시도 실제 CloudFront 과금은 `$0.00`에 가깝다.

### Static Frontend Split Benefit

현재 S3에 올라간 정적 산출물 크기:

| App | Objects | Total size |
| --- | ---: | ---: |
| `OC-ADMIN` | 3 | 535,585 bytes, 약 0.51 MiB |
| `OC-RECORD` | 30 | 1,210,060 bytes, 약 1.15 MiB |
| **Total** | 33 | 1,745,645 bytes, 약 1.66 MiB |

현재 `t3.small` EC2 상태:

| Metric | Current |
| --- | ---: |
| Memory total | 약 1.9 GiB |
| Memory available | 약 1.07 GiB |
| Spring Boot RSS | 약 482 MiB |
| Next.js dashboard RSS | 약 98 MiB |
| nginx worker RSS | 약 5 MiB |
| Root disk usage | 30GB 중 약 2.7GB 사용, 약 28GB 여유 |
| Recent CPUUtilization | 평균 약 0.4%, 최대 약 1.84% |

따라서 순수 EC2 리소스 관점에서는 `OC-ADMIN`, `OC-RECORD`를 같은 EC2 nginx에 같이 올려도 부담은 거의 없다.

- 디스크 추가 사용량은 약 1.66 MiB라 무시 가능하다.
- nginx는 이미 떠 있으므로 정적 파일 location을 추가해도 상시 메모리 증가는 사실상 없다.
- 현재 트래픽에서는 CPU/네트워크 오프로딩 이점도 거의 없다.
- `t3.small`로 낮출 수 있었던 주된 이유는 `m7i-flex.large`가 과한 스펙이었기 때문이지, 정적 파일 2개 앱을 S3/CloudFront로 뺐기 때문이라고 보기는 어렵다.

그래도 S3/CloudFront 분리에는 운영상 이점이 있다.

- EC2가 죽어도 `/admin`, `/record` 정적 shell은 CloudFront/S3에서 계속 내려갈 수 있다. 단, API가 죽으면 실제 기능은 실패한다.
- 정적 파일 배포와 EC2 jar/Next 배포가 분리된다.
- CloudFront 캐시와 SPA rewrite를 EC2 nginx 설정과 독립적으로 관리할 수 있다.
- 트래픽이 커지면 EC2 네트워크/nginx access 부하를 줄이고, CloudFront Free Tier 1TB/mo를 먼저 활용할 수 있다.
- 보안상 S3 origin은 public bucket이 아니고 CloudFront OAC를 통해 서빙된다.

결론: 현재 사용량과 산출물 크기 기준으로는 비용/성능 이점은 미미하다. 분리의 가치는 비용 절감보다는 배포 독립성, 정적 파일 안정성, 캐시 구조, 향후 트래픽 증가 대비에 있다.

Pricing references:

- EC2 On-Demand: https://aws.amazon.com/ec2/pricing/on-demand/
- RDS for PostgreSQL: https://aws.amazon.com/rds/postgresql/pricing/
- S3 pricing: https://aws.amazon.com/s3/pricing/
- CloudFront pricing: https://aws.amazon.com/cloudfront/pricing/
- CloudFront Free Tier expansion: https://aws.amazon.com/blogs/aws/aws-free-tier-data-transfer-expansion-100-gb-from-regions-and-1-tb-from-amazon-cloudfront-per-month/

## CloudFront Routing

CloudFront는 기본 인증서만 사용한다. 커스텀 도메인/Alias는 없다.

| Path | Origin | Cache | 비고 |
| --- | --- | --- | --- |
| default | `oceancampus-prod-frontend.s3.ap-northeast-2.amazonaws.com` | `Managed-CachingOptimized` | `/admin`, `/record` SPA |
| `/api/*` | EC2 public DNS, HTTP 80 | `Managed-CachingDisabled` | 모든 method 허용, viewer request 대부분 전달 |
| `/dashboard*` | EC2 public DNS, HTTP 80 | `Managed-CachingDisabled` | Next.js dashboard |
| `uploads/*` | `oceancampus-prod-uploads.s3.ap-northeast-2.amazonaws.com` | `Managed-CachingOptimized` | 업로드 이미지 조회 |

default behavior에는 CloudFront Function `oceancampus-spa-router`가 viewer-request로 붙어 있다. 역할은 `/admin`, `/admin/*`, `/record`, `/record/*` 중 파일 확장자가 없는 요청을 각각 `/admin/index.html`, `/record/index.html`로 rewrite하는 것이다. 그래서 Vite SPA 딥링크 새로고침이 동작한다.

최근 CloudFront invalidation 이력이 있고, 2026-06-14 05:25 UTC 배포 시점에 S3 object 갱신과 invalidation이 같이 확인됐다.

## Frontend Repository

프론트 레포는 `/Users/aryu/Documents/OC-PROJECT`다.

운영 대상 앱은 다음 세 개다.

| App | Framework | Runtime | Production path |
| --- | --- | --- | --- |
| `apps/OC-ADMIN` | Vite SPA | S3 정적 파일 | `/admin/` |
| `apps/OC-RECORD` | Vite SPA/PWA | S3 정적 파일 | `/record/` |
| `apps/OC-DASHBOARD` | Next.js 15 standalone | EC2 systemd | `/dashboard` |

필수 빌드 환경변수:

| 변수 | 용도 | 현재 운영값 |
| --- | --- | --- |
| `API_BASE_URL` | API 호출 base URL | `https://d24m5p5t9qbt5o.cloudfront.net` |
| `S3_PUBLIC_BASE` | S3 object key를 공개 URL로 변환 | `https://d24m5p5t9qbt5o.cloudfront.net` |
| `MAPBOX_TOKEN` | dashboard 지도 | 값은 시크릿으로 관리 |

### Admin/Record 배포

`OC-ADMIN`과 `OC-RECORD`는 빌드 결과물을 S3 prefix에 올린다.

```bash
pnpm install --frozen-lockfile

API_BASE_URL=https://d24m5p5t9qbt5o.cloudfront.net \
S3_PUBLIC_BASE=https://d24m5p5t9qbt5o.cloudfront.net \
pnpm --filter @ocean-kit/oc-admin build

aws s3 sync apps/OC-ADMIN/dist/ s3://oceancampus-prod-frontend/admin/ --delete

API_BASE_URL=https://d24m5p5t9qbt5o.cloudfront.net \
S3_PUBLIC_BASE=https://d24m5p5t9qbt5o.cloudfront.net \
pnpm --filter @ocean-kit/oc-record build

aws s3 sync apps/OC-RECORD/dist/ s3://oceancampus-prod-frontend/record/ --delete

aws cloudfront create-invalidation \
  --distribution-id E2M0Y165HYU3RC \
  --paths "/admin/*" "/record/*"
```

현재 S3에는 `admin/`과 `record/` prefix만 있다. `admin/index.html`, `record/index.html`은 `no-cache,no-store,must-revalidate` 메타데이터로 서빙되고 있다.

### Dashboard 배포

`OC-DASHBOARD`는 S3가 아니라 EC2의 `/opt/oceancampus/dashboard`에서 systemd 서비스로 실행된다.

EC2 현재 상태:

| 항목 | 값 |
| --- | --- |
| Service | `oceancampus-dashboard.service` |
| WorkingDirectory | `/opt/oceancampus/dashboard/apps/OC-DASHBOARD` |
| EnvironmentFile | `/opt/oceancampus/dashboard/.env` |
| ExecStart | `/usr/bin/node server.js` |
| Listen | `127.0.0.1:3000` |
| Nginx route | `/dashboard` -> `http://127.0.0.1:3000/dashboard` |

재배포 절차는 Next standalone 산출물을 EC2에 교체한 뒤 서비스를 재시작하는 방식이다.

```bash
API_BASE_URL=https://d24m5p5t9qbt5o.cloudfront.net \
S3_PUBLIC_BASE=https://d24m5p5t9qbt5o.cloudfront.net \
MAPBOX_TOKEN=<secret> \
pnpm --filter @ocean-kit/oc-dashboard build

# EC2에 업로드할 산출물:
# - apps/OC-DASHBOARD/.next/standalone/*
# - apps/OC-DASHBOARD/.next/static -> /opt/oceancampus/dashboard/apps/OC-DASHBOARD/.next/static
# - apps/OC-DASHBOARD/public       -> /opt/oceancampus/dashboard/apps/OC-DASHBOARD/public
```

EC2에서 교체 후:

```bash
sudo systemctl restart oceancampus-dashboard.service
sudo systemctl status oceancampus-dashboard.service --no-pager
curl -I http://127.0.0.1:3000/dashboard
curl -I https://d24m5p5t9qbt5o.cloudfront.net/dashboard
```

주의: `/opt/oceancampus/dashboard/.env`는 운영 시크릿이므로 배포 중 삭제하면 안 된다.

## Backend Repository

사용자가 말한 `/Users/aryu/Documents/오씨-프로젝트-백엔드` 경로는 현재 존재하지 않았다. 실제 확인된 백엔드 경로는 `/Users/aryu/Documents/OC-PROJCECT-BACKEND/back-end`다.

백엔드는 Spring Boot 프로젝트다.

| 항목 | 값 |
| --- | --- |
| Java | 21 |
| Spring Boot | 3.5.6 |
| Build | Gradle `bootJar` |
| DB driver | PostgreSQL |
| AWS | AWS SDK S3, presigned PUT URL 발급 |
| Dockerfile | 있음 |
| 현재 운영 | Docker 아님. EC2에서 jar 직접 실행 |

프로덕션 설정은 `src/main/resources/application-prod.properties` 기준이며, 값은 환경변수로 주입한다.

주요 운영 환경변수 키:

```txt
SPRING_PROFILES_ACTIVE
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
SPRING_JPA_HIBERNATE_DDL_AUTO
JWT_SECRET
JWT_EXPIRATION_ACCESS
AWS_REGION
AWS_S3_BUCKET_NAME
AWS_S3_PROJECT_FOLDER_NAME
AWS_S3_USER_OBJECTS_DIRECTORY
AWS_S3_EXPIRATION_TIME
```

현재 EC2의 API 환경파일에는 OAuth2, OpenAI, Gemini, Groq 관련 키도 있다. 문서에는 값을 남기지 않는다.

## Backend Runtime On EC2

EC2 내부 현재 상태:

| 항목 | 값 |
| --- | --- |
| API artifact | `/opt/oceancampus/api/app.jar` |
| Backup artifact | `/opt/oceancampus/api/app.jar.bak.20260612102322` |
| EnvironmentFile | `/opt/oceancampus/api/.env` |
| Service | `oceancampus-api.service` |
| User | `ec2-user` |
| WorkingDirectory | `/opt/oceancampus/api` |
| ExecStart | `/usr/bin/java $JAVA_OPTS -jar /opt/oceancampus/api/app.jar` |
| JAVA_OPTS | `-Xms256m -Xmx768m` |
| Listen | `*:8080` |
| Nginx route | `/api/`, `/actuator/`, `/v3/api-docs`, `/swagger-ui/` -> `127.0.0.1:8080` |

systemd 설정:

```ini
[Service]
User=ec2-user
WorkingDirectory=/opt/oceancampus/api
EnvironmentFile=/opt/oceancampus/api/.env
Environment=JAVA_OPTS=-Xms256m -Xmx768m
ExecStart=/usr/bin/java $JAVA_OPTS -jar /opt/oceancampus/api/app.jar
Restart=always
RestartSec=10
```

백엔드 재배포 절차:

```bash
cd /Users/aryu/Documents/OC-PROJCECT-BACKEND/back-end
./gradlew clean bootJar -x test

# build/libs/*.jar 를 EC2 /opt/oceancampus/api/app.jar 로 교체한다.
# 기존 app.jar 는 타임스탬프를 붙여 백업해두는 방식이 현재 상태와 맞다.
```

EC2에서:

```bash
sudo systemctl restart oceancampus-api.service
sudo systemctl status oceancampus-api.service --no-pager
journalctl -u oceancampus-api.service -n 100 --no-pager
curl -I http://127.0.0.1:8080/actuator/health
```

주의: CloudFront behavior는 `/api/*`, `/dashboard*`, `uploads/*`만 EC2 또는 uploads S3로 보낸다. `/actuator/health`, `/swagger-ui/`는 EC2 nginx에는 설정돼 있지만 CloudFront에는 별도 behavior가 없어서 CloudFront 도메인으로 바로 접근하는 운영 health check 용도로는 부적절하다.

## Upload Flow

이미지 업로드 흐름은 다음과 같다.

1. 프론트가 `GET /api/image/presigned-put-url?extension=...` 호출
2. Spring Boot가 `oceancampus-prod-uploads`에 대한 presigned PUT URL과 object key를 반환
3. 브라우저가 presigned URL로 S3에 직접 PUT
4. API에는 object key가 저장됨
5. 프론트는 `S3_PUBLIC_BASE + "/" + key`로 공개 URL 생성
6. CloudFront `uploads/*` behavior가 uploads S3 origin에서 이미지를 서빙

현재 uploads bucket의 실제 prefix는 `uploads/user_objects/YYYY-MM-DD/...`다. 이 값은 백엔드 `AWS_S3_PROJECT_FOLDER_NAME=uploads`, `AWS_S3_USER_OBJECTS_DIRECTORY=user_objects` 조합으로 만들어진다.

uploads bucket CORS 허용 origin:

```txt
https://d24m5p5t9qbt5o.cloudfront.net
http://43.202.139.140
http://localhost:3000
http://localhost:3001
http://localhost:3002
http://localhost:3003
http://localhost:5173
http://localhost:5174
```

허용 method는 `PUT`, `GET`, `HEAD`다.

## Operational Notes

- 현재 운영 EC2에는 Docker가 없다. 프론트 레포와 백엔드 레포에 Dockerfile이 있어도, 실제 운영 방식은 Docker/ECR 기반이 아니다.
- ECR 저장소는 과거/실험 흔적으로 보인다. 현 구조에서 이미지를 push해도 EC2가 자동 반영하지 않는다.
- API/RDS는 단일 EC2, 단일 RDS 구성이다. 오토스케일링, ALB, Multi-AZ RDS는 없다.
- RDS는 public access가 꺼져 있고, App EC2 보안그룹에서만 5432 접근 가능하다.
- EC2 nginx는 80만 listen한다. CloudFront origin protocol도 `http-only`다.
- CloudFront 기본 도메인을 그대로 쓰고 있다. 커스텀 도메인이 필요하면 Route53 hosted zone, ACM 인증서, CloudFront alias 설정이 추가로 필요하다.
- SSH 22는 제한돼 있지만, SSM Agent가 Online이라 운영 조회/명령 실행은 SSM을 우선 쓰는 편이 낫다.
