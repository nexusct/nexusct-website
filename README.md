# NexusCT Website

Enterprise technology solutions website for **NexusCT** (Nexus Communications Technology) — Schaumburg, IL.

> Connecting Your World, Powering Your Future.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Pages](#pages)
- [Nurse Call System Designer](#nurse-call-system-designer)
- [Backend Services](#backend-services)
- [Design System](#design-system)
- [Development](#development)
- [Deployment](#deployment)
- [Contact](#contact)
- [License](#license)

---

## Overview

A multi-page marketing and tool website covering NexusCT's full service portfolio. The site is built with vanilla HTML, CSS, and JavaScript — no frameworks — and is designed for static hosting with an optional CGI-bin backend for data persistence.

### Key Features

- **13-page multi-section site** covering healthcare, technology, and managed services
- **Interactive Nurse Call System Designer** embedded directly into product pages (wired, wireless, NCaaS) and available as a standalone tool
- **AI-powered questionnaire** that auto-designs nurse call systems with instant budget estimates
- **Lead capture and quote storage** via SQLite backend
- **Light/dark mode** with CSS custom properties
- **Fully responsive** — optimized for desktop and mobile
- **PDF generation** — client-side quote PDFs with facility images via jsPDF

---

## Architecture

```
nexusct-site/
├── index.html                  # Homepage
├── about.html                  # Company story & certifications
├── healthcare.html             # Healthcare & Life Safety overview
├── nurse-call-wired.html       # Jeron Provider 700/790 + embedded designer
├── nurse-call-wireless.html    # RCare G4 Wireless + embedded designer
├── ncaas.html                  # Nurse Call as-a-Service + embedded designer
├── nurse-call-designer.html    # Standalone designer tool (full page)
├── rtls.html                   # RTLS & Wander Management
├── patient-safety.html         # Patient Safety & Security
├── nexus360.html               # Nexus360 Managed Healthcare Platform
├── unifi360.html               # UniFi as a Service (3 tiers)
├── services.html               # Full services overview (ICT, security, A/V)
├── contact.html                # Contact form with facility type selector
│
├── base.css                    # Global CSS resets
├── style.css                   # Site-wide design system (~1560 lines)
├── site.js                     # Navigation, dark mode, scroll reveals
│
├── nurse-call-base.css         # Designer tool CSS resets
├── nurse-call-style.css        # Designer tool styles (~1390 lines)
├── nurse-call-app.js           # Designer tool logic (~1784 lines)
│
├── cgi-bin/
│   ├── api.py                  # Quote/lead storage API (SQLite)
│   └── image_proxy.py          # Google image search proxy
│
├── .gitignore
└── README.md
```

### How the Designer Is Integrated

The Nurse Call System Designer is embedded in two ways:

1. **Inline on product pages** — `nurse-call-wired.html`, `nurse-call-wireless.html`, and `ncaas.html` each include the full designer below their product content. The designer section has its own heading ("Design Your Nurse Call System") with the overline "INTERACTIVE TOOL" and is wrapped in an `.nc-designer-section` container. Visitors read about the product and then immediately interact with the designer without leaving the page.

2. **Standalone page** — `nurse-call-designer.html` provides the designer as a dedicated full-page experience, linked from the site navigation.

Both approaches use the same markup structure (`.nc-designer-wrapper > .app-container > #chatMessages` etc.), the same CSS files (`nurse-call-base.css`, `nurse-call-style.css`), and the same JavaScript (`nurse-call-app.js`). The tool's internal header and footer are hidden via CSS when embedded within the site shell.

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Homepage | `index.html` | Hero, solutions overview, differentiators, CTA |
| About | `about.html` | Company story, BICSI/AVIXA certifications, industry focus |
| Healthcare | `healthcare.html` | Healthcare & Life Safety overview with 6 solution cards |
| Wired Nurse Call | `nurse-call-wired.html` | Jeron Provider 700/790 features, compliance badges, **embedded designer** |
| Wireless Nurse Call | `nurse-call-wireless.html` | RCare G4 features, wireless advantages, **embedded designer** |
| NCaaS | `ncaas.html` | Subscription-based nurse call, benefits, **embedded designer** |
| System Designer | `nurse-call-designer.html` | Standalone full-page nurse call designer tool |
| RTLS | `rtls.html` | Real-time location tracking & wander management |
| Patient Safety | `patient-safety.html` | Integrated patient safety & security platform |
| Nexus360 | `nexus360.html` | Unified managed healthcare environment |
| UniFi360 | `unifi360.html` | UniFi as a Service — Essential, Professional, Enterprise tiers |
| Services | `services.html` | ICT infrastructure, security, smart building, A/V, LED |
| Contact | `contact.html` | Contact form with facility type dropdown |

---

## Nurse Call System Designer

### Questionnaire Flow (13 Steps)

| Step | Question | Input Type |
|------|----------|------------|
| 1 | Facility type | Card selection (8 options) |
| 2 | Number of beds/rooms | Numeric input |
| 3 | Platform recommendation | Auto-selected or card selection |
| 4 | Call station type | Card selection |
| 5 | Nurse console count | Numeric input |
| 6 | Corridor dome lights | Yes/No |
| 7 | Code Blue stations | Yes/No + count |
| 8 | Wander management | Yes/No |
| 9 | Staff assignment | Yes/No |
| 10 | RTLS integration | Yes/No |
| 11 | Software add-ons | Multi-select checkboxes |
| 12 | Installation type | Card selection (Professional / Full Turnkey) |
| 13 | Lead capture form | Name, email, phone, facility, notes |

### Supported Platforms

| Platform | Use Case | Key Differentiator |
|----------|----------|-------------------|
| **Jeron Provider 790** | IP-based acute care | Full-featured IP nurse call |
| **Jeron Provider 700** | Networked skilled/sub-acute care | Reliable networked wired system |
| **RCare G4 Wireless** | ALF/SNF wireless, retrofits | UL1069-compliant wireless |

### Pricing Logic

- **Margin**: 25% (sell price = dealer cost / 0.75)
- **Client-facing total**: Displayed as a range of ±30% (e.g., "$42,000 — $78,000")
- **No line-item pricing** is shown to the client — only component names, quantities by category, and the total range
- **Financing**: 7.9% APR with 36, 48, and 60-month terms (payments shown as ±30% range)
- **NCaaS**: 20% service premium (`NCAAS_MARKUP = 1.20`) over a 60-month managed service term

### Installation Options

| Type | Per-Bed Cost | Description |
|------|-------------|-------------|
| Professional Install | $150/bed | Licensed technician installation with project management |
| Full Turnkey | $250/bed | Complete installation including low-voltage cabling, pathways, and infrastructure |

### Facility Image

The designer searches for a Google image of the facility (by name) and includes it on the cover page of the generated PDF quote. This is powered by the `cgi-bin/image_proxy.py` proxy.

### Admin Panel

Access at any designer page URL with `#admin` appended (e.g., `nurse-call-designer.html#admin`).

- **Password**: `nexus2026`
- **Features**: View all submitted quotes and leads, with contact info, platform, bed count, facility type, date, and pricing breakdowns

---

## Backend Services

### `cgi-bin/api.py` — Quote & Lead Storage

- **POST /cgi-bin/api.py** — Store a completed quote with lead info, pricing, and system configuration
- **GET /cgi-bin/api.py** — Retrieve all stored quotes (used by the admin panel)
- **Storage**: SQLite database (`quotes.db`)
- **Fields stored**: Facility name/type, platform, bed count, lead contact info, equipment/installation/margin totals, component details

### `cgi-bin/image_proxy.py` — Facility Image Proxy

- **GET /cgi-bin/image_proxy.py?q=FACILITY_NAME** — Returns a Google image search result for the given facility name
- Used by the designer to fetch a facility photo for the PDF cover page
- Returns image data as base64 for client-side use

---

## Design System

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#0056b3` | NexusCT Blue — buttons, links, accents |
| `--color-success` | `#28a745` | NexusCT Green — success states, badges |
| `--color-charcoal` | `#1a1a2e` | Body text, dark surfaces |
| `--color-error` | `#dc3545` | Error states |
| `--color-warning` | `#f0ad4e` | Warning states |

### Typography

- **Font**: Inter (Google Fonts) — 400, 500, 600, 700, 800 weights
- **Scale**: Fluid `clamp()` values from `--text-xs` (0.75rem) to `--text-2xl` (3.5rem)

### Dark Mode

Toggle via the moon/sun icon in the header. Implemented with `[data-theme="dark"]` CSS custom property overrides. All pages support both modes.

### Spacing

8-point grid system via CSS custom properties: `--space-1` (0.25rem) through `--space-24` (6rem).

---

## Development

### Prerequisites

- A static file server (e.g., `python -m http.server`, `serve`, or any HTTP server)
- Python 3 for CGI-bin backend (optional — needed for quote storage and facility image proxy)

### Running Locally

```bash
# Simple static server
cd nexusct-site
python -m http.server 8000

# Visit http://localhost:8000
```

For CGI-bin support (quote storage, facility images), use a server that supports CGI execution, or adapt the Python scripts to a lightweight framework.

### File Modification Guide

| To change... | Edit... |
|--------------|---------|
| Site layout, colors, spacing | `style.css` |
| Navigation, dark mode, scroll animations | `site.js` |
| Designer pricing data (Jeron/RCare parts) | `nurse-call-app.js` (top of file) |
| Designer questionnaire flow | `nurse-call-app.js` (question functions) |
| Designer styling | `nurse-call-style.css` |
| Margin percentage | `nurse-call-app.js` → `const MARGIN = 0.25` |
| Financing APR | `nurse-call-app.js` → `const FINANCE_APR = 0.079` |
| NCaaS markup | `nurse-call-app.js` → `const NCAAS_MARKUP = 1.20` |
| Admin password | `nurse-call-app.js` → search for `nexus2026` |

### Adding the Designer to a New Page

To embed the designer into any additional page:

1. Add to `<head>`:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>
   <link rel="stylesheet" href="./nurse-call-base.css">
   <link rel="stylesheet" href="./nurse-call-style.css">
   ```

2. Add the designer markup where desired (copy the `.nc-designer-section` block from `nurse-call-wired.html`)

3. Add before `</body>`:
   ```html
   <script src="./nurse-call-app.js"></script>
   ```

---

## Deployment

The site is pure static HTML/CSS/JS and can be deployed to any static hosting platform:

- **S3 + CloudFront** (current)
- **Webflow** (design target)
- **Netlify / Vercel / GitHub Pages**
- **Any web server** (Apache, Nginx, etc.)

The CGI-bin scripts need a Python-capable server if quote storage and facility image search are required.

---

## Contact

- **Phone**: (847) 796-5585
- **Email**: info@nxsct.com
- **Location**: Schaumburg, IL
- **Support Portal**: [nexusct.simprosuite.com/customer](https://nexusct.simprosuite.com/customer)

---

## License

Proprietary — NexusComm LLC. All rights reserved.
