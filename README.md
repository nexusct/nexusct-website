# NexusCT Website

Enterprise technology solutions website for **NexusCT** (Nexus Communications Technology) — Schaumburg, IL.

## Overview

Full multi-page website covering all NexusCT service areas:

- **Healthcare & Life Safety** — Nurse call systems, RTLS, wander management, patient safety
- **Wired Nurse Call** — Jeron Provider 700/790 (UL1069/UL2560)
- **Wireless Nurse Call** — RCare G4 Wireless (UL1069/NFPA 99)
- **Nurse Call as-a-Service (NCaaS)** — Subscription-based managed nurse call
- **RTLS & Wander Management** — Accutech & Aero Wireless real-time location
- **Patient Safety & Security** — Integrated safety platform
- **Nexus360** — Unified managed healthcare environment
- **UniFi360** — UniFi as a Service (3 tiers, zero CapEx)
- **Services** — ICT, security, smart building, A/V, LED displays
- **Interactive Nurse Call System Designer** — AI-powered questionnaire with auto-system design and budget estimation

## Tech Stack

- Pure HTML / CSS / JavaScript (no frameworks)
- CSS custom properties design system with light/dark mode
- Inter typeface via Google Fonts
- jsPDF for client-side PDF generation
- CGI-bin backend (Python) for quote storage and facility image proxy
- SQLite for lead/quote persistence

## Pages

| File | Description |
|------|-------------|
| `index.html` | Homepage — hero, solutions overview, differentiators |
| `about.html` | Company story, certifications, industry focus |
| `healthcare.html` | Healthcare & Life Safety overview |
| `nurse-call-wired.html` | Jeron Provider 700/790 wired systems |
| `nurse-call-wireless.html` | RCare G4 wireless systems |
| `ncaas.html` | Nurse Call as-a-Service subscription model |
| `rtls.html` | RTLS & Wander Management |
| `patient-safety.html` | Patient Safety & Security |
| `nexus360.html` | Nexus360 managed healthcare platform |
| `unifi360.html` | UniFi as a Service (3 pricing tiers) |
| `services.html` | Full services overview |
| `contact.html` | Contact form with facility type dropdown |
| `nurse-call-designer.html` | Interactive nurse call system designer tool |

## Nurse Call System Designer

The interactive designer (`nurse-call-designer.html`) walks clients through a 13-step questionnaire:

1. Facility type selection
2. Bed/room count
3. Platform recommendation (Jeron 700, Jeron 790, RCare G4)
4. Call station type
5. Nurse console requirements
6. Corridor displays
7. Code Blue needs
8. Wander management
9. Staff assignment
10. RTLS add-ons
11. Software licenses
12. Installation type
13. Lead capture form

The system auto-designs a complete nurse call solution and presents:
- Component summary (no line-item pricing — totals only)
- Estimated budget range (+/- 30%)
- Financing options (7.9% APR, 36/48/60 months)
- NCaaS monthly pricing alternative
- Facility image from Google

### Admin Panel

Navigate to `nurse-call-designer.html#admin` (password: `nexus2026`) to view all submitted leads and quotes.

## Backend (CGI-bin)

| Script | Purpose |
|--------|---------|
| `cgi-bin/api.py` | Stores and retrieves nurse call quotes and leads (SQLite) |
| `cgi-bin/image_proxy.py` | Proxies Google image search for facility photos |

## Brand

- **Primary Blue:** `#0056b3`
- **Success Green:** `#28a745`
- **Charcoal:** `#1a1a2e`
- **Font:** Inter (Google Fonts)

## Contact

- **Phone:** (847) 796-5585
- **Email:** info@nxsct.com
- **Location:** Schaumburg, IL
- **Support Portal:** [nexusct.simprosuite.com/customer](https://nexusct.simprosuite.com/customer)

## License

Proprietary — NexusComm LLC. All rights reserved.
