(() => {
  const DRAFT_KEY = 'vine-admin-draft-v1';

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
    if (typeof value !== 'string') return;
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

    setText('[data-draft-field="home.heroTitle"]', draft.home?.heroTitle);
    setHtml('[data-draft-field="home.heroBody"]', draft.home?.heroBody);
    setText('[data-draft-field="locationPage.heroBody"]', draft.locationPage?.heroBody);
    setText('[data-draft-field="contactPage.heroBody"]', draft.contactPage?.heroBody);

    setImage('[data-draft-image="heroPrimary"]', draft.assetSlots?.heroPrimary);
    setImage('[data-draft-image="heroSecondary"]', draft.assetSlots?.heroSecondary);
    setImage('[data-draft-image="storeView"]', draft.assetSlots?.storeView);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDraft, { once: true });
  } else {
    applyDraft();
  }
})();
