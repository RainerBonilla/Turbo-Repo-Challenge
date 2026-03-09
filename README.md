# Turbo Repo Challenge

## Project Overview

The Turbo Repo Challenge is a full-stack task management application built using a monorepo architecture with Turborepo. The application allows users to create, read, update, and delete tasks through a modern web interface, backed by a robust API server.

### Clean Architecture Implementation

This project follows clean architecture principles to ensure maintainability, testability, and separation of concerns:

- **Presentation Layer**: The web app (Next.js) handles user interactions and displays data.
- **Application Layer**: Controllers and services in the server app orchestrate business logic.
- **Domain Layer**: Business entities and rules are defined in the core modules.
- **Infrastructure Layer**: Database interactions via Prisma ORM, external APIs, and utilities.

The architecture promotes:

- Dependency inversion (inner layers don't depend on outer layers)
- Single responsibility principle across modules
- Easy testing through dependency injection
- Scalable codebase with clear boundaries

## Apps and Tech Stack

### Server App

A RESTful API built with **NestJS** that provides task management endpoints. It uses **Prisma** as the ORM for database interactions with **PostgreSQL**.

- **Tech Stack**: NestJS, TypeScript, Prisma, PostgreSQL, Swagger (for API documentation)
- **Features**: CRUD operations for tasks, error handling, validation, modular architecture

### Web App

A modern single-page application built with **Next.js** for task management. It provides an intuitive UI for users to interact with tasks.

- **Tech Stack**: Next.js, React, TypeScript, Tailwind CSS
- **Features**: Task listing, creation, editing, filtering, real-time updates, responsive design

## Installation and Setup

### Prerequisites

- **Node.js** version 18 or higher
- **pnpm** package manager (version 10.11.0)
- **Docker** and Docker Compose for database setup

### Steps to Run

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd turbo-repo-challenge
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**:

   Create `.env` files in the respective app directories:

   **For the server app** (`apps/server/.env`):

   ```env
   DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase"
   FRONTEND_URL="http://localhost:3000"
   PORT=8000
   NODE_ENV="development"
   ```

   **For the web app** (`apps/web/.env.local`):

   ```env
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   ```

4. **Set up the database**:

   ```bash
   docker-compose up -d
   ```

   This starts a PostgreSQL database and pgAdmin interface for development.

5. **Run database migrations** (for the server):

   ```bash
   cd apps/server
   npx prisma migrate dev
   cd ../..
   ```

6. **Start the development servers**:

   ```bash
   pnpm dev
   ```

   This will start both the server (typically on port 8000) and web app (on port 3000) concurrently.

7. **Access the application**:
   - Web app: http://localhost:3000
   - API server: http://localhost:8000
   - pgAdmin: http://localhost:5050 (admin@example.com / adminpassword)

## Environment Requirements

### Server App

- **Node.js**: >=18
- **Database**: PostgreSQL (provided via Docker Compose)
- **Environment Variables**: Database connection string (configured in Prisma)

### Web App

- **Node.js**: >=18
- **Browser**: Modern browser with JavaScript enabled

## Docker Compose Database Setup

The `docker-compose.yaml` file provides a ready-to-use PostgreSQL database for development:

- **Database**: PostgreSQL 18.1
- **Admin Interface**: pgAdmin 4 for database management
- **Ports**: Database on 5432, pgAdmin on 5050
- **Credentials**:
  - DB: myuser/mypassword, database: mydatabase
  - pgAdmin: admin@example.com/adminpassword

This setup ensures a consistent development environment without requiring local PostgreSQL installation.

## AI Agent Collaboration

This project was developed with extensive AI assistance, leveraging GitHub Copilot and other AI tools to accelerate development while maintaining code quality. The approach focused on:

- **Iterative Development**: Using AI to generate initial code structures, then refining through human oversight
- **Code Organization**: AI-assisted refactoring to implement clean architecture patterns and organize components into logical folder structures
- **Documentation**: AI-generated comprehensive README and inline documentation
- **Error Resolution**: AI-powered debugging and error fixing during development
- **Best Practices**: Incorporating AI suggestions for modern development standards, TypeScript usage, and framework-specific conventions

The collaboration balanced AI efficiency with human architectural decisions, ensuring the codebase follows industry best practices while being maintainable and scalable.
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs

````

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
````

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
