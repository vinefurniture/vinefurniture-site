(() => {
  const DRAFT_KEY = 'vine-admin-draft-v2';

  const readDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const setText = (selector, value) => {
    if (typeof value !== 'string') return;
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  };

  const setHtml = (selector, value) => {
    if (typeof value !== 'string') return;
    document.querySelectorAll(selector).forEach((node) => {
      node.innerHTML = value.replace(/\n/g, '<br />');
    });
  };

  const setHref = (selector, value) => {
    if (typeof value !== 'string' || !value.trim()) return;
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute('href', value);
    });
  };

  const setImage = (selector, value) => {
    if (typeof value !== 'string' || !value.trim()) return;
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute('src', value);
    });
  };

  const showBadge = () => {
    if (document.querySelector('.draft-preview-badge')) return;
    const badge = document.createElement('div');
    badge.className = 'draft-preview-badge';
    badge.textContent = '미리보기 초안 적용중';
    document.body.appendChild(badge);
  };

  const normalizeGallery = (items = []) =>
    [...items]
      .map((item, index) => ({
        key: item.key,
        visible: item.visible !== false,
        order: Number.isFinite(item.order) ? Number(item.order) : index + 1,
      }))
      .sort((a, b) => a.order - b.order || String(a.key).localeCompare(String(b.key), 'ko-KR'))
      .map((item, index) => ({ ...item, order: index + 1 }));

  const applyGallery = (draft) => {
    const galleryItems = normalizeGallery(draft.gallery);
    if (galleryItems.length === 0) return;

    document.querySelectorAll('[data-draft-gallery-container]').forEach((container) => {
      const limitAttr = Number(container.getAttribute('data-draft-gallery-limit'));
      const limit = Number.isFinite(limitAttr) && limitAttr > 0 ? limitAttr : Number.POSITIVE_INFINITY;
      const nodes = new Map(
        [...container.querySelectorAll('[data-draft-gallery-item]')].map((node) => [node.getAttribute('data-draft-gallery-item'), node]),
      );

      galleryItems.forEach((item, index) => {
        const node = nodes.get(item.key);
        if (!node) return;
        container.appendChild(node);
        node.hidden = !item.visible || index >= limit;
      });
    });
  };

  const applyDraft = () => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('draft')) return;

    const draft = readDraft();
    if (!draft) return;

    showBadge();

    setText('[data-draft-field="business.phone"]', draft.business?.phone);
    setText('[data-draft-field="business.hours"]', draft.business?.hours);
    setText('[data-draft-field="business.address"]', draft.business?.address);
    setHref('[data-draft-href="business.phoneHref"]', draft.business?.phoneHref);
    setHref('[data-draft-href="business.instagram"]', draft.business?.instagram);
    setHref('[data-draft-href="business.blog"]', draft.business?.blog);
    setHref('[data-draft-href="business.place"]', draft.business?.place);

    setText('[data-draft-field="home.heroTitle"]', draft.home?.heroTitle);
    setHtml('[data-draft-field="home.heroBody"]', draft.home?.heroBody);
    setText('[data-draft-field="locationPage.heroBody"]', draft.locationPage?.heroBody);
    setText('[data-draft-field="contactPage.heroBody"]', draft.contactPage?.heroBody);

    setImage('[data-draft-image="heroPrimary"]', draft.assetSlots?.heroPrimary);
    setImage('[data-draft-image="heroSecondary"]', draft.assetSlots?.heroSecondary);
    setImage('[data-draft-image="storeView"]', draft.assetSlots?.storeView);

    applyGallery(draft);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDraft, { once: true });
  } else {
    applyDraft();
  }
})();
