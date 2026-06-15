# 러너블(Runable) 네트워크 / API 분석 보고서

분석 대상: https://runable.me/
분석 일자: 2026-06-16
분석 방법: 브라우저 네트워크 요청 캡처 + 페이지 컨텍스트 내 fetch 직접 호출 테스트

---

## 1. 아키텍처 개요

- **프론트엔드**: Next.js (App Router). 정적 리소스는 `/_next/static/...` 경로.
- **API 게이트웨이**: `https://runable.me/next-api/index/v1/...` — Next.js Route Handler가 백엔드를 **same-origin으로 프록시**하는 구조.
- **스토리지/이미지**: `storage.runable.me` (대회 썸네일·배너 등).
- **분석/태그**: Google Analytics(GA4: G-2Q998K12M7), Google Tag Manager(GTM-NHRDDKFB).
- **렌더링 방식**:
  - 목록형 페이지(커뮤니티, 대회일정)는 **클라이언트 XHR**로 API 호출.
  - 상세 페이지(`/comp/{id}`, `/product/{id}`)는 **SSR(서버 렌더링)** 으로 데이터를 받아와 클라이언트 XHR이 거의 없음.

---

## 2. 인증 없이 호출 가능한 공개 API (비로그인 200 OK + JSON)

모든 엔드포인트가 `auth=false` 쿼리로 호출되며, 토큰/쿠키 없이도 정상 데이터를 반환함.

| 기능 | 엔드포인트 | 메서드 | 비고 |
|---|---|---|---|
| 커뮤니티 카테고리 | `/next-api/index/v1/article/category?auth=false` | GET | 카테고리 id/제목/노출기간 |
| 커뮤니티 게시글 목록 | `/next-api/index/v1/article/post?category=&page=0&size=20&orderBy=createDateTime&direction=DESC` | GET | totalElements 28,104건. 제목/본문/작성자 닉네임·userId·authorId 포함 |
| 커뮤니티 공지 | `/next-api/index/v1/article/post/notices?category=&auth=false` | GET | 고정 공지 |
| 대회 일정 | `/next-api/index/v1/comp/schedule?auth=false&page=0&size=20&orderBy=startDateTime&direction=ASC&searchPeriod.searchWord=&searchPeriod.fromDate=2026-06-01&searchPeriod.toDate=2026-06-30` | GET | 대회 목록(53건)·종목·지역·상세 |
| 대회 일정(종목필터) | `...&eventNameList=full&...` (위 schedule에 파라미터 추가) | GET | full/half/10k 등 종목 필터 |
| 디스플레이/배너 | `/next-api/index/v1/display/content?displayType=BAND_BANNER&displayTarget=COMP` | GET | 배너 노출 콘텐츠 |

### 주요 쿼리 파라미터
- 공통: `auth=false`, `page`, `size`, `orderBy`, `direction` (페이징/정렬)
- 게시글: `category` (카테고리 UUID), `orderBy=createDateTime`
- 대회 일정: `searchPeriod.searchWord`(검색어), `searchPeriod.fromDate` / `searchPeriod.toDate`(기간), `eventNameList`(종목: full/half/10k/5k)
- 디스플레이: `displayType`(예: BAND_BANNER), `displayTarget`(예: COMP)

### 응답 형식 (공통 패턴)
```json
{
  "status": "OK",
  "data": {
    "totalElements": 28104,
    "page": 0,
    "size": 1,
    "totalPages": 28104,
    "articles": [ /* ... */ ]
  },
  "resUuid": "..."
}
```
대회 일정은 `data.compList[]`, 카테고리는 `data.categories[]` 형태.

---

## 3. CORS 분석

### 응답 헤더 (실측)
```
content-type: application/json
date: Mon, 15 Jun 2026 ...
vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch
```
- **`Access-Control-Allow-Origin` 등 어떤 CORS 허용 헤더도 없음.**
- `vary: RSC, Next-Router-...` → `/next-api/`가 Next.js Route Handler(서버 프록시)임을 시사.

### 해석
| 호출 주체 | 동작 | 이유 |
|---|---|---|
| 러너블 사이트 내부 JS (same-origin) | ✅ 정상 호출 | 동일 출처라 CORS 미적용 |
| 다른 웹페이지의 브라우저 JS (cross-origin) | ❌ 차단 | CORS 허용 헤더 부재 → 응답 읽기 차단 |
| curl / Postman / 서버사이드(Node·Python 등) | ✅ 정상 호출 | CORS는 브라우저 정책일 뿐, 서버 호출엔 무관 |

> 즉, "그냥 호출하면 되나?" → **서버사이드/CLI에서는 토큰 없이 그대로 수집 가능**. 브라우저 cross-origin은 CORS로 막힘.
> 외부 브라우저에서 써야 한다면 서버 프록시를 두거나 백엔드에서 호출하면 됨.

---

## 4. 데이터 수집 가능성 요약

- **수집 용이(인증 불필요)**: 커뮤니티 글 전체(2.8만 건+), 대회 일정/종목/지역, 배너/디스플레이 콘텐츠.
- **SSR로 제공**: 대회 상세, 상품 상세 → HTML 파싱 또는 SSR용 내부 API 필요.
- **인증 필요(접근 불가)**: 기록모아, 레이스 로그, 결제·신청, 운세 결과 등 → 본인인증/로그인 토큰 요구.

---

## 5. 참고 / 보안 관점 메모

- 공개 API에 인증 게이트나 레이트리밋이 보이지 않아, 대량 스크래핑/크롤링에 노출될 수 있음(운영 측 검토 권장).
- 게시글 API 응답에 작성자 `userId`/`authorId`(정수 ID)가 포함되어 있어, 닉네임-내부ID 매핑이 노출됨.
- 본 분석은 GET(읽기) 엔드포인트만 대상으로 했으며, 쓰기/결제 API는 테스트하지 않음.
