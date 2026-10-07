/**
 * MICHAEL MERCIER TENNIS & PICKLEBALL
 * Lightweight, Vanilla JavaScript for Accessibility, UX & Direct Inquiries
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

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
  }

  // 2. FAQ Accordion with Keyboard Support
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

  // 3. Floating Quick Contact Widget
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

  // 4. Contact Form Submission & Confirmation
  const contactForm = document.getElementById('lessonInquiryForm');
  const modal = document.getElementById('formSuccessModal');
  const closeModalBtn = document.getElementById('closeSuccessModal');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const name = document.getElementById('userName')?.value.trim();
      const email = document.getElementById('userEmail')?.value.trim();

      if (!name || !email) {
        alert('Please provide your name and email so Coach Mike can contact you.');
        e.preventDefault();
        return;
      }
    });
  }

  // Check URL parameters for successful submission (?status=success)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('status') === 'success' && modal) {
    modal.classList.add('open');
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  // 5. Seasonal Clinic Announcement List Form
  const clinicForm = document.getElementById('clinicSignupForm');
  if (clinicForm) {
    clinicForm.addEventListener('submit', (e) => {
      const clinicEmail = document.getElementById('clinicEmail')?.value.trim();
      if (!clinicEmail) {
        e.preventDefault();
        alert('Please enter a valid email address.');
      }
    });
  }

  // 6. Dynamic Year
  const yearEls = document.querySelectorAll('.current-year');
  const year = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = year;
  });
});
