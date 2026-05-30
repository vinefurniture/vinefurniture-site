import { getVineAssetStatus } from './vine-asset-tools.mjs';

const { found, missing } = getVineAssetStatus();

console.log('Vine asset readiness');
console.log(`- found: ${found.length}`);
console.log(`- missing: ${missing.length}`);
console.log('');

if (found.length) {
  console.log('[FOUND]');
  for (const asset of found) {
    console.log(`- ${asset.plannedSrc} (${asset.title})`);
  }
  console.log('');
}

if (missing.length) {
  console.log('[MISSING]');
  for (const asset of missing) {
    console.log(`- ${asset.plannedSrc} (${asset.title})`);
  }
  console.log('');
}

if (missing.length > 0) {
  process.exitCode = 1;
}
