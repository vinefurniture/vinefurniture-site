# Real asset drop zone

실제 바인퍼니처 이미지 파일은 이 디렉토리 아래에 배치합니다.

권장 구조:
- `brand/logo-primary.png`
- `hero/hero-primary-bed.jpg`
- `hero/hero-secondary-sofa.jpg`
- `store/store-interior-main.jpg`
- `gallery/gallery-bed-01.jpg`
- `gallery/gallery-sofa-01.jpg`
- `gallery/gallery-table-01.jpg`
- `gallery/gallery-store-01.jpg`
- `gallery/gallery-storage-01.jpg`
- `gallery/gallery-instagram-bed-01.jpg`
- `gallery/gallery-instagram-sofa-01.jpg`
- `gallery/gallery-store-interior-01.jpg`

이 경로에 실제 파일을 넣으면 사이트가 플레이스홀더 대신 자동으로 실자산을 사용합니다.
현재 기준으로는 위 슬롯 **12/12개가 모두 실제 파일로 채워진 상태**입니다.
검증 명령:
- `npm run assets:check`
- `node scripts/generate-vine-asset-report.mjs --format=json --output=handoff/vine-assets.json`
- `node scripts/generate-vine-asset-report.mjs --format=markdown --output=handoff/vine-assets.md`
- `node scripts/generate-vine-asset-intake.mjs --format=csv --output=handoff/vine-asset-intake.csv`
- `node scripts/generate-vine-asset-intake.mjs --format=markdown --output=handoff/vine-asset-intake.md`
- `npm run build`
- `npm run preview:check`

상세 기준은 `docs/asset-replacement-guide.md` 참고.

기존 공개 사이트 자산 재수집:
- `uv run --with pillow python scripts/import-vine-legacy-assets.py`
- 수집 로그: `handoff/vine-legacy-asset-import.md`

자산 기준 데이터는 `src/data/vine-asset-manifest.json`에 있습니다.
이 파일의 `plannedSrc`를 기준으로 실제 파일 존재 여부가 자동 판정됩니다.

추가 메모:
- 로고 파일(`brand/logo-primary.png`)이 준비되면 헤더/푸터의 VF 플레이스홀더 대신 자동 반영됩니다.
- 대표 이미지 3장은 `/admin`에서 먼저 초안 미리보기 후 반영 여부를 결정할 수 있습니다.
- `/admin` 수정 내용은 브라우저에 자동 저장되며, `/?draft=1` 계열 미리보기에서 바로 확인할 수 있습니다.
- 파비콘은 `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.svg`, 기본 OG 이미지는 `public/images/og/vine-og-default.svg`에서 관리합니다.
