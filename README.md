<div align="center">
  <img src="./src/app/assets/bravo-logo.png" alt="Bravo" width="96" />
  <h1>Bravo Learning System</h1>
  <p><strong>Modular, type-safe learning platform front‑end built with React, Vite, TanStack, and a design‑system first approach.</strong></p>
  <p>
    <a href="#quick-start">Quick Start</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#features">Features</a> ·
    <a href="#environment-variables">Environment</a> ·
    <a href="#development-workflow">Dev Workflow</a> ·
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Directory Layout](#directory-layout)
5. [Environment Variables](#environment-variables)
6. [Quick Start](#quick-start)
7. [Scripts](#scripts)
8. [Domain Modules](#domain-modules)
9. [State & Data Layer](#state--data-layer)
10. [UI & Design System](#ui--design-system)
11. [Error Handling & UX](#error-handling--ux)
12. [Code Quality](#code-quality)
13. [Conventions](#conventions)
14. [Roadmap](#roadmap)
15. [Contributing](#contributing)

---

## Features

- 🔐 Auth flow with composite multi‑step signup (profile + organization + avatar upload)
- 🧩 Domain-driven structure (`auth`, `classroom`, `course`, `authoring`, `home`)
- 🧵 Strong typing end‑to‑end (payloads, responses, query keys)
- ⚡ Vite + SWC fast HMR
- 🔄 Robust Axios layer (token refresh queue, upload helpers, config centralization)
- 📡 TanStack Query for server state + caching
- 🧭 TanStack Router for colocated route modules & type‑safe params
- 🎨 shadcn/ui + Radix primitives + Tailwind for consistent, accessible components
- 🧪 Easily testable modular APIs & hooks (query key factories)
- ☁️ Runtime configuration abstraction (`env.ts`) with coercion helpers
- 🖼 File upload utilities (progress callback, size/type validation)
- 🔔 Toast feedback patterns (sonner) for async UX

---

## Tech Stack

| Layer         | Tools                                                  |
| ------------- | ------------------------------------------------------ |
| Runtime       | React 19, TypeScript 5, Vite 7                         |
| Routing       | TanStack Router                                        |
| Data Fetching | TanStack Query (React Query)                           |
| HTTP          | Axios (custom instance + interceptors)                 |
| State         | Lightweight domain + query (Zustand planned / partial) |
| Forms         | React Hook Form + Zod (signup flow; more coming)       |
| UI            | shadcn/ui, Radix UI, Tailwind CSS, Lucide Icons        |
| Feedback      | sonner (toasts)                                        |
| Validation    | Zod                                                    |

---

## Architecture

Guiding principles:

1. Boundary clarity: Each domain encapsulates types, APIs, queries, components, routing.
2. Composition over inheritance: Hooks + functional components + utilities.
3. Progressive hardening: Start with mocks → layer production APIs without rewriting consumers.
4. Single source of truth: Central `env.ts` for runtime config.
5. Predictable data flows: Axios → query hooks → presentational components.

### Layers

- Domain Layer (`src/domains/*`): Vertical slices (auth, classroom, etc.).
- Shared Layer (`src/shared/*`): Cross-cutting primitives (ui, lib, config, hooks, types, constants).
- App Shell (`src/App.tsx`, router tree): Layout + global providers.

---

## Directory Layout

```
src/
  app/                 # Global assets & top-level app scaffolding
  domains/
    auth/              # Auth types, APIs, signup/login pages
    classroom/         # Classroom module (list, detail, creation)
    course/            # Course feature (placeholder / partial)
    authoring/         # Authoring UI + template explorer
    home/              # Dashboard entry
  shared/
    components/        # Design system components + templates
    config/            # Runtime env configuration (env.ts)
    lib/               # Axios, router setup, query utilities
    hooks/             # Reusable hooks (auth, mobile, ...)
    types/             # Shared type declarations
    constants/         # Static domain-agnostic constants
```

---

## Environment Variables

All consumed via `src/shared/config/env.ts` with safe coercion.

| Group    | Variable                          | Purpose                            |
| -------- | --------------------------------- | ---------------------------------- |
| App      | `VITE_APP_NAME`                   | Display name                       |
| App      | `VITE_APP_VERSION`                | Version string                     |
| App      | `VITE_APP_DESCRIPTION`            | Meta description                   |
| App      | `VITE_APP_ENV`                    | Environment label (dev/stage/prod) |
| API      | `VITE_API_URL`                    | Base API URL                       |
| API      | `VITE_API_VERSION`                | Optional API version segment       |
| API      | `VITE_API_TIMEOUT`                | Request timeout ms                 |
| Auth     | `VITE_AUTH_COOKIE_NAME`           | Auth cookie name (if used)         |
| Auth     | `VITE_AUTH_TOKEN_EXPIRES`         | Access token TTL seconds           |
| Auth     | `VITE_AUTH_REFRESH_TOKEN_EXPIRES` | Refresh token TTL                  |
| Auth     | `VITE_AUTH_PERSIST_KEY`           | Local storage key                  |
| Org      | `VITE_ORG_LOGO_MAX_SIZE`          | Max org logo size bytes            |
| Org      | `VITE_ORG_LOGO_ALLOWED_TYPES`     | CSV list of MIME types             |
| Org      | `VITE_ORG_MEMBER_INVITE_LIMIT`    | Invite cap                         |
| Org      | `VITE_ORG_MEMBER_ROLES`           | CSV roles                          |
| Upload   | `VITE_UPLOAD_MAX_SIZE`            | Max upload size bytes              |
| Upload   | `VITE_UPLOAD_ALLOWED_TYPES`       | CSV accepted MIME types            |
| Upload   | `VITE_UPLOAD_BASE_URL`            | Upload service endpoint            |
| Features | `VITE_FEATURE_SOCIAL_LOGIN`       | Enable social login gate           |
| Features | `VITE_FEATURE_GOOGLE_LOGIN`       | Google login flag                  |
| Features | `VITE_FEATURE_MICROSOFT_LOGIN`    | Microsoft login flag               |
| Features | `VITE_FEATURE_INVITE_BY_LINK`     | Invite by link flag                |
| External | `VITE_GOOGLE_CLIENT_ID`           | OAuth client ID                    |
| External | `VITE_MICROSOFT_CLIENT_ID`        | OAuth client ID                    |
| Error    | `VITE_SENTRY_DSN`                 | Sentry DSN                         |
| Error    | `VITE_ERROR_REPORTING_LEVEL`      | Log/report level                   |
| Password | `VITE_PASSWORD_MIN_LENGTH`        | Minimum length                     |
| Password | `VITE_PASSWORD_REQUIRE_UPPERCASE` | Boolean                            |
| Password | `VITE_PASSWORD_REQUIRE_LOWERCASE` | Boolean                            |
| Password | `VITE_PASSWORD_REQUIRE_NUMBER`    | Boolean                            |
| Password | `VITE_PASSWORD_REQUIRE_SPECIAL`   | Boolean                            |
| Dev      | `VITE_ENABLE_DEVTOOLS`            | Enable React Query devtools        |
| Dev      | `VITE_ENABLE_API_MOCKING`         | Toggle MSW-like mocking            |
| Dev      | `VITE_ENABLE_DEBUG_LOGGING`       | Verbose logging                    |

Example `.env.local`:

```bash
VITE_APP_NAME="Bravo Learning System"
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=15000
VITE_AUTH_PERSIST_KEY=bravo_auth
VITE_UPLOAD_MAX_SIZE=10485760
VITE_FEATURE_GOOGLE_LOGIN=true
```

---

## Quick Start

```bash
# 1. Install deps
pnpm install   # or yarn / npm install

# 2. Create env file
cp .env.example .env.local  # (create one using the table above if missing)

# 3. Run dev server
pnpm dev

# 4. Open
http://localhost:5173
```

> Use React Query Devtools by enabling `VITE_ENABLE_DEVTOOLS=true`.

---

## Scripts

| Script         | Description                     |
| -------------- | ------------------------------- |
| `pnpm dev`     | Start development server (Vite) |
| `pnpm build`   | Type check + production build   |
| `pnpm preview` | Preview built assets            |
| `pnpm lint`    | Run ESLint over project         |

---

## Domain Modules

### Auth

- Multi-step signup (profile → organization → avatar upload → done)
- Composite payload submission (`signupFull`)
- Avatar upload with fallback & toast notifications.

### Classroom

- List & detail pages
- Scope filtering (mine / organizations)
- Create dialog with auto enrollment key generation
- Status toggle (active/disabled) & leave action (placeholder)
- Query key factory for cache segmentation

### Authoring / Course / Home

- Scaffolds / placeholders for expansion following the same conventions.

---

## State & Data Layer

| Concern          | Approach                                                   |
| ---------------- | ---------------------------------------------------------- |
| Server State     | TanStack Query hooks per domain                            |
| Local UI State   | Component `useState` or upcoming lightweight stores        |
| Auth Persistence | (Planned / Partial) Local storage via persist key          |
| Uploads          | Axios helper (`uploadFile`, `uploadFiles`) with validation |

Suggested improvements (next iterations):

- Add optimistic updates for classroom mutations
- Add error boundaries per route segment
- Add invalidation helpers & mutation side-effect standardization

---

## UI & Design System

- Based on shadcn/ui + Tailwind utilities.
- Variant & size management via `class-variance-authority`.
- Reusable primitives under `shared/components/ui/*`.
- Layout templates in `shared/components/templates/*`.

### Patterns

- Keep domain-specific composite views inside each domain folder.
- Promote only truly generic components to shared.

---

## Error Handling & UX

- Toasts on critical async flows (signup, uploads; more to follow for classrooms)
- Defensive guards (e.g., prevent create without name)
- Placeholder loading & empty states; skeletons recommended as next enhancement.

---

## Code Quality

- ESLint (TypeScript aware) + recommended React rules
- Strict TypeScript config recommended; incremental tightening possible
- Consistent import aliases via `@/` root mapping

### Suggested Future Additions

- Pre-commit hooks (lint + typecheck)
- Vitest / React Testing Library baseline
- MSW integration for local API mocking

---

## Conventions

| Area       | Rule                                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| Filenames  | `kebab-case` for files, `PascalCase` for components                                 |
| Types      | `PascalCase` prefixed with domain meaning where helpful                             |
| Query Keys | Factory object (`CLASSROOM_QUERY_KEYS`) returning `as const` tuples                 |
| Mutations  | Encapsulate in hook file alongside queries                                          |
| Env        | Read **only** via `env.ts`, never import `import.meta.env` directly in feature code |
| Routing    | Each domain has its own `router.ts` and exports route objects                       |

---

## Roadmap

- [ ] Real Classroom API integration (replace mocks)
- [ ] Toast + optimistic updates for classroom mutations
- [ ] Edit classroom dialog & tabbed detail layout
- [ ] URL-synced filters & pagination
- [ ] Organization management flows
- [ ] Role-based UI gating (instructor / admin)
- [ ] Testing setup (unit + integration + visual)
- [ ] Error boundary wrappers per route chunk
- [ ] Skeleton loaders for tables & detail pages
- [ ] Internationalization pass

---

## Contributing

1. Fork & branch: `feat/<your-feature>`
2. Keep changes scoped (one vertical slice per PR)
3. Ensure type safety & lint passes: `pnpm lint`
4. Provide screenshot / gif for UI changes
5. Update Roadmap or README if foundational changes

---

## License

Currently private / internal. Add explicit license before open sourcing.

---

## Appendix: Classroom Integration Flow (Example)

```tsx
// Navigate to detail
navigate({ to: "/classrooms/$id", params: { id: classroom.id } });

// In detail page
const { id } = useParams({ from: "/auth/classrooms/$id" });
const { data: classroom } = useClassroomQuery(id);
```

---

> Built with care for scalability, clarity, and developer happiness.
