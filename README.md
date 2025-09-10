# EasyLife Tool Web

Production-ready Next.js 15 (app dir) toolkit with Tailwind CSS, shadcn/ui style system, Framer Motion animations, and two sample tools.

## Stack
- Next.js 15 app directory
- TypeScript strict
- Tailwind CSS + design tokens (CSS vars) + tailwindcss-animate
- Framer Motion
- Radix UI primitives (toast)
- Lucide Icons

## Features Implemented
- Dark / Light theme toggle
- SEO metadata + Open Graph + Twitter cards
- Sticky, responsive navbar + mobile menu
- Hero section with animated headline
- Banner slider (Framer Motion)
- Tools listing page with search + category filter
- Reusable components (ToolCard, FileUploadBox, etc.)
- Image Compressor (client-side canvas compression)
- PDF to Excel (placeholder conversion logic for now)
- Accessible toast hook

## Dev
Install dependencies then start dev server.

```bash
pnpm install
pnpm dev
```

(You can also use npm or yarn.)

## Extend
Add new tools under `app/tools/<tool-slug>/page.tsx` and register them in `app/tools/page.tsx` and optionally as featured on the homepage.
