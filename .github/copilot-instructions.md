# GitHub Copilot Instructions for Turbo Repo Challenge

This document provides comprehensive guidelines and context for GitHub Copilot to assist effectively across the entire monorepo. Use this information when generating or editing code, debugging, or understanding the project structure.

## Repository Overview

The workspace is structured as a Turborepo monorepo containing multiple apps and shared packages:

- **apps/server**: A NestJS 11+ backend application with Prisma 7.4.2 ORM for PostgreSQL. Provides RESTful API endpoints for task management with Swagger documentation.
- **apps/web**: A Next.js 14+ frontend app using the App Router with React functional components, custom hooks for state management, and modular styling.
- **packages/schemas**: Shared Zod schemas for type-safe validation across both server and web apps.
- **packages/eslint-config**: Centralized ESLint configurations for consistent code quality.
- **packages/typescript-config**: Shared TypeScript configurations for workspace-wide typing.

### Monorepo Architecture

- **Package Manager**: pnpm 10.11.0 with workspace protocol (`workspace:*`)
- **Build Tool**: Turborepo 2.8.14 for fast, incremental builds
- **Database**: PostgreSQL with Prisma adapter (`@prisma/adapter-pg@7.4.2`)
- **Node Version**: 18+

## Key Technologies & Versions

- **Node.js** 18+ and **TypeScript** 5.9.2 across all projects
- **NestJS** 11.0.1 with class-validator/class-transformer for DTO validation
- **Prisma** 7.4.2 with PostgreSQL adapter and generated client in `apps/server/generated/prisma`
- **Next.js** 14+ with App Router and React 18+
- **Zod** for runtime schema validation (shared across server/web via `@repo/schemas`)
- **Jest** for unit and integration testing with React Testing Library for components
- **PostgreSQL** 14+ as primary data store

## Coding Conventions

### TypeScript & General Patterns

- **Strict Typing**: Enable `"strict": true` in tsconfig.json. Never use `any`; use `unknown` for truly unknown types and narrow them with type guards.
- **Shared Types**: Always use schemas from `@repo/schemas` for `Task`, `TaskStatus`, `TaskPriority`, `TaskStats`, etc. Export type inference with `z.infer<typeof Schema>`.
- **ESLint**: All code must pass ESLint rules from `packages/eslint-config`. Run `pnpm lint` before committing.
- **Imports**: Use path aliases (`@/`, `@repo/`) for imports. Never use relative imports beyond the immediate directory level.
- **File Naming**:
  - Components: PascalCase (e.g., `TaskCard.tsx`)
  - Hooks: camelCase with `use` prefix (e.g., `useTasks.ts`)
  - Tests: `*.spec.ts` or `*.spec.tsx`
  - Utilities/services: camelCase (e.g., `errorHandler.ts`)

### Server (NestJS) Patterns

- **Module Structure**: Follow the SOLID principle. Each feature module (e.g., `tasks`) should contain:
  - `*.module.ts`: Imports, providers, controllers
  - `*.controller.ts`: HTTP endpoints with `@Controller`, `@Get`, `@Post`, `@Patch`, `@Delete`
  - `*.service.ts`: Business logic with `@Injectable`
  - `dtos.ts`: Data Transfer Objects with `@ApiProperty` decorators for Swagger
  - `*.spec.ts`: Unit tests for service logic
  - `*.e2e-spec.ts` in `/test`: End-to-end tests for full request/response cycles

- **DTOs**: Use Swagger decorators (`@ApiProperty`) with descriptions and examples. All DTOs must include validation via `class-validator` decorators (`@IsString`, `@IsOptional`, etc.).

- **Controllers**: Use dependency injection via constructor. Always use global exception filters for consistent error responses.

- **Prisma Integration**:
  - Access PrismaClient via injected `DatabaseService` (which extends PrismaClient)
  - Use auto-generated Prisma types from `generated/prisma/client`
  - Always handle database errors and return appropriate HTTP status codes

- **Error Handling**: Define custom exceptions extending `HttpException`. Use appropriate HTTP status codes (400 for validation, 404 for not found, 500 for server errors).

### Web (Next.js/React) Patterns

- **Component Structure**: Use functional components with hooks. Mark components with `"use client"` if they use state, hooks, or event handlers.
- **Component Organization**:
  - UI components in `components/` organized by domain (e.g., `components/tasks/`, `components/loading/`)
  - Each component in its own file with optional `index.ts` re-export
  - Related utilities/helpers can be colocated
  - Tests live alongside the component with `.spec.tsx` extension

- **Hooks**: Custom hooks in `lib/hooks/` (e.g., `useTasks.ts`). Hooks should handle loading, error, and data states. Return an object with clear properties.

- **API Integration**:
  - Central API client in `lib/api/api.ts` with methods for each resource
  - Use typed interfaces for request/response data (align with Prisma models)
  - Handle errors with `ErrorHandler.parseError()` for consistent messaging
  - Suppress console.error in tests that expect errors

- **Validation**: Use Zod schemas from `@repo/schemas` in forms and component logic. Define additional client-side schemas for extended validation.

- **Styling**:
  - Global styles in `app/globals.css`
  - Component-level CSS modules: `ComponentName.module.css`
  - Use semantic HTML and accessible class names

## Testing Strategy

### General Test Guidelines

- **File Naming**: Test files use `*.spec.ts` or `*.spec.tsx` convention and live alongside source files
- **Test Coverage**: Aim for high coverage of critical business logic (>80%), but prioritize test quality over coverage percentage
- **Descriptive Test Names**: Use `test("action should result in consequence")` format. Avoid vague names like "works correctly"
- **AAA Pattern**: Arrange (setup), Act (execute), Assert (verify) in each test
- **Test Isolation**: Each test should be independent; use `beforeEach`/`afterEach` for cleanup
- **Mocking Strategy**:
  - Mock external dependencies (database, API calls, timers)
  - Don't mock the code being tested
  - For async operations, always wrap state updates in `act()` from React Testing Library

### Server Testing (NestJS + Jest)

- **Service Tests** (`*.service.spec.ts`):
  - Mock database via Prisma using jest mocks
  - Test business logic in isolation
  - Cover success paths, validation failures, and edge cases
  - Example: Test that `createTask()` throws error if title is invalid or empty

- **Controller Tests** (`*.controller.spec.ts`):
  - Use `Test.createTestingModule()` from `@nestjs/testing` to create isolated test modules
  - Mock services injected into controllers
  - Test HTTP status codes and response shapes
  - Verify proper error handling and status code mapping

- **E2E Tests** (`test/*.e2e-spec.ts`):
  - Start a full NestJS application context
  - Test complete request/response cycles: initial request → service → database → response
  - Cover full user workflows (e.g., create → read → update → delete)
  - Seeds database state before tests if needed

### Web Testing (Next.js/React + Jest + React Testing Library)

- **Component Tests** (`*.spec.tsx`):
  - Wrap components that use providers (ToastProvider, etc.) in a render helper function
  - Test user interactions: button clicks, form submissions, input changes
  - Use `fireEvent` for direct interactions
  - Use `waitFor` for async state updates
  - Always clean up mock functions in `beforeEach` (call `.mockClear()`)
  - Test error states and loading states

- **Hook Tests**:
  - Use `renderHook()` from React Testing Library
  - Wrap hooks that depend on context with appropriate providers
  - Test the hook's return value changes as dependencies change
  - Example: Test that `useTasks()` returns tasks after calling `fetchTasks()`

- **API & Utility Tests**:
  - Mock `fetch` using Jest mocks for API client tests
  - Test error handling and parsing
  - Verify correct endpoints and request shapes are used

- **Async & Timer Tests**:
  - Use `jest.useFakeTimers()` in `beforeEach` and `jest.useRealTimers()` in `afterEach`
  - Wrap timer-advancing code in `act()`: `act(() => jest.advanceTimersByTime(5000))`
  - Use `waitFor()` for state updates that depend on async operations

### Testing Patterns by Use Case

- **Form Validation**: Render component, fill form with invalid data, verify error messages appear
- **Conditional Rendering**: Test that components show/hide based on state changes
- **Error Handling**: Mock API to throw errors, verify error messages display correctly
- **Lists/Filtering**: Test adding/removing items, filtering by criteria
- **Modal/Dialog**: Test open/close states, cancel and confirm actions

## Data & Schema Management

### Shared Schemas (@repo/schemas)

The `packages/schemas/index.ts` file is the **source of truth** for all data types:

- Defines Zod schemas: `TaskStatus`, `TaskPriority`, `TaskSortBy`, `TaskSchema`, `TaskStatsSchema`
- Exports type inferrence: `type Task = z.infer<typeof TaskSchema>`
- Used in both server (DTOs) and web (form validation, API types)
- **Pattern**: Always import types from `@repo/schemas`, never duplicate type definitions

### Prisma Schema & Migrations

- **Location**: `apps/server/prisma/schema.prisma`
- **Adapter**: Uses PostgreSQL with `@prisma/adapter-pg`
- **Generated Client**: Output to `../generated/prisma` (CommonJS format)
- **Enums**: Map Prisma enums to string values matching Zod schemas (e.g., `in-progress` → `inProgress`)
- **Workflow**: Edit schema → Run `prisma migrate dev --name <name>` → Commit migration files

### Database Service

- Located at `apps/server/src/database/database.service.ts`
- Extends PrismaClient with NestJS lifecycle hooks
- Connection pooling via `@prisma/adapter-pg` and `Pool` from `pg`
- Access in services via dependency injection: `constructor(private db: DatabaseService)`
- Always use `this.db.<model>.method()` for queries

## App-Specific Architecture

### Server (NestJS)

**Entry Point & Bootstrap**

- Entry: `apps/server/src/main.ts`
- Bootstraps NestJS application, enables Swagger docs at `/api/docs`
- Global pipes and filters configured at bootstrap

**Core Modules**

- `app.module.ts`: Root module, imports all feature modules (database, tasks)
- `database.module.ts`: Provides DatabaseService (extends PrismaClient)
- `tasks.module.ts`: Feature module for task CRUD operations

**Task Module Anatomy**

- `tasks.controller.ts`:
  - Routes: GET `/tasks` (list), GET `/tasks/:id`, POST `/tasks` (create), PATCH `/tasks/:id`, DELETE `/tasks/:id`
  - Uses `@Query()` for filters (status, priority, assignee, sortBy)
  - Returns typed responses via DTOs
- `tasks.service.ts`:
  - `find()`: Query tasks with optional filters/sorting
  - `findById()`: Get single task, throw 404 if not found
  - `create()`: Validate input, create new task, return created entity
  - `update()`: Update specific fields, return updated task
  - `delete()`: Remove task by ID
  - `getStats()`: Aggregate task counts by status and priority

- `dtos.ts`:
  - `CreateTaskDto`: Input validation for new tasks
  - `UpdateTaskDto`: Input validation for updates (all fields optional)
  - `TaskResponseDto`: Shaped response for API clients

**Database Access Pattern**

```typescript
// In service constructor
constructor(private db: DatabaseService) {}

// In methods
const task = await this.db.task.findUnique({ where: { id } });
```

### Web (Next.js/React)

**Project Structure**

- `app/`: Next.js 14 App Router pages
  - `layout.tsx`: Root layout with global styles
  - `page.tsx`: Home page (renders TaskManager)
  - `globals.css`: Global styles
- `components/`: Organized by feature/responsibility
  - `tasks/`: Task-related components (TaskManager, TaskCard, TaskForm, TaskFilters, etc.)
  - `loading/`: Loading states (LoadingSpinner, SkeletonLoader, SearchLoading)
  - `error/`: Error handling (ErrorBoundary, ErrorDisplay, errorHandler utility)
  - `toast/`: Toast notifications (ToastProvider, ToastContainer, useToast hook)

**API Client Pattern** (`lib/api/api.ts`)

- Single `ApiClient` class with methods for each resource
- Base URL: `NEXT_PUBLIC_API_URL` or defaults to `http://localhost:8000`
- Error handling: Parses response errors, throws with descriptive messages
- Type safety: Methods return typed data via Zod validation
- Singleton pattern: `export const apiClient = new ApiClient()`

**State & Data Fetching** (`lib/hooks/useTasks.ts`)

- `useTasks()`:
  - Returns: `{ tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask }`
  - Auto-fetches tasks on mount via `useEffect`
  - Handles error state via `ErrorHandler.parseError()`
  - Updates local state optimistically on mutation
- `useTaskStats()`: Fetches task statistics (counts by status/priority)

**Error Handling Pattern**

- Extend `ErrorHandler.parseError()` in error handling utility
- Returns `AppError` object with `message` and optional `details`
- Components show error messages to users via toast or inline display

**Styling Pattern**

- Global styles override values in `app/globals.css`
- Component styles in `ComponentName.module.css` for scoped styling
- CSS Modules are imported as: `import styles from './ComponentName.module.css'`
- Apply via: `<div className={styles.container}>`

## API Design Patterns

### REST Endpoint Structure

- **List with Filters**: `GET /api/tasks?status=pending&priority=high&sortBy=dueDate`
  - Query parameters for filters (status, priority, assignee, sortBy)
  - Returns array of typed objects
- **Single Resource**: `GET /api/tasks/:id`
  - Returns single resource or 404 error
- **Create**: `POST /api/tasks`
  - Body: CreateTaskDto (validated by class-validator)
  - Returns created resource with generated ID
- **Update**: `PATCH /api/tasks/:id`
  - Body: UpdateTaskDto (all fields optional)
  - Returns updated resource
- **Delete**: `DELETE /api/tasks/:id`
  - Returns 204 No Content on success
- **Statistics**: `GET /api/tasks/stats`
  - Returns TaskStats (counts grouped by status and priority)

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed: Title must be at least 3 characters",
  "error": "Bad Request"
}
```

### API Client Methods

All methods in `lib/api/api.ts` should:

- Parse Zod schema before returning
- Throw descriptive errors with context
- Support optional filters/parameters
- Return typed data

## Error Handling Strategy

### Server-Side

- Custom exceptions extend `HttpException` from `@nestjs/common`
- Use appropriate HTTP status codes:
  - 400: Validation or bad request
  - 404: Resource not found
  - 409: Conflict (e.g., duplicate unique constraint)
  - 500: Internal server error
- Global exception filter catches and formats all errors

### Client-Side

- `ErrorHandler` utility in `components/error/errorHandler.ts`
- `parseError()` method converts Error → AppError
- `AppError` interface: `{ message: string; details?: string }`
- Display errors via:
  - Toast notifications for temporary feedback
  - Inline ErrorDisplay component for form-level errors
  - ErrorBoundary for component tree failures

### Error Types

- **Validation Errors**: From Zod or class-validator, include field details
- **Network Errors**: Fetch failures, timeout, connection refused
- **API Errors**: Server returned error response with message
- **Client Errors**: Invalid state, missing dependencies, logic errors

## Development Workflow

### Adding a New Feature (Task CRUD example)

1. **Define Schema** (`packages/schemas/index.ts`)
   - Add Zod schema for new entity
   - Export type via `z.infer<>`
2. **Update Database** (`apps/server/prisma/schema.prisma`)
   - Add model matching Zod schema
   - Run `prisma migrate dev --name add_<feature>`
   - Commit migration files
3. **Server Implementation** (`apps/server/src/<feature>/`)
   - Create `<feature>.module.ts`, `<feature>.controller.ts`, `<feature>.service.ts`
   - Add routes with Swagger decorators
   - Validate inputs with DTOs
   - Handle errors with custom exceptions
   - Write unit tests for service logic
   - Write e2e tests for full workflows
4. **Web Implementation** (`apps/web/`)
   - Add API methods to `lib/api/api.ts`
   - Create custom hook in `lib/hooks/` if needed
   - Build components in `components/<feature>/`
   - Add validation schemas to component
   - Write component tests with React Testing Library
   - Test with real API using `pnpm dev`
5. **Type Synchronization**
   - Ensure DTOs match Zod schemas
   - Use `@repo/schemas` imports on web for type safety
   - No duplicate type definitions across packages

### Testing Workflow

1. Write test file alongside source (`Component.spec.tsx`)
2. Import test utilities and mocks
3. Set up providers/wrappers as needed
4. Write tests following AAA pattern
5. Mock external dependencies (API, database, timers)
6. Run `pnpm test:web` or `pnpm test:server`
7. Achieve >80% coverage for critical paths

### Git Workflow & Commits

- Branch naming: `feature/<name>`, `fix/<name>`, `test/<name>`
- Commit before each logical checkpoint
- Run `pnpm lint` before pushing (auto-fixes most issues)
- Create PR with description of changes and testing approach

## Common Development Tasks

### Creating a New Component

```typescript
// 1. Create file: components/tasks/NewComponent.tsx
"use client";
import { useState } from "react";
import styles from "./NewComponent.module.css";

export function NewComponent() {
  // Component logic
  return <div className={styles.container}>Content</div>;
}

// 2. Create styles: components/tasks/NewComponent.module.css
.container {
  /* styles */
}

// 3. Export from index: components/tasks/index.ts
export { NewComponent } from "./NewComponent";

// 4. Create tests: components/tasks/NewComponent.spec.tsx
import { render, screen } from "@testing-library/react";
import { NewComponent } from "./NewComponent";

describe("NewComponent", () => {
  test("renders correctly", () => {
    render(<NewComponent />);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
```

### Creating a New NestJS Service Method

```typescript
// In tasks.service.ts
async findByAssignee(assignee: string): Promise<Task[]> {
  return this.db.task.findMany({
    where: { assignee },
    orderBy: { createdAt: 'desc' }
  });
}

// In tasks.controller.ts
@Get('by-assignee/:assignee')
@ApiParam({ name: 'assignee', description: 'Assignee name' })
@ApiResponse({ status: 200, type: [TaskResponseDto] })
findByAssignee(@Param('assignee') assignee: string) {
  return this.tasksService.findByAssignee(assignee);
}

// Test in tasks.service.spec.ts
it('should find tasks by assignee', async () => {
  const mockTasks = [{ id: '1', assignee: 'John' }];
  jest.spyOn(db.task, 'findMany').mockResolvedValue(mockTasks);

  const result = await service.findByAssignee('John');
  expect(result).toEqual(mockTasks);
});
```

### Adding Validation to a Form

```typescript
// Define schema at component top
const schema = z.object({
  title: z.string().min(3).max(100),
  email: z.string().email(),
  age: z.coerce.number().min(0).max(150),
});

// Validate on submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const data = schema.parse({ title, email, age });
    await onSubmit(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      setErrors(error.flatten().fieldErrors);
    }
  }
};
```

## Workspace Commands

### Development

- `pnpm dev` - Run all apps in dev mode (server + web concurrently)
- `pnpm dev --filter=apps/server` - Run only server in watch mode
- `pnpm dev --filter=apps/web` - Run only web in dev mode
- `pnpm build` - Build entire monorepo with Turborepo caching
- `pnpm build --filter=apps/server` - Build specific app

### Testing

- `pnpm test` - Run all tests across monorepo
- `pnpm test:server` - Run server tests only
- `pnpm test:web` - Run web tests only (fixed by recent changes)
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:cov` - Generate coverage reports

### Code Quality

- `pnpm lint` - Run ESLint across all packages and fix issues
- `pnpm format` - Format all TypeScript and Markdown files with Prettier
- `pnpm check-types` - Run TypeScript type checking

### Database

- `pnpm --filter=server prisma migrate dev --name <migration_name>` - Create database migration
- `pnpm --filter=server prisma studio` - Open Prisma Studio GUI
- `pnpm --filter=server prisma generate` - Manually regenerate Prisma client

### Docker

- `docker-compose up -d postgres` - Start PostgreSQL container
- `docker-compose down` - Stop containers

## Important Development Notes

### Dependency Management

- **Monorepo Workspaces**: Use `workspace:*` protocol in package.json to reference local packages
- **@repo/schemas**: This is the source of truth for all shared types. Always import types from here, never duplicate
- **PostgreSQL Types**: Do NOT add `@types/pg` as a direct dependency in apps - it's unnecessary and causes type conflicts
- **Version Consistency**: Keep dependency versions aligned across the monorepo to avoid duplication

### Type Safety & Validation

- **Zod Schemas**: All data validation happens through Zod schemas in `@repo/schemas`
- **DTO Alignment**: Server DTOs must match Zod schemas exactly for type consistency
- **Import Pattern**: Web imports types using `z.infer<typeof Schema>` from `@repo/schemas`
- **Never use `any`**: Use `unknown` and narrow with type guards instead

### Testing Best Practices

- **Wrap State Updates**: Always wrap React state updates in `act()` when testing async operations
- **Mock Timers**: Use `jest.useFakeTimers()` and `jest.useRealTimers()` properly in beforeEach/afterEach
- **Toast Provider Tests**: Wrap component renders in `<ToastProvider>` when testing components that use toast
- **API Mocking**: Mock fetch calls at the ApiClient level, not individual components
- **Clear Mocks**: Call `.mockClear()` in beforeEach to ensure test isolation

### Component Patterns

- **Provider Wrapping**: Components using context (Toast, etc.) need provider wrappers in tests
- **CSS Modules**: Always use CSS modules for component styles (not inline styles or global classes)
- **Error Boundaries**: Use ErrorBoundary for graceful error handling UI
- **React Testing Library**: Prefer user-facing queries (`getByRole`, `getByText`) over implementation details

### File Organization Principles

- Keep files small and focused (single responsibility)
- Colocate tests with source files
- Group related components in subdirectories
- Use index.ts for barrel exports in component directories
- Keep utilities and helpers close to where they're used unless truly shared

### Server Architecture

- **Dependency Injection**: Leverage NestJS DI for loose coupling and testability
- **DatabaseService**: Always inject DatabaseService, don't create PrismaClient directly
- **Exception Classes**: Create custom exceptions for domain-specific errors
- **Swagger Docs**: Always add @ApiProperty decorators to DTOs for auto-generated API docs
- **Validation Pipes**: Use global validation pipes for DTOs

### Web Architecture

- **"use client"**: Mark all components using state, hooks, or event handlers with this directive
- **API Client Singleton**: Import `apiClient` singleton from `lib/api/api.ts` for consistency
- **Hook Dependencies**: List all dependencies in useEffect/useCallback to avoid stale closures
- **Error Handling**: Use ErrorHandler.parseError() for consistent error messages across the app
- **Loading States**: Always show loading spinners during async operations for better UX

## Search & Navigation Patterns

- To find tasks-related code, search for `tasks` module or `Task` model
- Shared configuration lives under `packages/*`
- Prisma migrations stored in `apps/server/prisma/migrations/`
- Generated Prisma types in `apps/server/generated/prisma/`
- API client methods in `lib/api/api.ts`
- Custom hooks in `lib/hooks/`
- Error utilities in `components/error/`

## Debugging Tips

### Common Issues & Solutions

**Issue**: Type errors with `Pool` from `pg`

- **Solution**: Remove `@types/pg` from direct dependencies. It's included in the monorepo root.

**Issue**: Tests failing with "not wrapped in act(...)"

- **Solution**: Wrap state-changing operations and timer advancements in `act()`: `act(() => { setState(); })`

**Issue**: Toast not showing in component tests

- **Solution**: Wrap component in `<ToastProvider>` when rendering in tests

**Issue**: API calls not working in tests

- **Solution**: Mock fetch at the ApiClient level or use MSW (Mock Service Worker)

**Issue**: Prisma type conflicts in generated/prisma

- **Solution**: Run `pnpm --filter=server prisma generate` to regenerate types

### Debugging Commands

- `pnpm dev` - Start dev servers with hot reload
- `npm run dev:debug` - Run with debugger attached
- `pnpm test:watch` - Run tests in watch mode for faster iteration
- `docker-compose logs postgres` - Check database logs
- `pnpm --filter=server prisma studio` - Visual database explorer

## Performance Considerations

- **Turborepo Caching**: Take advantage of Turborepo's incremental builds
- **Database Queries**: Use Prisma's `select`/`include` to fetch only needed fields
- **API Response Sizes**: Return only necessary task fields to reduce payload
- **Component Re-renders**: Use proper dependency arrays and memoization when needed
- **Bundle Size**: Monitor Next.js bundle with `pnpm build`

## Security Notes

- **Environment Variables**: All sensitive config in .env files (never in version control)
- **SQL Injection**: Prisma parameterizes queries automatically - always use it
- **CORS**: Configure in NestJS to allow web app requests
- **Validation**: All user input validated with Zod schemas before database operations
- **Type Safety**: TypeScript strict mode prevents many common security issues
