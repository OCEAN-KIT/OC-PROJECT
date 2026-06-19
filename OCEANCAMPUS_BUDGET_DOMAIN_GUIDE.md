# 오션캠퍼스 운영 예산 및 도메인 연결 안내

작성일: 2026-06-19

이 문서는 오션캠퍼스 측 공유용으로 작성한 운영 예산 및 도메인 작업 안내서입니다. 개발자가 아닌 담당자도 이해할 수 있도록, 현재 붙어 있는 인프라와 월 예상 비용, 도메인 연결 시 오션캠퍼스 측에서 해야 할 일을 중심으로 정리했습니다.

## 1. 현재 인프라 구성

현재 서비스는 AWS 서울 리전 위에 올라가 있습니다.

| 구분 | 역할 | 현재 구성 |
| --- | --- | --- |
| EC2 서버 | 백엔드 API와 대시보드 실행 | `t3.small` 1대 |
| RDS 데이터베이스 | 서비스 데이터 저장 | PostgreSQL `db.t4g.micro`, 20GB |
| EBS 디스크 | EC2 서버 저장공간 | gp3 30GB |
| S3 업로드 저장소 | 사용자가 올린 이미지 저장 | `oceancampus-prod-uploads` |
| S3 프론트 저장소 | Admin/Record 정적 파일 저장 | `oceancampus-prod-frontend` |
| CloudFront | HTTPS, 정적 파일/업로드 이미지/API 라우팅 | 1개 배포 |

요청 흐름은 다음과 같습니다.

```txt
사용자
  -> CloudFront
    -> /admin, /record: S3 정적 파일
    -> /dashboard: EC2 대시보드
    -> /api: EC2 백엔드 API
    -> /uploads: S3 업로드 이미지
```

## 2. 한 달 예상 예산

계산 기준:

- AWS 공식 가격표 기준 On-Demand 요금
- 월 730시간 사용 기준
- 예약 인스턴스, Savings Plans, 세금, 환율 변동은 제외
- 현재 사용량 기준으로 트래픽 비용은 거의 0원에 가까운 수준

### 2.1 서버 비용 변경 효과

기존에는 `m7i-flex.large`급 서버를 사용했지만, 현재는 `t3.small`로 낮췄습니다.

| 서버 타입 | 시간당 비용 | 월 예상 비용 |
| --- | ---: | ---: |
| 기존 `m7i-flex.large` | `$0.11771/hr` | `$85.93/mo` |
| 현재 `t3.small` | `$0.02600/hr` | `$18.98/mo` |
| 절감액 | `$0.09171/hr` | `$66.95/mo` |

서버 컴퓨트 비용만 보면 월 약 `$66.95` 절감됩니다.

## 3. 현재 월 운영비 예상

현재 운영에 필요한 리소스만 기준으로 계산하면 월 예상 비용은 약 **`$42.59`**입니다.

| 항목 | 계산 기준 | 월 예상 |
| --- | --- | ---: |
| EC2 서버 | `t3.small`, `$0.026/hr * 730h` | `$18.98` |
| EC2 디스크 | gp3 30GB, `$0.0912/GB-month` | `$2.74` |
| RDS DB 인스턴스 | `db.t4g.micro`, `$0.025/hr * 730h` | `$18.25` |
| RDS DB 저장공간 | gp3 20GB, `$0.131/GB-month` | `$2.62` |
| S3 저장공간 | 현재 약 7.3MB | `~$0.00` |
| CloudFront | 현재 트래픽 기준 Free Tier 내 | `$0.00` |
| **합계** |  | **`$42.59/mo`** |

기존 서버 타입을 계속 썼다면 같은 나머지 인프라 기준 월 약 **`$109.53`** 수준입니다.

즉 현재 구조는 대략 다음과 같이 줄었습니다.

```txt
기존 예상: $109.53/mo
현재 예상: $42.59/mo
월 절감액: 약 $66.95
```

주의할 점:

현재 AWS 계정에는 이전 서버에 붙어 있던 50GB 디스크가 아직 남아 있습니다. 이 디스크를 유지하면 월 약 `$4.56`가 추가되어 실제 계정 비용은 약 **`$47.15/mo`**에 가까워집니다.

필요 없는 이전 디스크라면 삭제하는 것이 맞습니다. 서버는 멈춰도 디스크는 계속 과금됩니다.

## 4. 트래픽이 늘면 비용이 많이 늘어나는지

현재 규모에서는 트래픽이 조금 늘어도 월 비용 차이는 크지 않습니다.

CloudFront는 Free Tier가 커서, 일반적인 초기 운영 수준에서는 비용이 거의 발생하지 않습니다.

CloudFront Free Tier 기준:

- 월 1TB 데이터 전송
- 월 1,000만 HTTP/HTTPS 요청
- 월 200만 CloudFront Function 실행

현재 관측 사용량은 이보다 훨씬 작습니다.

| 시나리오 | 월 데이터 전송 | 월 요청 수 | CloudFront 예상 비용 |
| --- | ---: | ---: | ---: |
| 현재 수준 | 약 0.0016GB | 약 274회 | `$0.00` |
| 초기 사용 증가 | 10GB | 10만 회 | `$0.00` |
| 사용량 증가 | 100GB | 100만 회 | `$0.00` |
| 꽤 큰 사용량 | 500GB | 500만 회 | `$0.00` |
| Free Tier 한계 근처 | 1TB | 1,000만 회 | `$0.00` |

위 범위를 넘으면 추가 비용이 발생합니다.

Free Tier를 넘은 뒤의 대략적인 단가는 다음과 같습니다.

| 항목 | 단가 |
| --- | ---: |
| CloudFront 데이터 전송 | 약 `$0.120/GB` |
| HTTPS 요청 | 약 `$0.012 / 10,000 requests` |

예를 들어 Free Tier를 넘은 상태에서 추가로 10GB, 10만 요청이 더 발생하면 약 `$1.32` 정도입니다.

결론적으로 현재 예상 트래픽에서는 월 비용이 크게 흔들릴 가능성은 낮습니다. 비용을 크게 바꾸는 요소는 트래픽보다 EC2/RDS 같은 고정 인프라 크기입니다.

## 5. 프론트 정적 파일을 CloudFront/S3로 분리한 효과

Admin과 Record 앱의 정적 파일 크기는 매우 작습니다.

| 앱 | 파일 수 | 총 크기 |
| --- | ---: | ---: |
| Admin | 3개 | 약 0.51MiB |
| Record | 30개 | 약 1.15MiB |
| 합계 | 33개 | 약 1.66MiB |

따라서 현재 규모에서는 CloudFront/S3 분리로 인한 서버 비용 절감 효과는 크지 않습니다. 같은 EC2에서 nginx로 정적 파일을 같이 서빙해도 리소스 부담은 거의 없습니다.

다만 분리의 장점은 있습니다.

- Admin/Record 배포와 백엔드 배포를 따로 할 수 있습니다.
- EC2 서버가 잠시 문제를 겪어도 정적 화면 파일은 CloudFront/S3에서 내려갈 수 있습니다.
- 트래픽이 커지면 CloudFront 캐시와 Free Tier를 활용할 수 있습니다.

정리하면, 현재 단계에서 CloudFront/S3 분리는 비용 절감보다는 운영 안정성, 배포 분리, 향후 트래픽 증가 대비에 가깝습니다.

## 6. 도메인 연결 작업에서 먼저 확인할 것

요청받은 도메인은 `oceancampus.co.kr`이었지만, 2026-06-19 기준 공개 WHOIS/DNS 조회 결과 `oceancampus.co.kr`은 등록되어 있지 않은 것으로 확인됩니다.

반면 공개적으로 확인되는 오션캠퍼스 홈페이지는 다음 도메인입니다.

```txt
https://www.oceancampus.kr/
```

현재 `oceancampus.kr`은 다음 상태입니다.

| 항목 | 현재 상태 |
| --- | --- |
| 사용 중인 도메인 | `oceancampus.kr` |
| 홈페이지 | `www.oceancampus.kr` |
| 네임서버 | `ns1.whoisdomain.kr` ~ `ns4.whoisdomain.kr` |
| 현재 홈페이지 연결 | Framer 쪽으로 연결된 것으로 보임 |

따라서 오션캠퍼스 측에서 먼저 확인해야 할 것은 다음입니다.

1. 실제로 연결할 도메인이 `oceancampus.co.kr`인지 `oceancampus.kr`인지 확인
2. `oceancampus.co.kr`을 쓰고 싶다면 먼저 도메인 등록 필요
3. 이미 쓰고 있는 홈페이지를 유지해야 한다면 루트 도메인 `oceancampus.kr`, `www.oceancampus.kr`은 건드리지 않는 것이 안전
4. 우리 서비스는 별도 서브도메인으로 연결하는 것을 권장

## 7. 권장 도메인 방식

가장 안전한 방식은 기존 홈페이지를 그대로 두고, 우리 서비스만 별도 서브도메인으로 연결하는 것입니다.

권장안:

```txt
kit.oceancampus.kr
```

이 주소 하나에서 아래 경로를 사용합니다.

```txt
kit.oceancampus.kr/admin
kit.oceancampus.kr/record
kit.oceancampus.kr/dashboard
kit.oceancampus.kr/api
kit.oceancampus.kr/uploads
```

이 방식의 장점:

- 기존 홈페이지 `www.oceancampus.kr`를 건드리지 않습니다.
- DNS 레코드 추가가 적습니다.
- 현재 CloudFront 라우팅 구조를 크게 바꾸지 않아도 됩니다.
- 인증서와 HTTPS 처리를 CloudFront에서 관리할 수 있습니다.

대안으로 `admin.oceancampus.kr`, `record.oceancampus.kr`, `dashboard.oceancampus.kr`처럼 나누는 방법도 있지만, DNS와 인증서, CORS, 쿠키 설정이 더 복잡해집니다. 현재 규모에서는 권장하지 않습니다.

## 8. 오션캠퍼스 측 작업 매뉴얼

오션캠퍼스 측 담당자가 해야 할 일은 도메인 소유자 계정에서 DNS 레코드를 추가하는 것입니다. 서버 작업이나 코드 수정은 오션캠퍼스 측에서 하지 않아도 됩니다.

### Step 1. 도메인 관리자 계정 확인

오션캠퍼스 측에서 아래 정보를 확인합니다.

- 도메인을 어디에서 구매했는지
- 도메인 관리 페이지에 로그인 가능한 계정이 있는지
- DNS 관리 메뉴에 접근할 수 있는지

현재 `oceancampus.kr`의 네임서버는 Whoisdomain 계열입니다.

```txt
ns1.whoisdomain.kr
ns2.whoisdomain.kr
ns3.whoisdomain.kr
ns4.whoisdomain.kr
```

따라서 Whoisdomain 또는 도메인을 구매한 업체의 DNS 관리 화면에서 작업할 가능성이 높습니다.

### Step 2. 기존 홈페이지 레코드는 수정하지 않기

아래 레코드는 기존 홈페이지와 관련될 수 있으므로 임의로 삭제하거나 바꾸면 안 됩니다.

```txt
oceancampus.kr
www.oceancampus.kr
```

특히 현재 홈페이지가 Framer로 연결되어 있으므로, 루트 도메인과 `www` 레코드를 바꾸면 기존 홈페이지가 내려갈 수 있습니다.

오션캠퍼스 측에서는 기존 홈페이지는 그대로 두고, 새 서브도메인만 추가하면 됩니다.

### Step 3. 개발팀에서 전달하는 인증서 검증용 CNAME 추가

HTTPS를 쓰려면 AWS에서 도메인 인증서를 발급해야 합니다. 이때 AWS가 도메인 소유 확인용 CNAME 레코드를 발급합니다.

예시는 다음과 같습니다. 실제 값은 개발팀이 따로 전달합니다.

```txt
Type: CNAME
Name: _xxxxxxxx.kit.oceancampus.kr
Value: _yyyyyyyy.acm-validations.aws
TTL: 300 또는 기본값
```

오션캠퍼스 측은 이 CNAME을 DNS 관리 화면에 추가해주면 됩니다.

주의:

- 위 값은 예시입니다. 실제 값은 AWS 인증서 발급 시 생성됩니다.
- 앞의 `_`가 빠지면 인증이 실패합니다.
- `Name`과 `Value`를 반대로 넣으면 인증이 실패합니다.
- 등록 후 반영까지 보통 수 분에서 길게는 몇 시간 걸릴 수 있습니다.

### Step 4. 서비스용 CNAME 추가

인증서 발급과 CloudFront 설정이 끝나면 서비스 접속용 CNAME을 추가합니다.

권장 레코드:

```txt
Type: CNAME
Name: kit
Value: d24m5p5t9qbt5o.cloudfront.net
TTL: 300 또는 기본값
```

DNS 관리 화면에 따라 `Name`에는 `kit`만 입력해야 할 수도 있고, `kit.oceancampus.kr` 전체를 입력해야 할 수도 있습니다. 업체 화면 안내에 맞춰 입력하면 됩니다.

### Step 5. 접속 확인

반영 후 아래 주소가 열리는지 확인합니다.

```txt
https://kit.oceancampus.kr/admin
https://kit.oceancampus.kr/record
https://kit.oceancampus.kr/dashboard
```

관리자가 확인할 내용:

- 브라우저에서 보안 경고 없이 HTTPS로 열리는지
- 로그인 화면 또는 서비스 화면이 보이는지
- 새로고침해도 404가 나지 않는지
- 기존 홈페이지 `https://www.oceancampus.kr/`가 그대로 열리는지

## 9. 오션캠퍼스 측에서 하지 않아도 되는 일

오션캠퍼스 측은 아래 작업을 직접 하지 않아도 됩니다.

- 서버 접속
- AWS 설정 변경
- 코드 수정
- 배포 실행
- 인증서 직접 발급
- CloudFront 설정 변경

오션캠퍼스 측에서 필요한 것은 DNS 관리 화면에서 개발팀이 전달한 레코드를 추가하는 것입니다.

## 10. 절대 하면 안 되는 작업

아래 작업은 기존 홈페이지 장애로 이어질 수 있으므로 사전 합의 없이 하면 안 됩니다.

- `oceancampus.kr` 루트 A 레코드 변경
- `www.oceancampus.kr` CNAME/A 레코드 변경
- 네임서버 전체 변경
- 기존 Framer 관련 DNS 레코드 삭제
- 개발팀이 전달하지 않은 CloudFront 주소로 연결

## 11. 도메인 관련 최종 체크리스트

오션캠퍼스 측 체크리스트:

```txt
[ ] 실제 사용할 도메인이 oceancampus.kr인지 oceancampus.co.kr인지 확인
[ ] 도메인/DNS 관리자 계정 로그인 가능 여부 확인
[ ] 기존 홈페이지 www.oceancampus.kr는 유지하기로 확인
[ ] 개발팀이 전달한 ACM 인증용 CNAME 추가
[ ] 개발팀이 전달한 서비스용 CNAME 추가
[ ] https://kit.oceancampus.kr 접속 확인
[ ] 기존 홈페이지가 그대로 열리는지 확인
```

개발팀 체크리스트:

```txt
[ ] AWS ACM 인증서 요청, us-east-1
[ ] 오션캠퍼스 측에 인증용 CNAME 전달
[ ] 인증 완료 확인
[ ] CloudFront Alternate domain name에 kit.oceancampus.kr 추가
[ ] CloudFront에 ACM 인증서 연결
[ ] 프론트 API_BASE_URL, S3_PUBLIC_BASE 도메인 전환 여부 결정
[ ] CORS AllowedOrigins에 새 도메인 추가
[ ] CloudFront invalidation
[ ] admin/record/dashboard/api/uploads smoke test
```

## 12. 참고 링크

- 현재 확인되는 오션캠퍼스 홈페이지: https://www.oceancampus.kr/
- AWS EC2 요금: https://aws.amazon.com/ec2/pricing/on-demand/
- AWS RDS PostgreSQL 요금: https://aws.amazon.com/rds/postgresql/pricing/
- AWS S3 요금: https://aws.amazon.com/s3/pricing/
- AWS CloudFront 요금: https://aws.amazon.com/cloudfront/pricing/
- CloudFront Free Tier 안내: https://aws.amazon.com/blogs/aws/aws-free-tier-data-transfer-expansion-100-gb-from-regions-and-1-tb-from-amazon-cloudfront-per-month/
