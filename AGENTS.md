# Repository Guidelines

## Project Structure & Module Organization
This project is a React Router 7 + Vite + TypeScript client. Main application code lives in `app/`. Route modules are in `app/routes/`, shared UI in `app/components/`, page layouts in `app/layouts/`, API access in `app/services/`, reusable helpers in `app/utils/` and `app/lib/`, and local state in `app/stores/` and `app/contexts/`. Static assets and fonts belong in `public/`. Build output is generated in `build/` and should not be edited manually. Supporting notes and specs live in `docs/` and `kiro/specs/`.

## Build, Test, and Development Commands
Use `npm run dev` to start the local React Router dev server with HMR on `http://localhost:5173`. Use `npm run build` to create the production bundle in `build/`. Use `npm run start` to serve the production build locally. Use `npm run typecheck` before opening a PR; it regenerates route types and runs TypeScript in strict mode.

## Coding Style & Naming Conventions
Follow the existing TypeScript and React patterns: functional components, named exports where practical, and strict typing for loader data, props, and service responses. Use 2-space indentation and keep imports grouped cleanly. Components, layouts, and contexts use `PascalCase` filenames such as `PostCard.tsx`; hooks use `camelCase` with a `use` prefix such as `usePageLoading.ts`; route files follow React Router conventions such as `category.$slug.tsx`. Prefer the `~/*` alias for imports from `app/`.

## Testing Guidelines
There is no dedicated automated test suite configured yet. For now, treat `npm run typecheck` and a production build via `npm run build` as the minimum validation step for every change. When adding tests later, place them beside the feature or under a dedicated `app/tests/` tree and use filenames ending in `.test.ts` or `.test.tsx`.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit subjects such as `feat: add create and update post functionality` and `fix category bugs`. Keep commits focused and use prefixes like `feat:` and `fix:` consistently. PRs should include a brief summary, impacted routes/components, manual verification steps, and screenshots for visible UI changes. Link the related issue or task when one exists.

## Configuration Notes
Environment values are stored in `.env`. Do not commit secrets. If a change affects API integration, proxy behavior, or protected routes, update the relevant documentation in `README.md` or `PROTECTED_ROUTES.md`.
