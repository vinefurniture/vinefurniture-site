import { existsSync } from 'node:fs';
import { join } from 'node:path';
import manifest from '../src/data/vine-asset-manifest.json' with { type: 'json' };

const publicDir = join(process.cwd(), 'public');

const categories = [
  ['selected', manifest.selected],
  ['gallery', manifest.gallery],
];

export const vineAssetManifest = manifest;

export const flattenVineAssets = () =>
  categories.flatMap(([group, items]) =>
    items.map((item) => ({
      ...item,
      group,
      absolutePath: join(publicDir, item.plannedSrc.replace(/^\//, '')),
    })),
  );

export const getVineAssetStatus = () => {
  const assets = flattenVineAssets().map((asset) => ({
    ...asset,
    exists: existsSync(asset.absolutePath),
  }));

  for (const asset of assets) {
    asset.activeSrc = asset.exists ? asset.plannedSrc : asset.src;
  }

  const found = assets.filter((asset) => asset.exists);
  const missing = assets.filter((asset) => !asset.exists);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: assets.length,
      found: found.length,
      missing: missing.length,
      completionRatio: assets.length ? Number((found.length / assets.length).toFixed(4)) : 0,
    },
    assets,
    found,
    missing,
  };
};
