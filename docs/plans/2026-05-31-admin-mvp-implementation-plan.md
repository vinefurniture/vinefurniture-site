# Vine Furniture `/admin` MVP Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn the current `/admin` prototype into a real low-risk admin MVP that lets a low-tech operator safely edit only the highest-value fields, preview changes, and produce a publishable payload without exposing layout, SEO, or deployment internals.

**Architecture:** Keep the public site static on Astro/Vercel. Treat `src/data/site-content.json` and `src/data/vine-asset-manifest.json` as the canonical content model, add a narrow admin schema on top, and use a two-stage flow: `저장 → 미리보기 확인 → 사이트 반영`. In MVP scope, browser draft state can remain local, but the publish surface must generate a deterministic JSON payload that can later be imported by a serverless save flow.

**Tech Stack:** Astro, TypeScript/JSON data modules, SCSS, browser `localStorage`, static preview bindings, Vercel static deployment.

---

## Current State Audit

### What already exists
- `src/pages/admin.astro`
  - local draft save to `localStorage`
  - preview open buttons for `/`, `/location`, `/contact`
  - draft export to JSON
  - representative image preview for `heroPrimary`, `heroSecondary`, `storeView`
- `public/admin/admin-preview.js`
  - applies `?draft=1` preview bindings on public pages
- `src/data/site-content.json`
  - centralized business info and page copy
- `src/data/vine-asset-manifest.json`
  - explicit selected/gallery asset slots with `src` and `plannedSrc`
- `scripts/check-preview-readiness.mjs`
  - verifies preview bindings and metadata presence

### Gaps to close for MVP
1. `/admin` has no explicit field schema shared with preview/publish logic.
2. Gallery ordering/visibility is discussed in docs but not editable in real `/admin`.
3. Exported draft JSON is useful, but not normalized as a future import/publish contract.
4. There is no “site 반영용 payload” generation step.
5. The page mixes UI, state logic, and field definitions into one large Astro file.

---

## Recommended MVP Scope

### Safe editable fields
#### Business info
- 대표 전화번호
- 운영시간
- 주소
- 인스타그램 링크
- 네이버 블로그 링크
- 네이버 플레이스 링크

#### Home / key copy
- 메인 제목
- 메인 소개문
- 오시는 길 소개문
- 문의 페이지 소개문

#### Representative image slots
- `heroPrimary` — 메인 대표 사진
- `storeView` — 매장 전경 사진
- `heroSecondary` — 문의 보조 사진

#### Gallery controls
- 갤러리 순서 변경
- 갤러리 노출/숨김
- 각 갤러리 항목의 간단한 관리자 라벨 확인

### Explicitly out of scope for MVP
- 레이아웃 변경
- 색상/간격/컴포넌트 구조 변경
- SEO 세부 메타 수정
- favicon/manifest/sitemap 수정
- Vercel 배포 설정
- 자유 문단 추가/삭제
- 새 페이지 생성
- 실제 인증/권한 시스템

---

## Target UX Flow

### Operator flow
1. `/admin` 접속
2. `매장 기본 정보`, `메인 문구`, `대표 사진`, `갤러리 순서`만 수정
3. 자동 저장 확인
4. `미리보기 보기` 버튼으로 실제 페이지 확인
5. `사이트 반영 파일 내보내기` 버튼 클릭
6. 운영자 또는 관리자(helper)가 그 파일을 반영

### Why this flow
- 아버님 수준의 운영자에게 GitHub/Vercel 개념을 숨길 수 있음
- 저장과 배포를 분리해 실수를 줄일 수 있음
- 나중에 서버리스 저장을 붙여도 UI를 크게 바꾸지 않아도 됨

---

## Proposed Data Contract

Create one admin-specific draft contract and use it everywhere.

### Draft payload shape
```json
{
  "version": 1,
  "updatedAt": "2026-05-31T10:00:00+09:00",
  "business": {
    "phone": "031-312-1051",
    "phoneHref": "tel:0313121051",
    "hours": "매일 10:00~19:00",
    "address": "경기 시흥시 수인로3488번길 1 지층(신천동)",
    "instagram": "https://www.instagram.com/vinefurniture/",
    "blog": "https://blog.naver.com/syj1051000",
    "place": "https://naver.me/xlb3Zq7H"
  },
  "home": {
    "heroTitle": "...",
    "heroBody": "..."
  },
  "locationPage": {
    "heroBody": "..."
  },
  "contactPage": {
    "heroBody": "..."
  },
  "assetSlots": {
    "heroPrimary": "/images/vine/hero/hero-primary-bed.jpg",
    "storeView": "/images/vine/store/store-interior-main.jpg",
    "heroSecondary": "/images/vine/hero/hero-secondary-sofa.jpg"
  },
  "gallery": [
    {
      "key": "galleryBed01",
      "visible": true,
      "order": 1
    }
  ]
}
```

### Important rule
For MVP, keep preview-time image uploads as browser-local Data URLs if needed, but the **publish/export** format should prefer final public paths or explicit placeholder values. That keeps the contract compatible with future server-side import.

---

## File Plan

### New files
- `src/data/admin-schema.ts`
- `src/lib/admin-draft.ts`
- `src/components/admin/AdminSection.astro`
- `src/components/admin/AdminTextFields.astro`
- `src/components/admin/AdminImageSlots.astro`
- `src/components/admin/AdminGalleryManager.astro`
- `src/components/admin/AdminActionBar.astro`
- `docs/plans/2026-05-31-admin-mvp-implementation-plan.md`

### Files to modify
- `src/pages/admin.astro`
- `src/pages/admin-demo.astro`
- `src/data/site-content.json`
- `src/data/vine-asset-manifest.json`
- `src/data/site.ts`
- `public/admin/admin-preview.js`
- `scripts/check-preview-readiness.mjs`
- `README.md` (only if operator workflow changes materially)

---

## Task Breakdown

### Task 1: Extract admin draft schema from `admin.astro`
**Objective:** Move the editable field contract out of the page so future UI, preview, and publish logic share one source of truth.

**Files:**
- Create: `src/data/admin-schema.ts`
- Modify: `src/pages/admin.astro`

**Implementation notes:**
- Export `adminDefaults`
- Export editable field lists grouped by section
- Export representative image slot metadata with operator labels
- Export gallery admin item metadata (`key`, `title`, `category`, `defaultVisible`, `defaultOrder`)

**Verification:**
- `npm run build`
- `/admin` renders with the same defaults as before

---

### Task 2: Create reusable draft helpers
**Objective:** Stop embedding all draft logic inline in the Astro page.

**Files:**
- Create: `src/lib/admin-draft.ts`
- Modify: `src/pages/admin.astro`

**Implementation notes:**
- Move `pathGet`, `pathSet`, `mergeDeep`, `makePhoneHref` style logic into one shared helper file
- Add `createEmptyDraft`, `readDraft`, `normalizeDraft`, `serializeDraft`
- Include `version` and `updatedAt`

**Verification:**
- `npm run build`
- export JSON from `/admin` includes `version` and `updatedAt`

---

### Task 3: Add link fields to real `/admin`
**Objective:** Match the MVP scope already documented in strategy docs.

**Files:**
- Modify: `src/pages/admin.astro`
- Modify: `src/data/admin-schema.ts`
- Modify: `public/admin/admin-preview.js`
- Modify: `scripts/check-preview-readiness.mjs`

**Implementation notes:**
- Add inputs for `instagram`, `blog`, `place`
- Add preview bindings for any surfaced CTA/anchor targets that should reflect draft changes
- Keep labels Korean-first and non-technical

**Verification:**
- `npm run build`
- `npm run preview:check`
- Browser check: changed external links open the draft-updated targets

---

### Task 4: Add gallery visibility/order management to `/admin`
**Objective:** Deliver the most important missing operator feature without introducing full CMS complexity.

**Files:**
- Modify: `src/pages/admin.astro`
- Modify: `src/data/admin-schema.ts`
- Modify: `src/data/site.ts`
- Modify: `src/pages/gallery.astro`
- Modify: `src/pages/index.astro`
- Modify: `public/admin/admin-preview.js`
- Modify: `scripts/check-preview-readiness.mjs`

**Implementation notes:**
- Render gallery items in admin with `위로`, `아래로`, `숨기기/보이기` controls
- Keep ordering explicit in draft state
- In preview mode, apply gallery visibility/order before rendering bound image list if feasible; if not feasible statically, at least show operator summary and mark as “publish-time only”
- Prefer no drag-and-drop library in MVP; simple move-up/move-down buttons are safer for low-tech users

**Verification:**
- `npm run build`
- `/admin` can reorder gallery items
- hidden items disappear from draft preview or are clearly marked as publish-only behavior

---

### Task 5: Split `/admin` UI into focused components
**Objective:** Make the admin page maintainable before more logic is added.

**Files:**
- Create: `src/components/admin/AdminSection.astro`
- Create: `src/components/admin/AdminTextFields.astro`
- Create: `src/components/admin/AdminImageSlots.astro`
- Create: `src/components/admin/AdminGalleryManager.astro`
- Create: `src/components/admin/AdminActionBar.astro`
- Modify: `src/pages/admin.astro`

**Implementation notes:**
- Keep section headings and explanatory copy in components
- Leave only layout wiring and script bootstrap in `src/pages/admin.astro`
- Do not introduce a framework island unless needed

**Verification:**
- `npm run build`
- no visual regression on `/admin`

---

### Task 6: Add publish-package export mode
**Objective:** Make exported JSON deterministic and ready for manual or future automated import.

**Files:**
- Modify: `src/lib/admin-draft.ts`
- Modify: `src/pages/admin.astro`
- Create: `scripts/import-admin-draft.mjs`
- Modify: `README.md`

**Implementation notes:**
- Keep the existing “draft export” if useful
- Add a second button: `사이트 반영 파일 내보내기`
- Export normalized JSON only with fields that the real site accepts
- Add a CLI importer that:
  1. reads exported JSON
  2. patches `src/data/site-content.json`
  3. patches gallery visibility/order source
  4. prints a summary of changed fields
- This importer is the bridge between browser-only MVP and future server-side save

**Verification:**
- `node scripts/import-admin-draft.mjs --input sample.json --dry-run`
- output lists exact content changes

---

### Task 7: Create one repeatable publish checklist
**Objective:** Reduce operator/helper confusion when moving draft changes to production.

**Files:**
- Create: `docs/admin-publish-checklist.md`
- Modify: `README.md`

**Checklist should include:**
1. export publish file from `/admin`
2. run importer dry-run
3. review diff
4. run `npm run build`
5. run `npm run preview:check`
6. deploy to Vercel
7. verify `/`, `/location`, `/contact`, `/gallery`

**Verification:**
- helper can follow the checklist without reading source code

---

### Task 8: Refresh `/admin-demo` to match the real MVP
**Objective:** Prevent the demo page from becoming stale or misleading.

**Files:**
- Modify: `src/pages/admin-demo.astro`
- Modify: `docs/admin-cms-strategy.md`

**Implementation notes:**
- Show only fields still in MVP scope
- Replace drag-sort language if MVP uses button reorder first
- Mention that deployment/SEO remain hidden

**Verification:**
- `/admin-demo` messaging matches the real `/admin` capability set

---

## Recommended Implementation Order

### Phase A — tighten current prototype
1. Task 1
2. Task 2
3. Task 3

### Phase B — deliver missing operator value
4. Task 4
5. Task 5

### Phase C — bridge to real operations
6. Task 6
7. Task 7
8. Task 8

---

## Acceptance Criteria

The `/admin` MVP is ready when all of the following are true:
- Operator can edit phone, hours, address, home title/body, location body, contact body, external links
- Operator can preview three representative image slots
- Operator can change gallery order and visibility with simple controls
- Preview flow remains available from `/admin`
- Exported publish JSON is normalized and deterministic
- A helper can apply the exported file with one documented CLI import flow
- `npm run build` passes
- `npm run preview:check` passes
- Vercel deployment remains static-only

---

## Non-goals for this phase
- login/auth
- multi-user editing
- DB persistence
- direct file upload to server storage
- one-click publish from browser
- freeform WYSIWYG editing

---

## Recommended next action
Implement **Tasks 1–3 first**. They are small, de-risk the codebase, and establish the stable draft contract needed before gallery management and publish automation.
