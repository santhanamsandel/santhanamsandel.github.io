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
    sections/     Stats, About, Skills, Experience, BeyondClassroom, Projects, AILab, Training, Credentials, Contact
    Lightbox.tsx  accessible full-screen photo viewer
    Backdrop.tsx  page-wide embers (desktop WebGL) + cursor spotlight
    three/        Smoke (hero backdrop shader), Embers (particles), LabNetwork (AI Lab 3D)
  data/profile.ts ← site content (experience, projects, skills, training…)
  data/gallery.ts ← classroom gallery photos + captions
  lib/hooks.ts    media-query / in-view / WebGL / idle helpers
  lib/reveal.ts   shared IntersectionObserver for CSS scroll reveals
public/
  images/         optimised WebP photos (EXIF/GPS stripped), og.jpg
  Santhanam_L_Resume.pdf
```

## Classroom gallery ("Beyond the Classroom")

Photos and captions live in `src/data/gallery.ts`.

1. Export the photo as WebP twice: `name.webp` (~1400px wide) and `name-sm.webp` (~720px wide), into `public/images/gallery/`.
2. Add an entry with the large file's real pixel size (`w`, `h`), an accurate `alt`, a `caption` category and a short `note`.
3. Remove a photo by deleting its entry.

Images keep their original aspect ratio (no cropping or stretching) and open in a full-screen lightbox
(arrow keys / swipe to browse, Esc to close).

## Updating the portfolio

1. **Text, jobs, projects, skills, certifications** — edit `src/data/profile.ts`.
   - New project: add an object to `projects` (set `github` only if the repo is public).
   - New job: add to the top of `experience`.
2. **Resume** — replace `public/Santhanam_L_Resume.pdf` (keep the same file name).
3. **Photos** — drop a new WebP/JPG into `public/images/` and reference it in `profile.ts`
   (classroom photos: `src/data/gallery.ts`). Keep images under ~1400px wide.
4. Commit and push to `main` — GitHub Actions builds and deploys automatically (~2 min).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Rollback

A snapshot of the site before the November 2026 upgrade is on the `backup/pre-upgrade-2026-11-24` branch.
