/* site.js — NexusCT Site Interactions */

(function() {
  'use strict';

  /* ========== Theme Toggle ========== */
  function getPreferredTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  const currentTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);

  document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(function(toggle) {
      toggle.addEventListener('click', function() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        updateThemeIcons(next);
      });
    });

    updateThemeIcons(currentTheme);

    /* ========== Mobile Nav ========== */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && mainNav) {
      mobileToggle.addEventListener('click', function() {
        mobileToggle.classList.toggle('active');
        mainNav.classList.toggle('open');
      });
    }

    /* ========== Dropdown toggles (mobile) ========== */
    const navItems = document.querySelectorAll('.nav-item[data-dropdown]');
    navItems.forEach(function(item) {
      const link = item.querySelector('.nav-link');
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          // Close other dropdowns when opening this one
          navItems.forEach(function(other) {
            if (other !== item) other.classList.remove('open');
          });
          item.classList.toggle('open');
        }
      });
    });

    /* ========== Close mobile nav on link click ========== */
    document.querySelectorAll('.dropdown-link, .nav-link:not([data-dropdown] > .nav-link)').forEach(function(link) {
      link.addEventListener('click', function() {
        if (mainNav && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          if (mobileToggle) mobileToggle.classList.remove('active');
        }
      });
    });

    /* ========== Scroll Reveal ========== */
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.reveal').forEach(function(el) {
        observer.observe(el);
      });
    }

    /* ========== Active nav link ========== */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(function(link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  });

  function updateThemeIcons(theme) {
    const sunPath = 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z';
    const moonPath = 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z';

    document.querySelectorAll('[data-theme-toggle] svg path').forEach(function(path) {
      path.setAttribute('d', theme === 'dark' ? sunPath : moonPath);
    });

    document.querySelectorAll('[data-theme-toggle]').forEach(function(btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
})();
