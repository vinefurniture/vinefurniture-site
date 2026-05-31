#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , inputArg] = process.argv;

if (!inputArg) {
  console.error('Usage: node scripts/check-admin-publish-payload.mjs <path-to-vine-admin-publish.json>');
  process.exit(1);
}

const inputPath = resolve(process.cwd(), inputArg);
if (!existsSync(inputPath)) {
  console.error(`[ERROR] publish file not found: ${inputPath}`);
  process.exit(1);
}

const payload = JSON.parse(readFileSync(inputPath, 'utf8'));
const errors = [];
const warnings = [];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isHttpsUrl = (value) => /^https:\/\//.test(String(value ?? '').trim());
const phoneDigits = String(payload?.business?.phone ?? '').replace(/[^0-9+]/g, '');

if (!payload?.business || !payload?.home || !payload?.locationPage || !payload?.contactPage || !Array.isArray(payload?.gallery)) {
  errors.push('필수 구조(business/home/locationPage/contactPage/gallery)가 부족합니다.');
}

const requiredStringFields = [
  ['business.phone', payload?.business?.phone],
  ['business.address', payload?.business?.address],
  ['business.hours', payload?.business?.hours],
  ['business.instagram', payload?.business?.instagram],
  ['business.blog', payload?.business?.blog],
  ['business.place', payload?.business?.place],
  ['home.heroTitle', payload?.home?.heroTitle],
  ['home.heroBody', payload?.home?.heroBody],
  ['locationPage.heroBody', payload?.locationPage?.heroBody],
  ['contactPage.heroBody', payload?.contactPage?.heroBody],
];

for (const [label, value] of requiredStringFields) {
  if (!isNonEmptyString(value)) errors.push(`${label} 값이 비어 있습니다.`);
}

if (phoneDigits.length < 9) {
  errors.push('business.phone 형식이 올바르지 않습니다.');
}

for (const [label, value] of [
  ['business.instagram', payload?.business?.instagram],
  ['business.blog', payload?.business?.blog],
  ['business.place', payload?.business?.place],
]) {
  if (isNonEmptyString(value) && !isHttpsUrl(value)) {
    errors.push(`${label} 는 https:// 로 시작해야 합니다.`);
  }
}

const assetSlots = payload?.assetSlots && typeof payload.assetSlots === 'object' ? payload.assetSlots : {};
const localOnlySlots = Object.entries(assetSlots)
  .filter(([, value]) => typeof value === 'string' && value.startsWith('data:'))
  .map(([key]) => key);

if (localOnlySlots.length > 0) {
  errors.push(`브라우저 임시 업로드가 남아 있습니다: ${localOnlySlots.join(', ')}`);
}

if (Array.isArray(payload?.localOnlyAssetSlots) && payload.localOnlyAssetSlots.length > 0) {
  errors.push(`payload.localOnlyAssetSlots 가 비어 있지 않습니다: ${payload.localOnlyAssetSlots.join(', ')}`);
}

const galleryKeys = new Set();
for (const item of payload?.gallery ?? []) {
  if (!isNonEmptyString(item?.key)) {
    errors.push('gallery 항목 중 key가 비어 있는 값이 있습니다.');
    continue;
  }
  if (galleryKeys.has(item.key)) {
    errors.push(`gallery key 중복: ${item.key}`);
  }
  galleryKeys.add(item.key);
  if (typeof item.visible !== 'boolean') {
    warnings.push(`gallery.${item.key}.visible 값이 boolean이 아닙니다. import 시 기본 처리될 수 있습니다.`);
  }
}

const summary = {
  inputPath,
  phone: payload?.business?.phone ?? '',
  linkChecks: {
    instagram: payload?.business?.instagram ?? '',
    blog: payload?.business?.blog ?? '',
    place: payload?.business?.place ?? '',
  },
  galleryCount: Array.isArray(payload?.gallery) ? payload.gallery.length : 0,
  localOnlySlots,
  errors,
  warnings,
};

console.log(JSON.stringify(summary, null, 2));

if (errors.length > 0) {
  console.log('\n[ERROR] publish payload 검증 실패');
  console.log('[HINT] 사진을 올린 경우 먼저 npm run admin:extract-assets -- ./vine-admin-draft.json --write 를 실행해 publish JSON을 다시 만들어주세요.');
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('\n[WARN] 경고가 있습니다. 내용을 확인한 뒤 import 하세요.');
} else {
  console.log('\n[OK] publish payload 검증 통과');
}
