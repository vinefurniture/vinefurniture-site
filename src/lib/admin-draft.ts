export type AdminGalleryDraftItem = {
  key: string;
  visible: boolean;
  order: number;
};

export type AdminDraft = {
  version: number;
  updatedAt: string;
  business: {
    phone: string;
    phoneHref: string;
    address: string;
    hours: string;
    instagram: string;
    blog: string;
    place: string;
  };
  home: {
    heroTitle: string;
    heroBody: string;
  };
  locationPage: {
    heroBody: string;
  };
  contactPage: {
    heroBody: string;
  };
  assetSlots: {
    heroPrimary: string;
    heroSecondary: string;
    storeView: string;
  };
  gallery: AdminGalleryDraftItem[];
};

export type PublishPayload = AdminDraft & {
  localOnlyAssetSlots: string[];
};

export const cloneValue = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const pathGet = (obj: unknown, path: string) =>
  path.split('.').reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), obj);

export const pathSet = (obj: Record<string, unknown>, path: string, value: unknown) => {
  const keys = path.split('.');
  const last = keys.pop();
  if (!last) return;

  const target = keys.reduce<Record<string, unknown>>((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object') acc[key] = {};
    return acc[key] as Record<string, unknown>;
  }, obj);

  target[last] = value;
};

export const makePhoneHref = (phone: string) => `tel:${String(phone ?? '').replace(/[^0-9+]/g, '')}`;

export const normalizeGalleryItems = (
  items: AdminGalleryDraftItem[] | undefined,
  fallback: AdminGalleryDraftItem[],
): AdminGalleryDraftItem[] => {
  const fallbackMap = new Map(fallback.map((item) => [item.key, item]));

  const normalized = fallback.map((base) => {
    const incoming = items?.find((item) => item.key === base.key);
    return {
      key: base.key,
      visible: incoming?.visible ?? base.visible,
      order: Number.isFinite(incoming?.order) ? Number(incoming?.order) : base.order,
    };
  });

  normalized.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key, 'ko-KR'));

  return normalized.map((item, index) => ({
    ...item,
    order: index + 1,
    visible: item.visible ?? fallbackMap.get(item.key)?.visible ?? true,
  }));
};

export const normalizeDraft = (draft: Partial<AdminDraft> | null | undefined, defaults: AdminDraft, version = defaults.version): AdminDraft => {
  const merged = cloneValue(defaults);

  if (draft?.business) Object.assign(merged.business, draft.business);
  if (draft?.home) Object.assign(merged.home, draft.home);
  if (draft?.locationPage) Object.assign(merged.locationPage, draft.locationPage);
  if (draft?.contactPage) Object.assign(merged.contactPage, draft.contactPage);
  if (draft?.assetSlots) Object.assign(merged.assetSlots, draft.assetSlots);

  merged.version = version;
  merged.gallery = normalizeGalleryItems(draft?.gallery, defaults.gallery);
  merged.business.phoneHref = makePhoneHref(merged.business.phone);
  merged.updatedAt = typeof draft?.updatedAt === 'string' && draft.updatedAt ? draft.updatedAt : defaults.updatedAt;

  return merged;
};

export const createEmptyDraft = (defaults: AdminDraft, version = defaults.version): AdminDraft =>
  normalizeDraft({ ...cloneValue(defaults), version, updatedAt: '' }, defaults, version);

export const readDraftFromStorage = (storageKey: string, defaults: AdminDraft): AdminDraft => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? normalizeDraft(JSON.parse(raw), defaults) : createEmptyDraft(defaults);
  } catch {
    return createEmptyDraft(defaults);
  }
};

export const stampDraft = (draft: AdminDraft): AdminDraft => ({
  ...draft,
  updatedAt: new Date().toISOString(),
  business: {
    ...draft.business,
    phoneHref: makePhoneHref(draft.business.phone),
  },
  gallery: normalizeGalleryItems(draft.gallery, draft.gallery),
});

export const serializeDraft = (draft: AdminDraft) => JSON.stringify(stampDraft(draft), null, 2);

export const buildPublishPayload = (draft: AdminDraft, defaults: AdminDraft): PublishPayload => {
  const stamped = stampDraft(normalizeDraft(draft, defaults));
  const localOnlyAssetSlots = Object.entries(stamped.assetSlots)
    .filter(([, value]) => typeof value === 'string' && value.startsWith('data:'))
    .map(([key]) => key);

  const payload = cloneValue(stamped) as PublishPayload;
  payload.localOnlyAssetSlots = localOnlyAssetSlots;

  for (const key of localOnlyAssetSlots) {
    payload.assetSlots[key as keyof AdminDraft['assetSlots']] = defaults.assetSlots[key as keyof AdminDraft['assetSlots']];
  }

  return payload;
};
