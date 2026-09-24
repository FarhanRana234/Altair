# CONTEXT.MD — ALTAIR Website Design System & Content Source of Truth

## 1. Project Background & Identity
- **Project Name:** ALTAIR
- **Affiliation:** AeroPakistan 2027 — a national-level STEM and education competition jointly developed by NUVEX Pvt. Ltd. and the NUST Formula Student Team (NFST). Student teams design, build, and race scaled-down gliders and showcase their work through portfolios, presentations, and marketing[cite: 1, 2].
- **Team Identity:** ALTAIR is a student-led engineering team composed of 6 members from NED University of Engineering & Technology (NEDUET) and Capital University of Science & Technology (CUST), competing in AeroPakistan 2027[cite: 1, 2].
- **Lineage:** Direct successor to Team DriftX — 1st Runners-Up at Formula Pakistan 2026, achieving the highest Engineering & Design score nationally.

---

## 2. Design References & Aesthetic Ground Truth
- **AeroPakistan (https://www.aeropakistan.com/):** Reference for visual motion and atmosphere — dark aerospace theme, dynamic canvas starfield background, scroll-linked element reveals, "click to continue" micro-interactions, and floating 3D parallax hero graphics[cite: 1].
- **Teach64 (https://teach64.com/):** Reference for typography hierarchy, high-contrast counter-up metric cards, and structured card grids.
- **UI Mockup Ground Truth:** The visual target is defined by an elegant thin serif display typeface overlaid on a deep navy space/starfield background[cite: 1]. It avoids cyberpunk/HUD/telemetry elements in favor of high-end aerospace minimalism[cite: 1].

---

## 3. Brand Visual Tokens

### Color Palette
- **Deep Space Navy (Primary Background):** `#030712`, `#0B132B`[cite: 1]
- **Electric Aerodynamic Blue (Accents & CTAs):** `#00F0FF`, `#3B82F6`
- **Platinum / Silver (Body Text & Borders):** `#E2E8F0`[cite: 1]
- **Gold (Sponsorship Highlights Only):** `#F59E0B`

### Typography
- **Headings & Wordmark:** Thin, high-contrast serif display font (e.g., *Cormorant Garamond* or *Playfair Display*, light weight) matching the "ALTAIR" title aesthetic[cite: 1].
- **Body & Captions:** *Inter* or *Plus Jakarta Sans*, light weight (`font-light`), generous letter-spacing (`tracking-widest` / `tracking-wider`) for an airy, elegant feel[cite: 1].

### Visual Components & Cards
- Interactive canvas starfield/particle background running continuously across all sections[cite: 1].
- Glassmorphic container cards with soft blue borders (`border border-blue-500/20 bg-slate-900/40 backdrop-blur-md rounded-2xl`)[cite: 1].
- Lowercase `"altair"` wordmark logo used in top-left navigation and footer[cite: 1, 2].

---

## 4. Feature Specifications & API Architecture

### A. Live Interactive 3D Glider Viewer
- **Tech Stack:** `@react-three/fiber`, `@react-three/drei`, `Three.js`
- **Component:** `<Glider3DViewer />` embedded inside the "PROJECT ALTAIR" section[cite: 1].
- **Functionality:** 
  - Loads a 3D GLTF model (`/models/glider.gltf`).
  - Interactive mouse/touch orbit controls (rotation, zoom, tilt).
  - Overlay toggles to inspect CAD geometry and simulated CFD airflow pressure paths.

### B. Automated Sponsorship Lead Form (Web3Forms API)
- **Tech Stack:** Next.js Client Component, **Web3Forms API** (`https://api.web3forms.com/submit`)
- **Component:** `<SponsorshipFormModal />`
- **Functionality:**
  - Interactive form capturing: Full Name, Corporate Email, Company/Organization Name, Selected Sponsorship Tier, and Note.
  - Submits payload directly to `altair.aeropak@gmail.com` via Web3Forms endpoint using `process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`[cite: 1, 2].
  - On successful submission, triggers an instant browser download of `ALTAIR_SPONSORSHIP_PROPOSAL.pdf` from the `/public` directory[cite: 1, 2].

### C. Interactive Sponsorship Tier & Budget Explorer
- **Tech Stack:** React State (`useState`), Framer Motion (`AnimatePresence`, `motion.div`)
- **Component:** `<TierExplorer />`
- **Functionality:**
  - Dynamic budget allocation slider ranging from PKR 30,000 to PKR 500,000+[cite: 2].
  - Real-time tier highlight: Bronze, Silver, Gold, or Platinum[cite: 2].
  - Dynamically updates tier perk checklist (glider branding size, social reel count, portfolio features, presentation shoutouts)[cite: 2].

---

## 5. Hero Page Section-by-Section Content & Layout

### A. Landing Screen (Hero)
- **Top-Left Logo:** `"altair"` lowercase wordmark[cite: 1].
- **Visual Anchor:** Large glider photo laid diagonally across the screen with a continuous subtle vertical floating animation[cite: 1].
- **Center Overlay:** Giant thin serif wordmark `"ALTAIR"`[cite: 1].
- **Interaction Hint:** `"click to continue"` label with a thin downward pulsing arrow line[cite: 1].

### B. "WHAT IS AERO PAKISTAN?"
- **Heading:** `WHAT IS AERO PAKISTAN?`[cite: 1, 2]
- **Body Text:** "Aero Pakistan is a national-level STEM and education competition where student teams design, build, and race scaled-down gliders, and showcase their work through portfolios, presentations, and marketing. Jointly developed by NUVEX Pvt. Ltd. and the NUST Formula Student Team (NFST), the initiative aims to build Pakistan's STEM ecosystem by promoting engineering, teamwork, innovation, and entrepreneurship among students aged approximately 15–19."[cite: 1, 2]

### C. "PROJECT ALTAIR"
- **Heading (Right-aligned):** `Project Altair`[cite: 1]
- **Subheading:** `Engineering the future of flight`[cite: 1]
- **Body Text:** "We're a team building the next-generation glider from the ground up. From aerodynamics and advanced materials to hands-on testing and innovation, ALTAIR is designed to soar higher."[cite: 1]
- **Interactive Component:** `<Glider3DViewer />` canvas showing "First prototype"[cite: 1].

### D. "TEAM ALTAIR"
- **Heading (Left-aligned):** `TEAM ALTAIR`[cite: 1]
- **Body Text:** "ALTAIR is a team of 6 passionate individuals building a glider for the future of flight. We are committed to pushing the boundaries of aerodynamics and design while learning through hands-on innovation. Our mission goes beyond just building a glider — we build to inspire, to create, and to prove what teamwork can achieve. Through engineering, testing, and dedication, ALTAIR continues to show that innovation can take flight."[cite: 1]

### E. "EVENTS"
- **Heading:** `EVENTS`[cite: 1]
- **Intro:** "We are planning to do two social events to maximize our reach and provide a wider range of values to our sponsors."[cite: 1]
- **Event 1 — Karachi Community Race Event:** Public race in Karachi expecting an audience across various age ranges, creating sponsor visibility and an engaging community gathering[cite: 1, 2].
- **Event 2 — Engineering Podcasts:** Industry interviews with aerospace professionals/pilots targeting STEM learners while showcasing sponsor marketing materials[cite: 1, 2].
- **Footer Callout:** `"Follow us on instagram for further updates!"`[cite: 1]

### F. "SPONSOR US!"
- **Heading:** `SPONSOR US!`[cite: 1]
- **Body Text:** "ALTAIR presents an opportunity to collaborate and support the young talent in Engineering and Aerospace. Following is the Sponsorship Proposal. If you want to collaborate, do let us know and we'll find a way to work things out!"[cite: 1]
- **Interactive Elements:**
  - `<TierExplorer />` dynamic slider component[cite: 2].
  - "Sponsor Us / Request Proposal" CTA button opening `<SponsorshipFormModal />`[cite: 1, 2].

### G. "CONTACT"
- **Heading:** `CONTACT`[cite: 1, 2]
- **Handles & Contact Details:**
  - Instagram: `@teamaltair__`[cite: 1, 2]
  - Email: `altair.aeropak@gmail.com`[cite: 1, 2]
  - LinkedIn: `Altair` (`linkedin.com/company/teamaltair`)[cite: 1, 2]
  - Huriya Irfan (Captain): `0310-1078428`[cite: 1, 2]
  - Yamaan Ali (Structures): `0303-2390577`[cite: 1, 2]

### H. Team Roster Cards (2 Rows × 3 Columns Grid)
1. **Huriya Irfan** — Captain — *"Changed the track. Kept the vibe."*[cite: 1, 2]
2. **Shamikh Khilji** — Aerodynamics — *"Nah, I'd win"*[cite: 1, 2]
3. **Musaab Junaid** — CAD — *"No somersaults intended, I guess.."*[cite: 1, 2]
4. **Yamaan Ali** — Structures and Manufacturing — *"Baggin that highest engineering score fs"*[cite: 1, 2]
5. **Hamna Maryam** — Project Manager — *"Stand back, we got this"*[cite: 1, 2]
6. **Syeda Shanza Fatima** — CAD — *"See you with a goated glider on my side"*[cite: 1, 2]

---

## 6. Track Record & Metrics (Teach64-Style Grid)
- **1st Runners-Up:** Formula Pakistan 2026 (Team DriftX lineage)[cite: 2].
- **185.0 Top Score:** Highest Engineering & Design score nationally[cite: 2].
- **1,800+ Attendees:** Audience reach at Karachi Expo Centre[cite: 2].
- **6 Engineers:** Multidisciplinary team representing NEDUET and CUST[cite: 1, 2].
- **National Media Exposure:** BBC Urdu, DAWN, ProPakistani coverage[cite: 2].
- **PKR 828,000:** Total project execution and manufacturing budget[cite: 2].

---

## 7. Sponsorship Tiers & Proposal Details

### Investment Tiers
- **Bronze (PKR 30,000 – 50,000):** Logo on standard team merchandise, promotional brochures at AeroPakistan stall, logo in 10-page Enterprise Portfolio, dedicated Instagram story[cite: 2].
- **Silver (PKR 60,000 – 90,000):** All Bronze perks + logo on glider, dedicated slide in official presentation, 3 Instagram reels[cite: 2].
- **Gold (PKR 250,000 – 500,000):** All Silver perks + prominent glider logo, prime stall demonstration centerpiece, 5 dedicated Instagram reels, verbal presentation shout-out[cite: 2].
- **Platinum / Title Sponsor (PKR 500,000+):** Title naming rights ("Altair, powered by [Brand]"), dominant full glider livery design, industry category exclusivity[cite: 2].
- **In-Kind Partnerships:** Round-trip airfare (2), 1-week Karachi hotel accommodation (2 people), merchandise manufacturing, printing services, social reach support[cite: 2].

### UN Sustainable Development Goals (SDGs)
- **SDG 4:** Quality Education[cite: 2]
- **SDG 8:** Decent Work & Economic Growth[cite: 2]
- **SDG 9:** Industry, Innovation & Infrastructure[cite: 2]
- **SDG 17:** Partnerships for the Goals[cite: 2]

---

## 8. Technical Stack Architecture
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation Engine:** Framer Motion & HTML5 Canvas API
- **3D Engine:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Lead Capture Endpoint:** Web3Forms API (`https://api.web3forms.com/submit`)
- **Deployment Platform:** Vercel
- **Icons:** Lucide React