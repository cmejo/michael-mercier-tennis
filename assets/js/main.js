/**
 * MICHAEL MERCIER TENNIS & PICKLEBALL
 * Modern Vanilla JavaScript Suite
 * - Google Analytics & Social Referrer Attribution Engine
 * - Dynamic Form Lead Attribution & Event Tracking
 * - Accessibility (ARIA sync, keyboard traps, escape listeners)
 * - Navigation, FAQ Accordion, and Floating Quick Contact Widget
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. ANALYTICS & SOCIAL MEDIA REFERRAL INTELLIGENCE
  // =========================================================================

  // Safe GA4 event dispatcher
  const trackEvent = (eventName, params = {}) => {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }
      if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
        console.log('[Analytics Event]', eventName, params);
      }
    } catch (err) {
      console.warn('[Analytics Error]', err);
    }
  };

  // Detect social & campaign traffic source (Facebook, Instagram, Nextdoor, Yelp, Google, etc.)
  const getAttributionData = () => {
    try {
      const stored = sessionStorage.getItem('mm_attribution');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}

    const ref = (document.referrer || '').toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || '';
    const utmMedium = urlParams.get('utm_medium') || '';
    const utmCampaign = urlParams.get('utm_campaign') || '';
    const refParam = urlParams.get('ref') || '';
    const fbclid = urlParams.get('fbclid');
    const gclid = urlParams.get('gclid');

    let source = 'Direct / Organic';
    let platform = 'Direct';

    // 1. Check explicit UTM source first
    if (utmSource) {
      source = utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
      platform = source;
    }
    // 2. Check Click IDs & Social / Search Referrers
    else if (fbclid || ref.includes('facebook.com') || ref.includes('fb.com')) {
      source = 'Facebook (Meta)';
      platform = 'Facebook';
    } else if (ref.includes('instagram.com')) {
      source = 'Instagram';
      platform = 'Instagram';
    } else if (ref.includes('nextdoor.com')) {
      source = 'Nextdoor';
      platform = 'Nextdoor';
    } else if (ref.includes('yelp.com')) {
      source = 'Yelp';
      platform = 'Yelp';
    } else if (ref.includes('linkedin.com') || ref.includes('lnkd.in')) {
      source = 'LinkedIn';
      platform = 'LinkedIn';
    } else if (ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('x.com')) {
      source = 'X (Twitter)';
      platform = 'Twitter';
    } else if (ref.includes('tiktok.com')) {
      source = 'TikTok';
      platform = 'TikTok';
    } else if (ref.includes('youtube.com') || ref.includes('youtu.be')) {
      source = 'YouTube';
      platform = 'YouTube';
    } else if (gclid || ref.includes('google.com') || ref.includes('maps.google.com')) {
      source = gclid ? 'Google Paid Search (Ads)' : 'Google Search / Maps';
      platform = 'Google';
    } else if (ref.includes('bing.com')) {
      source = 'Bing Search';
      platform = 'Bing';
    } else if (ref.includes('duckduckgo.com')) {
      source = 'DuckDuckGo';
      platform = 'DuckDuckGo';
    } else if (ref.includes('yahoo.com')) {
      source = 'Yahoo Search';
      platform = 'Yahoo';
    } else if (refParam) {
      source = 'Referral (' + refParam + ')';
      platform = refParam;
    } else if (ref && !ref.includes(window.location.hostname)) {
      try {
        const refHost = new URL(document.referrer).hostname;
        source = 'External (' + refHost + ')';
        platform = refHost;
      } catch (e) {
        source = 'External Referral';
        platform = 'External';
      }
    }

    const attribution = {
      source: source,
      platform: platform,
      utm_medium: utmMedium || (fbclid ? 'social_cpc' : (gclid ? 'cpc' : 'organic')),
      utm_campaign: utmCampaign || 'none',
      landing_page: window.location.href,
      referrer_url: document.referrer || 'none',
      timestamp: new Date().toISOString()
    };

    try {
      sessionStorage.setItem('mm_attribution', JSON.stringify(attribution));
    } catch (e) {}

    return attribution;
  };

  const attribution = getAttributionData();

  // Send referral visit event to GA4
  trackEvent('traffic_referral', {
    traffic_source: attribution.source,
    platform: attribution.platform,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    landing_page: attribution.landing_page
  });

  // Inject referral and campaign tracking into web forms for FormSubmit email notifications
  const injectAttributionFields = (form) => {
    if (!form) return;
    const addField = (name, value, id) => {
      let field = form.querySelector(`input[name="${name}"]`);
      if (!field) {
        field = document.createElement('input');
        field.type = 'hidden';
        field.name = name;
        if (id) field.id = id;
        form.appendChild(field);
      }
      field.value = value || 'N/A';
    };

    addField('Traffic_Source', attribution.source);
    addField('Campaign_Name', attribution.utm_campaign);
    addField('Landing_Page', attribution.landing_page);
    addField('Referrer_URL', attribution.referrer_url);
  };

  // Wire up form attribution
  const lessonForm = document.getElementById('lessonInquiryForm');
  const clinicForm = document.getElementById('clinicSignupForm');
  injectAttributionFields(lessonForm);
  injectAttributionFields(clinicForm);

  // Track telephone, SMS, and email click conversions
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('click_to_call', {
        phone_number: link.href.replace('tel:', ''),
        link_text: link.innerText.trim(),
        traffic_source: attribution.source
      });
    });
  });

  document.querySelectorAll('a[href^="sms:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('click_to_sms', {
        phone_number: link.href.replace('sms:', ''),
        link_text: link.innerText.trim(),
        traffic_source: attribution.source
      });
    });
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('click_to_email', {
        email: link.href.replace('mailto:', '').split('?')[0],
        traffic_source: attribution.source
      });
    });
  });

  // =========================================================================
  // 2. ACCESSIBILITY & FORM VALIDATION (MODERN WEB GUIDANCE)
  // =========================================================================

  // Synchronize aria-invalid with CSS :user-invalid state for screen readers
  const syncAria = (el) => {
    if (el && typeof el.matches === 'function' && (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA')) {
      el.setAttribute('aria-invalid', el.matches(':user-invalid') ? 'true' : 'false');
    }
  };
  document.addEventListener('blur', (e) => syncAria(e.target), true);
  document.addEventListener('input', (e) => {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('aria-invalid')) syncAria(e.target);
  });

  // Contact Form Submission & Confirmation
  if (lessonForm) {
    lessonForm.addEventListener('submit', (e) => {
      const name = document.getElementById('userName')?.value.trim();
      const email = document.getElementById('userEmail')?.value.trim();

      if (!name || !email) {
        alert('Please provide your name and email so Coach Mike can contact you.');
        e.preventDefault();
        return;
      }

      // Track lead generation conversion event
      trackEvent('generate_lead', {
        form_name: 'Lesson Inquiry',
        sport: document.getElementById('sportInterest')?.value || 'Not specified',
        town: document.getElementById('clientLocation')?.value || 'Not specified',
        traffic_source: attribution.source,
        value: 150
      });
    });
  }

  // Seasonal Clinic Announcement List Form
  if (clinicForm) {
    clinicForm.addEventListener('submit', (e) => {
      const clinicEmail = document.getElementById('clinicEmail')?.value.trim();
      if (!clinicEmail) {
        e.preventDefault();
        alert('Please enter a valid email address.');
        return;
      }

      trackEvent('clinic_signup', {
        form_name: 'Seasonal Clinic List',
        traffic_source: attribution.source
      });
    });
  }

  // Modal notification handling with Escape listener & outside-click dismiss
  const modal = document.getElementById('formSuccessModal');
  const closeModalBtn = document.getElementById('closeSuccessModal');

  const closeModal = () => {
    if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (window.history.replaceState) {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Check URL parameters for successful submission (?status=success)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('status') === 'success' && modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    trackEvent('lead_success_view', { traffic_source: attribution.source });
  }

  // =========================================================================
  // 3. NAVIGATION, FAQ & INTERACTIVE CONTROLS
  // =========================================================================

  // Mobile Menu Toggle & Dropdown Handling
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const dropdownItem = document.querySelector('.nav-item-dropdown');
  const dropdownLink = dropdownItem ? dropdownItem.querySelector(':scope > a') : null;

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link === dropdownLink && window.innerWidth <= 1024) {
          e.preventDefault();
          dropdownItem.classList.toggle('dropdown-open');
          const isOpen = dropdownItem.classList.contains('dropdown-open');
          dropdownLink.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          return;
        }
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // FAQ Accordion with Keyboard Support
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((button) => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const item = button.closest('.faq-item');

      faqQuestions.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.closest('.faq-item')?.classList.remove('open');
      });

      if (!isExpanded) {
        button.setAttribute('aria-expanded', 'true');
        item.classList.add('open');
      }
    });
  });

  // Floating Quick Contact Widget
  const floatingToggle = document.querySelector('.floating-toggle-btn');
  const floatingMenu = document.querySelector('.floating-contact-menu');
  if (floatingToggle && floatingMenu) {
    floatingToggle.addEventListener('click', () => {
      floatingMenu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!floatingToggle.contains(e.target) && !floatingMenu.contains(e.target)) {
        floatingMenu.classList.remove('open');
      }
    });
  }

  // Global Escape key listener to close active overlays
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
      }
      if (floatingMenu && floatingMenu.classList.contains('open')) {
        floatingMenu.classList.remove('open');
      }
    }
  });

  // Dynamic Year
  const yearEls = document.querySelectorAll('.current-year');
  const year = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = year;
  });
});
