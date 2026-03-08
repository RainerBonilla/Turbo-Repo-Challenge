# Task Management API Server

A secure NestJS API server for task management with comprehensive security features and full CRUD operations.

## Features

### Security & Middleware
- ✅ **Helmet**: Security headers for production safety
- ✅ **CORS**: Cross-origin resource sharing configuration
- ✅ **Validation Pipes**: Global input validation and sanitization
- ✅ **Global API Prefix**: All routes prefixed with `/api`

### Task Management API
- ✅ **CRUD Operations**: Create, Read, Update, Delete tasks
- ✅ **Advanced Filtering**: Filter by status, priority, assignee
- ✅ **Sorting**: Sort by due date, priority, creation date
- ✅ **Statistics**: Task statistics and analytics
- ✅ **Swagger Documentation**: Interactive API documentation

### Data Validation
- ✅ **Zod Schemas**: Runtime type validation
- ✅ **Prisma ORM**: Type-safe database operations
- ✅ **Input Sanitization**: Automatic property stripping

## Tech Stack

- **Framework**: NestJS 11+
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod schemas
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm package manager

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables in `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskdb"
PORT=8000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

3. Run database migrations:
```bash
pnpm prisma migrate dev
```

4. Start the development server:
```bash
pnpm dev
```

### API Endpoints

All endpoints are prefixed with `/api`:

#### Tasks
- `GET /api/tasks` - List tasks with filtering/sorting
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Statistics
- `GET /api/tasks/stats` - Get task statistics

#### Documentation
- `GET /api/docs` - Swagger UI documentation

### Query Parameters

#### Task Filtering
- `status`: `pending | inProgress | completed`
- `priority`: `low | medium | high`
- `assignee`: string (assignee name)
- `sortBy`: `dueDate | priority | createdAt`

Example:
```
GET /api/tasks?status=pending&priority=high&sortBy=dueDate
```

## Security Features

### Helmet
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- And more security headers

### CORS Configuration
- Configurable allowed origins
- Specific HTTP methods
- Credential support
- Custom headers

### Input Validation
- Automatic property whitelisting
- Type coercion and transformation
- Error message hiding in production

## Development

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Run ESLint

### Database

- **Migrations**: `pnpm prisma migrate dev`
- **Studio**: `pnpm prisma studio`
- **Generate Client**: `pnpm prisma generate`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | `8000` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

## API Documentation

Once the server is running, visit:
- **API Base**: http://localhost:8000/api
- **Swagger UI**: http://localhost:8000/api/docs

## Deployment

1. Build the application:
```bash
pnpm build
```

2. Set production environment variables

3. Start the server:
```bash
pnpm start:prod
```

## Contributing

1. Follow TypeScript and NestJS best practices
2. Add proper validation schemas for new endpoints
3. Update Swagger documentation
4. Add unit tests for new features
5. Ensure security headers are maintained