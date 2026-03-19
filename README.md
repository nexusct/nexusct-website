# NexusCT Nurse Call System Designer

Interactive nurse call system design and quoting tool. Walk through a guided questionnaire to configure a complete Jeron Provider 790 (wired) or RCare G4 (wireless) nurse call system, then receive an instant budget estimate with full product catalog, financing options, and NCaaS pricing.

## Live Tool

**[Launch Nurse Call Designer →](https://www.perplexity.ai/computer/a/nexusct-site-UcpuJMmiQDShBtGa08VmvQ)**

Admin access: `index.html#admin` · Password: `nexus2026`

## Features

### Guided System Design
- 12-step conversational questionnaire
- Facility type selection (hospital, SNF, ALF, memory care, behavioral, clinic, rehab)
- Room-by-room configuration with accessories, sensors, and displays
- Nurse station console selection
- Hallway LED and corridor display configuration
- Software integration selection

### Platforms
- **Jeron Provider 790** — IP-based wired, full acute care, VoIP, EHR integration (82 parts)
- **RCare G4 Wireless** — UL-1069 certified wireless, assisted living/SNF, mobile alerts (43 parts)
- Side-by-side comparison table

### Intelligent BOM Engine
- Automatic dependency resolution (20 rules)
  - Power supplies per gateway
  - J-Bus terminators/splitters per daisy chain
  - Per-gateway software licensing
  - Server sizing based on total wireless devices (RCare)
  - UL-1069 wall buttons per room (RCare)
  - Wander management keypads per exit
- Correct infrastructure scaling (gateways, switches, cabinets, rack mounts)

### Product Catalog (119 entries)
Every part has manufacturer images, descriptions, key specs, and product page URLs:
- **Jeron**: Product images from jeron.com, Magnet Group Tier 2 pricing
- **RCare**: Product images from rcareinc.com catalog
- **3rd-party products** mapped to real commercial items:
  - Pressure pads → Smart Caregiver TL-2100G CordLess
  - Pillow speakers → Curbell Gen4+ (IPX4, UL 1069, FDA)
  - TV integration → SONIFI Health Interactive TV
  - AI assistant → Amazon Alexa Smart Properties for Healthcare
  - Tablets → Samsung Galaxy Tab A9+ (Knox MDM)
  - Infotainment → PDi A-Series 43" Smart medTV (Epic compatible)
  - Hallway displays → MEDI+SIGN digital displays
  - Master displays → Samsung QM55C 55" 4K commercial
  - LED strips → Philips Hue Commercial
  - Door contacts → Honeywell 7939WG
  - Bed exit alarms → Smart Caregiver CordLess
  - Audio annunciators → Bogen MB8TSQ

### Pricing & Quoting
- 25% margin (sell = dealer / 0.75)
- Client sees estimated range only (±30% of actual)
- No part numbers, unit prices, or line item pricing exposed to client
- Financing at 7.9% APR (36/48/60 month terms)
- NCaaS monthly pricing (20% service premium over 60-month term)
- Competitor comparison (Rauland, Westcom, TeleCare, Cornell)
- SLA packages (Bronze, Silver, Gold)

### Lead Capture
- Facility name, contact name, email, phone
- Google Places facility image auto-fetch for quote cover
- Quote data saved via CGI backend

## File Structure

```
index.html              # Standalone tool (entry point)
nurse-call-app.js       # App logic, pricing data, BOM engine, product catalog
nurse-call-base.css     # CSS variables and tokens
nurse-call-style.css    # Tool-specific styles
cgi-bin/
  api.py                # Lead capture and quote storage backend
  image_proxy.py        # Google Places image proxy
```

## Key Configuration

| Setting | Value |
|---------|-------|
| Margin | 25% (sell = dealer / 0.75) |
| Finance APR | 7.9% |
| Finance Terms | 36, 48, 60 months |
| NCaaS Markup | 20% over 60 months |
| Professional Install | $150/bed |
| Full Turnkey Install | $250/bed |
| Client Pricing | Range only (±30%) |

## Contact

**NexusCT — Nexus Communications Technology**  
(847) 796-5585 · info@nxsct.com  
1171 Tower Rd, Schaumburg, IL 60173
