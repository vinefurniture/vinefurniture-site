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
  visible?: boolean;
  order?: number;
};

type AssetItem = Omit<AssetSeed, 'slot'> & {
  isRealAsset: boolean;
  activeSource: string;
  visible: boolean;
  order: number;
};

const resolvePublicPath = (webPath: string) => join(process.cwd(), 'public', webPath.replace(/^\//, ''));
const hasRealAsset = (plannedSrc: string) => existsSync(resolvePublicPath(plannedSrc));

const stageAsset = ({ slot: _slot, ...item }: AssetSeed, fallbackOrder = 999): AssetItem => {
  const isRealAsset = hasRealAsset(item.plannedSrc);

  return {
    ...item,
    src: isRealAsset ? item.plannedSrc : item.src,
    isRealAsset,
    activeSource: isRealAsset ? '실제 자산 자동 연결됨' : item.source,
    visible: item.visible ?? true,
    order: item.order ?? fallbackOrder,
  };
};

const selectedAssetEntries = assetManifest.selected.map((item, index) => [item.key, stageAsset(item, index + 1)] as const);
const galleryAssetInventory = assetManifest.gallery
  .map((item, index) => stageAsset(item, index + 1))
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'ko-KR'));

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
export const galleryAssets: AssetItem[] = galleryAssetInventory.filter((asset) => asset.visible);

export const assetInventory = {
  selected: Object.values(selectedAssets),
  gallery: galleryAssetInventory,
};
