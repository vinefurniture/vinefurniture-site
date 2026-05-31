# Vine Furniture Asset Replacement Guide

이 문서는 현재 플레이스홀더 기반으로 구현된 바인퍼니처 사이트를
실제 자산으로 교체할 때 필요한 **파일명 규칙 / 연결 위치 / 우선순위**를 정리합니다.

## 1. 기본 원칙
- 실제 자산은 `public/images/vine/` 아래에 둡니다.
- 현재 코드에서는 플레이스홀더와 실제 파일 경로를 모두 문서화해 두었습니다.
- 실제 파일이 준비되면 `src/data/vine-asset-manifest.json`의 `plannedSrc` 경로에 맞춰 파일만 넣으면 자동으로 실자산이 연결됩니다.
- 권장 포맷은 `jpg` 또는 `webp`입니다.
- 공개 전에는 파일 크기 최적화(가급적 500KB 이하)를 권장합니다.
- 파비콘/OG 같은 공통 메타 자산은 별도 경로(`public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.svg`, `public/images/og/`)에서 관리합니다.
- 공개 전 메타/공유 자산 점검은 `npm run preview:check`로 함께 확인합니다.

---

## 2. 권장 폴더 구조

```text
public/images/
  placeholders/
  og/
  vine/
    brand/
    hero/
    gallery/
    store/
```

---

## 3. 실제 자산 파일명 규칙

### 3-0. 메타 / 공유 자산
- `public/favicon.svg`
  - 용도: 브라우저 탭, 북마크, 기본 아이콘
  - 현재 상태: 브랜드용 SVG 초안 적용 완료
- `public/favicon.ico`
  - 용도: 구형 브라우저 fallback
  - 현재 상태: 기본 fallback 유지
- `public/apple-touch-icon.svg`
  - 용도: 모바일 홈 화면/터치 아이콘 구조
  - 현재 상태: 브랜드용 SVG 초안 적용 완료
- `public/images/og/vine-og-default.svg`
  - 용도: Open Graph / Twitter 카드 기본 대표 이미지
  - 현재 상태: 배포 전용 플레이스홀더형 OG 초안 적용 완료

### 3-1. 브랜드 / 공통
- `brand/logo-primary.png`
  - 출처: 기존 홈페이지 `theme/TYPE08/img/logo.png`
  - 사용 위치: 헤더, 푸터
  - 참고: 파일이 준비되면 기존 VF 원형 플레이스홀더 대신 자동 반영됩니다.

### 3-2. 메인 히어로
- `hero/hero-primary-bed.jpg`
  - 출처: 인스타그램 침대 대표컷
  - 후보: `https://www.instagram.com/p/C62940502/`
  - 사용 위치: 메인 히어로

- `hero/hero-secondary-sofa.jpg`
  - 출처: 인스타그램 소파 대표컷
  - 후보: `https://www.instagram.com/p/C656623823/`
  - 사용 위치: 문의 페이지 보조 이미지 / 보조 히어로

### 3-3. 매장 / 전경
- `store/store-interior-main.jpg`
  - 출처: 기존 홈페이지 `img4` 또는 인스타 매장 전경
  - 후보: `https://www.instagram.com/p/C662940502/`
  - 사용 위치: 브랜드 소개 헤더 / 오시는 길 / 방문 유도 섹션

### 3-4. 갤러리
- `gallery/gallery-bed-01.jpg`
  - 출처: 기존 홈페이지 `img1.png`
- `gallery/gallery-sofa-01.jpg`
  - 출처: 기존 홈페이지 `img2.png`
- `gallery/gallery-table-01.jpg`
  - 출처: 기존 홈페이지 `img3.png`
- `gallery/gallery-store-01.jpg`
  - 출처: 기존 홈페이지 `img4.png`
- `gallery/gallery-storage-01.jpg`
  - 출처: 기존 홈페이지 `img5.png`
- `gallery/gallery-instagram-bed-01.jpg`
  - 출처: 인스타 침대 대표컷
- `gallery/gallery-instagram-sofa-01.jpg`
  - 출처: 인스타 소파 대표컷
- `gallery/gallery-store-interior-01.jpg`
  - 출처: 매장 전경 대표컷

---

## 4. 코드 연결 기준
실제 연결 기준 파일:
- `src/data/vine-asset-manifest.json`
- `src/data/site.ts` (`vine-asset-manifest.json`을 읽어 실제/플레이스홀더 자동 연결)

매니페스트의 각 자산은 다음 정보를 가집니다.
- `key`: 슬롯 식별자
- `slot`: 자산 묶음 분류(brand / hero / store / gallery)
- `src`: 기본 플레이스홀더 경로
- `plannedSrc`: 실제 자산이 들어갈 목표 경로
- `source`: 자산 출처 설명
- `category`: 갤러리용 카테고리(선택)

런타임(`src/data/site.ts`)에서는 아래 상태값이 자동 계산됩니다.
- `isRealAsset`: 실제 파일 존재 여부에 따라 자동 계산되는 상태값
- `activeSource`: 현재 어떤 자산이 연결되었는지 보여주는 설명값

실제 자산 준비 후에는 아래 방식으로 반영됩니다.
1. `plannedSrc` 경로에 맞게 실제 이미지 파일 저장
2. `npm run assets:check`로 누락 파일 확인
3. `node scripts/generate-vine-asset-report.mjs --format=json --output=handoff/vine-assets.json` 또는 `node scripts/generate-vine-asset-report.mjs --format=markdown --output=handoff/vine-assets.md`로 인수인계용 산출물 생성
4. `npm run build`로 검증
5. 브라우저에서 모바일/데스크톱 확인

참고:
- 현재 구현은 `public/images/vine/...` 경로에 실제 파일이 있으면 플레이스홀더 대신 자동으로 그 파일을 사용합니다.
- 즉, 대부분의 경우 `src/data/site.ts`를 다시 수정할 필요가 없습니다.
- 단, 파일명 자체를 바꾸거나 새 슬롯을 추가할 때만 `src/data/vine-asset-manifest.json`을 수정하면 됩니다.

### 4-1. 신규 자산 툴링 명령
- `npm run assets:check`
  - 기존 동작 유지
  - 현재 `plannedSrc` 기준으로 실제 파일이 존재하는지 콘솔에 FOUND / MISSING 목록 출력
- `npm run assets:manifest`
  - JSON 형식의 머신 리더블 매니페스트 + 존재 여부 + 요약 수치 출력
- `npm run assets:report`
  - Markdown 형식의 인수인계 보고서 출력
- `npm run assets:intake`
  - CSV 형식의 실자산 전달/정리용 시트 출력
- `npm run assets:intake:md`
  - Markdown 형식의 실자산 전달/정리용 시트 출력

파일로 **깔끔하게 저장**하려면 직접 스크립트 호출을 권장합니다.
- `node scripts/generate-vine-asset-report.mjs --format=json --output=handoff/vine-assets.json`
- `node scripts/generate-vine-asset-report.mjs --format=markdown --output=handoff/vine-assets.md`
- `node scripts/generate-vine-asset-intake.mjs --format=csv --output=handoff/vine-asset-intake.csv`
- `node scripts/generate-vine-asset-intake.mjs --format=markdown --output=handoff/vine-asset-intake.md`

기존 `vinefurniture.kr` 공개 자산을 다시 수집해 현재 슬롯 경로에 반영하려면 아래 명령을 사용할 수 있습니다.
- `uv run --with pillow python scripts/import-vine-legacy-assets.py`
- 실행 결과는 `handoff/vine-legacy-asset-import.md`에 기록됩니다.

---

## 5. 우선 교체 순서
1. `hero/hero-primary-bed.jpg`
2. `store/store-interior-main.jpg`
3. `gallery/gallery-bed-01.jpg`
4. `gallery/gallery-sofa-01.jpg`
5. `gallery/gallery-table-01.jpg`
6. `brand/logo-primary.png`

---

## 6. 공개 전 체크리스트
- [ ] 플레이스홀더 제거 여부 확인
- [ ] 모든 대표 이미지 alt 텍스트 점검
- [ ] 모바일에서 잘리지 않는지 확인
- [ ] 파일 크기 최적화 확인
- [ ] Vercel Preview에서 실제 이미지 로딩 확인

---

## 7. 간편 관리자 MVP 사용 흐름

- 관리자 페이지: `/admin`
- 저장 방식: 브라우저 `localStorage`에 초안 자동 저장 (`vine-admin-draft-v1`)
- 미리보기 방식: `/?draft=1`, `/location?draft=1`, `/contact?draft=1`

권장 운영 순서:
1. `/admin`에서 전화번호, 운영시간, 주소, 메인 문구, 대표 이미지 3장을 먼저 수정
2. 입력 후 자동 저장되면 미리보기 버튼으로 모바일/문구 확인
3. 문구/링크/갤러리 순서만 바꿨으면 `사이트 반영 파일`을 내보내고 import 단계로 이동
4. 대표 사진까지 바꿨으면 `초안 JSON`을 내보낸 뒤 `npm run admin:extract-assets -- ./vine-admin-draft.json --write`로 실제 파일을 먼저 생성
5. 생성된 `vine-admin-publish.json` 또는 기존 publish JSON을 import 단계로 반영

---

## 8. 실제 이미지 반영 직전 실행 체크리스트

### 8-1. 파일 준비
- [ ] 전달받은 실제 이미지 파일명을 `plannedSrc` 기준으로 정리했는가
- [ ] 세로/가로 비율이 현재 카드/히어로 영역과 크게 충돌하지 않는가
- [ ] 대표 이미지는 우선 `hero`, `store`, `gallery` 순서로 준비했는가
- [ ] 로고 파일은 배경 투명 PNG 또는 SVG인지 확인했는가

### 8-2. 코드 반영
- [ ] `plannedSrc` 위치에 실제 파일을 넣었는가
- [ ] `npm run assets:check`에서 누락 파일 목록이 예상대로 보이는가
- [ ] 임시 플레이스홀더 설명 문구가 남아 있지 않은가
- [ ] 페이지별 meta description/OG 구조가 유지되는가
- [ ] 기본 OG 이미지 외에 별도 페이지 대표 이미지가 필요하면 추가 지정했는가

### 8-3. 품질 점검
- [ ] `npm run build`가 경고 없이 통과하는가
- [ ] 홈 / 브랜드 / 갤러리 / 오시는 길 / 문의 페이지를 모두 확인했는가
- [ ] 모바일(특히 360px~430px 폭)에서 버튼 줄바꿈과 헤더 네비가 어색하지 않은가
- [ ] 갤러리 카드 이미지가 과도하게 잘리거나 눌리지 않는가
- [ ] 연락처/지도/외부 링크가 정상 동작하는가

### 8-4. Vercel Preview 직전
- [ ] `public/images/vine/` 하위 실제 파일이 모두 커밋 대상에 포함되는가
- [ ] `site.webmanifest`, `favicon.svg`, `favicon.ico`, `apple-touch-icon.svg`, `images/og/vine-og-default.svg`가 유지되는가
- [ ] `npm run preview:check`가 통과하는가
- [ ] canonical / OG / twitter 메타가 페이지 HTML에 들어가는가
- [ ] Preview URL에서 탭 아이콘과 OG 이미지가 정상 노출되는지 최종 확인할 계획이 있는가
