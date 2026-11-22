# Santhanam L — 3D Portfolio

Personal portfolio for **Santhanam L** — AI/ML Engineer, Generative AI Specialist and Technical Trainer.

**Live:** https://santhanamsandel.github.io/

## Stack

- **Next.js 15** (App Router, static export) · **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **Three.js + React Three Fiber** — hero neural core and AI Lab network (lazy-loaded, paused off-screen, lighter on mobile, static under reduced motion)
- **Framer Motion** — reveals, timeline progress, tilt cards, transitions
- **Lenis** — smooth scrolling on desktop (native on touch)
- **Lucide** icons

## Project structure

```
src/
  app/            layout (SEO, Open Graph, JSON-LD), page, global styles
  components/
    Hero.tsx, Nav.tsx, SmoothScroll.tsx, ProjectVisual.tsx, ui.tsx
    sections/     About, Skills, Experience, Projects, AILab, Training, Credentials, Contact
    three/        NeuralCore (hero 3D), LabNetwork (AI Lab 3D)
  data/profile.ts ← ALL site content lives here
  lib/hooks.ts    media-query / in-view / WebGL helpers
public/
  images/         optimised WebP photos (EXIF/GPS stripped), og.jpg
  Santhanam_L_Resume.pdf
```

## Updating the portfolio

1. **Text, jobs, projects, skills, certifications** — edit `src/data/profile.ts`.
   - New project: add an object to `projects` (set `github` only if the repo is public).
   - New job: add to the top of `experience`.
2. **Resume** — replace `public/Santhanam_L_Resume.pdf` (keep the same file name).
3. **Photos** — drop a new WebP/JPG into `public/images/` and reference it in `profile.ts`
   (training gallery: `teaching.gallery`). Keep images under ~1200px wide.
4. Commit and push to `main` — GitHub Actions builds and deploys automatically (~2 min).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```
