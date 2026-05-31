#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , inputArg, ...restArgs] = process.argv;
const shouldWrite = restArgs.includes('--write');

if (!inputArg) {
  console.error('Usage: node scripts/import-admin-publish.mjs <path-to-vine-admin-publish.json> [--write]');
  process.exit(1);
}

const inputPath = resolve(process.cwd(), inputArg);
const siteContentPath = resolve(process.cwd(), 'src/data/site-content.json');
const manifestPath = resolve(process.cwd(), 'src/data/vine-asset-manifest.json');

if (!existsSync(inputPath)) {
  console.error(`[ERROR] publish file not found: ${inputPath}`);
  process.exit(1);
}

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));
const makePhoneHref = (phone) => `tel:${String(phone ?? '').replace(/[^0-9+]/g, '')}`;

const payload = readJson(inputPath);
const siteContent = readJson(siteContentPath);
const manifest = readJson(manifestPath);

if (!payload?.business || !payload?.home || !payload?.locationPage || !payload?.contactPage || !Array.isArray(payload?.gallery)) {
  console.error('[ERROR] invalid publish payload structure');
  process.exit(1);
}

const nextSiteContent = clone(siteContent);
const nextManifest = clone(manifest);
const phoneHref = makePhoneHref(payload.business.phone);

nextSiteContent.business.phone = payload.business.phone;
nextSiteContent.business.phoneHref = phoneHref;
nextSiteContent.business.address = payload.business.address;
nextSiteContent.business.hours = payload.business.hours;
nextSiteContent.business.instagram = payload.business.instagram;
nextSiteContent.business.blog = payload.business.blog;
nextSiteContent.business.place = payload.business.place;

nextSiteContent.home.heroTitle = payload.home.heroTitle;
nextSiteContent.home.heroBody = payload.home.heroBody;
nextSiteContent.home.heroPrimaryCtaHref = phoneHref;
nextSiteContent.home.visitSecondaryCtaHref = payload.business.place;

nextSiteContent.locationPage.heroBody = payload.locationPage.heroBody;
nextSiteContent.locationPage.primaryCtaHref = payload.business.place;
nextSiteContent.locationPage.secondaryCtaHref = phoneHref;
nextSiteContent.locationPage.notes[0].body = `${payload.business.address}\n${payload.business.hours}\n${payload.business.phone}`;

nextSiteContent.contactPage.heroBody = payload.contactPage.heroBody;
nextSiteContent.contactPage.primaryCtaHref = phoneHref;
nextSiteContent.contactPage.secondaryCtaHref = payload.business.instagram;
nextSiteContent.contactPage.cards[0].body = payload.business.phone;

const galleryMap = new Map(payload.gallery.map((item, index) => [item.key, { visible: item.visible !== false, order: index + 1 }]));
nextManifest.gallery = nextManifest.gallery
  .map((item, index) => {
    const incoming = galleryMap.get(item.key);
    return {
      ...item,
      visible: incoming?.visible ?? item.visible ?? true,
      order: incoming?.order ?? item.order ?? index + 1,
    };
  })
  .sort((a, b) => a.order - b.order || String(a.key).localeCompare(String(b.key), 'ko-KR'))
  .map((item, index) => ({ ...item, order: index + 1 }));

const slotWarnings = [];
for (const item of nextManifest.selected) {
  const nextValue = payload.assetSlots?.[item.key];
  if (!nextValue || typeof nextValue !== 'string') continue;
  if (nextValue.startsWith('data:')) {
    slotWarnings.push(`${item.key}: 브라우저 임시 업로드(data URL)는 자동 반영하지 않았습니다.`);
    continue;
  }
  if (nextValue.startsWith('/')) {
    item.src = nextValue;
    item.plannedSrc = nextValue;
    item.source = 'admin publish import';
  }
}

const summary = {
  inputPath,
  mode: shouldWrite ? 'write' : 'dry-run',
  business: {
    phone: nextSiteContent.business.phone,
    address: nextSiteContent.business.address,
    hours: nextSiteContent.business.hours,
  },
  links: {
    instagram: nextSiteContent.business.instagram,
    blog: nextSiteContent.business.blog,
    place: nextSiteContent.business.place,
  },
  copy: {
    homeHeroTitle: nextSiteContent.home.heroTitle,
    locationHeroBody: nextSiteContent.locationPage.heroBody,
    contactHeroBody: nextSiteContent.contactPage.heroBody,
  },
  galleryVisibleCount: nextManifest.gallery.filter((item) => item.visible !== false).length,
  galleryOrder: nextManifest.gallery.map((item) => `${item.order}. ${item.key}${item.visible === false ? ' (hidden)' : ''}`),
  representativeImageWarnings: slotWarnings,
  payloadLocalOnlyAssetSlots: payload.localOnlyAssetSlots ?? [],
};

console.log(JSON.stringify(summary, null, 2));

if (!shouldWrite) {
  console.log('\n[INFO] Dry run only. Add --write to update src/data/site-content.json and src/data/vine-asset-manifest.json.');
  process.exit(0);
}

writeFileSync(siteContentPath, JSON.stringify(nextSiteContent, null, 2) + '\n');
writeFileSync(manifestPath, JSON.stringify(nextManifest, null, 2) + '\n');
console.log('\n[OK] Applied publish payload to site-content.json and vine-asset-manifest.json');
