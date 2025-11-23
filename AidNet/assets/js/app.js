// script.js - Smooth, stable frontend interactions for AidNet
// Features:
// - AidNet utilities (localStorage API)
// - PageTransition overlay for link navigations
// - Header shrink on scroll
// - IntersectionObserver reveal on scroll
// - Service icon magnetic hover, ripple, click -> open bottom-sheet
// - Button ripple utility
// - Staggered icon entrance
// - Card 3D tilt
// - Accessibility: respects prefers-reduced-motion

/* ========== AidNet Utilities ========== */
const AidNet = {
    apiBase: 'api/',
    getAuth() {
      try { return JSON.parse(localStorage.getItem('aidnet_auth') || 'null'); }
      catch { return null; }
    },
    setAuth(data) { localStorage.setItem('aidnet_auth', JSON.stringify(data)); },
    clearAuth() { localStorage.removeItem('aidnet_auth'); },
    async post(endpoint, payload) {
      const res = await fetch(this.apiBase + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload || {})
      });
      return res.json();
    },
    async get(endpoint) {
      const res = await fetch(this.apiBase + endpoint);
      return res.json();
    }
  };
  
  /* ========== PageTransition ========== */
  class PageTransition {
    constructor() {
      this.transitionEl = document.createElement('div');
      this.transitionEl.className = 'page-transition';
      document.body.appendChild(this.transitionEl);
      this._bindNavLinks();
    }
  
    _bindNavLinks() {
      // Links that should navigate to separate HTML pages
      document.querySelectorAll('.nav-link, a[href$=".html"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        // ignore anchor or links handled elsewhere
        if (href.includes('#') || link.hasAttribute('data-no-transition') || link.getAttribute('onclick')) return;
        link.addEventListener('click', (e) => {
          // Only run for same-origin and html pages
          e.preventDefault();
          this.transitionTo(href);
        });
      });
    }
  
    transitionTo(url) {
      // Animate out, then navigate
      this.transitionEl.classList.remove('in');
      // ensure active to play animation
      this.transitionEl.classList.add('active');
      // small delay to allow animation to show
      setTimeout(() => {
        // direct navigation
        window.location.href = url;
      }, 360);
    }
  
    onLoad() {
      // Play "in" animation when page loaded
      this.transitionEl.classList.add('in');
      setTimeout(() => {
        this.transitionEl.classList.remove('in', 'active');
      }, 520);
    }
  }
  
  /* ========== Bottom Sheet Manager (service icon -> bottom sheet) ========== */
  class BottomSheet {
    constructor() {
      // try to find one in DOM, otherwise create
      this.sheet = document.querySelector('.bottom-sheet') || this._createSheet();
      this.titleEl = this.sheet.querySelector('.bottom-sheet-title') || null;
      this.contentEl = this.sheet.querySelector('.bottom-sheet-content') || null;
      this.closeBtns = this.sheet.querySelectorAll('.close-btn, .bottom-sheet-close');
      this.isOpen = false;
      this._bindClose();
    }
  
    _createSheet() {
      const markup = document.createElement('div');
      markup.className = 'bottom-sheet';
      markup.innerHTML = `
        <div class="bottom-sheet-header">
          <div class="bottom-sheet-title">Details</div>
          <button class="close-btn" aria-label="Close bottom sheet">&times;</button>
        </div>
        <div class="bottom-sheet-body" style="padding-bottom:24px;">
          <div class="bottom-sheet-content"></div>
        </div>
      `;
      document.body.appendChild(markup);
      return markup;
    }
  
    _bindClose() {
      this.sheet.addEventListener('click', (e) => {
        // close when clicking on overlay area outside content
        if (e.target === this.sheet) this.close();
      });
      this.closeBtns.forEach(btn => btn.addEventListener('click', () => this.close()));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });
    }
  
    open({ title = '', html = '', actions = [] } = {}) {
      // populate
      const titleNode = this.sheet.querySelector('.bottom-sheet-title');
      const contentNode = this.sheet.querySelector('.bottom-sheet-content');
  
      if (titleNode) titleNode.textContent = title || 'Details';
      if (contentNode) {
        // clear previous
        contentNode.innerHTML = '';
        // main html content
        const contentWrapper = document.createElement('div');
        contentWrapper.innerHTML = html || '';
        contentNode.appendChild(contentWrapper);
  
        // actions area
        if (actions && actions.length) {
          const actionsRow = document.createElement('div');
          actionsRow.style.display = 'flex';
          actionsRow.style.gap = '8px';
          actionsRow.style.marginTop = '14px';
          actions.forEach(act => {
            const btn = document.createElement('button');
            btn.className = act.class || 'action-btn';
            btn.textContent = act.label || 'Action';
            if (act.onClick) btn.addEventListener('click', act.onClick);
            if (act.href) btn.addEventListener('click', () => window.location.href = act.href);
            actionsRow.appendChild(btn);
          });
          contentNode.appendChild(actionsRow);
        }
      }
  
      // show
      this.sheet.classList.add('open');
      this.isOpen = true;
      // focus handling: focus close button
      const firstClose = this.sheet.querySelector('.close-btn');
      if (firstClose) firstClose.focus();
      // prevent background scroll
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  
    close() {
      this.sheet.classList.remove('open');
      this.isOpen = false;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }
  
  /* ========== Utilities ========== */
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // small helper to attach ripple effect to elements
  function addRipple(el, options = {}) {
    if (!el) return;
    el.classList.add('ripple-container');
    el.addEventListener('pointerdown', (e) => {
      try {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        el.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      } catch (err) {
        // fail silently
      }
    });
  }
  
  /* ========== Main Initialization ========== */
  document.addEventListener('DOMContentLoaded', () => {
    // page transition
    const pageTransition = new PageTransition();
    pageTransition.onLoad();
  
    // bottom sheet manager
    const bottomSheet = new BottomSheet();
  
    // logout
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        AidNet.clearAuth();
        pageTransition.transitionTo('login.html');
      });
    }
  
    // Active nav highlight
    try {
      const currentPath = (location.pathname || '').toLowerCase();
      document.querySelectorAll('.nav-link').forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        if (href && currentPath.endsWith(href)) link.classList.add('active');
      });
    } catch (err) { /* ignore */ }
  
    /* ========== Header shrink on scroll ========== */
    const header = document.querySelector('.app-header');
    if (header) {
      const onScroll = () => {
        if (window.scrollY > 10) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  
    /* ========== Reveal on Scroll ========== */
    const revealElements = Array.from(document.querySelectorAll('.reveal'));
    if (!prefersReduced && 'IntersectionObserver' in window && revealElements.length) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealElements.forEach(el => io.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('is-visible'));
    }
  
    /* ========== Service Icon interactions (MAGNETIC + RIPPLE + BOTTOM-SHEET) ========== */
    document.querySelectorAll('.service-icon').forEach((icon) => {
      // Use local RAF loop to avoid flooding with mousemoves
      let rafPending = false;
      let lastEvent = null;
  
      // Ensure element has GPU-friendly hint
      icon.style.willChange = 'transform';
  
      const rectSafe = () => {
        try { return icon.getBoundingClientRect(); } catch { return null; }
      };
  
      icon.addEventListener('mousemove', (e) => {
        if (prefersReduced) return;
        lastEvent = e;
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
          rafPending = false;
          const rect = rectSafe();
          if (!rect || !lastEvent) return;
          const x = lastEvent.clientX - rect.left - rect.width / 2;
          const y = lastEvent.clientY - rect.top - rect.height / 2;
          // milder effect to reduce jumpiness
          const tx = x * 0.06;
          const ty = y * 0.06;
          icon.style.transform = `translate(${tx}px, ${ty - 4}px) scale(1.045)`;
        });
      });
  
      icon.addEventListener('mouseleave', () => {
        icon.style.transform = '';
      });
  
      // Click ripple (visual) but we handle click for bottom-sheet open
      icon.addEventListener('click', (e) => {
        // small click "pulse" class
        icon.classList.add('clicking');
        setTimeout(() => icon.classList.remove('clicking'), 350);
  
        // ripple
        try {
          const r = icon.getBoundingClientRect();
          const ripple = document.createElement('span');
          ripple.style.cssText = [
            'position:absolute',
            'border-radius:50%',
            'background:rgba(37,99,235,0.18)',
            'width:120px;height:120px',
            `left:${e.clientX - r.left - 60}px`,
            `top:${e.clientY - r.top - 60}px`,
            'pointer-events:none',
            'transform:scale(0)',
            'opacity:0.9',
            'animation:ripple 0.6s ease-out forwards'
          ].join(';');
          icon.style.position = 'relative';
          icon.appendChild(ripple);
          setTimeout(() => ripple.remove(), 650);
        } catch (err) { /* ignore */ }
  
        // OPEN BOTTOM SHEET: read data attributes for content
        // data-title, data-desc, data-actions -> JSON encoded array optional
        const title = icon.getAttribute('data-title') || icon.querySelector('.service-label')?.textContent || 'Service';
        const desc = icon.getAttribute('data-desc') || '';
        let actions = [];
        const actionsAttr = icon.getAttribute('data-actions'); // expected JSON like: [{"label":"Call","href":"tel:..."}]
        if (actionsAttr) {
          try { actions = JSON.parse(actionsAttr); } catch { actions = []; }
        } else {
          // default actions from attributes
          const actionHref = icon.getAttribute('data-href');
          if (actionHref) actions.push({ label: 'Open', href: actionHref, class: 'action-btn' });
        }
  
        // build HTML content - keep minimal and sanitized-ish
        const html = `
          <div style="font-size:14px;color:var(--text-muted)">${desc}</div>
        `;
  
        // Add a "call" shortcut if data-tel provided
        const tel = icon.getAttribute('data-tel');
        if (tel) actions.unshift({
          label: 'Call',
          onClick: () => { window.location.href = 'tel:' + tel; },
          class: 'action-btn'
        });
  
        // Add a "navigate" action if data-lat & data-lng provided
        const lat = icon.getAttribute('data-lat');
        const lng = icon.getAttribute('data-lng');
        if (lat && lng) {
          const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat + ',' + lng)}`;
          actions.push({ label: 'Open in Maps', href: mapsHref, class: 'action-btn' });
        }
  
        bottomSheet.open({ title, html, actions });
      });
    });
  
    /* ========== Ripple for primary elements ========== */
    if (!prefersReduced) {
      document.querySelectorAll('.btn-primary, .btn-secondary, .card-action, .action-btn').forEach(addRipple);
    }
  
    /* ========== Smooth anchor scrolling ========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  
    /* ========== Staggered entrance for service-grid icons ========== */
    if (!prefersReduced) {
      const icons = Array.from(document.querySelectorAll('.service-grid .service-icon'));
      icons.forEach((icon, i) => {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(18px)';
        setTimeout(() => {
          icon.style.transition = 'opacity 420ms var(--ease-standard), transform 420ms var(--ease-emphasized)';
          icon.style.opacity = '1';
          icon.style.transform = 'translateY(0)';
        }, i * 70);
      });
    }
  
    /* ========== Card 3D tilt ========== */
    document.querySelectorAll('.service-card').forEach(card => {
      card.style.willChange = 'transform';
      let rafPending = false, lastEvent = null;
      card.addEventListener('mousemove', (e) => {
        if (prefersReduced) return;
        lastEvent = e;
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
          rafPending = false;
          const rect = card.getBoundingClientRect();
          const x = lastEvent.clientX - rect.left;
          const y = lastEvent.clientY - rect.top;
          const rotateX = (y - rect.height / 2) / 24; // softer rotation
          const rotateY = (rect.width / 2 - x) / 24;
          card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  
    /* ========== Bottom sheet: make sure close buttons inside dynamic content also work ========== */
    document.body.addEventListener('click', (e) => {
      if (e.target && e.target.matches('.bottom-sheet .close-btn')) bottomSheet.close();
    });
  
    /* ========== Accessibility: if reduced-motion, remove animated classes to avoid jank ========== */
    if (prefersReduced) {
      document.querySelectorAll('.service-icon, .service-card, .icon-circle').forEach(el => {
        el.style.transition = 'none';
        el.style.animation = 'none';
      });
    }
  });
  