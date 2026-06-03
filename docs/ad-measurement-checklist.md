# 바인퍼니처 광고 / 성과측정 체크리스트

광고 집행 전후에 유지보수자가 확인할 최소 항목입니다. 운영자는 숫자만 확인하면 되도록 GA4 기준으로 단순화합니다.

## 1. 광고 시작 전 필수 설정

### Google Tag Manager / GA4
- [x] GTM 컨테이너 생성: `GTM-TWF4CHZX`
- [x] 사이트 기본 GTM 설치 코드 반영
- [ ] GTM에서 GA4 구성 태그 생성
  - 태그 유형: Google 애널리틱스: GA4 구성
  - 측정 ID: `G-XXXXXXXXXX`
  - 트리거: All Pages
- [ ] GTM에서 아래 클릭 이벤트용 GA4 이벤트 태그 생성
- [ ] GTM 미리보기에서 `click_call`, `click_naver_place`, `click_instagram`, `click_naver_blog` 이벤트 확인
- [ ] GTM 게시 후 GA4 실시간 보고서에서 방문 수와 클릭 이벤트 확인

참고: 코드에는 `PUBLIC_GTM_CONTAINER_ID` 환경변수도 지원하지만, 현재 기본값은 `GTM-TWF4CHZX`입니다.

### 사이트 클릭 이벤트
사이트에는 아래 이벤트를 보낼 준비가 되어 있습니다.

| 이벤트 이름 | 의미 | 중요도 |
| --- | --- | --- |
| `click_call` | 전화 버튼 클릭 | 최상 |
| `click_naver_place` | 네이버 플레이스 / 위치 / 예약 클릭 | 최상 |
| `click_instagram` | 인스타그램 클릭 | 중간 |
| `click_naver_blog` | 네이버 블로그 클릭 | 낮음~중간 |

## 2. 광고 URL 규칙

광고 채널마다 다른 URL을 사용해야 성과를 구분할 수 있습니다.

### 네이버 검색광고
```text
https://vinefurniture-site.vercel.app/?utm_source=naver&utm_medium=cpc&utm_campaign=visit
```

### 인스타그램 / 메타 광고
```text
https://vinefurniture-site.vercel.app/?utm_source=instagram&utm_medium=paid_social&utm_campaign=visit
https://vinefurniture-site.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=visit
```

### 테스트용 QR / 오프라인 안내
```text
https://vinefurniture-site.vercel.app/?utm_source=offline&utm_medium=qr&utm_campaign=store_visit
```

## 3. 주간 성과 점검표

매주 같은 요일에 아래 숫자만 기록합니다.

| 항목 | 이번 주 | 지난주 | 판단 |
| --- | ---: | ---: | --- |
| 사이트 방문 수 |  |  | 늘었는가? |
| 전화 클릭 `click_call` |  |  | 실제 문의와 비슷한가? |
| 위치/예약 클릭 `click_naver_place` |  |  | 방문 의향이 있는가? |
| 인스타그램 클릭 `click_instagram` |  |  | 사진 확인 수요가 있는가? |
| 광고비 |  |  | 너무 빨리 소진되지 않았는가? |
| 실제 전화 문의 수 |  |  | 사이트 클릭과 차이가 큰가? |
| 실제 매장 방문 수 |  |  | 광고 이후 늘었는가? |

## 4. 광고 중단/수정 기준

아래 중 하나라도 해당하면 광고 문구나 랜딩을 수정합니다.

- 방문 수는 있는데 전화/위치 클릭이 거의 없다.
- 위치 클릭은 있는데 실제 방문이 거의 없다.
- 전화 문의가 가격만 묻고 끝난다.
- 인스타그램 클릭만 많고 전화/위치 클릭이 없다.
- 특정 광고 소재만 비용을 많이 쓰고 전환이 없다.

## 5. 초보 운영자용 한 줄 판단

- 전화 클릭이 늘면: 문의 의도 있음
- 위치/예약 클릭이 늘면: 방문 의도 있음
- 방문 수만 늘고 클릭이 없으면: 광고비 누수 가능성 있음
- 인스타 클릭만 늘면: 사진은 보지만 방문 유도가 약할 수 있음
