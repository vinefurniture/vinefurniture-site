import { assetInventory, pageContent, selectedAssets, siteMeta } from './site';
import type { AdminDraft, AdminGalleryDraftItem } from '../lib/admin-draft';

export const adminDraftVersion = 1;
export const adminDraftStorageKey = 'vine-admin-draft-v2';

export type AdminFieldDef = {
  name: string;
  label: string;
  hint?: string;
  rows?: number;
  type?: 'text' | 'textarea' | 'url' | 'checkbox';
  inputmode?: string;
};

export type AdminImageSlotDef = {
  key: keyof AdminDraft['assetSlots'];
  label: string;
  hint: string;
  src: string;
  alt: string;
  plannedSrc: string;
};

export type AdminGalleryItemDef = AdminGalleryDraftItem & {
  title: string;
  category: string;
  src: string;
  alt: string;
};

export const adminBusinessFields: AdminFieldDef[] = [
  { name: 'business.phone', label: '대표 전화', hint: '예: 031-312-1051', inputmode: 'tel' },
  { name: 'business.hours', label: '운영시간', hint: '예: 매일 10:00~19:00' },
  { name: 'business.address', label: '주소', hint: '지번/건물층까지 한 줄로 적어주세요.' },
];

export const adminLinkFields: AdminFieldDef[] = [
  { name: 'business.instagram', label: '인스타그램 링크', hint: '예: https://www.instagram.com/vinefurniture/', type: 'url', inputmode: 'url' },
  { name: 'business.blog', label: '네이버 블로그 링크', hint: '예: https://blog.naver.com/...', type: 'url', inputmode: 'url' },
  { name: 'business.place', label: '네이버 플레이스 링크', hint: '예: https://naver.me/...', type: 'url', inputmode: 'url' },
];

export const adminCopyFields: AdminFieldDef[] = [
  { name: 'home.heroTitle', label: '메인 제목', rows: 3, type: 'textarea', hint: '너무 길지 않게 한 문장으로 적는 것이 좋습니다.' },
  { name: 'home.heroBody', label: '메인 소개문', rows: 5, type: 'textarea', hint: '매장 강점과 방문 유도를 짧게 적어주세요.' },
  { name: 'locationPage.heroBody', label: '오시는 길 소개문', rows: 4, type: 'textarea' },
  { name: 'contactPage.heroBody', label: '문의 페이지 소개문', rows: 4, type: 'textarea' },
];

export const adminPromoFields: AdminFieldDef[] = [
  { name: 'homePromo.enabled', label: '홈에서 방문 안내 보이기', type: 'checkbox', hint: '체크를 끄면 메인 페이지에서 방문 안내가 숨겨집니다.' },
  { name: 'homePromo.eyebrow', label: '작은 제목', hint: '예: 방문 안내' },
  { name: 'homePromo.title', label: '방문 안내 제목', rows: 3, type: 'textarea', hint: '짧고 바로 이해되는 문장으로 적어주세요.' },
  { name: 'homePromo.body', label: '방문 안내문', rows: 4, type: 'textarea', hint: '방문 유도나 상담 안내를 짧게 적어주세요.' },
  { name: 'homePromo.benefit', label: '방문 혜택 문구', rows: 3, type: 'textarea', hint: '예: 견적서 지참 시 혜택처럼 조건을 정확히 적어주세요.' },
  { name: 'homePromo.disclaimer', label: '혜택 확인 안내', rows: 3, type: 'textarea', hint: '방문 전 확인, 재고, 종료 가능성 등 오해 방지 문구입니다.' },
];

export const adminImageSlots: AdminImageSlotDef[] = [
  {
    key: 'heroPrimary',
    label: '메인 대표 사진',
    hint: '첫 화면 가장 큰 사진',
    src: selectedAssets.heroPrimary.src,
    alt: selectedAssets.heroPrimary.alt,
    plannedSrc: selectedAssets.heroPrimary.plannedSrc,
  },
  {
    key: 'storeView',
    label: '매장 전경 사진',
    hint: '브랜드 소개 / 오시는 길에 사용',
    src: selectedAssets.storeView.src,
    alt: selectedAssets.storeView.alt,
    plannedSrc: selectedAssets.storeView.plannedSrc,
  },
  {
    key: 'heroSecondary',
    label: '문의 보조 사진',
    hint: '문의 페이지에 들어가는 사진',
    src: selectedAssets.heroSecondary.src,
    alt: selectedAssets.heroSecondary.alt,
    plannedSrc: selectedAssets.heroSecondary.plannedSrc,
  },
];

export const adminGalleryItems: AdminGalleryItemDef[] = assetInventory.gallery.map((asset, index) => ({
  key: asset.key,
  title: asset.title,
  category: asset.category ?? '기타',
  src: asset.src,
  alt: asset.alt,
  visible: asset.visible,
  order: asset.order ?? index + 1,
}));

export const adminDefaults: AdminDraft = {
  version: adminDraftVersion,
  updatedAt: '',
  business: {
    phone: siteMeta.phone,
    phoneHref: siteMeta.phoneHref,
    address: siteMeta.address,
    hours: siteMeta.hours,
    instagram: siteMeta.instagram,
    blog: siteMeta.blog,
    place: siteMeta.place,
  },
  home: {
    heroTitle: pageContent.home.heroTitle,
    heroBody: pageContent.home.heroBody,
  },
  homePromo: {
    enabled: pageContent.home.promo?.enabled !== false,
    eyebrow: pageContent.home.promo?.eyebrow ?? '방문 안내',
    title: pageContent.home.promo?.title ?? '',
    body: pageContent.home.promo?.body ?? '',
    benefit: pageContent.home.promo?.benefit ?? '',
    disclaimer: pageContent.home.promo?.disclaimer ?? '',
  },
  locationPage: {
    heroBody: pageContent.location.heroBody,
  },
  contactPage: {
    heroBody: pageContent.contact.heroBody,
  },
  assetSlots: {
    heroPrimary: selectedAssets.heroPrimary.src,
    heroSecondary: selectedAssets.heroSecondary.src,
    storeView: selectedAssets.storeView.src,
  },
  gallery: adminGalleryItems.map(({ key, visible, order }) => ({ key, visible, order })),
};
