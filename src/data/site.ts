import { existsSync } from 'node:fs';
import { join } from 'node:path';
import siteContent from './site-content.json';
import assetManifest from './vine-asset-manifest.json';

type AssetSeed = {
  key: string;
  slot: string;
  title: string;
  src: string;
  plannedSrc: string;
  alt: string;
  source: string;
  category?: string;
};

type AssetItem = Omit<AssetSeed, 'slot'> & {
  isRealAsset: boolean;
  activeSource: string;
};

const resolvePublicPath = (webPath: string) => join(process.cwd(), 'public', webPath.replace(/^\//, ''));
const hasRealAsset = (plannedSrc: string) => existsSync(resolvePublicPath(plannedSrc));

const stageAsset = ({ slot: _slot, ...item }: AssetSeed): AssetItem => {
  const isRealAsset = hasRealAsset(item.plannedSrc);

  return {
    ...item,
    src: isRealAsset ? item.plannedSrc : item.src,
    isRealAsset,
    activeSource: isRealAsset ? '실제 자산 자동 연결됨' : item.source,
  };
};

const selectedAssetEntries = assetManifest.selected.map((item) => [item.key, stageAsset(item)] as const);

export const siteMeta = {
  ...siteContent.meta,
  ...siteContent.business,
};

export const navigationItems = siteContent.navigation;

export const pageContent = {
  home: siteContent.home,
  brand: siteContent.brand,
  gallery: siteContent.galleryPage,
  location: siteContent.locationPage,
  contact: siteContent.contactPage,
};

export const selectedAssets: Record<string, AssetItem> = Object.fromEntries(selectedAssetEntries);

export const galleryAssets: AssetItem[] = assetManifest.gallery.map(stageAsset);

export const assetInventory = {
  selected: Object.entries(selectedAssets).map(([key, asset]) => ({ key, ...asset })),
  gallery: galleryAssets,
};
