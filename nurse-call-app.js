// =====================================================
// NexusCT Nurse Call System Designer — App Logic
// =====================================================

const CGI_BIN = "__CGI_BIN__";

// ---- Theme Toggle ----
(function() {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = 'light'; // default to light for healthcare
  root.setAttribute('data-theme', theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      toggle.innerHTML = theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }
})();

// ---- Pricing Data ----
const JERON_PARTS = {
  // Infrastructure
  "7950":  { name: "Room Controller", cost: 214.50 },
  "7953":  { name: "Room Controller w/Prism Dome", cost: 259.50 },
  "7953-T":{ name: "Room Controller w/Dome+Tone", cost: 333.00 },
  "7991":  { name: "8-Port Ethernet Switch", cost: 1215.00 },
  "7992":  { name: "Gateway 2-Channel", cost: 930.00 },
  "7993":  { name: "Gateway 8-Channel", cost: 1087.50 },
  "7989":  { name: "Cabinet (30x24)", cost: 315.00 },
  "7960":  { name: "Console Controller", cost: 202.50 },
  "7963":  { name: "Console Controller w/Zone Light", cost: 342.00 },
  // Patient Stations
  "7920":  { name: "Single Patient Station", cost: 252.00 },
  "7922":  { name: "Dual Patient Station", cost: 297.00 },
  "7923":  { name: "Enhanced Single Patient Station", cost: 300.00 },
  "7924":  { name: "Enhanced Dual Patient Station", cost: 396.00 },
  "7925":  { name: "Single Patient (DIN only)", cost: 201.00 },
  "7926":  { name: "Dual Patient (DIN only)", cost: 225.00 },
  "7912":  { name: "Staff Station/Pushbutton", cost: 159.00 },
  "7919":  { name: "Pullcord/Bath Audio Station", cost: 159.00 },
  "7930":  { name: "Single Pushbutton Station", cost: 69.00 },
  "7932":  { name: "Pullcord and Pushbutton", cost: 72.00 },
  "7958":  { name: "Pullcord Shower Station", cost: 73.50 },
  // Behavioral
  "7912-PC": { name: "Behavioral Intercom w/Call", cost: 442.50 },
  "7912-PCC":{ name: "Behavioral Intercom w/Call+Cancel", cost: 495.00 },
  "7912-PCK":{ name: "Behavioral w/Panic+Remote Cancel", cost: 547.50 },
  "7920-PC": { name: "Behavioral Patient w/Cancel", cost: 592.50 },
  "7930-PC": { name: "Behavioral Call w/Cancel", cost: 306.00 },
  // Consoles
  "7965":  { name: "Touchscreen Nurse Console", cost: 1200.00 },
  "7965-B":{ name: "Touchscreen Console w/Bluetooth", cost: 1687.50 },
  "7967-M":{ name: "Touchscreen Nurse Terminal", cost: 933.00 },
  "7967-P":{ name: "Touchscreen Workflow Terminal", cost: 933.00 },
  "7967-S":{ name: "Touchscreen Staff Duty Terminal", cost: 933.00 },
  // Dome/Zone
  "7973":  { name: "Prism Zone Light", cost: 312.00 },
  "7973-T":{ name: "Prism Zone Light w/Tone", cost: 385.50 },
  // Accessories
  "7901":  { name: "Standard Pillow Speaker", cost: 121.50 },
  "7905":  { name: "Enhanced Pillow Speaker w/Light", cost: 202.50 },
  "7908":  { name: "10ft DIN Call Cord Sealed", cost: 49.50 },
  "7910":  { name: "10ft DIN Call Cord", cost: 34.50 },
  "7914":  { name: "Geriatric Call Cord", cost: 202.50 },
  // Software
  "7970":  { name: "Automated Voice PA", cost: 750.00 },
  "7977":  { name: "ADT Integration", cost: 1125.00 },
  "7978":  { name: "SIP Phone Integration", cost: 1875.00 },
  "7979":  { name: "Pocket Paging", cost: 375.00 },
  "7979D": { name: "Dual Pocket Paging", cost: 975.00 },
  "7980":  { name: "Staff Assignment", cost: 1500.00 },
  "7981":  { name: "RTLS Integration", cost: 750.00 },
  "7982":  { name: "Barcode Staff Mgmt", cost: 375.00 },
  "7983":  { name: "EIS Logging/Reporting", cost: 1125.00 },
  "7984":  { name: "LAN Bridge Standard", cost: 1650.00 },
  "7985":  { name: "PC Console Software", cost: 1500.00 },
  "7986":  { name: "PC Console MapView", cost: 1500.00 },
  "7987":  { name: "Android Notification (w/2 devices)", cost: 4500.00 },
  "7987-05":{ name: "Additional Android Devices (5-pack)", cost: 2000.00 },
  "7990":  { name: "Admin/Programming Software", cost: 727.50 },
  // Services
  "9966":  { name: "Jeron Commissioning", cost: 3000.00 },
  "9967":  { name: "Jeron Integration Support", cost: 3750.00 },
  "9971":  { name: "Jeron Clinical In-Service", cost: 2250.00 },
};

const RCARE_PARTS = {
  "RCube":      { name: "RCube Enterprise Server", cost: 4500 },
  "BCube":      { name: "BCube Small Facility Server", cost: 2600 },
  "MR-500-G4": { name: "Master Receiver", cost: 800 },
  "LT-490-G4": { name: "Locator", cost: 350 },
  "RP-990-G4": { name: "Repeater", cost: 450 },
  "Outdoor-Enc":{ name: "Outdoor Enclosure", cost: 200 },
  "WTC-G4":    { name: "Wireless Pendant (Standard)", cost: 72 },
  "Pretty-G4": { name: "Pretty Pretty Pendant (G4)", cost: 96 },
  "RC-WTC":    { name: "Wearable Transmitter", cost: 68 },
  "Staff-Pend":{ name: "Staff Emergency Pendant", cost: 68 },
  "BP-7RWR":   { name: "Emergency Pull Cord", cost: 90 },
  "JR-14":     { name: "Bedside Station", cost: 110 },
  "WM-8":      { name: "Wall Push Button", cost: 55 },
  "Help-Btn":  { name: "Help Button (large)", cost: 65 },
  "WD-3":      { name: "Door/Window Contact", cost: 75 },
  "MS-6":      { name: "Activity Sensor", cost: 120 },
  "UT-RE3":    { name: "Universal Transmitter", cost: 85 },
  "RC-BCA9":   { name: "Bed/Chair Pad Alarm", cost: 140 },
  "RK-77":     { name: "Remote Keypad", cost: 95 },
  "CC980":     { name: "CC980 Touchscreen Console 15\"", cost: 1875 },
  "CC-10":     { name: "CC-10 Compact Console 10\"", cost: 1350 },
  "RC-3900":   { name: "Voice Communicator", cost: 280 },
  "RC-5200":   { name: "Cellular Voice Dialer", cost: 350 },
  "Indoor-Int":{ name: "Indoor Intercom", cost: 220 },
  "RPhone":    { name: "RPhone (locked smartphone)", cost: 340 },
  "Pager-Int": { name: "Pager Integration", cost: 225 },
  "Dome-LED":  { name: "Corridor Dome Light (3-color LED)", cost: 180 },
  "PCC-Int":   { name: "PointClickCare Integration", cost: 1500 },
  "Wander-Int":{ name: "Wander Management Integration", cost: 1875 },
  "VCube":     { name: "Voice-to-Voice (VCube) Upgrade", cost: 2000 },
  "MCube":     { name: "RCare Mobile (MCube) Upgrade", cost: 2500 },
};

const MARGIN = 0.25;
function sellPrice(cost) { return cost / (1 - MARGIN); }
function fmt(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtWhole(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

// ---- Financing Calculations ----
const FINANCE_APR = 0.079; // 7.9% APR
const NCAAS_MARKUP = 1.20; // 20% service premium on NCaaS
const NCAAS_TERM = 60; // 60-month NCaaS agreement

function calcMonthlyPayment(principal, apr, months) {
  const r = apr / 12;
  if (r === 0) return principal / months;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

// ---- Facility Image ----
let facilityImageData = null; // Will hold base64 data URI after search

// ---- State ----
let answers = {};
let currentStep = 0;
const TOTAL_STEPS = 13;

const chatMessages = document.getElementById('chatMessages');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

function updateProgress(step) {
  currentStep = step;
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  progressFill.style.width = pct + '%';
  progressText.textContent = `Step ${step} of ${TOTAL_STEPS}`;
}

// ---- Chat Helpers ----
function addMessage(type, html) {
  const div = document.createElement('div');
  div.className = `message ${type === 'user' ? 'user-msg' : 'ai-msg'}`;
  const avatarClass = type === 'user' ? 'user' : 'ai';
  const avatarText = type === 'user' ? 'You' : 'NC';
  div.innerHTML = `
    <div class="msg-avatar ${avatarClass}">${avatarText}</div>
    <div class="msg-content">
      <div class="msg-bubble">${html}</div>
    </div>
  `;
  chatMessages.appendChild(div);
  scrollToBottom();
  return div;
}

function addOptions(optionsHtml) {
  const div = document.createElement('div');
  div.className = 'message ai-msg';
  div.style.animationDelay = '200ms';
  div.innerHTML = `
    <div class="msg-avatar ai" style="visibility:hidden">NC</div>
    <div class="msg-content">${optionsHtml}</div>
  `;
  chatMessages.appendChild(div);
  scrollToBottom();
  return div;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'message ai-msg';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="msg-avatar ai">NC</div>
    <div class="msg-content">
      <div class="msg-bubble">
        <div class="typing-indicator"><span></span><span></span><span></span></div>
      </div>
    </div>
  `;
  chatMessages.appendChild(div);
  scrollToBottom();
}

function hideTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 50);
}

async function typeDelay(ms = 800) {
  showTyping();
  await new Promise(r => setTimeout(r, ms));
  hideTyping();
}

function disableAllOptions() {
  chatMessages.querySelectorAll('.option-card, .option-check, .btn').forEach(el => {
    el.style.pointerEvents = 'none';
    el.style.opacity = '0.6';
  });
}

// ---- Questions Flow ----
async function startConversation() {
  // Check for admin route
  if (window.location.hash === '#admin') {
    showAdmin();
    return;
  }

  await typeDelay(600);
  addMessage('ai', "Welcome to the <strong>NexusCT Nurse Call System Designer</strong>. I'll walk you through a series of questions to design and price the perfect nurse call system for your facility.");
  await typeDelay(800);
  askFacilityType();
}

// Q1: Facility Type
async function askFacilityType() {
  updateProgress(1);
  addMessage('ai', "What type of facility are you?");
  const types = [
    { id: 'hospital', title: 'Hospital / Acute Care', desc: 'Full-service hospital with ICU, med-surg, specialty units' },
    { id: 'snf', title: 'Skilled Nursing / SNF', desc: 'Post-acute care, rehabilitation, long-term nursing' },
    { id: 'alf', title: 'Assisted Living / ALF', desc: 'Residential care with daily living assistance' },
    { id: 'memory', title: 'Memory Care', desc: 'Specialized dementia and Alzheimer\'s care' },
    { id: 'behavioral', title: 'Behavioral Health', desc: 'Psychiatric and behavioral health facility' },
    { id: 'clinic', title: 'Clinic / Ambulatory', desc: 'Outpatient clinic or ambulatory surgery center' },
    { id: 'rehab', title: 'Rehabilitation Center', desc: 'Physical, occupational, and speech therapy' },
    { id: 'other', title: 'Other', desc: 'Custom facility type' },
  ];
  let html = '<div class="options-grid">';
  types.forEach(t => {
    html += `<button class="option-card" onclick="selectFacilityType('${t.id}','${t.title}')">
      <div class="option-title">${t.title}</div>
      <div class="option-desc">${t.desc}</div>
    </button>`;
  });
  html += '</div>';
  addOptions(html);
}

window.selectFacilityType = async function(id, title) {
  disableAllOptions();
  answers.facilityType = id;
  answers.facilityTypeLabel = title;
  addMessage('user', title);
  await typeDelay();
  askBeds();
};

// Q2: Beds
async function askBeds() {
  updateProgress(2);
  addMessage('ai', "How many beds/rooms does your facility need to cover?");
  const html = `
    <div class="numeric-input-wrap">
      <input type="number" id="bedInput" min="10" max="999" placeholder="e.g., 120" value="">
      <button class="btn btn-primary" onclick="submitBeds()">Continue</button>
    </div>
    <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-1);">Enter a number from 10 to 500+</div>
  `;
  addOptions(html);
  setTimeout(() => document.getElementById('bedInput')?.focus(), 300);
}

window.submitBeds = async function() {
  const val = parseInt(document.getElementById('bedInput')?.value);
  if (!val || val < 1) { alert('Please enter a valid number of beds.'); return; }
  disableAllOptions();
  answers.beds = val;
  addMessage('user', `${val} beds/rooms`);
  await typeDelay();
  askConstructionType();
};

// Q3: New/Retrofit
async function askConstructionType() {
  updateProgress(3);
  addMessage('ai', "Is this a new construction or a retrofit/upgrade of an existing system?");
  const opts = [
    { id: 'new', title: 'New Construction', desc: 'Brand new facility build' },
    { id: 'retrofit', title: 'Retrofit / Upgrade', desc: 'Replacing or upgrading an existing system' },
    { id: 'expansion', title: 'Expansion of Existing', desc: 'Adding capacity to a current system' },
  ];
  let html = '<div class="options-grid">';
  opts.forEach(o => {
    html += `<button class="option-card" onclick="selectConstruction('${o.id}','${o.title}')">
      <div class="option-title">${o.title}</div>
      <div class="option-desc">${o.desc}</div>
    </button>`;
  });
  html += '</div>';
  addOptions(html);
}

window.selectConstruction = async function(id, title) {
  disableAllOptions();
  answers.constructionType = id;
  answers.constructionTypeLabel = title;
  addMessage('user', title);
  await typeDelay();
  askPlatform();
};

// Q4: Platform
async function askPlatform() {
  updateProgress(4);
  addMessage('ai', "Which nurse call platform are you interested in?");
  const opts = [
    { id: 'jeron790', title: 'Jeron Provider 790', desc: 'IP-based, full acute care features, VoIP, EHR integration', tag: 'Enterprise' },
    { id: 'jeron700', title: 'Jeron Provider 700', desc: 'Networked, skilled/sub-acute, touchscreen, wireless alerting', tag: 'Mid-Range' },
    { id: 'rcare', title: 'RCare G4 Wireless', desc: 'Wireless, UL-1069, assisted living/SNF, mobile alerts, no wiring', tag: 'Wireless' },
    { id: 'help', title: 'Help me decide', desc: 'View a side-by-side comparison of all platforms', tag: '' },
  ];
  let html = '<div class="options-grid">';
  opts.forEach(o => {
    const tagHtml = o.tag ? `<div style="font-size:10px;font-weight:700;color:var(--color-primary);text-transform:uppercase;letter-spacing:0.05em;">${o.tag}</div>` : '';
    html += `<button class="option-card" onclick="selectPlatform('${o.id}','${o.title}')">
      ${tagHtml}
      <div class="option-title">${o.title}</div>
      <div class="option-desc">${o.desc}</div>
    </button>`;
  });
  html += '</div>';
  addOptions(html);
}

window.selectPlatform = async function(id, title) {
  if (id === 'help') {
    disableAllOptions();
    addMessage('user', 'Help me decide');
    await typeDelay(600);
    showComparisonTable();
    return;
  }
  disableAllOptions();
  answers.platform = id;
  answers.platformLabel = title;
  addMessage('user', title);
  await typeDelay();
  askPatientStation();
};

function showComparisonTable() {
  addMessage('ai', "Here's a comparison of our available platforms:");
  const html = `
    <div class="comparison-table-wrap">
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Jeron 790</th>
            <th>Jeron 700</th>
            <th>RCare G4</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Type</strong></td><td>IP-Based</td><td>Networked</td><td>Wireless</td></tr>
          <tr><td><strong>Best For</strong></td><td>Hospitals, Acute Care</td><td>SNF, Sub-Acute</td><td>Assisted Living, SNF</td></tr>
          <tr><td><strong>Wiring Required</strong></td><td>Yes (Cat5/6)</td><td>Yes (Cat5)</td><td>No (wireless)</td></tr>
          <tr><td><strong>VoIP Support</strong></td><td>Yes</td><td>Limited</td><td>Optional</td></tr>
          <tr><td><strong>EHR Integration</strong></td><td>Full ADT</td><td>ADT Available</td><td>PointClickCare</td></tr>
          <tr><td><strong>Mobile Alerts</strong></td><td>SIP/Android</td><td>Paging</td><td>RPhone/SMS</td></tr>
          <tr><td><strong>Wander Mgmt</strong></td><td>No</td><td>No</td><td>Yes</td></tr>
          <tr><td><strong>UL-1069</strong></td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
          <tr><td><strong>Install Complexity</strong></td><td>High</td><td>Medium</td><td>Low</td></tr>
          <tr><td><strong>Cost Level</strong></td><td>$$$</td><td>$$</td><td>$$</td></tr>
        </tbody>
      </table>
    </div>
    <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-top:var(--space-3);">
      <button class="btn btn-primary" onclick="selectPlatform('jeron790','Jeron Provider 790')">Choose Jeron 790</button>
      <button class="btn btn-secondary" onclick="selectPlatform('jeron700','Jeron Provider 700')">Choose Jeron 700</button>
      <button class="btn btn-outline" onclick="selectPlatform('rcare','RCare G4 Wireless')">Choose RCare G4</button>
    </div>
  `;
  addOptions(html);
}

// Q5: Patient Station
async function askPatientStation() {
  updateProgress(5);
  const isRCare = answers.platform === 'rcare';
  addMessage('ai', "What level of patient station do you need?");

  let opts;
  if (isRCare) {
    opts = [
      { id: 'rcare_pendant', title: 'Wireless Pendant Only', desc: 'Basic pendant for mobile residents', price: sellPrice(96) },
      { id: 'rcare_pendant_pull', title: 'Pendant + Pull Cord', desc: 'Pendant worn plus bathroom pull cord', price: sellPrice(96 + 90) },
      { id: 'rcare_pendant_bed', title: 'Pendant + Bedside Station', desc: 'Pendant plus bedside call button', price: sellPrice(96 + 110) },
      { id: 'rcare_full', title: 'Full Room Package', desc: 'Pendant + Pull Cord + Bedside Station', price: sellPrice(96 + 90 + 110) },
    ];
  } else {
    opts = [
      { id: 'standard', title: 'Standard Audio (7920)', desc: 'Single patient station with audio', price: sellPrice(252) },
      { id: 'enhanced', title: 'Enhanced Audio w/Light (7923)', desc: 'Single station with enhanced audio and indicator', price: sellPrice(300) },
      { id: 'enhanced_dual', title: 'Enhanced Dual (7924)', desc: 'Dual-bed station with enhanced audio', price: sellPrice(396) },
      { id: 'behavioral', title: 'Behavioral Security (7920-PC)', desc: 'Tamper-resistant with cancel button', price: sellPrice(592.50) },
    ];
  }

  let html = '<div class="options-grid">';
  opts.forEach(o => {
    html += `<button class="option-card" onclick="selectStation('${o.id}','${o.title}')">
      <div class="option-title">${o.title}</div>
      <div class="option-desc">${o.desc}</div>
    </button>`;
  });
  html += '</div>';
  addOptions(html);
}

window.selectStation = async function(id, title) {
  disableAllOptions();
  answers.stationType = id;
  answers.stationTypeLabel = title;
  addMessage('user', title);
  await typeDelay();
  askBathroom();
};

// Q6: Bathroom
async function askBathroom() {
  updateProgress(6);
  addMessage('ai', "Do you need bathroom/shower emergency stations?");
  const opts = [
    { id: 'bath_1', title: 'Yes — 1 per room', desc: 'One emergency pull cord per bathroom' },
    { id: 'bath_2', title: 'Yes — 2 per room', desc: 'Pull cord in bathroom + shower area' },
    { id: 'bath_no', title: 'No', desc: 'No bathroom emergency stations needed' },
  ];
  let html = '<div class="options-grid">';
  opts.forEach(o => {
    html += `<button class="option-card" onclick="selectBathroom('${o.id}','${o.title}')">
      <div class="option-title">${o.title}</div>
      <div class="option-desc">${o.desc}</div>
    </button>`;
  });
  html += '</div>';
  addOptions(html);
}

window.selectBathroom = async function(id, title) {
  disableAllOptions();
  answers.bathroom = id;
  answers.bathroomLabel = title;
  addMessage('user', title);
  await typeDelay();
  askConsole();
};

// Q7: Console Type
async function askConsole() {
  updateProgress(7);
  const isRCare = answers.platform === 'rcare';
  addMessage('ai', "What nurse console type do you need?");

  let opts;
  if (isRCare) {
    opts = [
      { id: 'rcare_cc980', title: 'CC980 Touchscreen (15")', desc: 'Full-featured 15" touchscreen console', price: sellPrice(1875) },
      { id: 'rcare_cc10', title: 'CC-10 Compact (10")', desc: 'Compact 10" touchscreen console', price: sellPrice(1350) },
      { id: 'rcare_bcube', title: 'BCube (Small Facility)', desc: 'Built-in server for < 128 beds', price: sellPrice(2600) },
      { id: 'rcare_rcube', title: 'RCube (Enterprise)', desc: 'Enterprise server for large facilities', price: sellPrice(4500) },
    ];
  } else {
    opts = [
      { id: 'jeron_7965', title: 'Touchscreen Console (7965)', desc: 'Full touchscreen nurse console', price: sellPrice(1200) },
      { id: 'jeron_7965b', title: 'Touchscreen w/Bluetooth (7965-B)', desc: 'Console with Bluetooth wireless handset', price: sellPrice(1687.50) },
      { id: 'jeron_7985', title: 'PC Console Software (7985)', desc: 'Software-based console on PC', price: sellPrice(1500) },
      { id: 'jeron_7967', title: 'Touchscreen Terminal (7967)', desc: 'Compact touchscreen terminal', price: sellPrice(933) },
    ];
  }

  let html = '<div class="options-grid">';
  opts.forEach(o => {
    html += `<button class="option-card" onclick="selectConsole('${o.id}','${o.title}')">
      <div class="option-title">${o.title}</div>
      <div class="option-desc">${o.desc}</div>
    </button>`;
  });
  html += '</div>';
  addOptions(html);
}

window.selectConsole = async function(id, title) {
  disableAllOptions();
  answers.consoleType = id;
  answers.consoleTypeLabel = title;
  addMessage('user', title);
  await typeDelay();
  askConsoleCount();
};

// Q8: Console Count
async function askConsoleCount() {
  updateProgress(8);
  addMessage('ai', "How many nursing stations/consoles do you need?");
  const html = `
    <div class="numeric-input-wrap">
      <input type="number" id="consoleInput" min="1" max="20" placeholder="e.g., 4" value="">
      <button class="btn btn-primary" onclick="submitConsoles()">Continue</button>
    </div>
    <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-1);">Typically 1 per nursing unit/floor (1–20)</div>
  `;
  addOptions(html);
  setTimeout(() => document.getElementById('consoleInput')?.focus(), 300);
}

window.submitConsoles = async function() {
  const val = parseInt(document.getElementById('consoleInput')?.value);
  if (!val || val < 1) { alert('Please enter a valid number.'); return; }
  disableAllOptions();
  answers.consoleCount = val;
  addMessage('user', `${val} console(s)`);
  await typeDelay();
  askDomeLights();
};

// Q9: Dome Lights
async function askDomeLights() {
  updateProgress(9);
  addMessage('ai', "Do you need corridor dome/zone lights?");
  const opts = [
    { id: 'dome_1per', title: 'Yes — 1 per room', desc: 'Individual dome light above each room' },
    { id: 'dome_2per', title: 'Yes — 1 per 2 rooms', desc: 'Shared zone light per pair of rooms' },
    { id: 'dome_no', title: 'No', desc: 'No corridor lights needed' },
  ];
  let html = '<div class="options-grid">';
  opts.forEach(o => {
    html += `<button class="option-card" onclick="selectDome('${o.id}','${o.title}')">
      <div class="option-title">${o.title}</div>
      <div class="option-desc">${o.desc}</div>
    </button>`;
  });
  html += '</div>';
  addOptions(html);
}

window.selectDome = async function(id, title) {
  disableAllOptions();
  answers.domeLights = id;
  answers.domeLightsLabel = title;
  addMessage('user', title);
  await typeDelay();
  askWirelessAlerting();
};

// Q10: Wireless Alerting
async function askWirelessAlerting() {
  updateProgress(10);
  const isRCare = answers.platform === 'rcare';
  addMessage('ai', "What wireless alerting do you need?");

  let opts;
  if (isRCare) {
    opts = [
      { id: 'rcare_rphone', title: 'RPhone Mobile', desc: 'Locked smartphone for nursing staff', price: sellPrice(340) },
      { id: 'rcare_pager', title: 'Pager Integration', desc: 'Integration with existing pager system', price: sellPrice(225) },
      { id: 'rcare_email', title: 'Email/Text Alerts', desc: 'Included with system at no extra cost', price: 0 },
      { id: 'wireless_none', title: 'None', desc: 'No wireless alerting needed', price: 0 },
    ];
  } else {
    opts = [
      { id: 'jeron_sip', title: 'SIP Phone Integration', desc: 'Integrate with SIP/VoIP phone system', price: sellPrice(1875) },
      { id: 'jeron_paging', title: 'Pocket Paging', desc: 'Traditional pager alerts for staff', price: sellPrice(375) },
      { id: 'jeron_android', title: 'Android Notification', desc: 'Push alerts to Android devices', price: sellPrice(4500) },
      { id: 'wireless_none', title: 'None', desc: 'No wireless alerting needed', price: 0 },
    ];
  }

  let html = '<div class="options-grid">';
  opts.forEach(o => {
    html += `<button class="option-card" onclick="selectWireless('${o.id}','${o.title}')">
      <div class="option-title">${o.title}</div>
      <div class="option-desc">${o.desc}</div>
    </button>`;
  });
  html += '</div>';
  addOptions(html);
}

window.selectWireless = async function(id, title) {
  disableAllOptions();
  answers.wireless = id;
  answers.wirelessLabel = title;
  addMessage('user', title);
  await typeDelay();
  askIntegrations();
};

// Q11: Integrations (multi-select)
let selectedIntegrations = [];

async function askIntegrations() {
  updateProgress(11);
  const isRCare = answers.platform === 'rcare';
  addMessage('ai', "Do you need any additional integrations? <em>(Select all that apply, then click Continue)</em>");

  let opts;
  if (isRCare) {
    opts = [
      { id: 'int_ehr', title: 'EHR/ADT Integration', price: sellPrice(1500) },
      { id: 'int_rtls', title: 'RTLS Staff Locating', price: sellPrice(1500) },
      { id: 'int_reporting', title: 'Reporting & Analytics', price: 0, note: 'Included' },
      { id: 'int_wander', title: 'Wander Management', price: sellPrice(1875) },
    ];
  } else {
    opts = [
      { id: 'int_ehr', title: 'EHR/ADT Integration', price: sellPrice(1125) },
      { id: 'int_rtls', title: 'RTLS Staff Locating', price: sellPrice(750) },
      { id: 'int_reporting', title: 'Reporting & Analytics', price: sellPrice(1125) },
      { id: 'int_barcode', title: 'Barcode Staff Management', price: sellPrice(375) },
    ];
  }

  selectedIntegrations = [];
  let html = '<div class="options-multi">';
  opts.forEach(o => {
    html += `<button class="option-check" id="intopt_${o.id}" onclick="toggleIntegration('${o.id}','${o.title}')">
      <div class="checkbox"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="option-info">
        <div class="option-title">${o.title}</div>
      </div>
    </button>`;
  });
  html += `<div class="multi-submit-wrap">
    <button class="btn btn-primary" onclick="submitIntegrations()">Continue</button>
    <button class="btn btn-secondary" style="margin-left:var(--space-2);" onclick="submitIntegrations()">Skip — None Needed</button>
  </div></div>`;
  addOptions(html);
}

window.toggleIntegration = function(id, title) {
  const el = document.getElementById('intopt_' + id);
  const idx = selectedIntegrations.findIndex(i => i.id === id);
  if (idx >= 0) {
    selectedIntegrations.splice(idx, 1);
    el.classList.remove('checked');
  } else {
    selectedIntegrations.push({ id, title });
    el.classList.add('checked');
  }
};

window.submitIntegrations = async function() {
  disableAllOptions();
  answers.integrations = selectedIntegrations.map(i => i.id);
  answers.integrationsLabels = selectedIntegrations.map(i => i.title);
  const label = selectedIntegrations.length > 0 ? selectedIntegrations.map(i => i.title).join(', ') : 'None';
  addMessage('user', label);
  await typeDelay();
  askInstallation();
};

// Q12: Installation
async function askInstallation() {
  updateProgress(12);
  addMessage('ai', "What about installation support?");
  const opts = [
    { id: 'professional', title: 'NexusCT Professional Installation', desc: 'On-site installation by NexusCT technicians', price: 150 },
    { id: 'turnkey', title: 'NexusCT Full Turnkey', desc: 'Installation + commissioning + staff training', price: 250 },
  ];
  let html = '<div class="options-grid">';
  opts.forEach(o => {
    html += `<button class="option-card" onclick="selectInstall('${o.id}','${o.title}')">
      <div class="option-title">${o.title}</div>
      <div class="option-desc">${o.desc}</div>
    </button>`;
  });
  html += '</div>';
  addOptions(html);
}

window.selectInstall = async function(id, title) {
  disableAllOptions();
  answers.installation = id;
  answers.installationLabel = title;
  addMessage('user', title);
  await typeDelay(500);
  askLeadCapture();
};

// Q13: Lead Capture
async function askLeadCapture() {
  updateProgress(13);
  addMessage('ai', "Almost done! To generate your personalized system estimate, please provide your contact information.");
  const html = `
    <div class="lead-form">
      <div class="lead-field">
        <label for="leadName">Full Name <span class="required">*</span></label>
        <input type="text" id="leadName" placeholder="John Smith" autocomplete="name">
      </div>
      <div class="lead-field">
        <label for="leadEmail">Email Address <span class="required">*</span></label>
        <input type="email" id="leadEmail" placeholder="john@facility.com" autocomplete="email">
      </div>
      <div class="lead-field">
        <label for="leadPhone">Phone Number <span class="required">*</span></label>
        <input type="tel" id="leadPhone" placeholder="(555) 123-4567" autocomplete="tel">
      </div>
      <div class="lead-field">
        <label for="leadFacility">Facility Name <span class="required">*</span></label>
        <input type="text" id="leadFacility" placeholder="e.g., Sunrise Senior Living">
      </div>
      <div class="lead-field">
        <label for="leadNotes">Additional Notes <span class="optional">(optional)</span></label>
        <textarea id="leadNotes" rows="2" placeholder="Timeline, special requirements, etc."></textarea>
      </div>
      <div id="leadError" class="lead-error" style="display:none;"></div>
      <button class="btn btn-primary lead-submit" onclick="submitLeadForm()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        Generate My Estimate
      </button>
      <div class="lead-privacy">Your information is kept confidential and used only to prepare your estimate.</div>
    </div>
  `;
  addOptions(html);
  setTimeout(() => document.getElementById('leadName')?.focus(), 300);
}

window.submitLeadForm = async function() {
  const name = document.getElementById('leadName')?.value.trim();
  const email = document.getElementById('leadEmail')?.value.trim();
  const phone = document.getElementById('leadPhone')?.value.trim();
  const facility = document.getElementById('leadFacility')?.value.trim();
  const notes = document.getElementById('leadNotes')?.value.trim();
  const errorEl = document.getElementById('leadError');

  // Validation
  const missing = [];
  if (!name) missing.push('Full Name');
  if (!email) missing.push('Email Address');
  if (!phone) missing.push('Phone Number');
  if (!facility) missing.push('Facility Name');

  if (missing.length > 0) {
    errorEl.textContent = 'Please fill in: ' + missing.join(', ');
    errorEl.style.display = 'block';
    return;
  }

  // Basic email check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorEl.textContent = 'Please enter a valid email address.';
    errorEl.style.display = 'block';
    return;
  }

  errorEl.style.display = 'none';
  disableAllOptions();

  answers.leadName = name;
  answers.leadEmail = email;
  answers.leadPhone = phone;
  answers.leadFacility = facility;
  answers.leadNotes = notes;

  addMessage('user', `${name} — ${facility}`);
  await typeDelay(500);
  addMessage('ai', "Excellent! I have everything I need. Let me design your system now...");
  await new Promise(r => setTimeout(r, 1200));
  showDesigning();
};

// ---- System Design Engine ----
function showDesigning() {
  document.getElementById('chatView').style.display = 'none';
  document.getElementById('progressWrap').style.display = 'none';
  const dv = document.getElementById('designingView');
  dv.style.display = 'flex';

  const subtexts = [
    'Analyzing facility requirements and optimizing component selection',
    'Calculating infrastructure needs based on bed count',
    'Selecting patient stations and accessories',
    'Configuring console and networking components',
    'Searching for facility imagery',
    'Applying NexusCT preferred pricing',
    'Calculating financing options',
    'Generating your system proposal',
  ];
  let idx = 0;
  const subEl = document.getElementById('designingSubtext');
  const interval = setInterval(() => {
    idx++;
    if (idx < subtexts.length) {
      subEl.textContent = subtexts[idx];
    }
  }, 600);

  // Fetch facility image in background
  facilityImageData = null;
  const facilityName = answers.leadFacility || '';
  if (facilityName) {
    fetchFacilityImage(facilityName).catch(() => {});
  }

  setTimeout(() => {
    clearInterval(interval);
    dv.style.display = 'none';
    const result = buildSystemDesign();
    renderQuote(result);
    saveQuote(result);
  }, 5000);
}

async function fetchFacilityImage(facilityName) {
  try {
    const url = `${CGI_BIN}/image_proxy.py?q=${encodeURIComponent(facilityName)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return;
    const data = await res.json();
    if (data.base64) {
      facilityImageData = data.base64;
    }
  } catch (e) {
    console.warn('Facility image fetch failed:', e);
  }
}

function buildSystemDesign() {
  const beds = answers.beds;
  const isRCare = answers.platform === 'rcare';
  const isJeron = !isRCare;
  const bom = []; // { category, partNo, name, qty, dealerCost, sellPrice }

  // ---- INFRASTRUCTURE ----
  if (isJeron) {
    // Room controllers
    const useDome = answers.domeLights === 'dome_1per';
    const useSharedDome = answers.domeLights === 'dome_2per';
    if (useDome) {
      bom.push({ cat: 'Infrastructure', pn: '7953-T', name: JERON_PARTS['7953-T'].name, qty: beds, cost: JERON_PARTS['7953-T'].cost });
    } else {
      bom.push({ cat: 'Infrastructure', pn: '7950', name: JERON_PARTS['7950'].name, qty: beds, cost: JERON_PARTS['7950'].cost });
    }

    // Gateways (1 per 8 rooms)
    const gwCount = Math.ceil(beds / 8);
    bom.push({ cat: 'Infrastructure', pn: '7993', name: JERON_PARTS['7993'].name, qty: gwCount, cost: JERON_PARTS['7993'].cost });

    // Switches (1 per 8 gateways)
    const swCount = Math.ceil(gwCount / 8);
    bom.push({ cat: 'Infrastructure', pn: '7991', name: JERON_PARTS['7991'].name, qty: swCount, cost: JERON_PARTS['7991'].cost });

    // Cabinets (1 per switch)
    bom.push({ cat: 'Infrastructure', pn: '7989', name: JERON_PARTS['7989'].name, qty: swCount, cost: JERON_PARTS['7989'].cost });

    // Console controllers
    bom.push({ cat: 'Infrastructure', pn: '7960', name: JERON_PARTS['7960'].name, qty: answers.consoleCount, cost: JERON_PARTS['7960'].cost });

    // Admin software
    bom.push({ cat: 'Software', pn: '7990', name: JERON_PARTS['7990'].name, qty: 1, cost: JERON_PARTS['7990'].cost });

    // LAN Bridge (if >1 switch)
    if (swCount > 1) {
      bom.push({ cat: 'Software', pn: '7984', name: JERON_PARTS['7984'].name, qty: 1, cost: JERON_PARTS['7984'].cost });
    }

    // ---- PATIENT STATIONS ----
    const stationMap = {
      'standard': '7920',
      'enhanced': '7923',
      'enhanced_dual': '7924',
      'behavioral': '7920-PC',
    };
    const stPn = stationMap[answers.stationType] || '7920';
    bom.push({ cat: 'Patient Stations', pn: stPn, name: JERON_PARTS[stPn].name, qty: beds, cost: JERON_PARTS[stPn].cost });

    // Pillow speakers & call cords (1 per bed)
    bom.push({ cat: 'Accessories', pn: '7901', name: JERON_PARTS['7901'].name, qty: beds, cost: JERON_PARTS['7901'].cost });
    bom.push({ cat: 'Accessories', pn: '7910', name: JERON_PARTS['7910'].name, qty: beds, cost: JERON_PARTS['7910'].cost });

    // Bathroom stations
    if (answers.bathroom === 'bath_1') {
      bom.push({ cat: 'Patient Stations', pn: '7932', name: JERON_PARTS['7932'].name, qty: beds, cost: JERON_PARTS['7932'].cost });
    } else if (answers.bathroom === 'bath_2') {
      bom.push({ cat: 'Patient Stations', pn: '7932', name: JERON_PARTS['7932'].name, qty: beds, cost: JERON_PARTS['7932'].cost });
      bom.push({ cat: 'Patient Stations', pn: '7958', name: JERON_PARTS['7958'].name, qty: beds, cost: JERON_PARTS['7958'].cost });
    }

    // Dome/zone lights (if not using dome room controllers)
    if (useSharedDome) {
      const domeCount = Math.ceil(beds / 2);
      bom.push({ cat: 'Dome/Zone Lights', pn: '7973', name: JERON_PARTS['7973'].name, qty: domeCount, cost: JERON_PARTS['7973'].cost });
    }

    // Consoles
    const consoleMap = {
      'jeron_7965': '7965',
      'jeron_7965b': '7965-B',
      'jeron_7985': '7985',
      'jeron_7967': '7967-M',
    };
    const cPn = consoleMap[answers.consoleType] || '7965';
    if (cPn === '7985') {
      bom.push({ cat: 'Consoles', pn: '7985', name: JERON_PARTS['7985'].name, qty: answers.consoleCount, cost: JERON_PARTS['7985'].cost });
    } else {
      bom.push({ cat: 'Consoles', pn: cPn, name: JERON_PARTS[cPn].name, qty: answers.consoleCount, cost: JERON_PARTS[cPn].cost });
    }

    // Wireless alerting
    if (answers.wireless === 'jeron_sip') {
      bom.push({ cat: 'Software', pn: '7978', name: JERON_PARTS['7978'].name, qty: 1, cost: JERON_PARTS['7978'].cost });
    } else if (answers.wireless === 'jeron_paging') {
      bom.push({ cat: 'Software', pn: '7979', name: JERON_PARTS['7979'].name, qty: 1, cost: JERON_PARTS['7979'].cost });
    } else if (answers.wireless === 'jeron_android') {
      bom.push({ cat: 'Software', pn: '7987', name: JERON_PARTS['7987'].name, qty: 1, cost: JERON_PARTS['7987'].cost });
    }

    // Integrations
    if (answers.integrations.includes('int_ehr')) {
      bom.push({ cat: 'Software', pn: '7977', name: JERON_PARTS['7977'].name, qty: 1, cost: JERON_PARTS['7977'].cost });
    }
    if (answers.integrations.includes('int_rtls')) {
      bom.push({ cat: 'Software', pn: '7981', name: JERON_PARTS['7981'].name, qty: 1, cost: JERON_PARTS['7981'].cost });
    }
    if (answers.integrations.includes('int_reporting')) {
      bom.push({ cat: 'Software', pn: '7983', name: JERON_PARTS['7983'].name, qty: 1, cost: JERON_PARTS['7983'].cost });
    }
    if (answers.integrations.includes('int_barcode')) {
      bom.push({ cat: 'Software', pn: '7982', name: JERON_PARTS['7982'].name, qty: 1, cost: JERON_PARTS['7982'].cost });
    }

  } else {
    // ---- RCare ----
    // Server
    if (beds <= 128) {
      bom.push({ cat: 'Infrastructure', pn: 'BCube', name: RCARE_PARTS['BCube'].name, qty: 1, cost: RCARE_PARTS['BCube'].cost });
    } else {
      bom.push({ cat: 'Infrastructure', pn: 'RCube', name: RCARE_PARTS['RCube'].name, qty: 1, cost: RCARE_PARTS['RCube'].cost });
    }

    // Master Receiver
    bom.push({ cat: 'Infrastructure', pn: 'MR-500-G4', name: RCARE_PARTS['MR-500-G4'].name, qty: 1, cost: RCARE_PARTS['MR-500-G4'].cost });

    // Locators (1 per 18 rooms)
    const locCount = Math.max(1, Math.ceil(beds / 18));
    bom.push({ cat: 'Infrastructure', pn: 'LT-490-G4', name: RCARE_PARTS['LT-490-G4'].name, qty: locCount, cost: RCARE_PARTS['LT-490-G4'].cost });

    // Repeaters (1 per 35 rooms)
    const repCount = Math.max(1, Math.ceil(beds / 35));
    bom.push({ cat: 'Infrastructure', pn: 'RP-990-G4', name: RCARE_PARTS['RP-990-G4'].name, qty: repCount, cost: RCARE_PARTS['RP-990-G4'].cost });

    // Pendants (1.2x bed count for spares)
    const pendantQty = Math.ceil(beds * 1.2);
    bom.push({ cat: 'Resident Devices', pn: 'Pretty-G4', name: RCARE_PARTS['Pretty-G4'].name, qty: pendantQty, cost: RCARE_PARTS['Pretty-G4'].cost });

    // Station type extras
    if (answers.stationType === 'rcare_pendant_pull' || answers.stationType === 'rcare_full') {
      bom.push({ cat: 'Resident Devices', pn: 'BP-7RWR', name: RCARE_PARTS['BP-7RWR'].name, qty: beds, cost: RCARE_PARTS['BP-7RWR'].cost });
    }
    if (answers.stationType === 'rcare_pendant_bed' || answers.stationType === 'rcare_full') {
      bom.push({ cat: 'Resident Devices', pn: 'JR-14', name: RCARE_PARTS['JR-14'].name, qty: beds, cost: RCARE_PARTS['JR-14'].cost });
    }

    // Bathroom
    if (answers.bathroom === 'bath_1') {
      bom.push({ cat: 'Resident Devices', pn: 'BP-7RWR', name: RCARE_PARTS['BP-7RWR'].name + ' (Bathroom)', qty: beds, cost: RCARE_PARTS['BP-7RWR'].cost });
    } else if (answers.bathroom === 'bath_2') {
      bom.push({ cat: 'Resident Devices', pn: 'BP-7RWR', name: RCARE_PARTS['BP-7RWR'].name + ' (Bath+Shower)', qty: beds * 2, cost: RCARE_PARTS['BP-7RWR'].cost });
    }

    // Dome lights
    if (answers.domeLights === 'dome_1per') {
      bom.push({ cat: 'Communication', pn: 'Dome-LED', name: RCARE_PARTS['Dome-LED'].name, qty: beds, cost: RCARE_PARTS['Dome-LED'].cost });
    } else if (answers.domeLights === 'dome_2per') {
      bom.push({ cat: 'Communication', pn: 'Dome-LED', name: RCARE_PARTS['Dome-LED'].name, qty: Math.ceil(beds / 2), cost: RCARE_PARTS['Dome-LED'].cost });
    }

    // Console
    const rConsoleMap = {
      'rcare_cc980': 'CC980',
      'rcare_cc10': 'CC-10',
      'rcare_bcube': 'BCube',
      'rcare_rcube': 'RCube',
    };
    const rConsole = rConsoleMap[answers.consoleType];
    if (rConsole && rConsole !== 'BCube' && rConsole !== 'RCube') {
      bom.push({ cat: 'Nurse Stations', pn: rConsole, name: RCARE_PARTS[rConsole].name, qty: answers.consoleCount, cost: RCARE_PARTS[rConsole].cost });
    }

    // Wireless
    if (answers.wireless === 'rcare_rphone') {
      bom.push({ cat: 'Communication', pn: 'RPhone', name: RCARE_PARTS['RPhone'].name, qty: answers.consoleCount * 2, cost: RCARE_PARTS['RPhone'].cost });
    } else if (answers.wireless === 'rcare_pager') {
      bom.push({ cat: 'Communication', pn: 'Pager-Int', name: RCARE_PARTS['Pager-Int'].name, qty: 1, cost: RCARE_PARTS['Pager-Int'].cost });
    }

    // Integrations
    if (answers.integrations.includes('int_ehr')) {
      bom.push({ cat: 'Software/Integration', pn: 'PCC-Int', name: RCARE_PARTS['PCC-Int'].name, qty: 1, cost: RCARE_PARTS['PCC-Int'].cost });
    }
    if (answers.integrations.includes('int_wander')) {
      bom.push({ cat: 'Software/Integration', pn: 'Wander-Int', name: RCARE_PARTS['Wander-Int'].name, qty: 1, cost: RCARE_PARTS['Wander-Int'].cost });
    }
    if (answers.integrations.includes('int_rtls')) {
      bom.push({ cat: 'Software/Integration', pn: 'MCube', name: RCARE_PARTS['MCube'].name, qty: 1, cost: RCARE_PARTS['MCube'].cost });
    }
  }

  // Calculate totals
  let equipDealerTotal = 0;
  let equipSellTotal = 0;
  const bomWithPricing = bom.map(item => {
    const lineDealer = item.cost * item.qty;
    const lineSell = sellPrice(item.cost) * item.qty;
    equipDealerTotal += lineDealer;
    equipSellTotal += lineSell;
    return {
      ...item,
      lineDealer,
      lineSell,
      unitSell: sellPrice(item.cost),
    };
  });

  // Installation
  let installCost = 0;
  if (answers.installation === 'professional') installCost = 150 * beds;
  if (answers.installation === 'turnkey') installCost = 250 * beds;

  const grandTotal = equipSellTotal + installCost;
  const marginTotal = equipSellTotal - equipDealerTotal;

  // Financing options (based on mid-range estimate)
  const midTotal = grandTotal;
  const financing = {
    apr: FINANCE_APR,
    terms: [
      { months: 36, monthly: calcMonthlyPayment(midTotal, FINANCE_APR, 36) },
      { months: 48, monthly: calcMonthlyPayment(midTotal, FINANCE_APR, 48) },
      { months: 60, monthly: calcMonthlyPayment(midTotal, FINANCE_APR, 60) },
    ],
  };

  // NCaaS (Nurse Call as a Service) — equipment + maintenance + monitoring
  const ncaasMonthly = (midTotal * NCAAS_MARKUP) / NCAAS_TERM;
  const ncaasPerBed = ncaasMonthly / beds;
  const ncaas = {
    termMonths: NCAAS_TERM,
    monthly: ncaasMonthly,
    perBed: ncaasPerBed,
    includes: [
      'All system equipment and components',
      'Professional installation and commissioning',
      'Preventive maintenance and inspections',
      '24/7 remote monitoring and support',
      'Software updates and firmware upgrades',
      'Hardware replacement coverage',
    ],
  };

  return {
    bom: bomWithPricing,
    equipDealerTotal,
    equipSellTotal,
    installCost,
    grandTotal,
    marginTotal,
    financing,
    ncaas,
    facilityImage: facilityImageData,
    answers,
  };
}

// ---- Render Quote ----
function renderQuote(result) {
  const qv = document.getElementById('quoteView');
  qv.style.display = 'block';
  const a = result.answers;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const intLabels = a.integrationsLabels && a.integrationsLabels.length > 0 ? a.integrationsLabels.join(', ') : 'None';

  // Calculate +/- 30% range
  const rangeLow = Math.round(result.grandTotal * 0.70);
  const rangeHigh = Math.round(result.grandTotal * 1.30);

  // Build system summary grouped by category (no prices, no part numbers)
  const categories = {};
  result.bom.forEach(item => {
    if (!categories[item.cat]) categories[item.cat] = [];
    categories[item.cat].push(item);
  });

  let summaryHtml = '';
  for (const [cat, items] of Object.entries(categories)) {
    summaryHtml += `<div class="summary-category">
      <h3 class="summary-cat-title">${cat}</h3>
      <ul class="summary-list">`;
    items.forEach(item => {
      summaryHtml += `<li>${item.name} <span class="summary-qty">\u00d7${item.qty}</span></li>`;
    });
    summaryHtml += '</ul></div>';
  }

  // Facility image
  const facilityImgHtml = result.facilityImage
    ? `<div class="facility-image-wrap">
         <img src="${result.facilityImage}" alt="${a.leadFacility || 'Facility'}" class="facility-image" />
         <div class="facility-image-label">${a.leadFacility || ''}</div>
       </div>`
    : '';

  // Financing
  const fin = result.financing;
  let finCardsHtml = '';
  fin.terms.forEach(t => {
    const low = Math.round(t.monthly * 0.70);
    const high = Math.round(t.monthly * 1.30);
    const label = t.months === 36 ? '3-Year' : t.months === 48 ? '4-Year' : '5-Year';
    const highlight = t.months === 60 ? ' financing-card--popular' : '';
    finCardsHtml += `<div class="financing-card${highlight}">
      ${t.months === 60 ? '<div class="financing-badge">Lowest Payment</div>' : ''}
      <div class="financing-term">${label}</div>
      <div class="financing-months">${t.months} months</div>
      <div class="financing-amount">${fmtWhole(low)} \u2014 ${fmtWhole(high)}</div>
      <div class="financing-per">per month</div>
    </div>`;
  });

  // NCaaS
  const nc = result.ncaas;
  const ncMonthLow = Math.round(nc.monthly * 0.70);
  const ncMonthHigh = Math.round(nc.monthly * 1.30);
  const ncBedLow = (nc.perBed * 0.70).toFixed(2);
  const ncBedHigh = (nc.perBed * 1.30).toFixed(2);
  let ncIncludes = '';
  nc.includes.forEach(item => {
    ncIncludes += `<li>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      ${item}
    </li>`;
  });

  qv.innerHTML = `
    ${facilityImgHtml}
    <div class="quote-header">
      <div class="quote-header-left">
        <h1>System Estimate</h1>
        <p>${a.leadFacility ? a.leadFacility + ' \u2014 ' : ''}${a.facilityTypeLabel || ''} \u2014 ${a.beds} Beds | ${today}</p>
        ${a.leadName ? `<p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-top:var(--space-1);">Prepared for ${a.leadName}</p>` : ''}
      </div>
      <div class="quote-header-right">
        <div class="quote-total-label">Estimated Investment</div>
        <div class="quote-total-value">${fmt(rangeLow)} \u2014 ${fmt(rangeHigh)}</div>
        <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-1);">Final pricing determined after site survey</div>
      </div>
    </div>
    <div class="quote-body">
      <!-- Facility Profile -->
      <div class="quote-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>
          Facility Profile
        </h2>
        <div class="facility-grid">
          <div class="facility-item"><div class="label">Facility Type</div><div class="value">${a.facilityTypeLabel}</div></div>
          <div class="facility-item"><div class="label">Beds/Rooms</div><div class="value">${a.beds}</div></div>
          <div class="facility-item"><div class="label">Project Type</div><div class="value">${a.constructionTypeLabel}</div></div>
          <div class="facility-item"><div class="label">Platform</div><div class="value">${a.platformLabel}</div></div>
          <div class="facility-item"><div class="label">Patient Station</div><div class="value">${a.stationTypeLabel}</div></div>
          <div class="facility-item"><div class="label">Bathroom Stations</div><div class="value">${a.bathroomLabel}</div></div>
          <div class="facility-item"><div class="label">Console Type</div><div class="value">${a.consoleTypeLabel}</div></div>
          <div class="facility-item"><div class="label">Consoles</div><div class="value">${a.consoleCount}</div></div>
          <div class="facility-item"><div class="label">Dome Lights</div><div class="value">${a.domeLightsLabel}</div></div>
          <div class="facility-item"><div class="label">Wireless Alerting</div><div class="value">${a.wirelessLabel}</div></div>
          <div class="facility-item"><div class="label">Integrations</div><div class="value">${intLabels}</div></div>
          <div class="facility-item"><div class="label">Installation</div><div class="value">${a.installationLabel}</div></div>
        </div>
      </div>

      <!-- System Components -->
      <div class="quote-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
          System Components
        </h2>
        <div class="system-summary">
          ${summaryHtml}
        </div>
      </div>

      <!-- Estimated Investment -->
      <div class="quote-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Estimated Investment
        </h2>
        <div class="estimate-box">
          <div class="estimate-range">
            <div class="estimate-low">${fmt(rangeLow)}</div>
            <div class="estimate-dash">\u2014</div>
            <div class="estimate-high">${fmt(rangeHigh)}</div>
          </div>
          <p class="estimate-note">This estimate is based on the specifications above. Final pricing will be determined after an on-site survey and detailed engineering review by NexusCT. Actual costs may vary based on facility layout, cabling requirements, and site-specific conditions.</p>
        </div>
      </div>

      <!-- Financing Options -->
      <div class="quote-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Financing Options
        </h2>
        <p class="section-subtitle">Spread your investment over time with flexible financing at ${(fin.apr * 100).toFixed(1)}% APR.</p>
        <div class="financing-cards">
          ${finCardsHtml}
        </div>
        <p class="financing-disclaimer">Financing subject to credit approval. Rates and terms may vary. Estimated payments shown are based on the investment range above.</p>
      </div>

      <!-- NCaaS -->
      <div class="quote-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4z"/><path d="M2 10h20"/><path d="M12 14v4"/><path d="M8 14v4"/><path d="M16 14v4"/></svg>
          Nurse Call as a Service (NCaaS)
        </h2>
        <p class="section-subtitle">Eliminate capital expenditure entirely. Get a fully managed nurse call system as a monthly operating expense.</p>
        <div class="ncaas-box">
          <div class="ncaas-pricing">
            <div class="ncaas-amount">${fmtWhole(ncMonthLow)} \u2014 ${fmtWhole(ncMonthHigh)}<span>/mo</span></div>
            <div class="ncaas-perbed">$${ncBedLow} \u2014 $${ncBedHigh} per bed/month</div>
            <div class="ncaas-term">${nc.termMonths}-month service agreement</div>
          </div>
          <div class="ncaas-includes">
            <h4>Everything Included:</h4>
            <ul>${ncIncludes}</ul>
          </div>
        </div>
        <p class="financing-disclaimer">NCaaS pricing is estimated and subject to final site survey. Agreement terms and conditions apply. CapEx-to-OpEx conversion simplifies budgeting and includes full lifecycle management.</p>
      </div>

      <!-- Terms -->
      <div class="quote-section" style="margin-top:var(--space-6);">
        <div style="background:var(--color-surface-offset);border-radius:var(--radius-lg);padding:var(--space-4);font-size:var(--text-xs);color:var(--color-text-muted);line-height:1.7;">
          <strong style="color:var(--color-text);">Disclaimer</strong><br>
          This is a preliminary budget estimate only and does not constitute a formal quote or proposal.
          Final pricing requires an on-site assessment. 5-year manufacturer warranty included with all platforms.
          Tax not included. Contact NexusCT to schedule your complimentary site survey.
        </div>
      </div>

      <!-- Actions -->
      <div class="quote-actions">
        <button class="btn btn-primary" onclick="downloadPDF()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Estimate PDF
        </button>
        <a class="btn btn-success" href="mailto:jmazza@nexusct.com?subject=Nurse Call Estimate \u2014 ${encodeURIComponent(a.leadFacility || a.facilityTypeLabel)} \u2014 ${a.beds} Beds&body=${encodeURIComponent('Name: ' + (a.leadName || '') + '\nEmail: ' + (a.leadEmail || '') + '\nPhone: ' + (a.leadPhone || '') + '\nFacility: ' + (a.leadFacility || '') + (a.leadNotes ? '\nNotes: ' + a.leadNotes : '') + '\n\nI\'d like to discuss a nurse call system for our ' + a.beds + '-bed ' + a.facilityTypeLabel + ' facility.\n\nEstimated range: ' + fmt(rangeLow) + ' \u2014 ' + fmt(rangeHigh) + '\n\nPlease contact me to schedule a site survey.\n\nGenerated by NexusCT System Designer.')}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Request Site Survey
        </a>
        <button class="btn btn-secondary" onclick="startOver()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          Start Over
        </button>
      </div>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Store result globally for PDF
  window._quoteResult = result;
}

// ---- Start Over ----
window.startOver = function() {
  answers = {};
  currentStep = 0;
  selectedIntegrations = [];
  document.getElementById('quoteView').style.display = 'none';
  document.getElementById('quoteView').innerHTML = '';
  document.getElementById('chatView').style.display = 'flex';
  document.getElementById('progressWrap').style.display = 'block';
  chatMessages.innerHTML = '';
  updateProgress(0);
  startConversation();
};

// ---- PDF Generation ----
window.downloadPDF = function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const result = window._quoteResult;
  const a = result.answers;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const rangeLow = Math.round(result.grandTotal * 0.70);
  const rangeHigh = Math.round(result.grandTotal * 1.30);
  const refNo = `NC-${Date.now().toString(36).toUpperCase()}`;

  function addFooter() {
    doc.setFontSize(7);
    doc.setTextColor(130, 130, 130);
    doc.text('NexusCT | Nexus Communications Technology | (847) 796-5585 | info@nxsct.com | Schaumburg, IL', pw / 2, ph - 8, { align: 'center' });
  }

  // PAGE 1: COVER PAGE
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, pw, 50, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NexusCT', 14, 22);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Nexus Communications Technology', 14, 32);
  doc.text('(847) 796-5585  |  info@nxsct.com  |  Schaumburg, IL', 14, 40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SYSTEM ESTIMATE', pw - 14, 22, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(today, pw - 14, 32, { align: 'right' });
  doc.text(`Ref #${refNo}`, pw - 14, 40, { align: 'right' });

  let yPos = 65;

  if (result.facilityImage) {
    try {
      const imgWidth = pw - 28;
      const imgHeight = 60;
      doc.addImage(result.facilityImage, 'JPEG', 14, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 8;
    } catch (e) {
      console.warn('Could not add facility image to PDF:', e);
    }
  }

  if (a.leadName || a.leadFacility) {
    doc.setTextColor(0, 86, 179);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Prepared For', 14, yPos);
    yPos += 8;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    if (a.leadFacility) { doc.setFont('helvetica', 'bold'); doc.text(a.leadFacility, 14, yPos); yPos += 6; }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    if (a.leadName) { doc.text(a.leadName, 14, yPos); yPos += 5; }
    if (a.leadEmail) { doc.text(a.leadEmail, 14, yPos); yPos += 5; }
    if (a.leadPhone) { doc.text(a.leadPhone, 14, yPos); yPos += 5; }
    yPos += 5;
  }

  doc.setFillColor(26, 26, 46);
  doc.roundedRect(14, yPos, pw - 28, 30, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Estimated Investment Range', 20, yPos + 10);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(74, 222, 128);
  doc.text(`${fmt(rangeLow)}  \u2014  ${fmt(rangeHigh)}`, pw - 20, yPos + 21, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 200);
  doc.text('Including equipment + installation | Final pricing after site survey', 20, yPos + 20);

  addFooter();

  // PAGE 2: FACILITY PROFILE + SYSTEM COMPONENTS
  doc.addPage();
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, pw, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('NexusCT System Estimate', 14, 12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref #${refNo}`, pw - 14, 12, { align: 'right' });
  yPos = 28;

  doc.setTextColor(0, 86, 179);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Facility Profile', 14, yPos);
  yPos += 7;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const infoItems = [
    ['Facility Type', a.facilityTypeLabel],
    ['Beds/Rooms', String(a.beds)],
    ['Project Type', a.constructionTypeLabel],
    ['Platform', a.platformLabel],
    ['Patient Station', a.stationTypeLabel],
    ['Bathroom Stations', a.bathroomLabel],
    ['Console Type', a.consoleTypeLabel],
    ['Console Count', String(a.consoleCount)],
    ['Dome Lights', a.domeLightsLabel],
    ['Wireless Alerting', a.wirelessLabel],
    ['Installation', a.installationLabel],
  ];

  infoItems.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value || '', 55, yPos);
    yPos += 5;
  });

  yPos += 5;

  doc.setTextColor(0, 86, 179);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('System Components', 14, yPos);
  yPos += 3;

  const tableData = [];
  const categories = {};
  result.bom.forEach(item => {
    if (!categories[item.cat]) categories[item.cat] = [];
    categories[item.cat].push(item);
  });

  for (const [cat, items] of Object.entries(categories)) {
    tableData.push([{ content: cat, colSpan: 2, styles: { fontStyle: 'bold', fillColor: [227, 239, 252], textColor: [0, 86, 179], fontSize: 8 } }]);
    items.forEach(item => {
      tableData.push([item.name, String(item.qty)]);
    });
  }

  doc.autoTable({
    startY: yPos,
    head: [['Component', 'Qty']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [0, 86, 179], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { halign: 'center', cellWidth: 25 },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: function() { addFooter(); }
  });

  // PAGE 3: FINANCING + NCaaS
  doc.addPage();
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, pw, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('NexusCT System Estimate', 14, 12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref #${refNo}`, pw - 14, 12, { align: 'right' });
  yPos = 28;

  doc.setFillColor(26, 26, 46);
  doc.roundedRect(14, yPos, pw - 28, 28, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Estimated Investment', 20, yPos + 10);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(74, 222, 128);
  doc.text(`${fmt(rangeLow)}  \u2014  ${fmt(rangeHigh)}`, pw - 20, yPos + 19, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 200);
  doc.text('Including equipment + installation', 20, yPos + 18);
  yPos += 40;

  doc.setTextColor(0, 86, 179);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Financing Options', 14, yPos);
  yPos += 4;
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Spread your investment over time with flexible financing at ${(result.financing.apr * 100).toFixed(1)}% APR.`, 14, yPos + 3);
  yPos += 6;

  const finTableData = result.financing.terms.map(t => {
    const low = Math.round(t.monthly * 0.70);
    const high = Math.round(t.monthly * 1.30);
    const label = t.months === 36 ? '3-Year (36 mo)' : t.months === 48 ? '4-Year (48 mo)' : '5-Year (60 mo)';
    return [label, `${fmtWhole(low)} \u2014 ${fmtWhole(high)} /mo`];
  });

  doc.autoTable({
    startY: yPos,
    head: [['Term', 'Estimated Monthly Payment']],
    body: finTableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 86, 179], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 4;
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'italic');
  doc.text('Financing subject to credit approval. Rates and terms may vary. Estimated payments based on investment range.', 14, yPos);
  yPos += 14;

  doc.setTextColor(0, 86, 179);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Nurse Call as a Service (NCaaS)', 14, yPos);
  yPos += 4;
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Eliminate capital expenditure. Get a fully managed nurse call system as a monthly operating expense.', 14, yPos + 3);
  yPos += 10;

  const nc = result.ncaas;
  const ncMonthLow = Math.round(nc.monthly * 0.70);
  const ncMonthHigh = Math.round(nc.monthly * 1.30);
  const ncBedLow = (nc.perBed * 0.70).toFixed(2);
  const ncBedHigh = (nc.perBed * 1.30).toFixed(2);

  doc.setFillColor(240, 247, 255);
  doc.roundedRect(14, yPos, pw - 28, 48, 3, 3, 'F');
  doc.setDrawColor(0, 86, 179);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, yPos, pw - 28, 48, 3, 3, 'S');
  doc.setTextColor(0, 86, 179);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${fmtWhole(ncMonthLow)} \u2014 ${fmtWhole(ncMonthHigh)} /month`, pw / 2, yPos + 14, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(`$${ncBedLow} \u2014 $${ncBedHigh} per bed/month  |  ${nc.termMonths}-month service agreement`, pw / 2, yPos + 22, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  let includeY = yPos + 30;
  doc.setFont('helvetica', 'bold');
  doc.text('Includes:', 20, includeY);
  doc.setFont('helvetica', 'normal');
  const includeText = nc.includes.join('  |  ');
  const splitIncludes = doc.splitTextToSize(includeText, pw - 48);
  doc.text(splitIncludes, 20, includeY + 5);
  yPos += 60;

  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'italic');
  doc.text('NCaaS pricing estimated and subject to final site survey. CapEx-to-OpEx conversion simplifies budgeting with full lifecycle management.', 14, yPos);
  yPos += 14;

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a preliminary budget estimate and does not constitute a formal quote or proposal.', 14, yPos);
  doc.text('Final pricing requires an on-site assessment. 5-year manufacturer warranty included. Tax not included.', 14, yPos + 4);
  doc.text('Contact NexusCT to schedule your complimentary site survey.', 14, yPos + 8);

  addFooter();

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `NexusCT_Estimate_${a.beds}beds_${new Date().toISOString().slice(0,10)}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

// ---- Save Quote to Backend ----
async function saveQuote(result) {
  try {
    await fetch(`${CGI_BIN}/api.py/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        facility_name: result.answers.leadFacility || (result.answers.facilityTypeLabel + ' \u2014 ' + result.answers.beds + ' beds'),
        facility_type: result.answers.facilityType,
        beds: result.answers.beds,
        platform: result.answers.platformLabel,
        total_price: result.grandTotal,
        equipment_total: result.equipSellTotal,
        installation_total: result.installCost,
        margin_total: result.marginTotal,
        components: result.bom.map(b => ({ pn: b.pn, name: b.name, qty: b.qty, sell: b.lineSell })),
        answers: result.answers,
        lead_name: result.answers.leadName || '',
        lead_email: result.answers.leadEmail || '',
        lead_phone: result.answers.leadPhone || '',
        lead_facility: result.answers.leadFacility || '',
        lead_notes: result.answers.leadNotes || '',
      }),
    });
  } catch (e) {
    console.warn('Could not save quote:', e);
  }
}

// ---- Admin View ----
async function showAdmin() {
  document.getElementById('chatView').style.display = 'none';
  document.getElementById('progressWrap').style.display = 'none';
  const av = document.getElementById('adminView');
  av.style.display = 'block';

  av.innerHTML = `
    <div class="admin-login">
      <h2>Admin Access</h2>
      <p style="color:var(--color-text-muted);font-size:var(--text-sm);margin-bottom:var(--space-4);">Enter the admin password to view saved quotes.</p>
      <input type="password" id="adminPwd" placeholder="Password">
      <button class="btn btn-primary" style="width:100%;" onclick="adminLogin()">Sign In</button>
      <button class="btn btn-secondary" style="width:100%;margin-top:var(--space-2);" onclick="window.location.hash='';window.location.reload();">Back to Designer</button>
    </div>
  `;
}

window.adminLogin = async function() {
  const pwd = document.getElementById('adminPwd').value;
  if (!pwd) return;

  const av = document.getElementById('adminView');
  try {
    const res = await fetch(`${CGI_BIN}/api.py/admin?password=${encodeURIComponent(pwd)}`);
    if (!res.ok) {
      av.innerHTML = `<div class="admin-login"><h2>Access Denied</h2><p style="color:var(--color-error);">Invalid password.</p><button class="btn btn-secondary" style="margin-top:var(--space-4);" onclick="showAdmin()">Try Again</button></div>`;
      return;
    }
    const quotes = await res.json();
    renderAdminQuotes(quotes);
  } catch (e) {
    av.innerHTML = `<div class="admin-login"><h2>Error</h2><p style="color:var(--color-error);">Could not connect to server.</p><button class="btn btn-secondary" style="margin-top:var(--space-4);" onclick="showAdmin()">Try Again</button></div>`;
  }
};

function renderAdminQuotes(quotes) {
  const av = document.getElementById('adminView');
  if (quotes.length === 0) {
    av.innerHTML = `
      <h1>Saved Quotes</h1>
      <p style="color:var(--color-text-muted);">No quotes have been generated yet.</p>
      <button class="btn btn-secondary" style="margin-top:var(--space-4);" onclick="window.location.hash='';window.location.reload();">Back to Designer</button>
    `;
    return;
  }

  let html = `<h1>Saved Quotes (${quotes.length})</h1>
    <button class="btn btn-secondary" style="margin-bottom:var(--space-4);" onclick="window.location.hash='';window.location.reload();">Back to Designer</button>
    <div class="admin-quotes-list">`;

  quotes.forEach(q => {
    const date = new Date(q.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const hasLead = q.lead_name || q.lead_email || q.lead_phone;
    const leadHtml = hasLead ? `
      <div class="admin-lead-info">
        <strong style="color:var(--color-primary);font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.05em;">Lead Contact</strong>
        <div style="margin-top:var(--space-1);font-size:var(--text-sm);line-height:1.6;">
          ${q.lead_name ? `<div><strong>Name:</strong> ${q.lead_name}</div>` : ''}
          ${q.lead_email ? `<div><strong>Email:</strong> <a href="mailto:${q.lead_email}" style="color:var(--color-primary);">${q.lead_email}</a></div>` : ''}
          ${q.lead_phone ? `<div><strong>Phone:</strong> <a href="tel:${q.lead_phone}" style="color:var(--color-primary);">${q.lead_phone}</a></div>` : ''}
          ${q.lead_facility ? `<div><strong>Facility:</strong> ${q.lead_facility}</div>` : ''}
          ${q.lead_notes ? `<div><strong>Notes:</strong> ${q.lead_notes}</div>` : ''}
        </div>
      </div>
    ` : '';
    html += `
      <div class="admin-quote-card">
        <h3>${q.facility_name}</h3>
        ${leadHtml}
        <div class="meta">
          <span>Platform: ${q.platform || 'N/A'}</span>
          <span>Beds: ${q.beds}</span>
          <span>Type: ${q.facility_type}</span>
          <span>Date: ${date}</span>
        </div>
        <div class="total">${fmt(q.total_price)}</div>
        <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-1);">
          Equipment: ${fmt(q.equipment_total)} | Installation: ${fmt(q.installation_total)} | Margin: ${fmt(q.margin_total)}
        </div>
      </div>
    `;
  });

  html += '</div>';
  av.innerHTML = html;
}

// ---- Hash routing ----
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#admin') {
    showAdmin();
  }
});

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // Handle enter key on numeric inputs
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (document.activeElement?.id === 'bedInput') window.submitBeds();
      if (document.activeElement?.id === 'consoleInput') window.submitConsoles();
      if (document.activeElement?.id === 'adminPwd') window.adminLogin();
      // Lead form: Enter on any field except textarea submits
      const leadFields = ['leadName', 'leadEmail', 'leadPhone', 'leadFacility'];
      if (leadFields.includes(document.activeElement?.id)) window.submitLeadForm();
    }
  });

  startConversation();
});
