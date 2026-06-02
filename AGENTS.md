<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Agent Instructions

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5** (strict) · **Tailwind CSS v4**
- Animations: **GSAP 3** + `@gsap/react`, **Lenis** (smooth scroll), **split-type**
- Icons: **lucide-react**

## Package Manager

Use **npm**: `npm install`, `npm run dev`, `npm run lint`

## File-Scoped Commands

| Task      | Command                      |
| --------- | ---------------------------- |
| Typecheck | `npx tsc --noEmit`           |
| Lint      | `npx eslint path/to/file.ts` |

## Project Layout

| Path                    | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `app/`                  | App Router pages and layouts                       |
| `app/globals.css`       | Global styles and Tailwind config                  |
| `components/`           | Page section components (hero, navbar, work, etc.) |
| `components/hero/`      | Hero sub-components                                |
| `components/preloader/` | Preloader sub-components                           |
| `lib/portfolio-data.ts` | All static content (projects, experience, skills)  |
| `lib/animation.ts`      | Shared GSAP animation utilities                    |
| `types/`                | Shared TypeScript types                            |

## Key Conventions

- All content lives in `lib/portfolio-data.ts` — edit there, not in components.
- Animations use GSAP via `useGSAP` from `@gsap/react`; register plugins in the component that uses them.
- Path alias `@/` maps to project root.
- No `any` types; use types from `types/` or define inline.
- Tailwind v4: CSS-first config in `app/globals.css`, no `tailwind.config.*`.

## Commit Attribution

AI commits MUST include:

```
Co-Authored-By: Claude Sonnet 4.6 <claude-sonnet-4-6@anthropic.com>
```
