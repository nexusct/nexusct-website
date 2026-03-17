/* app.js — NexusCT UaaS Interactive Behaviors */

(function() {
  'use strict';

  // ============================================
  // THEME TOGGLE
  // ============================================
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;

  // Default to dark mode, but detect light preference
  let theme = 'dark';
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme = 'light';
  }
  // If data-theme already set (from HTML), use that
  const htmlTheme = root.getAttribute('data-theme');
  if (htmlTheme) {
    theme = htmlTheme;
  }
  root.setAttribute('data-theme', theme);
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', function() {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    if (theme === 'dark') {
      toggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    } else {
      toggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      var isOpen = mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');

      if (isOpen) {
        menuToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      } else {
        menuToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      }
    });

    // Close mobile nav when a link is clicked
    var mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      });
    });
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  var header = document.getElementById('header');
  var lastScroll = 0;

  if (header) {
    window.addEventListener('scroll', function() {
      var currentScroll = window.scrollY;

      if (currentScroll > 60) {
        header.style.borderBottomColor = 'oklch(from var(--color-text) l c h / 0.1)';
      } else {
        header.style.borderBottomColor = 'oklch(from var(--color-text) l c h / 0.06)';
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================
  // SCROLL REVEAL FALLBACK (for browsers without scroll-driven animations)
  // ============================================
  if (!CSS.supports('animation-timeline: scroll()')) {
    var fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      fadeElements.forEach(function(el) {
        observer.observe(el);
      });
    }
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    var navObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '-80px 0px -60% 0px'
    });

    sections.forEach(function(section) {
      navObserver.observe(section);
    });
  }

})();
