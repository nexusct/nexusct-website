/* ════════════════════════════════════════════════════════════
   NexusCT — Facility Map App
   Leaflet + MarkerCluster interactive map
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Constants ─────────────────────────────────────────── */
  const SCHAUMBURG = [42.0334, -88.0834];
  const RADIUS_MILES = 125;
  const MILES_TO_METERS = 1609.344;

  const TYPE_COLORS = {
    'Nursing Home / SNF':        '#22c55e',
    'Hospital':                  '#ef4444',
    'Dialysis Center':           '#f59e0b',
    'Assisted Living Facility':  '#8b5cf6',
    'Rehabilitation Center':     '#06b6d4',
    'Psychiatric Hospital':      '#ec4899',
    'Surgical Center':           '#f97316',
    'Hospice':                   '#64748b',
    'VA Medical Center':         '#3b82f6',
  };

  const TYPE_SHORT = {
    'Nursing Home / SNF':        'SNF',
    'Hospital':                  'Hospital',
    'Dialysis Center':           'Dialysis',
    'Assisted Living Facility':  'ALF',
    'Rehabilitation Center':     'Rehab',
    'Psychiatric Hospital':      'Psych',
    'Surgical Center':           'Surgery',
    'Hospice':                   'Hospice',
    'VA Medical Center':         'VA',
  };

  /* ── State ─────────────────────────────────────────────── */
  const filters = {
    types: new Set(Object.keys(TYPE_COLORS)),
    maxDistance: 125,
    minRating: 0,
    states: new Set(['IL', 'IN', 'WI', 'MI', 'IA', '']),
    relevance: new Set(['High', 'Medium']),
    search: '',
  };

  let visibleFacilities = [];
  let markerMap = new Map(); // facility index → Leaflet marker
  let clusterGroup;
  let mapInstance;

  /* ── Map init ──────────────────────────────────────────── */
  function initMap() {
    mapInstance = L.map('map', {
      center: SCHAUMBURG,
      zoom: 8,
      zoomControl: true,
      preferCanvas: true,
    });

    // Dark tile layer — CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstance);

    // 100-mile radius circle
    L.circle(SCHAUMBURG, {
      radius: RADIUS_MILES * MILES_TO_METERS,
      color: '#00b4d8',
      weight: 1,
      dashArray: '6, 8',
      fillColor: '#00b4d8',
      fillOpacity: 0.03,
      interactive: false,
    }).addTo(mapInstance);

    // HQ marker
    const hqIcon = L.divIcon({
      html: '<div class="hq-marker"><div class="hq-pulse"></div></div>',
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker(SCHAUMBURG, { icon: hqIcon, zIndexOffset: 9999 })
      .addTo(mapInstance)
      .bindTooltip('<div class="tooltip-name">NexusCT HQ</div><div class="tooltip-type">Schaumburg, IL</div>', {
        permanent: false,
        direction: 'top',
        offset: [0, -14],
      });

    // MarkerCluster group
    clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 14,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        const size = count < 10 ? 32 : count < 100 ? 36 : 40;
        return L.divIcon({
          html: `<div style="
            width:${size}px;height:${size}px;
            background:rgba(0,180,216,0.18);
            border:1.5px solid rgba(0,180,216,0.45);
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-family:'DM Mono',monospace;
            font-size:${count < 100 ? 11 : 10}px;
            font-weight:500;
            color:#00b4d8;
          ">${count}</div>`,
          className: '',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      },
    });

    mapInstance.addLayer(clusterGroup);
  }

  /* ── Marker creation ───────────────────────────────────── */
  function makeMarker(facility, idx) {
    const color = TYPE_COLORS[facility.type] || '#9ba3b8';
    const icon = L.divIcon({
      html: `<div style="
        width:12px;height:12px;
        background:${color};
        border:2px solid rgba(255,255,255,0.85);
        border-radius:50%;
        box-shadow:0 1px 4px rgba(0,0,0,0.5);
      "></div>`,
      className: '',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    const marker = L.marker([facility.lat, facility.lon], { icon });

    // Tooltip on hover
    marker.bindTooltip(
      `<div class="tooltip-name">${escHtml(facility.name)}</div>
       <div class="tooltip-type">${escHtml(facility.type)}</div>`,
      { direction: 'top', offset: [0, -8], sticky: false }
    );

    // Popup on click
    marker.bindPopup(buildPopup(facility), {
      maxWidth: 320,
      minWidth: 260,
      closeButton: true,
    });

    return marker;
  }

  /* ── Popup HTML ────────────────────────────────────────── */
  function buildPopup(f) {
    const color  = TYPE_COLORS[f.type] || '#9ba3b8';
    const rating = parseInt(f.rating) || 0;
    const stars  = rating ? '★'.repeat(rating) + '<span style="opacity:0.3">' + '★'.repeat(5 - rating) + '</span>' : '—';
    const dist   = f.distance ? f.distance.toFixed(1) + ' mi' : '—';

    let addressLine = f.address || '';
    if (f.city)  addressLine += (addressLine ? ', ' : '') + f.city;
    if (f.state) addressLine += (addressLine ? ', ' : '') + f.state;
    if (f.zip)   addressLine += ' ' + f.zip;

    const relClass = f.relevance === 'High' ? 'high' : 'medium';

    let rows = '';

    if (addressLine) {
      rows += `<div class="popup-row">
        <svg class="popup-row-icon" viewBox="0 0 14 14" fill="none">
          <path d="M7 1.5C4.79 1.5 3 3.29 3 5.5c0 3.38 4 7 4 7s4-3.62 4-7c0-2.21-1.79-3.5-4-3.5z" stroke="currentColor" stroke-width="1.2" fill="none"/>
          <circle cx="7" cy="5.5" r="1" fill="currentColor"/>
        </svg>
        <span class="popup-row-text">${escHtml(addressLine)}</span>
      </div>`;
    }

    if (f.phone) {
      rows += `<div class="popup-row">
        <svg class="popup-row-icon" viewBox="0 0 14 14" fill="none">
          <path d="M4.5 2.5h2l1 2.5-1.5 1a6.5 6.5 0 003 3l1-1.5 2.5 1v2A1 1 0 0111.5 11.5 10 10 0 012.5 2.5 1 1 0 014.5 2.5z" stroke="currentColor" stroke-width="1.2" fill="none"/>
        </svg>
        <span class="popup-row-text"><a href="tel:${escHtml(f.phone)}">${escHtml(f.phone)}</a></span>
      </div>`;
    }

    if (f.website) {
      const display = f.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      rows += `<div class="popup-row">
        <svg class="popup-row-icon" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M2 7h10M7 2C5.5 4 5 5.5 5 7s.5 3 2 5M7 2c1.5 2 2 3.5 2 5s-.5 3-2 5" stroke="currentColor" stroke-width="1.2"/>
        </svg>
        <span class="popup-row-text"><a href="${escHtml(f.website)}" target="_blank" rel="noopener noreferrer">${escHtml(display)}</a></span>
      </div>`;
    }

    const metaItems = [];
    if (f.beds) {
      metaItems.push(`<div class="popup-meta-item">
        <div class="popup-meta-label">Beds</div>
        <div class="popup-meta-value">${escHtml(f.beds)}</div>
      </div>`);
    }
    if (dist !== '—') {
      metaItems.push(`<div class="popup-meta-item">
        <div class="popup-meta-label">Distance</div>
        <div class="popup-meta-value">${dist}</div>
      </div>`);
    }
    if (rating) {
      metaItems.push(`<div class="popup-meta-item">
        <div class="popup-meta-label">CMS Rating</div>
        <div class="popup-meta-value popup-stars">${stars}</div>
      </div>`);
    }
    if (f.ownership) {
      metaItems.push(`<div class="popup-meta-item" style="grid-column:1/-1">
        <div class="popup-meta-label">Ownership</div>
        <div class="popup-meta-value" style="font-family:var(--font-sans);font-size:11px">${escHtml(f.ownership)}</div>
      </div>`);
    }

    const metaGrid = metaItems.length
      ? `<div class="popup-meta-grid">${metaItems.join('')}</div>` : '';

    // Build search URLs
    const searchName = encodeURIComponent(f.name);
    const searchLoc  = encodeURIComponent((f.city || '') + ' ' + (f.state || ''));
    const googleUrl   = `https://www.google.com/search?q=${searchName}+${searchLoc}`;
    const linkedinUrl  = `https://www.linkedin.com/search/results/companies/?keywords=${searchName}`;
    const apolloUrl    = `https://app.apollo.io/#/search?q=${searchName}&organizationLocations[]=${searchLoc}`;

    return `<div class="popup-header">
      <div class="popup-name">${escHtml(f.name)}</div>
      <div class="popup-type-row">
        <div class="popup-type-dot" style="background:${color}"></div>
        <span class="popup-type-label">${escHtml(f.type)}</span>
        <span class="popup-rel rel-badge ${relClass}">${escHtml(f.relevance)}</span>
      </div>
    </div>
    <div class="popup-body">
      ${rows}
      ${metaGrid}
      <div class="popup-search-row">
        <a href="${googleUrl}" target="_blank" rel="noopener noreferrer" class="popup-search-btn popup-search-google" title="Search on Google">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.13-1.43.36-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.76.01-.55z" fill="#FBBC05"/>
            <path d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.16 6.16-4.16z" fill="#EA4335"/>
          </svg>
          Google
        </a>
        <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="popup-search-btn popup-search-linkedin" title="Search on LinkedIn">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123zM6.893 20.452H3.58V9h3.413v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
        <a href="${apolloUrl}" target="_blank" rel="noopener noreferrer" class="popup-search-btn popup-search-apollo" title="Search on Apollo.io">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#6C2BD9" stroke-width="2"/>
            <path d="M12 5l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" fill="#6C2BD9"/>
          </svg>
          Apollo
        </a>
      </div>
    </div>`;
  }

  /* ── Filter logic ──────────────────────────────────────── */
  function applyFilters() {
    const search = filters.search.toLowerCase();

    visibleFacilities = FACILITIES.filter((f, idx) => {
      if (!filters.types.has(f.type)) return false;
      if (f.distance > filters.maxDistance) return false;
      if (filters.minRating > 0) {
        const r = parseInt(f.rating) || 0;
        if (r < filters.minRating) return false;
      }
      const fState = f.state || '';
      if (!filters.states.has(fState)) return false;
      if (!filters.relevance.has(f.relevance)) return false;
      if (search && !f.name.toLowerCase().includes(search)) return false;
      return true;
    });

    rebuildMarkers();
    updateStats();
    renderList();
    updateBadge();
  }

  /* ── Marker rebuild ────────────────────────────────────── */
  function rebuildMarkers() {
    clusterGroup.clearLayers();
    markerMap.clear();

    const markers = visibleFacilities.map((f, i) => {
      const origIdx = FACILITIES.indexOf(f);
      const marker = makeMarker(f, origIdx);
      markerMap.set(origIdx, marker);
      return marker;
    });

    clusterGroup.addLayers(markers);
  }

  /* ── Stats update ──────────────────────────────────────── */
  function updateStats() {
    const shown = visibleFacilities.length;

    document.getElementById('statVisible').textContent = shown.toLocaleString();

    const avgDist = shown > 0
      ? (visibleFacilities.reduce((s, f) => s + (f.distance || 0), 0) / shown).toFixed(1)
      : '—';
    document.getElementById('statAvgDist').textContent = shown > 0 ? avgDist + ' mi' : '—';

    // Type breakdown
    const typeCount = {};
    visibleFacilities.forEach(f => {
      typeCount[f.type] = (typeCount[f.type] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(typeCount), 1);

    const breakdown = document.getElementById('typeBreakdown');
    breakdown.innerHTML = Object.entries(TYPE_COLORS)
      .map(([type, color]) => {
        const count = typeCount[type] || 0;
        const pct   = (count / maxCount * 100).toFixed(1);
        return `<div class="breakdown-row">
          <span class="breakdown-label" title="${escHtml(type)}">${escHtml(TYPE_SHORT[type] || type)}</span>
          <div class="breakdown-bar-track">
            <div class="breakdown-bar-fill" style="width:${pct}%;background:${color}"></div>
          </div>
          <span class="breakdown-count">${count}</span>
        </div>`;
      })
      .join('');
  }

  /* ── Facility list ─────────────────────────────────────── */
  function renderList() {
    const list = document.getElementById('facilityList');

    if (visibleFacilities.length === 0) {
      list.innerHTML = '<div class="list-empty">No facilities match the current filters.</div>';
      return;
    }

    // Sort by distance
    const sorted = [...visibleFacilities].sort((a, b) => (a.distance || 999) - (b.distance || 999));

    list.innerHTML = sorted.map((f, i) => {
      const color = TYPE_COLORS[f.type] || '#9ba3b8';
      const short = TYPE_SHORT[f.type] || f.type;
      const dist  = f.distance ? f.distance.toFixed(1) + ' mi' : '—';
      const city  = f.city || f.state || '';
      const origIdx = FACILITIES.indexOf(f);

      const sName = encodeURIComponent(f.name);
      const sLoc  = encodeURIComponent((f.city || '') + ' ' + (f.state || ''));

      return `<div class="facility-item" data-idx="${origIdx}" role="button" tabindex="0">
        <div class="facility-item-top">
          <span class="facility-item-name">${escHtml(f.name)}</span>
          <span class="facility-item-dist">${dist}</span>
        </div>
        <div class="facility-item-bottom">
          <span class="type-badge" style="background:${color}20;color:${color}">${escHtml(short)}</span>
          ${city ? `<span class="facility-item-city">${escHtml(city)}</span>` : ''}
        </div>
        <div class="facility-item-links">
          <a href="https://www.google.com/search?q=${sName}+${sLoc}" target="_blank" rel="noopener noreferrer" class="item-link-btn item-link-google" title="Google" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.13-1.43.36-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.76.01-.55z" fill="#FBBC05"/><path d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.16 6.16-4.16z" fill="#EA4335"/></svg>
          </a>
          <a href="https://www.linkedin.com/search/results/companies/?keywords=${sName}" target="_blank" rel="noopener noreferrer" class="item-link-btn item-link-linkedin" title="LinkedIn" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123zM6.893 20.452H3.58V9h3.413v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://app.apollo.io/#/search?q=${sName}&organizationLocations[]=${sLoc}" target="_blank" rel="noopener noreferrer" class="item-link-btn item-link-apollo" title="Apollo.io" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none"><circle cx="12" cy="12" r="10" stroke="#6C2BD9" stroke-width="2"/><path d="M12 5l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" fill="#6C2BD9"/></svg>
          </a>
        </div>
      </div>`;
    }).join('');

    // Click handlers
    list.querySelectorAll('.facility-item').forEach(el => {
      el.addEventListener('click', () => flyToFacility(parseInt(el.dataset.idx)));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') flyToFacility(parseInt(el.dataset.idx));
      });
    });
  }

  /* ── Fly to facility ───────────────────────────────────── */
  function flyToFacility(idx) {
    const f = FACILITIES[idx];
    if (!f) return;

    // Unspiderfy / zoom in if needed
    mapInstance.flyTo([f.lat, f.lon], Math.max(mapInstance.getZoom(), 13), {
      animate: true,
      duration: 0.8,
    });

    // Open popup after fly
    setTimeout(() => {
      const marker = markerMap.get(idx);
      if (marker) {
        clusterGroup.zoomToShowLayer(marker, () => {
          marker.openPopup();
        });
      }
    }, 900);
  }

  /* ── Badge update ──────────────────────────────────────── */
  function updateBadge() {
    const n = visibleFacilities.length;
    document.getElementById('badgeCount').textContent = n.toLocaleString();
  }

  /* ── UI controls init ──────────────────────────────────── */
  function initControls() {
    // ── Type filters ──
    const typeContainer = document.getElementById('typeFilters');
    typeContainer.innerHTML = Object.entries(TYPE_COLORS).map(([type, color]) => {
      const short = TYPE_SHORT[type] || type;
      const count = FACILITIES.filter(f => f.type === type).length;
      return `<label class="type-checkbox-row">
        <input type="checkbox" checked data-type="${escHtml(type)}" />
        <span class="type-check-box"></span>
        <span class="type-color-dot" style="background:${color}"></span>
        <span class="type-label">${escHtml(type)}</span>
        <span class="type-count">${count}</span>
      </label>`;
    }).join('');

    typeContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) filters.types.add(cb.dataset.type);
        else            filters.types.delete(cb.dataset.type);
        applyFilters();
      });
    });

    // ── Distance slider ──
    const slider = document.getElementById('distanceSlider');
    const distLabel = document.getElementById('distanceLabel');

    function updateSliderStyle(val) {
      const pct = val / 125 * 100;
      slider.style.background = `linear-gradient(to right, #00b4d8 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
      distLabel.textContent = `0 – ${val} mi`;
    }

    slider.addEventListener('input', () => {
      filters.maxDistance = parseInt(slider.value);
      updateSliderStyle(slider.value);
      applyFilters();
    });
    updateSliderStyle(125);

    // ── Star filter ──
    document.getElementById('starFilter').querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filters.minRating = parseInt(btn.dataset.rating);
        const label = document.getElementById('ratingLabel');
        label.textContent = filters.minRating === 0 ? 'Any' : filters.minRating + '★+';
        applyFilters();
      });
    });

    // ── State filters ──
    document.querySelectorAll('[data-state]').forEach(cb => {
      cb.addEventListener('change', () => {
        const s = cb.dataset.state;
        if (cb.checked) filters.states.add(s);
        else            filters.states.delete(s);
        applyFilters();
      });
    });

    // ── Relevance filters ──
    document.querySelectorAll('[data-rel]').forEach(cb => {
      cb.addEventListener('change', () => {
        const r = cb.dataset.rel;
        if (cb.checked) filters.relevance.add(r);
        else            filters.relevance.delete(r);
        applyFilters();
      });
    });

    // ── Search ──
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');

    searchInput.addEventListener('input', () => {
      filters.search = searchInput.value;
      searchClear.classList.toggle('visible', !!filters.search);
      applyFilters();
    });

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      filters.search = '';
      searchClear.classList.remove('visible');
      applyFilters();
    });

    // ── Reset button ──
    document.getElementById('resetFilters').addEventListener('click', () => {
      // Types
      filters.types = new Set(Object.keys(TYPE_COLORS));
      typeContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = true; });

      // Distance
      slider.value = 125;
      filters.maxDistance = 125;
      updateSliderStyle(125);

      // Rating
      filters.minRating = 0;
      document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.star-btn[data-rating="0"]').classList.add('active');
      document.getElementById('ratingLabel').textContent = 'Any';

      // States
      filters.states = new Set(['IL', 'IN', 'WI', 'MI', 'IA', '']);
      document.querySelectorAll('[data-state]').forEach(cb => { cb.checked = true; });

      // Relevance
      filters.relevance = new Set(['High', 'Medium']);
      document.querySelectorAll('[data-rel]').forEach(cb => { cb.checked = true; });

      // Search
      searchInput.value = '';
      filters.search = '';
      searchClear.classList.remove('visible');

      applyFilters();
    });

    // ── Export CSV ──
    document.getElementById('exportBtn').addEventListener('click', exportCSV);

    // ── Sidebar toggle ──
    const sidebar    = document.getElementById('sidebar');
    const toggleBtn  = document.getElementById('sidebarToggle');
    const expandBtn  = document.getElementById('sidebarExpand');

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('collapsed');
      setTimeout(() => mapInstance.invalidateSize(), 300);
    });

    expandBtn.addEventListener('click', () => {
      sidebar.classList.remove('collapsed');
      setTimeout(() => mapInstance.invalidateSize(), 300);
    });
  }

  /* ── CSV Export ────────────────────────────────────────── */
  function exportCSV() {
    const cols = ['name', 'type', 'subtype', 'address', 'city', 'state', 'zip', 'phone',
                  'beds', 'rating', 'ownership', 'distance', 'relevance', 'website'];

    const header = cols.join(',');

    const rows = visibleFacilities
      .sort((a, b) => (a.distance || 999) - (b.distance || 999))
      .map(f => cols.map(col => {
        const val = f[col] != null ? String(f[col]) : '';
        return /[,"\n]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(','));

    const csv = [header, ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nexusct_facilities.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ── Utility ───────────────────────────────────────────── */
  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ── Boot ──────────────────────────────────────────────── */
  function init() {
    initMap();
    initControls();
    applyFilters();
  }

  // Wait for DOM + libraries
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
