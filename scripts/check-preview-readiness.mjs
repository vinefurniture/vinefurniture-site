import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const publicDir = join(root, 'public');
const siteContent = JSON.parse(readFileSync(join(root, 'src/data/site-content.json'), 'utf8'));
const assetManifest = JSON.parse(readFileSync(join(root, 'src/data/vine-asset-manifest.json'), 'utf8'));
const visibleGalleryCount = assetManifest.gallery.filter((asset) => asset.visible !== false).length;
const homeGalleryCount = Math.min(6, visibleGalleryCount);
const homePromoEnabled = siteContent.home?.promo?.enabled !== false;
const homePhoneHrefCount = 2;

const pageChecks = [
  {
    route: '/',
    file: 'index.html',
    titleFragment: '바인퍼니처',
    requiredBindings: [
      { fragment: 'src="/admin/admin-preview.js"', label: 'preview script include' },
      { fragment: 'data-draft-field="home.heroTitle"', label: 'home hero title binding' },
      { fragment: 'data-draft-field="home.heroBody"', label: 'home hero body binding' },
      ...(homePromoEnabled
        ? [
            { fragment: 'data-draft-toggle="homePromo.enabled"', label: 'home promo toggle binding' },
            { fragment: 'data-draft-field="homePromo.eyebrow"', label: 'home promo eyebrow binding' },
            { fragment: 'data-draft-field="homePromo.title"', label: 'home promo title binding' },
            { fragment: 'data-draft-field="homePromo.body"', label: 'home promo body binding' },
          ]
        : []),
      { fragment: 'data-draft-image="heroPrimary"', label: 'home hero image binding' },
      { fragment: 'data-draft-image="storeView"', label: 'home store image binding' },
      { fragment: 'data-draft-gallery-container="home"', label: 'home gallery preview container' },
      { fragment: 'data-draft-gallery-item=', label: 'home gallery preview item', expectedCount: homeGalleryCount },
      { fragment: 'data-draft-href="business.place"', label: 'home place href binding' },
      { fragment: 'data-draft-field="business.address"', label: 'shared address binding', expectedCount: 2 },
      { fragment: 'data-draft-field="business.hours"', label: 'shared hours binding', expectedCount: 2 },
      { fragment: 'data-draft-field="business.phone"', label: 'shared phone text binding', expectedCount: 2 },
      { fragment: 'data-draft-href="business.phoneHref"', label: 'phone CTA href binding', expectedCount: homePhoneHrefCount },
    ],
  },
  {
    route: '/brand',
    file: 'brand/index.html',
    titleFragment: '브랜드 소개 | 바인퍼니처',
    requiredBindings: [{ fragment: 'src="/admin/admin-preview.js"', label: 'preview script include' }],
  },
  {
    route: '/gallery',
    file: 'gallery/index.html',
    titleFragment: '최근 사진 | 바인퍼니처',
    requiredBindings: [
      { fragment: 'src="/admin/admin-preview.js"', label: 'preview script include' },
      { fragment: "window.location.replace('/#recent-feed')", label: 'gallery redirect script' },
      { fragment: 'href="/#recent-feed"', label: 'gallery redirect CTA' },
    ],
  },
  {
    route: '/location',
    file: 'location/index.html',
    titleFragment: '오시는 길 | 바인퍼니처',
    requiredBindings: [
      { fragment: 'src="/admin/admin-preview.js"', label: 'preview script include' },
      { fragment: 'data-draft-field="locationPage.heroBody"', label: 'location hero body binding' },
      { fragment: 'data-draft-image="storeView"', label: 'location store image binding' },
      { fragment: 'data-draft-field="business.address"', label: 'shared address binding' },
      { fragment: 'data-draft-field="business.hours"', label: 'shared hours binding' },
      { fragment: 'data-draft-field="business.phone"', label: 'shared phone text binding' },
      { fragment: 'data-draft-href="business.phoneHref"', label: 'phone CTA href binding', expectedCount: 1 },
      { fragment: 'data-draft-href="business.place"', label: 'location place href binding', expectedCount: 3 },
    ],
  },
  {
    route: '/contact',
    file: 'contact/index.html',
    titleFragment: '문의 | 바인퍼니처',
    requiredBindings: [
      { fragment: 'src="/admin/admin-preview.js"', label: 'preview script include' },
      { fragment: 'data-draft-field="contactPage.heroBody"', label: 'contact hero body binding' },
      { fragment: 'data-draft-image="heroSecondary"', label: 'contact hero image binding' },
      { fragment: 'data-draft-field="business.address"', label: 'shared address binding' },
      { fragment: 'data-draft-field="business.hours"', label: 'shared hours binding' },
      { fragment: 'data-draft-field="business.phone"', label: 'shared phone text binding', expectedCount: 2 },
      { fragment: 'data-draft-href="business.phoneHref"', label: 'phone CTA href binding', expectedCount: 1 },
      { fragment: 'data-draft-href="business.instagram"', label: 'contact instagram href binding', expectedCount: 2 },
      { fragment: 'data-draft-href="business.blog"', label: 'contact blog href binding', expectedCount: 2 },
    ],
  },
  {
    route: '/admin-guide',
    file: 'admin-guide/index.html',
    titleFragment: '관리자 빠른 안내 | 바인퍼니처',
    requiredBindings: [{ fragment: 'src="/admin/admin-preview.js"', label: 'preview script include' }],
  },
];

const assetChecks = [
  'favicon.svg',
  'favicon.ico',
  'apple-touch-icon.svg',
  'site.webmanifest',
  'images/og/vine-og-default.svg',
  'admin/admin-preview.js',
];

const requiredMetaFragments = [
  'rel="canonical"',
  'name="description"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'name="twitter:card"',
  'name="twitter:image"',
  'rel="apple-touch-icon"',
];

const previewScriptChecks = [
  { fragment: 'setText(\'[data-draft-field="business.phone"]\'', label: 'business.phone text update' },
  { fragment: 'setText(\'[data-draft-field="business.hours"]\'', label: 'business.hours text update' },
  { fragment: 'setText(\'[data-draft-field="business.address"]\'', label: 'business.address text update' },
  { fragment: 'setHref(\'[data-draft-href="business.phoneHref"]\'', label: 'business.phoneHref href update' },
  { fragment: 'setHref(\'[data-draft-href="business.instagram"]\'', label: 'business.instagram href update' },
  { fragment: 'setHref(\'[data-draft-href="business.blog"]\'', label: 'business.blog href update' },
  { fragment: 'setHref(\'[data-draft-href="business.place"]\'', label: 'business.place href update' },
  { fragment: 'setText(\'[data-draft-field="home.heroTitle"]\'', label: 'home.heroTitle text update' },
  { fragment: 'setHtml(\'[data-draft-field="home.heroBody"]\'', label: 'home.heroBody html update' },
  { fragment: 'setToggle(\'[data-draft-toggle="homePromo.enabled"]\'', label: 'homePromo.enabled toggle update' },
  { fragment: 'setText(\'[data-draft-field="homePromo.eyebrow"]\'', label: 'homePromo.eyebrow text update' },
  { fragment: 'setText(\'[data-draft-field="homePromo.title"]\'', label: 'homePromo.title text update' },
  { fragment: 'setHtml(\'[data-draft-field="homePromo.body"]\'', label: 'homePromo.body html update' },
  { fragment: 'setText(\'[data-draft-field="locationPage.heroBody"]\'', label: 'locationPage.heroBody text update' },
  { fragment: 'setText(\'[data-draft-field="contactPage.heroBody"]\'', label: 'contactPage.heroBody text update' },
  { fragment: 'setImage(\'[data-draft-image="heroPrimary"]\'', label: 'heroPrimary image update' },
  { fragment: 'setImage(\'[data-draft-image="heroSecondary"]\'', label: 'heroSecondary image update' },
  { fragment: 'setImage(\'[data-draft-image="storeView"]\'', label: 'storeView image update' },
  { fragment: 'const DRAFT_KEY = \'vine-admin-draft-v2\'' , label: 'new admin draft storage key' },
  { fragment: 'const applyGallery = (draft) => {', label: 'gallery preview application' },
];

const countOccurrences = (source, fragment) => source.split(fragment).length - 1;

let hasError = false;

console.log('Vine preview readiness check');

for (const asset of assetChecks) {
  const ok = existsSync(join(publicDir, asset));
  console.log(`${ok ? '[OK]' : '[MISSING]'} asset ${asset}`);
  if (!ok) hasError = true;
}

const previewScriptPath = join(publicDir, 'admin/admin-preview.js');
if (existsSync(previewScriptPath)) {
  const previewScript = readFileSync(previewScriptPath, 'utf8');
  const scriptIssues = [];

  for (const check of previewScriptChecks) {
    if (!previewScript.includes(check.fragment)) {
      scriptIssues.push(`missing preview script binding for ${check.label}`);
    }
  }

  if (scriptIssues.length > 0) {
    console.log('[WARN] public/admin/admin-preview.js');
    for (const issue of scriptIssues) console.log(`  - ${issue}`);
    hasError = true;
  } else {
    console.log('[OK] preview script binding coverage');
  }
}

for (const page of pageChecks) {
  const target = join(dist, page.file);
  if (!existsSync(target)) {
    console.log(`[MISSING] route ${page.route} -> dist/${page.file}`);
    hasError = true;
    continue;
  }

  const html = readFileSync(target, 'utf8');
  const pageErrors = [];
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const titleText = titleMatch?.[1] ?? '';

  if (!titleText.includes(page.titleFragment)) {
    pageErrors.push(`title mismatch (expected fragment ${page.titleFragment})`);
  }

  for (const fragment of requiredMetaFragments) {
    if (!html.includes(fragment)) {
      pageErrors.push(`missing ${fragment}`);
    }
  }

  for (const binding of page.requiredBindings ?? []) {
    const count = countOccurrences(html, binding.fragment);
    if (binding.expectedCount != null) {
      if (count !== binding.expectedCount) {
        pageErrors.push(`${binding.label} expected ${binding.expectedCount} occurrence(s), found ${count}`);
      }
      continue;
    }

    if (count < 1) {
      pageErrors.push(`missing ${binding.label}`);
    }
  }

  if (pageErrors.length > 0) {
    console.log(`[WARN] route ${page.route}`);
    for (const issue of pageErrors) console.log(`  - ${issue}`);
    hasError = true;
  } else {
    console.log(`[OK] route ${page.route} metadata + preview bindings`);
  }
}

if (hasError) {
  process.exitCode = 1;
} else {
  console.log('All preview-readiness checks passed.');
}
