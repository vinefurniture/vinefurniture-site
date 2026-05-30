# Vine asset intake sheet

Generated: 2026-05-30T04:47:07.547Z

실제 자산 전달/정리용 표입니다. `target_path` 기준으로 파일명을 맞춰 넣으면 자동 연결됩니다.

## Summary
- Total assets: 12
- Ready: 12
- Missing: 0

| Priority | Key | Title | Target path | Usage | Candidate source | Status |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | heroPrimary | 호텔형 침대 대표컷 | `/images/vine/hero/hero-primary-bed.jpg` | 메인 히어로 대표컷 | 인스타그램 침대 대표컷 후보: https://www.instagram.com/p/C62940502/ | READY |
| P3 | heroSecondary | 거실 소파 대표컷 | `/images/vine/hero/hero-secondary-sofa.jpg` | 문의 페이지 보조 이미지 / 보조 히어로 | 인스타그램 소파 대표컷 후보: https://www.instagram.com/p/C656623823/ | READY |
| P1 | storeView | 매장 내부 전경 | `/images/vine/store/store-interior-main.jpg` | 메인·브랜드·오시는 길 대표 매장컷 | 기존 홈페이지 img4 또는 인스타 매장 전경 후보: https://www.instagram.com/p/C662940502/ | READY |
| P1 | logoPrimary | 바인퍼니처 로고 | `/images/vine/brand/logo-primary.png` | 전 페이지 헤더/푸터 | 기존 홈페이지 theme/TYPE08/img/logo.png | READY |
| P2 | galleryBed01 | 호텔형 침대 쇼룸컷 | `/images/vine/gallery/gallery-bed-01.jpg` | 메인·갤러리 대표 침대컷 | 기존 홈페이지 img1.png | READY |
| P2 | gallerySofa01 | 프리미엄 소파 쇼룸컷 | `/images/vine/gallery/gallery-sofa-01.jpg` | 메인·갤러리 대표 소파컷 | 기존 홈페이지 img2.png | READY |
| P2 | galleryTable01 | 원목 식탁 연출컷 | `/images/vine/gallery/gallery-table-01.jpg` | 메인·갤러리 대표 식탁컷 | 기존 홈페이지 img3.png | READY |
| P3 | galleryStore01 | 매장 분위기 컷 | `/images/vine/gallery/gallery-store-01.jpg` | 갤러리 매장 분위기컷 | 기존 홈페이지 img4.png | READY |
| P3 | galleryStorage01 | 쇼룸 전시 구성컷 | `/images/vine/gallery/gallery-storage-01.jpg` | 갤러리 수납가구컷 | 기존 홈페이지 img5.png | READY |
| P3 | galleryInstagramBed01 | 침실 스타일링 컷 | `/images/vine/gallery/gallery-instagram-bed-01.jpg` | 갤러리 침실 스타일링컷 | 인스타그램 침대 대표컷 재활용 가능 | READY |
| P3 | galleryInstagramSofa01 | 거실 스타일링 컷 | `/images/vine/gallery/gallery-instagram-sofa-01.jpg` | 갤러리 거실 스타일링컷 | 인스타그램 소파 대표컷 재활용 가능 | READY |
| P3 | galleryStoreInterior01 | 매장 전경 대표컷 | `/images/vine/gallery/gallery-store-interior-01.jpg` | 갤러리 매장 전경컷 | 매장 전경 대표컷 재활용 가능 | READY |

## Drop-in rule
- 파일을 `public/` 기준 `target_path`에 맞춰 저장
- 저장 후 `npm run assets:check`, `npm run build`, `npm run preview:check` 순으로 검증
