(() => {
  const EVENT_BY_URL = [
    { test: (href) => href.startsWith('tel:'), name: 'click_call' },
    { test: (href) => href.includes('instagram.com'), name: 'click_instagram' },
    { test: (href) => href.includes('blog.naver.com'), name: 'click_naver_blog' },
    { test: (href) => href.includes('naver.me') || href.includes('map.naver.com'), name: 'click_naver_place' },
  ];

  const resolveEventName = (link) => {
    const explicitEvent = link.dataset.analyticsEvent;
    if (explicitEvent) return explicitEvent;

    const href = link.getAttribute('href') || '';
    return EVENT_BY_URL.find(({ test }) => test(href))?.name || '';
  };

  const trackClick = (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const eventName = resolveEventName(link);
    if (!eventName || typeof window.gtag !== 'function') return;

    const href = link.getAttribute('href') || '';
    const label = link.dataset.analyticsLabel || link.textContent.trim().replace(/\s+/g, ' ');

    window.gtag('event', eventName, {
      event_category: eventName === 'click_call' ? 'lead' : 'outbound',
      event_label: label,
      link_url: href,
      page_location: window.location.href,
    });
  };

  document.addEventListener('click', trackClick, { capture: true });
})();
