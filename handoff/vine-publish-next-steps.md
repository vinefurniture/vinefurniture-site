# Vine Furniture publish next steps

Updated: 2026-05-30 KST

## Current completed state
- Local git repo initialized
- Branch: `main`
- Initial commit created: `123b6a1 feat: initialize Vine Furniture Astro marketing site`
- Real assets connected: `12/12`
- Verification passed:
  - `npm run build`
  - `npm run assets:check`
  - `npm run preview:check`

## Chosen defaults
- Suggested GitHub repo name: `vinefurniture-site`
- Local git author:
  - `바인퍼니처`
  - `vinef3488@gmail.com`

## Blockers
Publishing cannot proceed from this machine yet because:
1. No GitHub auth is configured here
2. No Vercel auth is configured here

## Fastest path to finish
### A. GitHub
Create an empty GitHub repository named `vinefurniture-site`, then run:

```bash
cd /home/hansa/vinefurniture-site
git remote add origin https://github.com/<USERNAME>/vinefurniture-site.git
git push -u origin main
```

### B. Vercel
After logging in to Vercel on this machine, run:

```bash
cd /home/hansa/vinefurniture-site
npx vercel
npx vercel --prod
```

## If using tokens instead of interactive login
### GitHub
```bash
export GITHUB_TOKEN="<YOUR_GITHUB_TOKEN>"
```

### Vercel
```bash
export VERCEL_TOKEN="<YOUR_VERCEL_TOKEN>"
```

Then repo creation / deploy can be automated.

## Notes
- `vercel.json` is already ready for static Astro deployment.
- Default production domain target remains `vinefurniture.kr`.
- No additional code changes are currently required before publish.
