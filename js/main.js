/* main.js — lightweight progressive enhancements
   - Auto-highlight active nav link based on current file path
   - Close mobile navbar when a link is clicked (improves UX)
   - Reveal-on-scroll for .reveal-card elements (prefers-reduced-motion aware)
   - Small helpers: set current year in footer
*/

document.addEventListener('DOMContentLoaded', function () {
  // 1) Set current year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2) Active nav highlighting
  (function highlightNav(){
    try {
      const navLinks = document.querySelectorAll('[data-nav]');
      const path = window.location.pathname;
      // Simple heuristic: match filename or 'index.html' home
      let page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
      // normalize: index.html -> home
      if (page === '' || page === 'index.html') page = 'index.html';
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        // check endsWith to allow relative or foldered setups
        if (href.endsWith(page) || (page === 'index.html' && href.endsWith('index.html'))) {
          link.classList.add('active');
          link.setAttribute('aria-current','page');
        }
      });
    } catch (e) {
      // fail gracefully
      // console.warn(e);
    }
  })();

  // 3) Close mobile menu when a nav link is clicked (Bootstrap collapse)
  (function autoCloseMobileMenu(){
    const navCollapse = document.getElementById('mainNav');
    if (!navCollapse) return;
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
    navCollapse.querySelectorAll('a.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        // Only collapse if toggler is visible (i.e., mobile)
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler && getComputedStyle(toggler).display !== 'none') {
          bsCollapse.hide();
        }
      });
    });
  })();

  // 4) Reveal on scroll for cards (progressive enhancement)
  (function revealOnScroll(){
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // reveal everything instantly
      document.querySelectorAll('.reveal-card').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const elems = Array.from(document.querySelectorAll('.reveal-card'));
    if (!elems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08
    });

    elems.forEach(el => observer.observe(el));
  })();
  
});


