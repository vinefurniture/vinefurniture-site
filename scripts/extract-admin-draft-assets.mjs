#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import manifest from '../src/data/vine-asset-manifest.json' with { type: 'json' };

const [, , inputArg, ...restArgs] = process.argv;
const shouldWrite = restArgs.includes('--write');
const publishOutputArg = restArgs.find((arg) => arg.startsWith('--publish-output='));

if (!inputArg) {
  console.error('Usage: node scripts/extract-admin-draft-assets.mjs <path-to-vine-admin-draft.json> [--write] [--publish-output=path]');
  process.exit(1);
}

const inputPath = resolve(process.cwd(), inputArg);
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));

const defaultPublishOutput = (() => {
  const inputName = basename(inputPath);
  if (/draft/i.test(inputName)) {
    return resolve(dirname(inputPath), inputName.replace(/draft/i, 'publish'));
  }

  const extension = extname(inputName);
  const stem = extension ? inputName.slice(0, -extension.length) : inputName;
  return resolve(dirname(inputPath), `${stem}.publish${extension || '.json'}`);
})();

const publishOutputPath = publishOutputArg
  ? resolve(process.cwd(), publishOutputArg.split('=')[1])
  : defaultPublishOutput;

const mimeToLabel = (mimeType) => {
  if (!mimeType) return 'unknown';
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/svg+xml') return 'svg';
  return mimeType;
};

const parseDataUrl = (value) => {
  const match = String(value).match(/^data:([^;,]+)?((?:;[^,]+)*?),(.*)$/s);
  if (!match) {
    throw new Error('invalid data URL');
  }

  const [, mimeType = 'application/octet-stream', meta = '', rawPayload = ''] = match;
  const isBase64 = meta.includes(';base64');
  const payload = isBase64 ? rawPayload.replace(/\s+/g, '') : decodeURIComponent(rawPayload);
  const buffer = isBase64 ? Buffer.from(payload, 'base64') : Buffer.from(payload, 'utf8');

  return {
    mimeType,
    bytes: buffer.byteLength,
    buffer,
  };
};

const draft = readJson(inputPath);
if (!draft?.assetSlots || typeof draft.assetSlots !== 'object') {
  console.error('[ERROR] draft file must include assetSlots');
  process.exit(1);
}

const publishPayload = clone(draft);
const selectedAssets = manifest.selected.filter((item) => item.key in draft.assetSlots);
const extractionResults = [];
const warnings = [];

for (const asset of selectedAssets) {
  const value = draft.assetSlots[asset.key];
  if (typeof value !== 'string' || !value) continue;

  if (!value.startsWith('data:')) {
    if (value.startsWith('/')) {
      publishPayload.assetSlots[asset.key] = value;
    }
    continue;
  }

  let parsed;
  try {
    parsed = parseDataUrl(value);
  } catch (error) {
    warnings.push(`${asset.key}: data URL 파싱 실패 (${error instanceof Error ? error.message : String(error)})`);
    continue;
  }

  if (!parsed.mimeType.startsWith('image/')) {
    warnings.push(`${asset.key}: image/* 타입이 아닙니다 (${parsed.mimeType})`);
    continue;
  }

  const outputPath = resolve(process.cwd(), 'public', asset.plannedSrc.replace(/^\//, ''));
  extractionResults.push({
    key: asset.key,
    title: asset.title,
    mimeType: parsed.mimeType,
    mimeLabel: mimeToLabel(parsed.mimeType),
    bytes: parsed.bytes,
    outputPath,
    plannedSrc: asset.plannedSrc,
  });

  if (shouldWrite) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, parsed.buffer);
  }

  publishPayload.assetSlots[asset.key] = asset.plannedSrc;
}

publishPayload.localOnlyAssetSlots = Object.entries(publishPayload.assetSlots)
  .filter(([, value]) => typeof value === 'string' && value.startsWith('data:'))
  .map(([key]) => key);

const summary = {
  inputPath,
  mode: shouldWrite ? 'write' : 'dry-run',
  extractedCount: extractionResults.length,
  extractedAssets: extractionResults.map((item) => ({
    key: item.key,
    title: item.title,
    target: item.plannedSrc,
    mimeType: item.mimeType,
    bytes: item.bytes,
  })),
  publishOutputPath,
  remainingLocalOnlyAssetSlots: publishPayload.localOnlyAssetSlots,
  warnings,
};

console.log(JSON.stringify(summary, null, 2));

if (!shouldWrite) {
  console.log('\n[INFO] Dry run only. Add --write to write extracted images into public/images/vine/... and create a publish JSON.');
  process.exit(0);
}

mkdirSync(dirname(publishOutputPath), { recursive: true });
writeFileSync(publishOutputPath, JSON.stringify(publishPayload, null, 2) + '\n');
console.log(`\n[OK] Wrote publish payload to ${publishOutputPath}`);
if (extractionResults.length) {
  console.log('[OK] Extracted representative images into their planned public/images/vine/... paths');
} else {
  console.log('[INFO] No browser-local representative images were found in this draft file');
}
if (publishPayload.localOnlyAssetSlots.length) {
  console.log(`[WARN] Remaining local-only slots: ${publishPayload.localOnlyAssetSlots.join(', ')}`);
}
console.log(`[NEXT] Validate with: npm run admin:validate -- ${publishOutputPath}`);
