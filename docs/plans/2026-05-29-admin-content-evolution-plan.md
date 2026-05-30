# Vine Furniture Admin-Friendly Content Evolution Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Make the current Astro brochure site easier to maintain by moving editable content into a centralized data layer and designing a low-risk admin experience for a low-tech operator.

**Architecture:** Keep the public site static and fast, centralize copy in a human-readable JSON file, keep image slots explicit in a TypeScript mapping layer, and design a future `/admin` around a small set of safe editable fields rather than full-page freeform editing.

**Tech Stack:** Astro, SCSS, JSON content file, TypeScript mapping layer, Vercel static deployment.

---

### Task 1: Centralize public copy into one JSON file
**Objective:** Move page copy into a single admin-friendly source.

**Files:**
- Create: `src/data/site-content.json`
- Modify: `src/data/site.ts`

**Verification:**
- Build succeeds
- Pages render identical or better copy from JSON-backed exports

### Task 2: Replace generic placeholders with demo showroom visuals
**Objective:** Make the draft feel more realistic while preserving later swap-in rules.

**Files:**
- Create: `public/images/vine-demo/*.svg`
- Modify: `src/data/site.ts`

**Verification:**
- Home, brand, gallery, location, contact pages show demo visuals
- `plannedSrc` still points to final real-asset paths

### Task 3: Update pages to consume centralized content
**Objective:** Ensure future admin integration only changes one content source.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/brand.astro`
- Modify: `src/pages/gallery.astro`
- Modify: `src/pages/location.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/components/Header.astro`

**Verification:**
- Build succeeds
- Titles, descriptions, and CTA copy still render correctly

### Task 4: Add an admin UX prototype
**Objective:** Show what a low-tech-friendly management screen should feel like before building real save/auth flows.

**Files:**
- Create: `src/pages/admin-demo.astro`
- Create: `docs/admin-cms-strategy.md`

**Verification:**
- `/admin-demo` loads
- Strategy doc clearly separates safe editable fields from developer-only fields

### Task 5: Validate and document next backend decision
**Objective:** Leave the project ready for real admin implementation.

**Files:**
- Create/update docs as needed after validation

**Verification:**
- `npm run build` succeeds
- Preview routes and meta assets respond successfully
- Next implementation decision is explicit: custom simplified admin > full generic CMS
