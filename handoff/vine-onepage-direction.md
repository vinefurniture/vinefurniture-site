# Vine Furniture one-page direction

Updated: 2026-05-30 KST

## Decision summary
- Move the public-facing site toward a **one-page promotional landing page**.
- Do **not** expand content just to fill sections.
- Do **not** repeat the same photo across multiple sections.
- Optimize the customer journey as:
  - **웹 유입**
  - **브랜드/매장 신뢰 형성**
  - **대표 제품 분위기 확인**
  - **오프라인 방문 유도 또는 전화 문의**
- Treat the website as a **promotion + visit conversion surface**, not a content-heavy brochure.

## Core UX principle
The user should understand three things within a few seconds:
1. 여기가 어떤 가구 매장인지
2. 왜 한번 방문해볼 만한지
3. 지금 어떻게 문의/방문하면 되는지

If a section does not help one of those three outcomes, remove it.

## Recommended information architecture
Use a single `/` page with anchored sections:

1. **Hero / first impression**
   - One strong representative image only
   - Short brand promise
   - Primary CTA: 전화 문의
   - Secondary CTA: 오시는 길 / 방문 안내

2. **Why Vine Furniture**
   - 3 or 4 compact trust points only
   - Example themes:
     - 30년 경력
     - 공장 직영
     - 합리적인 가격
     - 직접 상담
   - Keep this compact; avoid long brand-story paragraphs

3. **Representative showroom / product gallery**
   - Curated set of unique photos only
   - Suggested count: **6 to 8 max**
   - Purpose: 분위기 전달, 품목 다양성 암시, 방문 욕구 자극
   - Avoid duplicated images and avoid separate gallery pages for now

4. **Instagram-connected social proof block**
   - Prefer a lightweight section over a heavy live embed
   - Show a small grid or teaser area with CTA to Instagram
   - Goal: "최근 분위기/활동성" 전달
   - Avoid relying on a full dynamic feed for the main experience

5. **Visit info / location**
   - Address
   - Hours
   - Naver map / place CTA
   - Short note encouraging call before visiting

6. **Final contact CTA**
   - Phone first
   - Instagram secondary
   - Clear close: 방문 상담 / 제품 문의 유도

## Navigation direction
Replace multi-page primary navigation with anchor-based navigation on the single page:
- 소개
- 사진
- 인스타그램
- 오시는 길
- 문의

This keeps the header intuitive and reduces page-hopping.

## What to remove or de-emphasize
- Long standalone brand page style copy
- A separate full gallery page as a primary user path
- Repeated photos across home / brand / gallery
- Excess informational cards that do not help trust or conversion
- Any section that exists only because brochure sites “usually have it”

## Photo strategy
### Rules
- One image = one clear job
- No duplicate use unless there is a very strong reason
- Hero image should be the strongest “first impression” shot
- Remaining gallery images should be unique in angle/category/space

### Suggested slot logic
- 1 hero image
- 2–3 category-defining product/showroom images
- 2–3 atmosphere/supporting images
- optional 1 exterior/storefront image if it helps offline visit confidence

## Instagram strategy
## Recommended approach
Do **not** make the whole home page depend on a real-time Instagram feed.

Current preferred order for this project:
1. **Home page:** compact teaser gallery + single CTA into `/gallery`
2. **Gallery page:** Instagram-first embedded feed + supporting curated showroom photos
3. **Direct Instagram open:** secondary action only when the user wants the native Instagram surface

### Why
- keeps the home conversion flow simpler
- preserves the user's place inside the site before inquiry/visit
- still gives a live/latest-photo surface on `/gallery`
- better fit for a low-tech future operator than making every section depend on embeds

## Conversion hierarchy
Every main screen should keep the conversion actions obvious:
- **Primary:** 전화 문의
- **Secondary:** 오시는 길 / 네이버 지도
- **Tertiary:** 인스타그램 보기

If there are too many equal-weight buttons, conversion weakens.

## Content tone direction
- Short
- Concrete
- Trust-first
- Local offline-store oriented
- Avoid inflated marketing language
- Prefer plain Korean that older or less technical visitors can scan quickly

## Implementation direction for the current Astro codebase
### Near-term recommended refactor
- Keep `/` as the main page and merge existing page content into sections
- Convert header links from route links to section anchors
- Reduce repeated content blocks
- Curate the image set so only unique photos remain in the main flow
- Keep legacy pages temporarily only if needed for transition, but de-emphasize them from nav

### Page role after refactor
- `/` = primary public experience
- `/gallery` = Instagram-first latest-photo page with supporting curated showroom highlights
- `/brand`, `/location`, `/contact` = optional fallback/support pages or candidates for later removal/redirect
- `/promotion` = do not reintroduce as a separate public route unless a future campaign truly needs a standalone landing page; keep promotions in the home `homePromo` block by default

## Success criteria
The redesign is successful if a first-time visitor can:
1. understand the store in under 5 seconds
2. see enough visual proof without scrolling through repetitive content
3. find phone/location actions immediately
4. feel guided toward **visit or inquiry**, not browsing for browsing’s sake

## Next implementation pass
Recommended next execution step:
1. rewrite the home page into one-page anchored sections
2. simplify header navigation
3. prune duplicate images/content
4. add a lightweight Instagram-connected section
5. rebuild and redeploy
