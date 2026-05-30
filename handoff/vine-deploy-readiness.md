# Vine Furniture deploy readiness

Updated: 2026-05-30 13:47:06 KST

## Current status
- Astro static site build: ready
- Vercel config: ready (`vercel.json` uses `framework: astro`, `buildCommand: npm run build`, `outputDirectory: dist`)
- Real image assets: ready (`12 / 12` found)
- Gallery/content polish: completed
- Local preview/browser QA: completed

## What changed in this pass
1. Customer-facing copy cleanup
   - Removed internal-sounding phrases like `1차`, `우선 선택안`, `보조 이미지`
   - Updated home/gallery/location copy to read like a live marketing site
2. Gallery page polish
   - Added summary cards
   - Added category chips
   - Added bottom CTA panel for call/location conversion
3. Visit/contact polish
   - Refined overlay labels to short customer-facing captions
   - Replaced stale location note with first-visit guidance
4. Documentation refresh
   - Updated `README.md`
   - Updated `public/images/vine/README.md`
   - Refreshed generated handoff asset reports

## Verification run
### Commands
```bash
npm run build
npm run assets:check
npm run preview:check
```

### Results
- `npm run build` ✅
- `npm run assets:check` ✅
  - found: 12
  - missing: 0
- `npm run preview:check` ✅
  - All preview-readiness checks passed.

## Visual QA notes
- Home hero now uses a shorter, natural overlay caption
- Gallery page now has better context before the image grid and a clear CTA after it
- Footer/header/logo render correctly with real logo asset
- Real showroom, sofa, table, and storefront images are visible in local browser preview

## Key files touched in this pass
- `src/data/site-content.json`
- `src/pages/gallery.astro`
- `src/pages/index.astro`
- `src/pages/brand.astro`
- `src/pages/location.astro`
- `src/pages/contact.astro`
- `src/styles/global.scss`
- `README.md`
- `public/images/vine/README.md`

## Handoff files
- `handoff/vine-assets.json`
- `handoff/vine-assets.md`
- `handoff/vine-asset-intake.csv`
- `handoff/vine-asset-intake.md`
- `handoff/vine-legacy-asset-import.md`
- `handoff/vine-deploy-readiness.md`

## Recommended next step
1. Commit the current repo state
2. Push to GitHub
3. Import/deploy on Vercel
4. Check Preview URL on desktop + mobile
5. Connect/customize production domain `vinefurniture.kr`

## Not done yet
- No Vercel deployment was executed in this pass
- No production-domain DNS change was executed in this pass
