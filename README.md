# Vine Furniture Website

바인퍼니처 홈페이지 리빌드 프로젝트입니다. Astro 기반의 정적 사이트로 구성되어 있으며,
현재 배포 기본 경로는 **Vercel** 기준으로 정리되어 있습니다.

## 프로젝트 개요
- 프레임워크: Astro
- 스타일: SCSS
- 배포 권장안: Vercel
- 목표: 빠른 로딩, 간결한 운영, 브랜드 신뢰 중심의 마케팅 사이트

## 주요 페이지
- `/` 메인
- `/brand` 브랜드 소개
- `/gallery` 갤러리
- `/location` 오시는 길
- `/contact` 문의
- `/admin-demo` 관리자 UX 프로토타입

## 콘텐츠 관리 구조
- 사이트 문구 원본: `src/data/site-content.json`
- 화면 바인딩/자산 슬롯: `src/data/site.ts`
- 임시 데모 이미지: `public/images/vine-demo/`

현재 구조는 향후 간편 관리자 페이지 또는 CMS 연결을 쉽게 하기 위해,
문구와 이미지 슬롯을 중앙 데이터 파일에서 관리하도록 정리되어 있습니다.

## 로컬 개발
```bash
npm install
npm run dev
```

기본 개발 서버:
- `http://localhost:4321`

## 프로덕션 빌드
```bash
npm run build
npm run preview
```

빌드 결과물:
- `dist/`

## Vercel 배포
이 프로젝트는 정적 Astro 사이트라 Vercel에 바로 배포할 수 있습니다.

### 권장 설정
- Framework Preset: `Astro`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: 프로젝트 `package.json`의 engines 기준 사용

### 배포 절차
1. 저장소를 GitHub에 푸시
2. Vercel에서 **Import Project** 선택
3. 저장소 연결
4. Astro 프리셋/빌드 설정 확인
5. 첫 배포 실행
6. Preview URL에서 최종 확인
7. 우선 `https://vinefurniture-site.vercel.app` 기준으로 확인
8. 추후 필요 시 커스텀 도메인 연결 (`vinefurniture.kr` 또는 신규 도메인)

## 자산 반영 메모
현재는 기존 `vinefurniture.kr` 공개 자산을 기준으로 **대표 이미지 12개가 실제 파일로 연결된 상태**입니다.
필요 시 아래 구조를 기준으로 동일 슬롯에 다시 교체/보강할 수 있습니다.

```text
public/images/
  placeholders/
  vine/
```

현재 연결 완료된 대표 범위:
- 로고
- 메인 히어로 이미지 2장
- 갤러리 대표 이미지 8장
- 매장 전경 이미지

반영/인수인계용 명령:
```bash
npm run assets:check
node scripts/generate-vine-asset-report.mjs --format=json --output=handoff/vine-assets.json
node scripts/generate-vine-asset-report.mjs --format=markdown --output=handoff/vine-assets.md
node scripts/generate-vine-asset-intake.mjs --format=csv --output=handoff/vine-asset-intake.csv
node scripts/generate-vine-asset-intake.mjs --format=markdown --output=handoff/vine-asset-intake.md
uv run --with pillow python scripts/import-vine-legacy-assets.py
```

관리자 반영 명령:
```bash
npm run admin:extract-assets -- ./vine-admin-draft.json --write
npm run admin:import -- ./vine-admin-publish.json --write
npm run build
npm run preview:check
```

상세 기준:
- `docs/asset-replacement-guide.md`
- `docs/admin-publish-checklist.md`
- `docs/admin-operator-guide.md`
- `public/images/vine/README.md`
- 기존 사이트 자산 재수집 스크립트: `scripts/import-vine-legacy-assets.py`

## 참고
- 현재 임시 운영 기본 URL은 `https://vinefurniture-site.vercel.app` 입니다.
- 추후 커스텀 도메인을 연결하면 `astro.config.mjs`와 `src/data/site-content.json`의 `siteUrl`을 함께 교체해야 합니다.
- 사이트맵은 `@astrojs/sitemap`으로 생성됩니다.
