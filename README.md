# ALTAIR

**Engineering the future of flight.**

Official website of **Team ALTAIR**, a student-led engineering team building a glider for **AeroPakistan 2027**.

🌐 **Live site:** [www.teamaltair.xyz](https://www.teamaltair.xyz)

---

## About

ALTAIR is a team of 6 engineering students from **NED University of Engineering & Technology (NEDUET)** and **Capital University of Science & Technology (CUST)**, competing in **AeroPakistan 2027**, a national STEM competition developed by NUVEX Pvt. Ltd. and the NUST Formula Student Team (NFST), where student teams design, build, and race scaled-down gliders.

ALTAIR is the direct successor to **Team DriftX**, 1st Runners-Up at Formula Pakistan 2026 with the highest Engineering & Design score nationally.

This website presents the team and project, and doubles as our sponsorship outreach platform.

## Features

- **Interactive 3D glider viewer**: orbit, zoom, and tilt the prototype, with overlays for CAD geometry and simulated CFD airflow (Three.js / React Three Fiber).
- **Sponsorship tier explorer**: a budget slider (PKR 30,000 to 500,000+) that highlights the matching Bronze / Silver / Gold / Platinum tier and its perks.
- **Sponsorship lead form**: submissions are emailed to the team through Web3Forms, and the sponsorship proposal PDF downloads on success.
- **Cinematic landing experience**: animated starfield canvas, scroll-linked reveals, and a floating hero glider.
- **Sections:** What is AeroPakistan, Project Altair, Team, Events, Sponsor Us, Contact.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion, GSAP, HTML5 Canvas |
| 3D | Three.js, `@react-three/fiber`, `@react-three/drei` |
| Forms | Web3Forms API |
| Icons | Lucide React |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18.17 or newer
- [pnpm](https://pnpm.io/) (the repo ships a `pnpm-lock.yaml`)

### Installation

```bash
git clone https://github.com/FarhanRana234/Altair.git
cd Altair
pnpm install
```

### Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `WEB3FORMS_ACCESS_KEY` | Access key from [Web3Forms](https://web3forms.com/), used by the sponsorship form |

### Run locally

```bash
pnpm dev
```

The dev server starts on [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server (port 3000) |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

## Project Structure

```
Altair/
├── app/            # Next.js App Router pages and layout
├── components/     # UI components (3D viewer, tier explorer, sponsorship form, ...)
├── lib/            # Shared utilities and helpers
├── public/         # Static assets (images, 3D model, sponsorship proposal PDF)
├── scripts/        # Helper scripts
├── CONTEXT.md      # Design system and content source of truth
└── ALTAIR_SPONSORSHIP_PROPOSAL.pdf
```

For brand colors, typography, and the full section-by-section copy, see [`CONTEXT.md`](./CONTEXT.md).

## Deployment

The site is deployed on [Vercel](https://vercel.com/). To deploy your own copy, import the repo into Vercel and add `WEB3FORMS_ACCESS_KEY` under **Project Settings → Environment Variables**.

## Team

| Name | Role |
| --- | --- |
| Huriya Irfan | Captain |
| Hamna Maryam | Project Manager |
| Shamikh Khilji | Aerodynamics |
| Yamaan Ali | Structures & Manufacturing |
| Musaab Junaid | CAD |
| Syeda Shanza Fatima | CAD |

## Sponsor Us

We're looking for partners to support young talent in engineering and aerospace. Read the [sponsorship proposal](./ALTAIR_SPONSORSHIP_PROPOSAL.pdf) or use the form on [teamaltair.xyz](https://www.teamaltair.xyz) to get in touch.

## Contact

- 📧 Email: [altair.aeropak@gmail.com](mailto:altair.aeropak@gmail.com)
- 📸 Instagram: [@teamaltair__](https://instagram.com/teamaltair__)
- 💼 LinkedIn: [linkedin.com/company/teamaltair](https://linkedin.com/company/teamaltair)

## License

All rights reserved © Team ALTAIR. Contact us for permission to reuse any part of this project.
