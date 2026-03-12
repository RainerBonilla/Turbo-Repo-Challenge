# GitHub Copilot Instructions for Turbo Repo Challenge

This document provides guidelines and context for GitHub Copilot (Raptor mini) to assist effectively across the entire monorepo. Use this information when generating or editing code, debugging, or understanding the project structure.

## Repository Overview

The workspace is structured as a Turborepo monorepo containing multiple apps and shared packages:

- **apps/server**: A NestJS backend application with Prisma for database ORM. Provides API endpoints for task management.
- **apps/web**: A Next.js frontend app using the App Router with React components for UI, hooks for data fetching, and styles.
- **packages**: Shared packages including ESLint configurations, schema utilities, and TypeScript configurations.

## Key Technologies

- **Node.js** and **TypeScript** across all projects
- **NestJS** for server-side architecture
- **Prisma** ORM for database modelling
- **Next.js** 14+ with the App Router for frontend
- **React** components and hooks
- **pnpm** as package manager
- **Turborepo** for workspace management

## Coding Conventions

- Follow TypeScript strict typing. Use `tsconfig.json` settings in each app.
- Apply ESLint rules defined in `packages/eslint-config`.
- Use React functional components and hooks in frontend.

## Tests

- Write unit tests for server using Jest in `apps/server/src`.
- Write unit and integration tests for frontend in `apps/web/src` using Jest and React Testing Library.
- Use `pnpm test` to run tests across the monorepo.
- For e2e testing of the server, use the `test` directory in `apps/server`.
- For frontend, consider Cypress or Playwright for e2e tests (not currently set up but can be added).
- When generating tests, ensure they are placed in the correct directories and follow existing test patterns.
- Use descriptive test names and cover both positive and negative cases.
- follow the naming convention for test files (`*.spec.ts`).
- For server tests, mock database interactions using tools like `jest-mock` or `prisma-mock` to isolate unit tests from actual database calls.
- For frontend tests, mock API calls using libraries like `msw` (Mock Service Worker) to simulate backend responses without relying on the actual server during testing.
- Ensure that test coverage is comprehensive, especially for critical business logic and API endpoints. Aim for high coverage but prioritize meaningful tests over achieving a specific percentage.
- When writing integration tests, focus on testing the interaction between components or modules rather than individual units. For example, test the interaction between a NestJS controller and its service, or between a React component and its hooks.
- For e2e tests, simulate real user interactions and verify that the entire flow works as expected, from the frontend to the backend and back. This can include testing form submissions, API calls, and UI updates.

## App-specific Notes

### Server

- Entry point: `apps/server/src/main.ts`.
- Modules: `app.module.ts`, `tasks` module contains controller, service, DTOs.
- Database service integrates Prisma client; look at `database.service.ts`.

### Web

- Uses Next.js App Router; pages in `apps/web/app`.
- UI components organized under `components` with subfolders (tasks, loading, error, toast).
- API interactions via `lib/api/api.ts` and custom hooks in `lib/hooks/useTasks.ts`.
- Styling: global CSS in `app/globals.css` and component-level CSS modules.

## Common Tasks for Copilot

- Generating or editing NestJS controllers, services, modules, DTOs.
- Adding Prisma models or migrations; update `schema.prisma`.
- Creating Next.js server components, client components, and hooks.
- Writing Jest tests for both server and web.
- Managing shared package configurations (ESLint, TypeScript).

## Workspace Commands

- Use `pnpm dev --filter=apps/server...` to run server.
- Use `pnpm dev --filter=apps/web...` to run frontend.
- `pnpm lint` and `pnpm test` run across the monorepo.

## Search Patterns

- To find tasks-related code, search for `tasks` module or `Task` model.
- Shared configuration lives under `packages/*`.

## Additional Tips

- When editing files, maintain import paths relative to workspace root using `@` aliases if configured.
- For new features, update both backend and frontend concurrently when API changes occur.

> **Note:** This file is intended for Copilot's internal guidance and not for runtime use. Update as project evolves.
