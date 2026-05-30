# Vine Furniture 1차 우선 반영 세트

이 문서는 바인퍼니처 사이트를 **실자산 1차 반영 기준으로 가장 빠르게 실사이트 느낌에 가깝게 올리는 최소 세트**를 정리합니다.

## 목표
아래 6개만 먼저 반영해도 홈/브랜드/오시는 길/문의/갤러리 첫인상 품질이 크게 올라갑니다.

## 1차 우선 반영 파일

### 필수 1순위
1. `/images/vine/hero/hero-primary-bed.jpg`
   - 용도: 메인 히어로 대표컷
   - 영향 페이지: 메인

2. `/images/vine/store/store-interior-main.jpg`
   - 용도: 매장 전경 / 내부 대표컷
   - 영향 페이지: 메인, 브랜드 소개, 오시는 길

3. `/images/vine/brand/logo-primary.png`
   - 용도: 헤더 / 푸터 로고
   - 영향 페이지: 전 페이지

### 필수 2순위
4. `/images/vine/gallery/gallery-bed-01.jpg`
   - 용도: 대표 갤러리 침대컷
   - 영향 페이지: 메인, 갤러리

5. `/images/vine/gallery/gallery-sofa-01.jpg`
   - 용도: 대표 갤러리 소파컷
   - 영향 페이지: 메인, 브랜드, 갤러리

6. `/images/vine/gallery/gallery-table-01.jpg`
   - 용도: 대표 갤러리 식탁컷
   - 영향 페이지: 메인, 갤러리

---

## 권장 파일 조건
- 포맷: `jpg` 또는 `webp`
- 용량: 가능하면 장당 500KB 이하
- 로고: 배경 투명 PNG 권장
- 히어로/대표컷: 너무 세로로 긴 이미지보다 가로형 또는 4:3~16:10 계열 권장

---

## 반영 순서
1. 위 6개 파일명을 `plannedSrc` 기준으로 맞춘다.
2. `public/images/vine/` 하위 경로에 파일을 넣는다.
3. 아래 명령으로 상태를 확인한다.

```bash
npm run assets:check
npm run build
npm run preview:check
```

4. 브라우저에서 아래 페이지를 확인한다.
- `/`
- `/brand`
- `/gallery`
- `/location`
- `/contact`

---

## 1차 반영 완료 판단 기준
아래 조건을 만족하면 1차 세트 완료로 봅니다.
- 홈 히어로가 실사진으로 교체됨
- 브랜드/오시는 길 전경 이미지가 실사진으로 교체됨
- 헤더/푸터 로고가 실제 로고로 교체됨
- 갤러리 첫 줄 인상이 플레이스홀더가 아닌 실사진 기반이 됨
- `npm run preview:check` 통과

---

## 다음 2차 반영 후보
1차 완료 후 아래를 이어서 채우면 됩니다.
- `/images/vine/hero/hero-secondary-sofa.jpg`
- `/images/vine/gallery/gallery-store-01.jpg`
- `/images/vine/gallery/gallery-storage-01.jpg`
- `/images/vine/gallery/gallery-instagram-bed-01.jpg`
- `/images/vine/gallery/gallery-instagram-sofa-01.jpg`
- `/images/vine/gallery/gallery-store-interior-01.jpg`
