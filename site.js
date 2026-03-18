/* site.js — NexusCT Site Interactions (2026 Restyle) */

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
    const navOverlay = document.querySelector('.nav-overlay');

    function openNav() {
      if (mainNav) {
        mainNav.classList.add('open');
        mainNav.style.display = 'flex';
        // Force reflow for animation
        mainNav.offsetHeight;
        mainNav.style.transform = 'translateX(0)';
      }
      if (mobileToggle) mobileToggle.classList.add('active');
      if (navOverlay) navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      if (mainNav) {
        mainNav.style.transform = '';
        mainNav.classList.remove('open');
      }
      if (mobileToggle) mobileToggle.classList.remove('active');
      if (navOverlay) navOverlay.classList.remove('active');
      document.body.style.overflow = '';
      // Close all mobile dropdowns
      document.querySelectorAll('.nav-item.open').forEach(function(item) {
        item.classList.remove('open');
      });
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', function() {
        if (mainNav && mainNav.classList.contains('open')) {
          closeNav();
        } else {
          openNav();
        }
      });
    }

    if (navOverlay) {
      navOverlay.addEventListener('click', closeNav);
    }

    /* ========== Dropdown toggles (mobile) ========== */
    const navItems = document.querySelectorAll('.nav-item[data-dropdown]');
    navItems.forEach(function(item) {
      const link = item.querySelector('.nav-link');
      if (!link) return;
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          navItems.forEach(function(other) {
            if (other !== item) other.classList.remove('open');
          });
          item.classList.toggle('open');
        }
      });
    });

    /* ========== Close mobile nav on link click ========== */
    document.querySelectorAll('.dropdown-link, .mega-menu-group a, .main-nav > .nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        if (mainNav && mainNav.classList.contains('open')) {
          closeNav();
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

    /* ========== Header scroll shadow ========== */
    let lastScroll = 0;
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        if (scrollTop > 10) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        lastScroll = scrollTop;
      }, { passive: true });
    }

    /* ========== Active nav link ========== */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .dropdown-link, .mega-menu-group a').forEach(function(link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    /* ========== Accordion ========== */
    document.querySelectorAll('.accordion-trigger').forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        const item = trigger.closest('.accordion-item');
        if (!item) return;
        const wasActive = item.classList.contains('active');
        // Close all items in the same accordion
        const accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion-item.active').forEach(function(active) {
            active.classList.remove('active');
          });
        }
        if (!wasActive) {
          item.classList.add('active');
        }
      });
    });
  });

  function updateThemeIcons(theme) {
    const sunIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

    document.querySelectorAll('[data-theme-toggle]').forEach(function(btn) {
      btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
})();
